'use client'

import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { FlagCZ, FlagSK } from '@/components/flags'
import { ChevronDown } from '@/components/icons'
import type { PhonePrefix } from '@/features/donation/schema'

import { TextInput } from './inputs'

type FlagProps = ComponentProps<'svg'>

// Typed against the schema's prefix union, so adding a prefix there without a
// flag here is a compile error rather than a blank box at runtime.
const PHONE_COUNTRIES: Record<PhonePrefix, { labelKey: string; Flag: (props: FlagProps) => ReactNode }> =
  {
    '+421': { labelKey: 'personalStep.countrySK', Flag: FlagSK },
    '+420': { labelKey: 'personalStep.countryCZ', Flag: FlagCZ },
  }

type PhoneFieldProps = {
  prefix: PhonePrefix
  prefixProps: ComponentProps<'select'>
  numberProps: ComponentProps<'input'>
}

// The native select stays in place for keyboard and screen-reader users but is
// rendered invisible, so the flag and chevron below it can carry the design.
export function PhoneField({ prefix, prefixProps, numberProps }: PhoneFieldProps) {
  const { t } = useTranslation()
  const { Flag } = PHONE_COUNTRIES[prefix]

  return (
    <div className="flex gap-3">
      <div className="relative w-20 shrink-0">
        <select
          {...prefixProps}
          aria-label={t('personalStep.countryPrefix')}
          className="peer absolute inset-0 size-full opacity-0"
        >
          {Object.entries(PHONE_COUNTRIES).map(([value, { labelKey }]) => (
            <option key={value} value={value}>
              {t(labelKey)} ({value})
            </option>
          ))}
        </select>
        <div className="pointer-events-none flex h-full items-center justify-center gap-1 rounded-lg bg-gray-100 peer-focus-visible:outline-2 peer-focus-visible:outline-indigo-600">
          <Flag />
          <ChevronDown className="text-gray-500" />
        </div>
      </div>

      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-900">
          {prefix}
        </span>
        <TextInput {...numberProps} type="tel" autoComplete="tel-national" className="pl-16" />
      </div>
    </div>
  )
}
