'use client'

import { useTranslation } from 'react-i18next'

import { LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/config'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex items-center gap-1 text-sm" role="group" aria-label={t('common.language')}>
      {LOCALES.map((locale: Locale) => (
        <button
          key={locale}
          type="button"
          lang={locale}
          aria-pressed={i18n.resolvedLanguage === locale}
          onClick={() => void i18n.changeLanguage(locale)}
          className={`rounded px-2 py-1 ${
            i18n.resolvedLanguage === locale
              ? 'font-semibold text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  )
}
