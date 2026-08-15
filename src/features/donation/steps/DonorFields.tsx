'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Field } from '@/components/form/Field'
import { PhoneField } from '@/components/form/PhoneField'
import { TextInput } from '@/components/form/inputs'

import { detectPhonePrefix, normalisePhone, type PersonalStepInput } from '../schema'

/**
 * Browsers autofill every repeated field with the same person unless each block
 * declares its own autofill section.
 */
const autoCompleteFor = (index: number, token: string) =>
  index === 0 ? token : `section-donor-${index + 1} ${token}`

export function DonorFields({ index }: { index: number }) {
  const { t } = useTranslation()
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<PersonalStepInput>()

  const path = `donors.${index}` as const
  const fieldId = (name: string) => `${path}.${name}`
  const donorErrors = errors.donors?.[index]
  const phoneField = register(`${path}.phone`)

  // Autofill drops in whatever shape the browser stored; rewrite it once the
  // field is left so the user sees exactly what will be submitted.
  const tidyPhone = (raw: string) => {
    const prefix = detectPhonePrefix(raw)
    if (prefix) setValue(`${path}.phonePrefix`, prefix)
    setValue(`${path}.phone`, normalisePhone(raw))
  }

  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="sr-only">{t('personalStep.donor', { index: index + 1 })}</legend>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t('personalStep.firstName')}
          required
          htmlFor={fieldId('firstName')}
          error={donorErrors?.firstName?.message}
        >
          <TextInput
            id={fieldId('firstName')}
            autoComplete={autoCompleteFor(index, 'given-name')}
            placeholder={t('personalStep.firstNamePlaceholder')}
            {...register(`${path}.firstName`)}
          />
        </Field>

        <Field
          label={t('personalStep.lastName')}
          required
          htmlFor={fieldId('lastName')}
          error={donorErrors?.lastName?.message}
        >
          <TextInput
            id={fieldId('lastName')}
            autoComplete={autoCompleteFor(index, 'family-name')}
            placeholder={t('personalStep.lastNamePlaceholder')}
            {...register(`${path}.lastName`)}
          />
        </Field>
      </div>

      <Field
        label={t('personalStep.email')}
        required
        htmlFor={fieldId('email')}
        error={donorErrors?.email?.message}
      >
        <TextInput
          id={fieldId('email')}
          type="email"
          autoComplete={autoCompleteFor(index, 'email')}
          placeholder={t('personalStep.emailPlaceholder')}
          {...register(`${path}.email`)}
        />
      </Field>

      <Field
        label={t('personalStep.phone')}
        required
        htmlFor={fieldId('phone')}
        error={donorErrors?.phone?.message ?? donorErrors?.phonePrefix?.message}
      >
        <Controller
          name={`${path}.phonePrefix`}
          control={control}
          render={({ field }) => (
            <PhoneField
              prefix={field.value}
              onPrefixChange={field.onChange}
              onPrefixBlur={field.onBlur}
              numberProps={{
                id: fieldId('phone'),
                autoComplete: autoCompleteFor(index, 'tel-national'),
                placeholder: t('personalStep.phonePlaceholder'),
                ...phoneField,
                onBlur: (event) => {
                  tidyPhone(event.target.value)
                  return phoneField.onBlur(event)
                },
              }}
            />
          )}
        />
      </Field>
    </fieldset>
  )
}
