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

  const groups = [
    [
      {
        label: 'Forma pomoci',
        value:
          shelter.target === 'SHELTER'
            ? 'Finančný príspevok konkrétnemu útulku'
            : 'Finančný príspevok celej nadácii',
      },
      { label: 'Útulok', value: shelterName ?? 'Nevybraný' },
      { label: 'Suma príspevku', value: EUR.format(shelter.amount) },
    ],
    [
      { label: 'Meno a priezvisko', value: `${personal.firstName} ${personal.lastName}` },
      { label: 'E-mail', value: personal.email },
      { label: 'Telefónne číslo', value: formatPhone(personal.phonePrefix, personal.phone) },
    ],
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
    <form onSubmit={onSubmit} noValidate className="flex h-full flex-col gap-8">
      <h1 className="text-5xl leading-[1.15] font-bold tracking-tight text-gray-900">
        Skontrolujte si zadané údaje
      </h1>

      <section className="flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-gray-900">Zhrnutie</h2>

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
          <input
            type="checkbox"
            className="size-4 accent-indigo-600"
            {...register('consent')}
          />
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
