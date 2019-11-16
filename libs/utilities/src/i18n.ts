import { Locale } from 'date-fns';
import localeEn from 'date-fns/locale/en-US';
import localeLt from 'date-fns/locale/lt';
import i18next, { TOptions } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import {
  initReactI18next,
  Namespace,
  useTranslation,
  UseTranslationOptions
} from 'react-i18next';

const fallbackLng = 'en';

const localeMapping: { [key: string]: Locale } = {
  lt: localeLt,
  en: localeEn
};

export function initI18n() {
  i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng,
      load: 'languageOnly',
      keySeparator: false,
      nsSeparator: false,

      interpolation: {
        escapeValue: false
      }
    });
}

export const useI18n = (ns?: Namespace, options?: UseTranslationOptions) => {
  const i18n = useTranslation(ns, options);
  const dateFnsLocale =
    localeMapping[i18n.i18n.language] || localeMapping[fallbackLng];

  function tt<T extends any[]>(opts: TOptions = {}) {
    return (parts: TemplateStringsArray, ...values: T) => {
      const { key, args } = values.reduce(
        (params, value, i) => {
          const k =
            typeof value === 'object' ? Object.keys(value)[0] : `k_${i}`;
          const v = typeof value === 'object' ? value[k] : value;

          return {
            key: params.key + `${parts[i]}{{${k}}}`,
            args: { ...params.args, [k]: v }
          };
        },
        { key: '', args: {} }
      );
      return i18n.t(key + parts[parts.length - 1], { ...args, ...opts });
    };
  }

  function t<T extends any[]>(parts: TemplateStringsArray, ...values: T) {
    return tt(undefined)(parts, ...values);
  }

  return { ...i18n, t, tt, dateFnsLocale };
};
