import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'
import config from '../config'

function initI18n() {
  i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      load: 'languageOnly',
      keySeparator: false,
      nsSeparator: false,
      debug: config.env.dev, // TODO: NODE_ENV var by default set in package.json?

      interpolation: {
        escapeValue: false
      }
    })
}

export default initI18n
