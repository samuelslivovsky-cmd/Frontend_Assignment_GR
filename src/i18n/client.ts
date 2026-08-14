'use client'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { DEFAULT_LOCALE, LOCALES, resources } from './config'

// Resources are bundled, so init resolves synchronously and no Suspense boundary is needed.
if (!i18next.isInitialized) {
  void i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: LOCALES,
      detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
      interpolation: { escapeValue: false },
    })
}

export default i18next
