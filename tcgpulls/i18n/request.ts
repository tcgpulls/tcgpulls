import { getRequestConfig } from "next-intl/server";
import { headers, cookies } from "next/headers";
import i18n from "@/messages/i18n";

export default getRequestConfig(async () => {
  // Try to get the locale from cookies
  let locale = (await cookies()).get("NEXT_LOCALE")?.value;

  // If no locale is found in cookies, use the Accept-Language header
  if (!locale) {
    const acceptLanguage = (await headers()).get("accept-language");
    locale = acceptLanguage ? acceptLanguage.split(",")[0] : i18n.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
