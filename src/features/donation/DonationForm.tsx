'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import { Field } from '@/components/form/Field'
import { Button, Select, TextInput } from '@/components/form/inputs'
import { errorMessage } from '@/lib/api/client'
import { useNotificationStore } from '@/store/notifications'

import { toContributionPayload } from './payload'
import { useContribute, useShelters } from './queries'
import {
  PHONE_PREFIXES,
  donationSchema,
  type DonationFormInput,
  type DonationFormValues,
} from './schema'

const AMOUNT_PRESETS = [5, 10, 20, 30, 50, 100]

const COUNTRY_FLAG: Record<(typeof PHONE_PREFIXES)[number], string> = {
  '+421': '🇸🇰',
  '+420': '🇨🇿',
}

const TARGET_OPTIONS = [
  { value: 'FOUNDATION', label: 'Nadácii GoodBoy' },
  { value: 'SHELTER', label: 'Konkrétnemu útulku' },
] as const

const EMPTY_FORM: DonationFormInput = {
  target: 'FOUNDATION',
  shelterId: '',
  amount: '',
  firstName: '',
  lastName: '',
  email: '',
  phonePrefix: '+421',
  phone: '',
  consent: false,
}

export function DonationForm() {
  const shelters = useShelters()
  const contribute = useContribute()
  const notify = useNotificationStore((state) => state.notify)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<DonationFormInput, unknown, DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: EMPTY_FORM,
  })

  // `useWatch` instead of `watch` — the latter returns an unmemoizable function that React Compiler bails on.
  const target = useWatch({ control, name: 'target' })

  // Reset runs in the mutation callback, not inside `handleSubmit` — RHF would overwrite it there.
  const onSubmit = handleSubmit((values) =>
    contribute.mutate(toContributionPayload(values), {
      onSuccess: ({ messages }) => {
        messages.forEach(({ type, message }) => notify(type, message))
        reset(EMPTY_FORM)
      },
      onError: (error) => notify('ERROR', errorMessage(error)),
    }),
  )

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Chcem prispieť</legend>
        {TARGET_OPTIONS.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2">
            <input type="radio" value={value} {...register('target')} />
            {label}
          </label>
        ))}
      </fieldset>

      <Field
        label="Útulok"
        htmlFor="shelterId"
        error={errors.shelterId?.message}
        hint={target === 'FOUNDATION' ? 'Nepovinné pri príspevku nadácii.' : undefined}
      >
        <Select id="shelterId" disabled={shelters.isPending} {...register('shelterId')}>
          <option value="">
            {shelters.isPending ? 'Načítavam útulky…' : 'Vyberte útulok'}
          </option>
          {shelters.data?.map((shelter) => (
            <option key={shelter.id} value={shelter.id}>
              {shelter.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Výška príspevku (€)" htmlFor="amount" error={errors.amount?.message}>
        <div className="flex flex-wrap gap-2">
          {AMOUNT_PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant="secondary"
              onClick={() => setValue('amount', String(preset), { shouldValidate: true })}
            >
              {preset} €
            </Button>
          ))}
        </div>
        <TextInput id="amount" inputMode="decimal" placeholder="Vlastná suma" {...register('amount')} />
      </Field>

      <Field label="Meno" htmlFor="firstName" error={errors.firstName?.message} hint="2 – 20 znakov.">
        <TextInput id="firstName" autoComplete="given-name" {...register('firstName')} />
      </Field>

      <Field label="Priezvisko" htmlFor="lastName" error={errors.lastName?.message}>
        <TextInput id="lastName" autoComplete="family-name" {...register('lastName')} />
      </Field>

      <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
        <TextInput id="email" type="email" autoComplete="email" {...register('email')} />
      </Field>

      <Field label="Telefón" htmlFor="phone" error={errors.phone?.message ?? errors.phonePrefix?.message}>
        <div className="flex gap-2">
          <Select aria-label="Predvoľba" {...register('phonePrefix')}>
            {PHONE_PREFIXES.map((prefix) => (
              <option key={prefix} value={prefix}>
                {COUNTRY_FLAG[prefix]} {prefix}
              </option>
            ))}
          </Select>
          <TextInput id="phone" type="tel" autoComplete="tel-national" placeholder="900 123 456" {...register('phone')} />
        </div>
      </Field>

      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" {...register('consent')} />
          Súhlasím so spracovaním osobných údajov.
        </label>
        {errors.consent && (
          <p role="alert" className="text-sm text-red-700">
            {errors.consent.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={contribute.isPending}>
        {contribute.isPending ? 'Odosielam…' : 'Odoslať príspevok'}
      </Button>
    </form>
  )
}
