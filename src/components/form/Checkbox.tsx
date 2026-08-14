'use client'

import type { ComponentProps, ReactNode } from 'react'

import { Check } from '@/components/icons'

/**
 * The native control stays in place for keyboard and assistive tech but is
 * transparent — `accent-color` cannot produce the Figma style, which is a tinted
 * box with an indigo tick rather than a filled box with a white one.
 */
export function Checkbox({ children, ...props }: ComponentProps<'input'> & { children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-900">
      <span className="relative inline-flex size-4 shrink-0">
        <input
          type="checkbox"
          className="peer absolute inset-0 size-full cursor-pointer opacity-0"
          {...props}
        />
        <span className="pointer-events-none flex size-4 items-center justify-center rounded border border-gray-300 bg-white transition-colors peer-checked:border-indigo-600 peer-checked:bg-indigo-100 peer-checked:[&>svg]:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-indigo-600 peer-focus-visible:outline-offset-2">
          <Check width={12} height={12} className="text-indigo-600 opacity-0 transition-opacity" />
        </span>
      </span>
      {children}
    </label>
  )
}
