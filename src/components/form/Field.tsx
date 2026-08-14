'use client'

import { createContext, useContext, useId, type ReactNode } from 'react'

import { FieldMark } from './FieldMark'

type FieldAria = {
  describedBy?: string
  invalid: boolean
}

const FieldContext = createContext<FieldAria>({ invalid: false })

/** Lets the controls inside a Field pick up its error wiring without threading props. */
export const useFieldAria = () => useContext(FieldContext)

type FieldProps = {
  label: ReactNode
  required: boolean
  htmlFor?: string
  error?: string
  hint?: string
  children: ReactNode
}

export function Field({ label, required, htmlFor, error, hint, children }: FieldProps) {
  const generatedId = useId()
  const id = htmlFor ?? generatedId
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <FieldContext value={{ describedBy, invalid: Boolean(error) }}>
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-gray-900">
          {label}
          <FieldMark required={required} />
        </label>
        {children}
        {hint && !error && (
          <p id={hintId} className="text-xs text-gray-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </FieldContext>
  )
}
