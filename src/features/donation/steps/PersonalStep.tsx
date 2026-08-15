'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ScrollArea } from '@/components/ScrollArea'
import { Plus } from '@/components/icons'
import { revealCard, revealField } from '@/lib/revealField'

import {
  EMPTY_DONOR,
  MAX_DONORS,
  createDonorSchema,
  createPersonalStepSchema,
  type PersonalStepInput,
  type PersonalStepValues,
} from '../schema'
import { StepActions } from '../StepActions'
import { useDonationStore } from '../store'
import { useFirstErrorToast } from '../useFirstErrorToast'

import { ACCORDION_MS, DonorCard } from './DonorCard'

export function PersonalStep() {
  const { t } = useTranslation()
  const router = useRouter()
  const saved = useDonationStore((state) => state.personal)
  const setPersonal = useDonationStore((state) => state.setPersonal)

  const schema = useMemo(() => createPersonalStepSchema(t), [t])
  const donorSchema = useMemo(() => createDonorSchema(t), [t])

  const form = useForm<PersonalStepInput, unknown, PersonalStepValues>({
    resolver: zodResolver(schema),
    defaultValues: saved ?? { donors: [EMPTY_DONOR] },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'donors' })
  const donors = useWatch({ control: form.control, name: 'donors' })

  const [openIndex, setOpenIndex] = useState(0)
  const [isRemoving, setRemoving] = useState(false)
  const { addButtonRef, requestAdd, requestRemove } = useDonorListFocus(fields.length)

  const isLastDonorComplete = donorSchema.safeParse(donors?.at(-1)).success
  const atLimit = fields.length >= MAX_DONORS
  const canAdd = !atLimit && isLastDonorComplete

  const blockedReason = atLimit
    ? t('personalStep.donorLimit', { max: MAX_DONORS })
    : isLastDonorComplete
      ? null
      : t('personalStep.donorIncomplete')

  const addDonor = () => {
    if (!canAdd) {
      if (!isLastDonorComplete) {
        setOpenIndex(fields.length - 1)
        revealField(`donors.${fields.length - 1}.firstName`)
      }
      return
    }

    requestAdd(fields.length)
    setOpenIndex(fields.length)
    append({ ...EMPTY_DONOR })
  }

  const removeDonor = (index: number) => {
    requestRemove()
    setOpenIndex(-1)
    setRemoving(true)
    remove(index)
  }

  const reportFirstError = useFirstErrorToast((path) => {
    const [, index, name] = path.split('.')
    const field = name === 'phonePrefix' ? 'phone' : name

    setOpenIndex(Number(index))

    return {
      label: `${t('personalStep.donor', { index: Number(index) + 1 })} · ${t(`personalStep.${field}`)}`,
      fieldId: `donors.${index}.${field}`,
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    setPersonal(values)
    router.push('/potvrdenie')
  }, reportFirstError)

  const canRemove = fields.length > 1
  const isCollapsible = canRemove || isRemoving

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="flex h-full flex-col gap-8 lg:min-h-0">
        <h1 className="text-3xl leading-[1.15] font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          {t('personalStep.heading')}
        </h1>

        <section className="flex flex-col gap-5 lg:min-h-0 lg:flex-1">
          <h2 className="text-sm font-semibold text-gray-900">
            {t('personalStep.sectionHeading')}
          </h2>

          {/* Row spacing is the rows' own padding, not a `gap`: a gap would hold the
              space open until a leaving row unmounts. */}
          <ScrollArea className="flex flex-col">
            {/* No `layout` on the cards: it keeps shifting siblings after a card's own
                animation ends, and the reveal below would aim at stale positions. */}
            <AnimatePresence initial={false} onExitComplete={() => setRemoving(false)}>
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  className="shrink-0 pb-3"
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: 12,
                    scale: 0.96,
                    height: 0,
                    paddingBottom: 0,
                    overflow: 'hidden',
                    transition: { duration: 0.3, ease: 'easeInOut' },
                  }}
                  transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                >
                  <DonorCard
                    index={index}
                    collapsible={isCollapsible}
                    isOpen={!isCollapsible || openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                    onRemove={canRemove ? () => removeDonor(index) : undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button
              ref={addButtonRef}
              type="button"
              aria-disabled={!canAdd || undefined}
              aria-describedby={blockedReason ? 'add-donor-reason' : undefined}
              onClick={addDonor}
              whileHover={canAdd ? { y: -1 } : undefined}
              className={`flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed text-sm font-bold transition-colors ${
                canAdd
                  ? 'border-indigo-300 bg-indigo-50/40 text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50'
                  : 'border-gray-200 bg-gray-50 text-gray-400'
              }`}
            >
              <span
                className={`flex size-5 items-center justify-center rounded-full ${
                  canAdd ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-white'
                }`}
              >
                <Plus width={12} height={12} />
              </span>
              {t('personalStep.addDonor')}
            </motion.button>

            {blockedReason && (
              <p id="add-donor-reason" className="shrink-0 pt-3 text-xs text-gray-500">
                {blockedReason}
              </p>
            )}
          </ScrollArea>

          <p aria-live="polite" className="sr-only">
            {t('personalStep.donorCount', { count: fields.length })}
          </p>
        </section>

        <StepActions backHref="/" submitLabel={t('common.continue')} withArrow />
      </form>
    </FormProvider>
  )
}

/**
 * Adding or removing a donor moves focus, but the target only exists once the list
 * has re-rendered — and a new card is still animating in, so scrolling it fully into
 * view has to wait for that.
 */
function useDonorListFocus(count: number) {
  const pendingFocus = useRef<number | 'add' | null>(null)
  const pendingReveal = useRef<number | null>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const target = pendingFocus.current
    if (target === null) return
    pendingFocus.current = null

    if (target === 'add') addButtonRef.current?.focus({ preventScroll: true })
    else document.getElementById(`donors.${target}.firstName`)?.focus({ preventScroll: true })
  }, [count])

  useEffect(() => {
    const index = pendingReveal.current
    if (index === null) return

    // The sibling that collapsed is still giving its space back, and the new card's
    // position is not final until it has. Scrolling earlier lands on stale offsets.
    // The request is cleared inside the timeout, not before it: in development the
    // effect runs twice and the first cleanup would otherwise cancel the only scroll.
    const timer = window.setTimeout(() => {
      pendingReveal.current = null

      const card = document
        .getElementById(`donors.${index}.firstName`)
        ?.closest('[data-donor-card]')
      if (card instanceof HTMLElement) revealCard(card)
    }, ACCORDION_MS)

    return () => window.clearTimeout(timer)
  }, [count])

  const requestAdd = (index: number) => {
    pendingFocus.current = index
    pendingReveal.current = index
  }

  const requestRemove = () => {
    pendingFocus.current = 'add'
  }

  return { addButtonRef, requestAdd, requestRemove }
}
