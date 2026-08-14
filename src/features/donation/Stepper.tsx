'use client'

import { usePathname } from 'next/navigation'

import { DONATION_STEPS, stepIndex } from './steps'

export function Stepper() {
  const current = stepIndex(usePathname())

  return (
    <ol className="flex items-center gap-4 text-sm">
      {DONATION_STEPS.map((step, index) => {
        const isDone = index < current
        const isActive = index === current

        return (
          <li key={step.href} className="flex flex-1 items-center gap-4">
            <span
              aria-current={isActive ? 'step' : undefined}
              className={`flex items-center gap-3 ${isActive || isDone ? 'text-gray-900' : 'text-gray-400'}`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : isDone
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-gray-300 text-gray-400'
                }`}
              >
                {isDone ? '✓' : index + 1}
              </span>
              {step.label}
            </span>
            {index < DONATION_STEPS.length - 1 && <span className="h-px flex-1 bg-gray-200" />}
          </li>
        )
      })}
    </ol>
  )
}
