'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { errorMessage } from '@/api/client'
import { ScrollArea } from '@/components/ScrollArea'
import { Skeleton } from '@/components/Skeleton'
import { Checkbox } from '@/components/form/Checkbox'
import { FieldMark } from '@/components/form/FieldMark'
import { useNotificationStore } from '@/store/notifications'

import { toContributionPayload } from '../payload'
import { useContribute, useShelters } from '../queries'
import { createConfirmationStepSchema, type ConfirmationStepInput } from '../schema'
import { StepActions } from '../StepActions'
import { useDonationStore } from '../store'
import { useFirstErrorToast } from '../useFirstErrorToast'

const formatPhone = (prefix: string, digits: string) =>
  `${prefix} ${digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`

export function ConfirmationStep() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const shelter = useDonationStore((state) => state.shelter)
  const personal = useDonationStore((state) => state.personal)
  const complete = useDonationStore((state) => state.complete)
  const shelters = useShelters()
  const contribute = useContribute()
  const notify = useNotificationStore((state) => state.notify)

  const schema = useMemo(() => createConfirmationStepSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmationStepInput>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false },
  })

  const reportFirstError = useFirstErrorToast(() => ({
    label: t('confirmationStep.consentLabel'),
    fieldId: 'consent',
  }))

  if (!shelter || !personal) return null

  const eur = new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'EUR' })
  const shelterName = shelters.data?.find((item) => item.id === shelter.shelterId)?.name

  const hasSeveralDonors = personal.donors.length > 1

  // `value` is null only while the shelter name is still loading.
  type SummaryGroup = { title?: string; rows: { label: string; value: string | null }[] }

  const groups: SummaryGroup[] = [
    {
      rows: [
        {
          label: t('confirmationStep.helpForm'),
          value:
            shelter.target === 'SHELTER'
              ? t('confirmationStep.helpFormShelter')
              : t('confirmationStep.helpFormFoundation'),
        },
        {
          label: t('confirmationStep.shelter'),
          // The name arrives with the shelter list, so it can still be loading here.
          value: shelters.isPending ? null : (shelterName ?? t('confirmationStep.shelterNone')),
        },
        { label: t('confirmationStep.amount'), value: eur.format(shelter.amount) },
      ],
    },
    ...personal.donors.map((donor, index) => ({
      // A single donor needs no heading — the section already says whose data this is.
      title: hasSeveralDonors ? t('personalStep.donor', { index: index + 1 }) : undefined,
      rows: [
        { label: t('confirmationStep.fullName'), value: `${donor.firstName} ${donor.lastName}` },
        { label: t('confirmationStep.email'), value: donor.email },
        { label: t('confirmationStep.phone'), value: formatPhone(donor.phonePrefix, donor.phone) },
      ],
    })),
  ]

  const onSubmit = handleSubmit(
    () =>
      contribute.mutate(toContributionPayload({ shelter, personal }), {
        // Success is handled by the thank-you page, so only failures reach the toaster.
        onSuccess: ({ messages }) => {
          complete({ amount: shelter.amount, message: messages[0]?.message })
          router.push('/dakujeme')
        },
        onError: (error) => notify('ERROR', errorMessage(error, t('common.unexpectedError'))),
      }),
    reportFirstError,
  )

  return (
    <form onSubmit={onSubmit} noValidate className="flex h-full flex-col gap-8 lg:min-h-0">
      <h1 className="text-3xl leading-[1.15] font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
        {t('confirmationStep.heading')}
      </h1>

      <section className="flex flex-col gap-5 lg:min-h-0 lg:flex-1" aria-busy={shelters.isPending}>
        <h2 className="text-sm font-semibold text-gray-900">
          {t('confirmationStep.sectionHeading')}
        </h2>

        <ScrollArea className="flex flex-col gap-5">
          {groups.map(({ title, rows }, index) => (
            <div
              key={index}
              className={`flex shrink-0 flex-col gap-4 ${index > 0 ? 'border-t border-gray-200 pt-6' : ''}`}
            >
              {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
              <dl className="flex flex-col gap-4">
                {rows.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 text-sm sm:gap-6"
                  >
                    <dt className="shrink-0 text-gray-600">{label}</dt>
                    <dd className="min-w-0 text-right font-semibold break-words text-gray-900">
                      {value ?? <Skeleton className="h-4 w-44" />}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          {hasSeveralDonors && (
            <p className="shrink-0 text-xs text-gray-500">
              {t('confirmationStep.sharedDonation', { count: personal.donors.length })}
            </p>
          )}
        </ScrollArea>
      </section>

      <div className="flex flex-col gap-2 border-t border-gray-200 pt-6">
        <Checkbox id="consent" {...register('consent')}>
          {t('confirmationStep.consent')}
          <FieldMark required />
        </Checkbox>
        {errors.consent && (
          <p role="alert" className="text-sm text-red-700">
            {errors.consent.message}
          </p>
        )}
      </div>

      <StepActions
        backHref="/osobne-udaje"
        submitLabel={t('confirmationStep.submit')}
        isSubmitting={contribute.isPending}
      />
    </form>
  )
}
