'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Check } from '@/components/icons'

import { DONATION_STEPS, stepIndex } from './steps'

export function Stepper() {
  const { t } = useTranslation()
  const current = stepIndex(usePathname())

  // Routes outside the wizard (the thank-you page) share this layout but have no progress to show.
  if (current === -1) return null

  return (
    <ol aria-label={t('steps.progress')} className="flex items-center gap-4 text-sm font-medium">
      {DONATION_STEPS.map((step, index) => {
        const isDone = index < current
        const isActive = index === current

        const content = (
          <>
            <span
              className={`flex size-8 items-center justify-center rounded-full border text-sm transition-colors ${
                isActive
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : isDone
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-gray-200 text-gray-400'
              }`}
            >
              {isDone ? <Check className="size-4" /> : index + 1}
            </span>
            {t(step.labelKey)}
            {isDone && <span className="sr-only">{t('steps.completed')}</span>}
          </>
        )

        return (
          <li key={step.href} className="flex flex-1 items-center gap-4 last:flex-none">
            {/* Only finished steps are reachable — jumping ahead would skip validation. */}
            {isDone ? (
              <Link
                href={step.href}
                className="flex shrink-0 items-center gap-3 rounded-lg text-gray-900 hover:text-indigo-700"
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
      className={`flex shrink-0 items-center gap-3 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}
    >
      {children}
    </span>
  )
}
