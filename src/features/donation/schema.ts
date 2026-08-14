import { z } from 'zod'

export const DONATION_TARGETS = ['FOUNDATION', 'SHELTER'] as const
export const PHONE_PREFIXES = ['+421', '+420'] as const

const requiredText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} musí mať aspoň ${min} znaky.`)
    .max(max, `${label} môže mať najviac ${max} znakov.`)

const amount = z
  .string()
  .trim()
  .min(1, 'Zadajte výšku príspevku.')
  .transform((value) => Number(value.replace(',', '.')))
  .refine((value) => Number.isFinite(value) && value > 0, 'Príspevok musí byť väčší ako 0 €.')

// The select holds an empty string for "no shelter picked".
const shelterId = z
  .string()
  .transform((value) => (value === '' ? null : Number(value)))

const phone = z
  .string()
  .transform((value) => value.replace(/\s/g, ''))
  .refine((value) => /^\d{9}$/.test(value), 'Zadajte 9-miestne číslo bez predvoľby.')

export const donationSchema = z
  .object({
    target: z.enum(DONATION_TARGETS),
    shelterId,
    amount,
    // The brief calls this optional, but the API rejects an empty firstName with a 400.
    firstName: requiredText('Meno', 2, 20),
    lastName: requiredText('Priezvisko', 2, 30),
    email: z.string().trim().pipe(z.email('Zadajte platnú e-mailovú adresu.')),
    phonePrefix: z.enum(PHONE_PREFIXES),
    phone,
    consent: z
      .boolean()
      .refine((value) => value, 'Bez súhlasu so spracovaním osobných údajov nevieme príspevok prijať.'),
  })
  .superRefine((values, ctx) => {
    if (values.target === 'SHELTER' && values.shelterId === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['shelterId'],
        message: 'Vyberte útulok, ktorému chcete prispieť.',
      })
    }
  })

export type DonationFormInput = z.input<typeof donationSchema>
export type DonationFormValues = z.output<typeof donationSchema>
