'use client'

import { motion } from 'motion/react'
import type { ComponentProps } from 'react'

import { ChevronDown } from '@/components/icons'

import { useFieldAria } from './Field'

const CONTROL =
  'w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-900 placeholder:text-gray-400 aria-invalid:outline-2 aria-invalid:outline-red-600 disabled:opacity-60'

export function TextInput({ className, ...props }: ComponentProps<'input'>) {
  const { describedBy, invalid } = useFieldAria()

  return (
    <input
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      {...props}
      className={`${CONTROL} ${className ?? ''}`}
    />
  )
}

// The native arrow is replaced so the control matches the rest of the design system.
export function Select({ className, ...props }: ComponentProps<'select'>) {
  const { describedBy, invalid } = useFieldAria()

  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        {...props}
        className={`${CONTROL} appearance-none pr-11 ${className ?? ''}`}
      />
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-500" />
    </div>
  )
}

// Motion owns these handlers, so the native versions are dropped from the props.
type ButtonProps = Omit<
  ComponentProps<'button'>,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & { variant?: 'primary' | 'secondary' }

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const style =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'

  return (
    <motion.button
      whileHover={props.disabled ? undefined : { scale: 1.03 }}
      whileTap={props.disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${style} ${className ?? ''}`}
    />
  )
}
