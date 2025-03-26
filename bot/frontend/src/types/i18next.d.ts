import { defaultNS, resources } from '../i18n/config';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources["en"];
    returnObjects: true;
  }
}

declare module 'i18next' {
  interface CustomTypeOptions {
    returnObjects: true;
  }
}

