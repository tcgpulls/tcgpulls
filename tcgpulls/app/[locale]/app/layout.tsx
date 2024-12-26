import { ReactNode } from "react";
import NavbarContent from "@/components/navigation/NavbarContent";
import { SidebarLayout } from "@/components/catalyst-ui/sidebar-layout";
import SidebarContent from "@/components/navigation/SidebarContent";
import Footer from "@/components/misc/Footer";
import { UrlParamsT } from "@/types/Params";
import TcgLanguageContextWrapper from "@/components/context/TcgLanguageContextWrapper";
import { SessionProvider } from "next-auth/react";

const AppLayout = async ({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: UrlParamsT;
}>) => {
  const { locale } = await params;

  if (!locale) {
    return null;
  }

  return (
    <TcgLanguageContextWrapper>
      <SessionProvider>
        <SidebarLayout sidebar={<SidebarContent />} navbar={<NavbarContent />}>
          <div className={`min-h-full flex flex-col justify-between flex-1`}>
            <div>{children}</div>
            <Footer />
          </div>
        </SidebarLayout>
      </SessionProvider>
    </TcgLanguageContextWrapper>
  );
};

export default AppLayout;
