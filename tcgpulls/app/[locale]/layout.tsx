import { ReactNode } from "react";
import "../../globals.css";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { UrlParamsT } from "@/types/Params";
import CustomApolloProvider from "@/components/providers/CustomApolloProvider";
import { SessionProvider } from "next-auth/react";
import TcgLanguageContextWrapper from "@/components/context/TcgLanguageContextWrapper";
import ToasterProvider from "@/components/providers/ToasterProvider";

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
    <SessionProvider>
      <TcgLanguageContextWrapper>
        <NextIntlClientProvider messages={messages}>
          <CustomApolloProvider>
            <html lang={locale} className={`min-h-screen`}>
              <body className={`flex flex-col min-h-screen grow font-sans`}>
                <ToasterProvider />
                {children}
              </body>
            </html>
          </CustomApolloProvider>
        </NextIntlClientProvider>
      </TcgLanguageContextWrapper>
    </SessionProvider>
  );
};

export default LocaleLayout;
