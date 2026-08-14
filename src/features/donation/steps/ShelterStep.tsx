'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'

import { Field } from '@/components/form/Field'
import { Button, Select, TextInput } from '@/components/form/inputs'

import { useShelters } from '../queries'
import {
  DONATION_TARGETS,
  shelterStepSchema,
  type ShelterStepInput,
  type ShelterStepValues,
} from '../schema'
import { StepActions } from '../StepActions'
import { useDonationStore } from '../store'

const AMOUNT_PRESETS = [5, 10, 20, 30, 50, 100]

const TARGET_LABELS: Record<(typeof DONATION_TARGETS)[number], string> = {
  SHELTER: 'Prispieť konkrétnemu útulku',
  FOUNDATION: 'Prispieť celej nadácii',
}

export function ShelterStep() {
  const router = useRouter()
  const shelters = useShelters()
  const saved = useDonationStore((state) => state.shelter)
  const setShelter = useDonationStore((state) => state.setShelter)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ShelterStepInput, unknown, ShelterStepValues>({
    resolver: zodResolver(shelterStepSchema),
    defaultValues: {
      target: saved?.target ?? 'SHELTER',
      shelterId: saved?.shelterId?.toString() ?? '',
      amount: saved ? String(saved.amount) : '',
    },
  })

  const target = useWatch({ control, name: 'target' })

  const onSubmit = handleSubmit((values) => {
    setShelter(values)
    router.push('/osobne-udaje')
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold tracking-tight">Vyberte si možnosť, ako chcete pomôcť</h1>

      <fieldset>
        <legend className="sr-only">Forma pomoci</legend>
        <div className="grid grid-cols-2 rounded-2xl border border-gray-200 p-1">
          {DONATION_TARGETS.map((value) => (
            <label
              key={value}
              className={`cursor-pointer rounded-xl px-4 py-3 text-center text-sm ${
                target === value ? 'bg-indigo-600 text-white' : 'text-gray-700'
              }`}
            >
              <input type="radio" value={value} className="sr-only" {...register('target')} />
              {TARGET_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label={target === 'SHELTER' ? 'Útulok' : 'Útulok (nepovinné)'}
        htmlFor="shelterId"
        error={errors.shelterId?.message}
      >
        <Select id="shelterId" disabled={shelters.isPending} {...register('shelterId')}>
          <option value="">
            {shelters.isPending ? 'Načítavam útulky…' : 'Vyberte útulok zo zoznamu'}
          </option>
          {shelters.data?.map((shelter) => (
            <option key={shelter.id} value={shelter.id}>
              {shelter.name}
            </option>
          ))}
        </Select>
        {shelters.isError && (
          <p role="alert" className="text-sm text-red-700">
            Zoznam útulkov sa nepodarilo načítať.
          </p>
        )}
      </Field>

      <Field label="Suma, ktorou chcem prispieť" htmlFor="amount" error={errors.amount?.message}>
        <TextInput id="amount" inputMode="decimal" placeholder="0 €" {...register('amount')} />
        <div className="flex flex-wrap gap-2 pt-2">
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
      </Field>

      <StepActions submitLabel="Pokračovať →" />
    </form>
  )
}
