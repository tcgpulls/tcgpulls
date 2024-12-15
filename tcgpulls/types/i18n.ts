export type i18nT = {
  defaultLocale: string;
  locales: i18nLocaleT[];
  pathnames: Record<string, Record<string, string>>;
};

export type i18nLocaleT = {
  value: string;
  label: string;
};
