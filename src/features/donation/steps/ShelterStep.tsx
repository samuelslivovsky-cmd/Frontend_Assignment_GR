'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Field } from '@/components/form/Field'
import { Button, Select } from '@/components/form/inputs'

import { DonationDog } from '../DonationDog'
import { useShelters } from '../queries'
import {
  DONATION_TARGETS,
  createShelterStepSchema,
  type ShelterStepInput,
  type ShelterStepValues,
} from '../schema'
import { StepActions } from '../StepActions'
import { useDonationStore } from '../store'

const AMOUNT_PRESETS = [5, 10, 20, 30, 50, 100]

const TARGET_KEYS: Record<(typeof DONATION_TARGETS)[number], string> = {
  SHELTER: 'shelterStep.targetShelter',
  FOUNDATION: 'shelterStep.targetFoundation',
}

export function ShelterStep() {
  const { t } = useTranslation()
  const router = useRouter()
  const shelters = useShelters()
  const saved = useDonationStore((state) => state.shelter)
  const setShelter = useDonationStore((state) => state.setShelter)

  const schema = useMemo(() => createShelterStepSchema(t), [t])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ShelterStepInput, unknown, ShelterStepValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      target: saved?.target ?? 'SHELTER',
      shelterId: saved?.shelterId?.toString() ?? '',
      amount: saved ? String(saved.amount) : '',
    },
  })

  const target = useWatch({ control, name: 'target' })
  const amount = useWatch({ control, name: 'amount' })

  const onSubmit = handleSubmit((values) => {
    setShelter(values)
    router.push('/osobne-udaje')
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex h-full flex-col gap-8">
      <h1 className="text-5xl leading-[1.15] font-bold tracking-tight text-gray-900">
        {t('shelterStep.heading')}
      </h1>

      <fieldset>
        <legend className="sr-only">{t('shelterStep.targetLegend')}</legend>
        <div className="grid grid-cols-2 rounded-2xl border border-gray-200 p-1">
          {DONATION_TARGETS.map((value) => (
            <label
              key={value}
              className={`rounded-xl px-4 py-3 text-center text-sm font-medium transition-colors ${
                target === value ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <input type="radio" value={value} className="sr-only" {...register('target')} />
              {t(TARGET_KEYS[value])}
            </label>
          ))}
        </div>
      </fieldset>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-900">{t('shelterStep.sectionHeading')}</h2>

        <Field
          label={
            <>
              {t('shelterStep.shelterLabel')}{' '}
              {target === 'FOUNDATION' && (
                <span className="font-normal text-gray-400">{t('shelterStep.shelterOptional')}</span>
              )}
            </>
          }
          htmlFor="shelterId"
          error={errors.shelterId?.message}
        >
          <Select id="shelterId" disabled={shelters.isPending} {...register('shelterId')}>
            <option value="">
              {shelters.isPending
                ? t('shelterStep.shelterLoading')
                : t('shelterStep.shelterPlaceholder')}
            </option>
            {shelters.data?.map((shelter) => (
              <option key={shelter.id} value={shelter.id}>
                {shelter.name}
              </option>
            ))}
          </Select>
          {shelters.isError && (
            <p role="alert" className="text-sm text-red-700">
              {t('shelterStep.shelterError')}
            </p>
          )}
        </Field>
      </section>

      <section className="flex flex-col gap-6">
        <label htmlFor="amount" className="text-sm font-semibold text-gray-900">
          {t('shelterStep.amountLabel')}
        </label>

        <div className="relative flex items-center justify-center">
          <span className="inline-flex items-baseline gap-1 border-b-2 border-indigo-600 pb-2">
            <input
              id="amount"
              inputMode="decimal"
              placeholder="0"
              aria-invalid={errors.amount ? true : undefined}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              // `ch` tracks the digit width of the current font, so the field hugs the value.
              style={{ width: `${Math.max(1, String(amount ?? '').length) + 0.6}ch` }}
              className="bg-transparent text-center text-6xl font-normal text-gray-900 outline-none transition-[width] duration-150 placeholder:text-gray-300"
              {...register('amount')}
            />
            <span className="text-2xl text-gray-500">€</span>
          </span>
          {/* Absolute so the amount stays optically centred, as in the design. */}
          <span className="absolute right-0">
            <DonationDog amount={Number(String(amount).replace(',', '.'))} />
          </span>
        </div>

        {errors.amount && (
          <p id="amount-error" role="alert" className="text-center text-sm text-red-700">
            {errors.amount.message}
          </p>
        )}

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {AMOUNT_PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              aria-pressed={Number(amount) === preset}
              variant={Number(amount) === preset ? 'primary' : 'secondary'}
              className="py-3"
              onClick={() => setValue('amount', String(preset), { shouldValidate: true })}
            >
              {preset} €
            </Button>
          ))}
        </div>
      </section>

      <StepActions submitLabel={t('common.continue')} withArrow />
    </form>
  )
}
