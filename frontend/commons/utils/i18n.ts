import i18next, { TOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-xhr-backend'
import { initReactI18next, Namespace, useTranslation, UseTranslationOptions } from 'react-i18next'
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

export const useI18n = (ns?: Namespace, options?: UseTranslationOptions) => {
  const i18n = useTranslation(ns, options)

  const _t = <T extends any[]>(opts: TOptions = {}) => (parts: string[], ...values: T) => {
    const { key, args } = values.reduce(
      (params, value, i) => {
        const k = typeof value === 'object' ? Object.keys(value)[0] : `k_${i}`
        const v = typeof value === 'object' ? value[k] : value

        return { key: params.key + `${parts[i]}{{${k}}}`, args: { ...params.args, [k]: v } }
      },
      { key: '', args: {} }
    )
    return i18n.t(key + parts[parts.length - 1], { ...args, ...opts })
  }

  const t = <T extends any[]>(optsOrParts: TOptions | string[], ...args: T) => {
    if (typeof optsOrParts === 'object' && !Array.isArray(optsOrParts)) {
      return _t(optsOrParts)
    }
    return _t(undefined)(optsOrParts, ...args)
  }

  return { ...i18n, t }
}

export default initI18n
