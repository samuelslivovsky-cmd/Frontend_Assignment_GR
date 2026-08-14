'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'

import { Field } from '@/components/form/Field'
import { PhoneField } from '@/components/form/PhoneField'
import { TextInput } from '@/components/form/inputs'

import {
  personalStepSchema,
  type PersonalStepInput,
  type PersonalStepValues,
} from '../schema'
import { StepActions } from '../StepActions'
import { useDonationStore } from '../store'

export function PersonalStep() {
  const router = useRouter()
  const saved = useDonationStore((state) => state.personal)
  const setPersonal = useDonationStore((state) => state.setPersonal)

  const {
    register,
    handleSubmit,
    control,
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

  const phonePrefix = useWatch({ control, name: 'phonePrefix' })

  const onSubmit = handleSubmit((values) => {
    setPersonal(values)
    router.push('/potvrdenie')
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex h-full flex-col gap-8">
      <h1 className="text-5xl leading-[1.15] font-bold tracking-tight text-gray-900">
        Potrebujeme od Vás zopár informácií
      </h1>

      <section className="flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-gray-900">O vás</h2>

        <div className="grid gap-5 sm:grid-cols-2">
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
          <PhoneField
            prefix={phonePrefix}
            prefixProps={register('phonePrefix')}
            numberProps={{ id: 'phone', placeholder: '123 321 123', ...register('phone') }}
          />
        </Field>
      </section>

      <StepActions backHref="/" submitLabel="Pokračovať" withArrow />
    </form>
  )
}
