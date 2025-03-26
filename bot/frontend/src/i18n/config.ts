import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en_common from './en/common.json';
import en_sidenav from './en/sidenav.json';
import en_header from './en/header.json';
import en_chat from './en/chat.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: en_common,
    sidenav: en_sidenav,
    header: en_header,
    chat: en_chat
  },
} as const;

i18next.use(initReactI18next).init({
  lng: 'en', // if you're using a language detector, do not define the lng option
  debug: true,
  resources,
  defaultNS,
  returnObjects: true,
  fallbackLng: "en",
});

export default i18next;