'use client'

import type { FieldErrors } from 'react-hook-form'

import { useNotificationStore } from '@/store/notifications'

type ErrorNode = { message?: string }

/** The field a toast points at: what to call it, and which control to jump to. */
export type ErrorTarget = { label: string; fieldId: string }

/** Depth-first, so the order matches how the fields are rendered down the page. */
function firstError(
  errors: unknown,
  path: string[] = [],
): { path: string; message: string } | null {
  if (!errors || typeof errors !== 'object') return null

  const node = errors as ErrorNode
  if (typeof node.message === 'string') return { path: path.join('.'), message: node.message }

  for (const [key, child] of Object.entries(errors)) {
    const found = firstError(child, [...path, key])
    if (found) return found
  }

  return null
}

/**
 * Turns a failed submit into a single toast naming the offending field. React Hook
 * Form already moves focus there, but the toast says which field in words and stays
 * behind as a way back for anyone who has scrolled on.
 */
export function useFirstErrorToast(resolve: (path: string) => ErrorTarget) {
  const notify = useNotificationStore((state) => state.notify)
  const clear = useNotificationStore((state) => state.clear)

  return (errors: FieldErrors) => {
    // A new attempt replaces the previous verdict rather than stacking on it.
    clear()

    const failure = firstError(errors)
    if (!failure) return

    const { label, fieldId } = resolve(failure.path)
    notify('ERROR', `${label}: ${failure.message}`, { fieldId })
  }
}
