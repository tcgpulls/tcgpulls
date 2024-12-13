import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import i18n from "@/i18n/i18n";

export type Locale = (typeof i18n.locales)[number]["value"];

export const routing = defineRouting({
  locales: i18n.locales.map((locale) => locale.value),
  defaultLocale: i18n.defaultLocale,
  pathnames: i18n.pathnames,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
