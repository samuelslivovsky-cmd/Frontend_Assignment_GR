import type { ComponentProps } from 'react'

const CONTROL = 'rounded border border-slate-400 bg-white px-3 py-2 disabled:opacity-60'

export function TextInput(props: ComponentProps<'input'>) {
  return <input {...props} className={CONTROL} />
}

export function Select(props: ComponentProps<'select'>) {
  return <select {...props} className={CONTROL} />
}

export function Button({ variant = 'primary', ...props }: ComponentProps<'button'> & { variant?: 'primary' | 'secondary' }) {
  const style =
    variant === 'primary'
      ? 'bg-slate-900 text-white hover:bg-slate-700'
      : 'border border-slate-400 hover:bg-slate-100'

  return (
    <button
      {...props}
      className={`rounded px-4 py-2 disabled:opacity-60 ${style} ${props.className ?? ''}`}
    />
  )
}
