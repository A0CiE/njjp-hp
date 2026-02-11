import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { toAppLanguage, type AppLanguage } from './languageOptions';
import zh from './locales/zh.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

export const resources = { zh: { translation: zh }, en: { translation: en }, ja: { translation: ja } } as const;

export function initI18n(initialLng?: AppLanguage){
  const device = Localization.getLocales?.()[0]?.languageCode ?? 'en';
  const lng = initialLng ?? toAppLanguage(device);
  if (!i18next.isInitialized) {
    i18next.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      resources,
      lng,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
  } else {
    i18next.changeLanguage(lng);
  }
  return i18next;
}
