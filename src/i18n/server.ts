import { createInstance, type TFunction } from 'i18next'

import { DEFAULT_LOCALE, resources } from './config'

// Server-rendered strings (page metadata) have no request locale to read, because
// there is no locale routing — they always render in the default language.
const instance = createInstance()
void instance.init({
  resources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
  initAsync: false,
})

export const serverT: TFunction = instance.t
