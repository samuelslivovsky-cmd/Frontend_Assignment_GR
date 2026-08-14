'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Field } from '@/components/form/Field'
import { Select, TextInput } from '@/components/form/inputs'

import {
  PHONE_PREFIXES,
  personalStepSchema,
  type PersonalStepInput,
  type PersonalStepValues,
} from '../schema'
import { StepActions } from '../StepActions'
import { useDonationStore } from '../store'

const PREFIX_LABELS: Record<(typeof PHONE_PREFIXES)[number], string> = {
  '+421': 'SK +421',
  '+420': 'CZ +420',
}

export function PersonalStep() {
  const router = useRouter()
  const saved = useDonationStore((state) => state.personal)
  const setPersonal = useDonationStore((state) => state.setPersonal)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalStepInput, unknown, PersonalStepValues>({
    resolver: zodResolver(personalStepSchema),
    defaultValues: saved ?? {
      firstName: '',
      lastName: '',
      email: '',
      phonePrefix: '+421',
      phone: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    setPersonal(values)
    router.push('/potvrdenie')
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold tracking-tight">Potrebujeme od Vás zopár informácií</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Meno" htmlFor="firstName" error={errors.firstName?.message}>
          <TextInput
            id="firstName"
            autoComplete="given-name"
            placeholder="Zadajte Vaše meno"
            {...register('firstName')}
          />
        </Field>

        <Field label="Priezvisko" htmlFor="lastName" error={errors.lastName?.message}>
          <TextInput
            id="lastName"
            autoComplete="family-name"
            placeholder="Zadajte Vaše priezvisko"
            {...register('lastName')}
          />
        </Field>
      </div>

      <Field label="E-mailová adresa" htmlFor="email" error={errors.email?.message}>
        <TextInput
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Zadajte Váš e-mail"
          {...register('email')}
        />
      </Field>

      <Field
        label="Telefónne číslo"
        htmlFor="phone"
        error={errors.phone?.message ?? errors.phonePrefix?.message}
      >
        <div className="flex gap-2">
          <Select aria-label="Predvoľba krajiny" {...register('phonePrefix')}>
            {PHONE_PREFIXES.map((prefix) => (
              <option key={prefix} value={prefix}>
                {PREFIX_LABELS[prefix]}
              </option>
            ))}
          </Select>
          <TextInput
            id="phone"
            type="tel"
            autoComplete="tel-national"
            placeholder="123 321 123"
            className="flex-1"
            {...register('phone')}
          />
        </div>
      </Field>

      <StepActions backHref="/" submitLabel="Pokračovať →" />
    </form>
  )
}
