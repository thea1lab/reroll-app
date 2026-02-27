import en from './en';
import pt from './pt';

const translations = { en, pt } as const;

export type AppLocale = keyof typeof translations;

export default translations;
