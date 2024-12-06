import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import NavbarContent from "@/components/navigation/NavbarContent";
import { SidebarLayout } from "@/components/catalyst-ui/sidebar-layout";
import SidebarContent from "@/components/navigation/SidebarContent";

const RootLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const locale = await getLocale();
  const messages = await getMessages({ locale });

  return (
    <ClerkProvider>
      <html
        lang={locale}
        className={`bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950`}
      >
        <head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </head>
        <body className={`font-sans`}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SidebarLayout
              sidebar={<SidebarContent />}
              navbar={<NavbarContent />}
            >
              <div>{children}</div>
            </SidebarLayout>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
