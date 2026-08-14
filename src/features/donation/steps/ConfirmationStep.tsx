'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { errorMessage } from '@/api/client'
import { useNotificationStore } from '@/store/notifications'

import { toContributionPayload } from '../payload'
import { useContribute, useShelters } from '../queries'
import { createConfirmationStepSchema, type ConfirmationStepInput } from '../schema'
import { StepActions } from '../StepActions'
import { useDonationStore } from '../store'

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

  if (!shelter || !personal) return null

  const eur = new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'EUR' })
  const shelterName = shelters.data?.find((item) => item.id === shelter.shelterId)?.name

  const groups = [
    [
      {
        label: t('confirmationStep.helpForm'),
        value:
          shelter.target === 'SHELTER'
            ? t('confirmationStep.helpFormShelter')
            : t('confirmationStep.helpFormFoundation'),
      },
      {
        label: t('confirmationStep.shelter'),
        value: shelterName ?? t('confirmationStep.shelterNone'),
      },
      { label: t('confirmationStep.amount'), value: eur.format(shelter.amount) },
    ],
    [
      {
        label: t('confirmationStep.fullName'),
        value: `${personal.firstName} ${personal.lastName}`,
      },
      { label: t('confirmationStep.email'), value: personal.email },
      {
        label: t('confirmationStep.phone'),
        value: formatPhone(personal.phonePrefix, personal.phone),
      },
    ],
  ]

  const onSubmit = handleSubmit(() =>
    contribute.mutate(toContributionPayload({ shelter, personal }), {
      // Success is handled by the thank-you page, so only failures reach the toaster.
      onSuccess: ({ messages }) => {
        complete({ amount: shelter.amount, message: messages[0]?.message })
        router.push('/dakujeme')
      },
      onError: (error) => notify('ERROR', errorMessage(error, t('common.unexpectedError'))),
    }),
  )

  return (
    <form onSubmit={onSubmit} noValidate className="flex h-full flex-col gap-8">
      <h1 className="text-5xl leading-[1.15] font-bold tracking-tight text-gray-900">
        {t('confirmationStep.heading')}
      </h1>

      <section className="flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-gray-900">
          {t('confirmationStep.sectionHeading')}
        </h2>

        {groups.map((rows, index) => (
          <dl
            key={rows[0].label}
            className={`flex flex-col gap-4 ${index > 0 ? 'border-t border-gray-200 pt-6' : ''}`}
          >
            {rows.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-6 text-sm">
                <dt className="text-gray-600">{label}</dt>
                <dd className="text-right font-semibold text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        ))}
      </section>

      <div className="flex flex-col gap-2 border-t border-gray-200 pt-6">
        <label className="flex items-center gap-3 text-sm text-gray-900">
          <input type="checkbox" className="size-4 accent-indigo-600" {...register('consent')} />
          {t('confirmationStep.consent')}
        </label>
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
