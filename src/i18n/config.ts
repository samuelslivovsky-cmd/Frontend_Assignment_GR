import en from './locales/en.json'
import sk from './locales/sk.json'

export const LOCALES = ['sk', 'en'] as const
export const DEFAULT_LOCALE = 'sk'

export type Locale = (typeof LOCALES)[number]

export const resources = {
  sk: { translation: sk },
  en: { translation: en },
}

export const LOCALE_LABELS: Record<Locale, string> = {
  sk: 'Slovensky',
  en: 'English',
}
