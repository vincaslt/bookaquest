import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-xhr-backend'
import config from '../config'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    load: 'languageOnly',
    keySeparator: false,
    nsSeparator: false,
    debug: config.env.dev,

    interpolation: {
      escapeValue: false
    }
  })

export default i18n
