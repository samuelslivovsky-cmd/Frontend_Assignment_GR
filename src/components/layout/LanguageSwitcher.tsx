'use client'

import { useTranslation } from 'react-i18next'

import { setLocale } from '@/i18n/client'
import { LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/config'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('common.language')}
      className="flex items-center gap-1 rounded-lg border border-gray-200 p-1"
    >
      {LOCALES.map((locale: Locale) => {
        const isActive = i18n.resolvedLanguage === locale

        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-pressed={isActive}
            onClick={() => setLocale(locale)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${
              isActive ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span aria-hidden>{locale}</span>
            <span className="sr-only">{LOCALE_LABELS[locale]}</span>
          </button>
        )
      })}
    </div>
  )
}
