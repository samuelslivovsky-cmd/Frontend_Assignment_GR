'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Field } from '@/components/form/Field'
import { PhoneField } from '@/components/form/PhoneField'
import { TextInput } from '@/components/form/inputs'

import {
  createPersonalStepSchema,
  type PersonalStepInput,
  type PersonalStepValues,
} from '../schema'
import { StepActions } from '../StepActions'
import { useDonationStore } from '../store'

export function PersonalStep() {
  const { t } = useTranslation()
  const router = useRouter()
  const saved = useDonationStore((state) => state.personal)
  const setPersonal = useDonationStore((state) => state.setPersonal)

  const schema = useMemo(() => createPersonalStepSchema(t), [t])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PersonalStepInput, unknown, PersonalStepValues>({
    resolver: zodResolver(schema),
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
        {t('personalStep.heading')}
      </h1>

      <section className="flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-gray-900">{t('personalStep.sectionHeading')}</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t('personalStep.firstName')}
            htmlFor="firstName"
            error={errors.firstName?.message}
          >
            <TextInput
              id="firstName"
              autoComplete="given-name"
              placeholder={t('personalStep.firstNamePlaceholder')}
              {...register('firstName')}
            />
          </Field>

          <Field
            label={t('personalStep.lastName')}
            htmlFor="lastName"
            error={errors.lastName?.message}
          >
            <TextInput
              id="lastName"
              autoComplete="family-name"
              placeholder={t('personalStep.lastNamePlaceholder')}
              {...register('lastName')}
            />
          </Field>
        </div>

        <Field label={t('personalStep.email')} htmlFor="email" error={errors.email?.message}>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t('personalStep.emailPlaceholder')}
            {...register('email')}
          />
        </Field>

        <Field
          label={t('personalStep.phone')}
          htmlFor="phone"
          error={errors.phone?.message ?? errors.phonePrefix?.message}
        >
          <PhoneField
            prefix={phonePrefix}
            prefixProps={register('phonePrefix')}
            numberProps={{
              id: 'phone',
              placeholder: t('personalStep.phonePlaceholder'),
              ...register('phone'),
            }}
          />
        </Field>
      </section>

      <StepActions backHref="/" submitLabel={t('common.continue')} withArrow />
    </form>
  )
}
