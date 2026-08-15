'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ScrollArea } from '@/components/ScrollArea'
import { Skeleton } from '@/components/Skeleton'
import { Field } from '@/components/form/Field'
import { FieldMark } from '@/components/form/FieldMark'
import { SelectField } from '@/components/form/SelectField'
import { Button } from '@/components/form/inputs'

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
import { useFirstErrorToast } from '../useFirstErrorToast'

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

  const reportFirstError = useFirstErrorToast((path) => ({
    label: t(path === 'amount' ? 'shelterStep.amountLabel' : 'shelterStep.shelterLabel'),
    fieldId: path,
  }))

  const onSubmit = handleSubmit((values) => {
    setShelter(values)
    router.push('/osobne-udaje')
  }, reportFirstError)

  return (
    <form onSubmit={onSubmit} noValidate className="flex h-full flex-col gap-8 lg:min-h-0">
      <h1 className="text-3xl leading-[1.15] font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
        {t('shelterStep.heading')}
      </h1>

      <ScrollArea className="flex flex-col gap-8">
        <fieldset>
          <legend className="sr-only">{t('shelterStep.targetLegend')}</legend>
          {/* Both labels never fit side by side on a phone, so below `sm` they stack
            rather than wrap mid-sentence. */}
          <div className="grid gap-1 rounded-2xl border border-gray-200 p-1 sm:grid-cols-2 sm:gap-0">
            {DONATION_TARGETS.map((value) => (
              <label
                key={value}
                className={`relative rounded-xl px-2 py-3 text-center text-xs font-medium whitespace-nowrap transition-colors xl:px-4 xl:text-sm ${
                  target === value ? 'text-white' : 'text-gray-700'
                }`}
              >
                <input type="radio" value={value} className="sr-only" {...register('target')} />
                {/* One shared element that slides between the two halves. */}
                {target === value && (
                  <motion.span
                    layoutId="donation-target-pill"
                    className="absolute inset-0 rounded-xl bg-indigo-600"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{t(TARGET_KEYS[value])}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <section className="flex flex-col gap-4" aria-busy={shelters.isPending}>
          <h2 className="text-sm font-semibold text-gray-900">{t('shelterStep.sectionHeading')}</h2>

          <Field
            label={t('shelterStep.shelterLabel')}
            required={target === 'SHELTER'}
            htmlFor="shelterId"
            error={errors.shelterId?.message}
          >
            {shelters.isPending ? (
              <div className="flex h-12 items-center justify-between rounded-lg bg-gray-100 px-4">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="size-3 rounded-full" />
              </div>
            ) : (
              <Controller
                name="shelterId"
                control={control}
                render={({ field }) => (
                  <SelectField
                    id="shelterId"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t('shelterStep.shelterPlaceholder')}
                    options={[
                      // Clearing the choice only makes sense when donating to the foundation.
                      ...(target === 'FOUNDATION'
                        ? [{ value: '', label: t('shelterStep.shelterNone') }]
                        : []),
                      ...(shelters.data ?? []).map((shelter) => ({
                        value: String(shelter.id),
                        label: shelter.name,
                      })),
                    ]}
                  />
                )}
              />
            )}
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
            <FieldMark required />
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
                style={{
                  width: `${Math.max(1, String(amount ?? '').length) + 0.6}ch`,
                }}
                className="bg-transparent text-center text-5xl font-normal text-gray-900 transition-[width] duration-150 outline-none placeholder:text-gray-300 sm:text-6xl"
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

          <div className="grid grid-cols-3 gap-3 xl:grid-cols-6">
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
      </ScrollArea>

      <StepActions submitLabel={t('common.continue')} withArrow />
    </form>
  )
}
