import { ReactNode } from "react";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import NavbarContent from "@/components/navigation/NavbarContent";
import { SidebarLayout } from "@/components/catalyst-ui/sidebar-layout";
import SidebarContent from "@/components/navigation/SidebarContent";
import { LanguageProvider } from "@/context/LanguageContext";
import ClientRedirect from "@/components/utils/ClientRedirect";
import { setupLanguage } from "@/server/setupLanguage";
import CustomHead from "@/components/misc/Head";

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { language: string };
}>) => {
  // Call the server utility to fetch language setup
  const { locale, messages, validPreferredLocale } = await setupLanguage();

  return (
    <LanguageProvider language={validPreferredLocale}>
      {/* Redirect root url to default language*/}
      <ClientRedirect from={"/"} to={validPreferredLocale} />
      <html
        lang={locale}
        className={`bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950`}
      >
        <CustomHead />
        <body className={`font-sans`}>
          <NextIntlClientProvider
            locale={params.language || locale}
            messages={messages}
          >
            <SidebarLayout
              sidebar={<SidebarContent />}
              navbar={<NavbarContent />}
            >
              <div>{children}</div>
            </SidebarLayout>
          </NextIntlClientProvider>
        </body>
      </html>
    </LanguageProvider>
  );
};

export default RootLayout;
