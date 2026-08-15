'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Check } from '@/components/icons'

import { DONATION_STEPS, stepIndex } from './steps'

export function Stepper() {
  const { t } = useTranslation()
  const current = stepIndex(usePathname())
  const isPinned = usePinned()

  // Routes outside the wizard (the thank-you page) share this layout but have no progress to show.
  if (current === -1) return null

  return (
    <nav
      aria-label={t('steps.progress')}
      // On phones the progress rides along with the page. The negative margins let
      // the white backdrop bleed past the layout padding, so content scrolling
      // underneath stays hidden all the way to the screen edges.
      className={`sticky top-0 z-20 -mx-4 -mt-4 bg-white px-4 transition-all sm:static sm:z-auto sm:m-0 sm:p-0 sm:shadow-none ${
        isPinned ? 'pt-3 pb-2 shadow-[0_6px_16px_-12px_rgb(0_0_0/0.5)]' : 'pt-4 pb-3'
      }`}
    >
      <CompactSteps current={current} isPinned={isPinned} />
      <FullSteps current={current} />
    </nav>
  )
}

// Collapsing shortens the page, which can pull the scroll position back below the
// threshold and expand the bar again — a loop on pages that only just scroll. The
// gap between these two marks is wider than the height the bar ever gives up, so
// one flip can never trigger the opposite one.
const COLLAPSE_ABOVE = 48
const EXPAND_BELOW = 8

/** Drives the sticky stepper's collapsed state. Crossing a threshold is the only re-render. */
function usePinned() {
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    const sync = () =>
      setIsPinned((pinned) => window.scrollY > (pinned ? EXPAND_BELOW : COLLAPSE_ABOVE))
    sync()

    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])

  return isPinned
}

/** Phone layout: the current step's name, a counter and a segmented progress bar. */
function CompactSteps({ current, isPinned }: { current: number; isPinned: boolean }) {
  const { t } = useTranslation()

  return (
    <div className="sm:hidden">
      {/* Once pinned the heading shrinks to a single small line, so the bar costs
          roughly half the height it does at rest. */}
      <div className="flex items-baseline justify-between gap-3">
        <p className={`font-bold text-gray-900 transition-all ${isPinned ? 'text-sm' : 'text-lg'}`}>
          {t(DONATION_STEPS[current].labelKey)}
        </p>
        <p className="shrink-0 text-xs font-semibold tracking-wide text-indigo-600 uppercase">
          {t('steps.counter', { current: current + 1, total: DONATION_STEPS.length })}
        </p>
      </div>

      <ol className={`flex gap-2 transition-all ${isPinned ? 'mt-2' : 'mt-3'}`}>
        {DONATION_STEPS.map((step, index) => {
          const isDone = index < current
          const label = (
            <span className="sr-only">
              {t(step.labelKey)}
              {isDone && ` ${t('steps.completed')}`}
            </span>
          )

          return (
            // The bar itself is 4px tall; the row around it carries a thumb-sized tap target.
            <li key={step.href} className="-my-2.5 flex h-6 flex-1 items-center">
              {isDone ? (
                <Link href={step.href} className="group flex h-full w-full items-center">
                  <Bar className="bg-indigo-600 group-hover:bg-indigo-700" />
                  {label}
                </Link>
              ) : (
                <span
                  aria-current={index === current ? 'step' : undefined}
                  className="flex h-full w-full items-center"
                >
                  <Bar className={index === current ? 'bg-indigo-600' : 'bg-gray-200'} />
                  {label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Bar({ className }: { className: string }) {
  return <span className={`h-1 w-full rounded-full transition-colors ${className}`} />
}

function FullSteps({ current }: { current: number }) {
  const { t } = useTranslation()

  return (
    <ol className="hidden items-center gap-4 text-sm font-medium sm:flex">
      {DONATION_STEPS.map((step, index) => {
        const isDone = index < current
        const isActive = index === current

        const content = (
          <>
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm transition-colors ${
                isActive
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : isDone
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-gray-200 text-gray-400'
              }`}
            >
              {isDone ? <Check className="size-4" /> : index + 1}
            </span>
            {/* Three labels only fit once the column is wide. Below `xl` just the
                current step is named; the others stay available to screen readers. */}
            <span
              className={`whitespace-nowrap xl:not-sr-only ${isActive ? 'not-sr-only' : 'sr-only'}`}
            >
              {t(step.labelKey)}
            </span>
            {isDone && <span className="sr-only">{t('steps.completed')}</span>}
          </>
        )

        return (
          <li key={step.href} className="flex min-w-0 flex-1 items-center gap-4 last:flex-none">
            {/* Only finished steps are reachable — jumping ahead would skip validation. */}
            {isDone ? (
              <Link
                href={step.href}
                className="flex min-w-0 items-center gap-4 rounded-lg text-gray-900 hover:text-indigo-700"
              >
                {content}
              </Link>
            ) : (
              <Step isActive={isActive}>{content}</Step>
            )}
            {index < DONATION_STEPS.length - 1 && <span className="h-px flex-1 bg-gray-200" />}
          </li>
        )
      })}
    </ol>
  )
}

function Step({ isActive, children }: { isActive: boolean; children: ReactNode }) {
  return (
    <span
      aria-current={isActive ? 'step' : undefined}
      className={`flex min-w-0 items-center gap-4 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}
    >
      {children}
    </span>
  )
}
