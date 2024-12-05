import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ReactNode } from "react";
import Navigation from "@/components/navigation/navigation";

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
      <html lang="en">
        <head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </head>
        <body className={`flex font-sans`}>
          <Navigation />
          <div>{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
