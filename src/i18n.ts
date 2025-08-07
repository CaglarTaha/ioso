import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'tr'],
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: { translation: require('../locales/en.json') },
      tr: { translation: require('../locales/tr.json') }
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;