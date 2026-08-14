import type { ComponentProps } from 'react'

const CONTROL =
  'w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-indigo-600 disabled:opacity-60'

export function TextInput({ className, ...props }: ComponentProps<'input'>) {
  return <input {...props} className={`${CONTROL} ${className ?? ''}`} />
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select {...props} className={`${CONTROL} ${className ?? ''}`} />
}

type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'secondary' }

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const style =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'

  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm disabled:opacity-60 ${style} ${className ?? ''}`}
    />
  )
}
