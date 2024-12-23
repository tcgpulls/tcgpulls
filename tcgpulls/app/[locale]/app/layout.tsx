import { ReactNode } from "react";
import NavbarContent from "@/components/navigation/NavbarContent";
import { SidebarLayout } from "@/components/catalyst-ui/sidebar-layout";
import SidebarContent from "@/components/navigation/SidebarContent";
import AccountBar from "@/components/navigation/AccountBar";
import { auth } from "@/auth";
import Footer from "@/components/misc/Footer";
import { UrlParamsT } from "@/types/Params";
import TcgLanguageContextWrapper from "@/components/context/TcgLanguageContextWrapper";

const AppLayout = async ({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: UrlParamsT;
}>) => {
  const session = await auth();
  const { locale } = await params;

  if (!locale) {
    return null;
  }

  return (
    <TcgLanguageContextWrapper>
      <SidebarLayout sidebar={<SidebarContent />} navbar={<NavbarContent />}>
        <div className={`min-h-full flex flex-col justify-between flex-1`}>
          <div>{children}</div>
          <AccountBar user={session?.user} />
          <Footer />
        </div>
      </SidebarLayout>
    </TcgLanguageContextWrapper>
  );
};

export default AppLayout;
