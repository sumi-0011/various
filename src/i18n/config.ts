export const locales = ['en-US', 'ko-KR'] as const;

export const defaultLocale: Locale = 'ko-KR';

export type Locale = (typeof locales)[number];
