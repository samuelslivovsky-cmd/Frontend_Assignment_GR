import type { TFunction } from 'i18next'
import { z } from 'zod'

export const DONATION_TARGETS = ['SHELTER', 'FOUNDATION'] as const
export const PHONE_PREFIXES = ['+421', '+420'] as const

/** Above this the donation is worth arranging personally rather than through a web form. */
export const MAX_DONATION = 10_000

export type PhonePrefix = (typeof PHONE_PREFIXES)[number]

// Schemas are built per translation function so validation messages follow the
// selected language instead of being frozen at module load.
const requiredText = (t: TFunction, label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, t('validation.minLength', { label, count: min }))
    .max(max, t('validation.maxLength', { label, count: max }))

const amount = (t: TFunction) =>
  z
    .string()
    .trim()
    .min(1, t('validation.amountRequired'))
    .transform((value) => Number(value.replace(',', '.')))
    .refine((value) => Number.isFinite(value) && value > 0, t('validation.amountPositive'))
    .refine(
      (value) => !Number.isFinite(value) || value <= MAX_DONATION,
      t('validation.amountTooLarge', { max: MAX_DONATION }),
    )

// The select holds an empty string for "no shelter picked".
const shelterId = z.string().transform((value) => (value === '' ? null : Number(value)))

/**
 * Browsers autofill phone numbers in whatever shape they stored them —
 * `0948 524 551`, `+421948524551`, `00421 948 524 551`. Reduce all of those to
 * the nine national digits, but only when the strip actually yields nine, so a
 * number that merely happens to start with 421 is left alone.
 */
export function normalisePhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  const candidates = [digits.replace(/^(?:00)?42[01]/, ''), digits.replace(/^0/, ''), digits]

  return candidates.find((candidate) => candidate.length === 9) ?? digits
}

/** The country code an autofilled value carried, if any. */
export function detectPhonePrefix(value: string): PhonePrefix | undefined {
  const match = value.replace(/\D/g, '').match(/^(?:00)?(42[01])/)

  return match ? (`+${match[1]}` as PhonePrefix) : undefined
}

const phone = (t: TFunction) =>
  z
    .string()
    .transform(normalisePhone)
    .refine((value) => /^\d{9}$/.test(value), t('validation.phoneInvalid'))

export const createShelterStepSchema = (t: TFunction) =>
  z
    .object({
      target: z.enum(DONATION_TARGETS),
      shelterId,
      amount: amount(t),
    })
    .superRefine((values, ctx) => {
      if (values.target === 'SHELTER' && values.shelterId === null) {
        ctx.addIssue({
          code: 'custom',
          path: ['shelterId'],
          message: t('validation.shelterRequired'),
        })
      }
    })

export const createPersonalStepSchema = (t: TFunction) =>
  z.object({
    // The brief calls the first name optional, but the API rejects an empty firstName with a 400.
    firstName: requiredText(t, t('validation.labelFirstName'), 2, 20),
    lastName: requiredText(t, t('validation.labelLastName'), 2, 30),
    email: z.string().trim().pipe(z.email(t('validation.emailInvalid'))),
    phonePrefix: z.enum(PHONE_PREFIXES),
    phone: phone(t),
  })

export const createConfirmationStepSchema = (t: TFunction) =>
  z.object({
    consent: z.boolean().refine((value) => value, t('validation.consentRequired')),
  })

type ShelterSchema = ReturnType<typeof createShelterStepSchema>
type PersonalSchema = ReturnType<typeof createPersonalStepSchema>
type ConfirmationSchema = ReturnType<typeof createConfirmationStepSchema>

export type ShelterStepInput = z.input<ShelterSchema>
export type ShelterStepValues = z.output<ShelterSchema>
export type PersonalStepInput = z.input<PersonalSchema>
export type PersonalStepValues = z.output<PersonalSchema>
export type ConfirmationStepInput = z.input<ConfirmationSchema>
