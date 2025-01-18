import { ReactNode } from "react";
import "./globals.css";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import Providers from "@/components/Providers";

const LocaleLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: UrlParamsT;
}) => {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as string)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <html lang={locale} className={`min-h-screen`}>
          <body className={`min-h-screen font-sans`}>{children}</body>
        </html>
      </Providers>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
