import { I18n } from 'i18n-js';
import en from './en';
import pt from './pt';

const i18n = new I18n({ en, pt });

i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export default i18n;
