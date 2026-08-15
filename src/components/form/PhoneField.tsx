'use client'

import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { FlagCZ, FlagSK } from '@/components/flags'
import type { PhonePrefix } from '@/features/donation/schema'

import { SelectField } from './SelectField'
import { TextInput } from './inputs'

type FlagProps = ComponentProps<'svg'>

// Typed against the schema's prefix union, so adding a prefix there without a
// flag here is a compile error rather than a blank box at runtime.
const PHONE_COUNTRIES: Record<
  PhonePrefix,
  { labelKey: string; Flag: (props: FlagProps) => ReactNode }
> = {
  '+421': { labelKey: 'personalStep.countrySK', Flag: FlagSK },
  '+420': { labelKey: 'personalStep.countryCZ', Flag: FlagCZ },
}

type PhoneFieldProps = {
  prefix: PhonePrefix
  onPrefixChange: (prefix: PhonePrefix) => void
  onPrefixBlur?: () => void
  numberProps: ComponentProps<'input'>
}

export function PhoneField({ prefix, onPrefixChange, onPrefixBlur, numberProps }: PhoneFieldProps) {
  const { t } = useTranslation()

  const options = Object.entries(PHONE_COUNTRIES).map(([value, { labelKey, Flag }]) => ({
    value,
    label: `${t(labelKey)} (${value})`,
    icon: <Flag />,
  }))

  return (
    <div className="flex gap-3">
      <div className="w-20 shrink-0">
        <SelectField
          variant="compact"
          aria-label={t('personalStep.countryPrefix')}
          value={prefix}
          onChange={(value) => onPrefixChange(value as PhonePrefix)}
          onBlur={onPrefixBlur}
          options={options}
        />
      </div>

      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-900">
          {prefix}
        </span>
        {/* Default before the spread, so a caller can scope autofill per donor. */}
        <TextInput autoComplete="tel-national" {...numberProps} type="tel" className="pl-16" />
      </div>
    </div>
  )
}
