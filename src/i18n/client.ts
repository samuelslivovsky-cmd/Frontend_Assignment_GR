'use client'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import { DEFAULT_LOCALE, LOCALES, resources, type Locale } from './config'

const STORAGE_KEY = 'goodboy.locale'

// Init pins the default locale so the first client render matches the server HTML.
// Detection runs after hydration (see applyPreferredLocale), never before it.
if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: LOCALES,
    interpolation: { escapeValue: false },
  })
}

const isSupported = (value: string | null): value is Locale =>
  LOCALES.includes(value as Locale)

function preferredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (isSupported(stored)) return stored

  const fromBrowser = navigator.language.split('-')[0]
  return isSupported(fromBrowser) ? fromBrowser : DEFAULT_LOCALE
}

export function applyPreferredLocale() {
  const locale = preferredLocale()
  if (locale !== i18next.resolvedLanguage) void i18next.changeLanguage(locale)
}

export function setLocale(locale: Locale) {
  localStorage.setItem(STORAGE_KEY, locale)
  void i18next.changeLanguage(locale)
}

export default i18next
