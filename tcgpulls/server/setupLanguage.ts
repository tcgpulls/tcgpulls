import { cookies } from "next/headers"; // Server-side cookie access
import { getLocale, getMessages } from "next-intl/server";
import i18n from "@/messages/i18n";

export const setupLanguage = async () => {
  // Fetch locale and messages for translations
  const locale = await getLocale();
  const messages = await getMessages({ locale });

  // Get the user's preferred language from the cookie
  const cookieStore = await cookies();
  const preferredLocale =
    cookieStore.get("NEXT_LOCALE")?.value || i18n.defaultLocale;

  // Validate the preferred locale against supported locales
  const isSupportedLocale = i18n.locales.some(
    (lang) => lang.value === preferredLocale,
  );
  const validPreferredLocale = isSupportedLocale
    ? preferredLocale
    : i18n.defaultLocale;

  return { locale, messages, validPreferredLocale };
};
