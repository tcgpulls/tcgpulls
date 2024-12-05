import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ReactNode } from "react";
import NavbarContent from "@/components/navigation/NavbarContent";
import { SidebarLayout } from "@/components/catalyst-ui/sidebar-layout";
import SidebarContent from "@/components/navigation/SidebarContent";

export const metadata: Metadata = {
  title: "TCGPulls",
  description: "Get your TCG pack pulls and pull rates all in one place!",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950`}
      >
        <head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </head>
        <body className={`font-sans`}>
          <SidebarLayout
            sidebar={<SidebarContent />}
            navbar={<NavbarContent />}
          >
            <div>{children}</div>
          </SidebarLayout>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
