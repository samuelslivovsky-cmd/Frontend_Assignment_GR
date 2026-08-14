'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { errorMessage } from '@/api/client'
import { useNotificationStore } from '@/store/notifications'

import { toContributionPayload } from '../payload'
import { useContribute, useShelters } from '../queries'
import { confirmationStepSchema, type ConfirmationStepInput } from '../schema'
import { StepActions } from '../StepActions'
import { useDonationStore } from '../store'

const EUR = new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' })

const formatPhone = (prefix: string, digits: string) =>
  `${prefix} ${digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`

type SummaryRow = { label: string; value: string }

export function ConfirmationStep() {
  const router = useRouter()
  const shelter = useDonationStore((state) => state.shelter)
  const personal = useDonationStore((state) => state.personal)
  const resetDraft = useDonationStore((state) => state.reset)
  const shelters = useShelters()
  const contribute = useContribute()
  const notify = useNotificationStore((state) => state.notify)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmationStepInput>({
    resolver: zodResolver(confirmationStepSchema),
    defaultValues: { consent: false },
  })

  if (!shelter || !personal) return null

  const shelterName = shelters.data?.find((item) => item.id === shelter.shelterId)?.name

  const summary: SummaryRow[] = [
    {
      label: 'Forma pomoci',
      value:
        shelter.target === 'SHELTER'
          ? 'Finančný príspevok konkrétnemu útulku'
          : 'Finančný príspevok celej nadácii',
    },
    { label: 'Útulok', value: shelterName ?? 'Nevybraný' },
    { label: 'Suma príspevku', value: EUR.format(shelter.amount) },
    { label: 'Meno a priezvisko', value: `${personal.firstName} ${personal.lastName}` },
    { label: 'E-mail', value: personal.email },
    { label: 'Telefónne číslo', value: formatPhone(personal.phonePrefix, personal.phone) },
  ]

  const onSubmit = handleSubmit(() =>
    contribute.mutate(toContributionPayload({ shelter, personal }), {
      onSuccess: ({ messages }) => {
        messages.forEach(({ type, message }) => notify(type, message))
        resetDraft()
        router.push('/')
      },
      onError: (error) => notify('ERROR', errorMessage(error)),
    }),
  )

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold tracking-tight">Skontrolujte si zadané údaje</h1>

      <dl className="flex flex-col gap-3">
        {summary.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <dt className="text-gray-600">{label}</dt>
            <dd className="font-semibold text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-1 border-t border-gray-200 pt-6">
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" {...register('consent')} />
          Súhlasím so spracovaním mojich osobných údajov
        </label>
        {errors.consent && (
          <p role="alert" className="text-sm text-red-700">
            {errors.consent.message}
          </p>
        )}
      </div>

      <StepActions
        backHref="/osobne-udaje"
        submitLabel="Odoslať formulár"
        isSubmitting={contribute.isPending}
      />
    </form>
  )
}
