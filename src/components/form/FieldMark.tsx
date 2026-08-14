'use client'

import { useTranslation } from 'react-i18next'

/**
 * Replaces the usual asterisk. Colour alone would fail WCAG 1.4.1, so each dot
 * carries a screen-reader-only word alongside it.
 */
export function FieldMark({ required }: { required: boolean }) {
  const { t } = useTranslation()

  return (
    <span
      // `align-super` puts it where a required asterisk would sit, not on the text's midline.
      className={`ml-1 inline-block size-1.5 rounded-full align-super ${
        required ? 'bg-indigo-600' : 'bg-green-600'
      }`}
    >
      <span className="sr-only">{required ? t('common.required') : t('common.optional')}</span>
    </span>
  )
}

export function FieldLegend() {
  const { t } = useTranslation()

  const items = [
    { className: 'bg-indigo-600', label: t('common.requiredField') },
    { className: 'bg-green-600', label: t('common.optionalField') },
  ]

  return (
    <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
      {items.map(({ className, label }) => (
        <span key={label} className="flex items-center gap-2">
          <span aria-hidden className={`size-1.5 rounded-full ${className}`} />
          {label}
        </span>
      ))}
    </p>
  )
}
