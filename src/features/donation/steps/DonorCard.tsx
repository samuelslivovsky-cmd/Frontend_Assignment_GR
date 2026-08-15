'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ChevronDown, Trash } from '@/components/icons'

import type { PersonalStepInput } from '../schema'

import { DonorFields } from './DonorFields'

/** Kept in step with the `duration-300` below — callers wait it out before scrolling. */
export const ACCORDION_MS = 300

type DonorCardProps = {
  index: number
  /** A lone donor stays a plain form — the header only earns its place from the second one. */
  collapsible: boolean
  isOpen: boolean
  onToggle: () => void
  onRemove?: () => void
}

export function DonorCard({ index, collapsible, isOpen, onToggle, onRemove }: DonorCardProps) {
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext<PersonalStepInput>()

  const donor = useWatch({ control, name: `donors.${index}` })
  const hasErrors = Boolean(errors.donors?.[index])
  const contentId = `donor-${index}-fields`

  if (!collapsible) return <DonorFields index={index} />

  const fullName = [donor?.firstName, donor?.lastName].filter(Boolean).join(' ').trim()

  return (
    <article
      data-donor-card
      className={`rounded-2xl border transition-colors ${
        hasErrors
          ? 'border-red-300'
          : isOpen
            ? 'border-indigo-200 shadow-[0_8px_30px_rgb(39_28_128/0.07)]'
            : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <Initials index={index} name={fullName} hasErrors={hasErrors} />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-gray-900">
            {fullName || t('personalStep.newDonor')}
          </span>
          <span
            className={`block truncate text-xs ${hasErrors ? 'text-red-700' : 'text-gray-500'}`}
          >
            {hasErrors
              ? t('personalStep.donorHasErrors')
              : donor?.email || t('personalStep.fillDetails')}
          </span>
        </span>

        <span className="hidden text-xs font-semibold text-indigo-600 sm:block">
          {isOpen ? t('personalStep.close') : t('personalStep.edit')}
        </span>
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-all ${
            isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <ChevronDown width={16} height={16} />
        </span>
      </button>

      {/* A 0fr → 1fr grid row collapses to the content's own height without measuring it. */}
      <div
        id={contentId}
        inert={!isOpen || undefined}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        {/* `relative` contains the fields' absolutely positioned `sr-only` labels;
            otherwise the scroll area is their containing block, escapes this clip and
            counts them at their uncollapsed offsets. */}
        <div className="relative overflow-hidden">
          <div className="flex flex-col gap-5 border-t border-gray-100 px-3 pt-4 pb-3">
            <DonorFields index={index} />

            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1.5 self-end rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
              >
                <Trash width={14} height={14} />
                {t('personalStep.removeDonor')}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function Initials({ index, name, hasErrors }: { index: number; name: string; hasErrors: boolean }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <span
      aria-hidden
      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
        hasErrors ? 'bg-red-50 text-red-700' : 'bg-indigo-50 text-indigo-600'
      }`}
    >
      {initials || index + 1}
    </span>
  )
}
