import { ReactNode } from "react";
import NavbarContent from "@/components/navigation/NavbarContent";
import { SidebarLayout } from "@/components/catalyst-ui/sidebar-layout";
import SidebarContent from "@/components/navigation/SidebarContent";
import AccountBar from "@/components/navigation/AccountBar";
import { auth } from "@/auth";

const AppLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const session = await auth();

  return (
    <SidebarLayout
      sidebar={<SidebarContent footer={<AccountBar user={session?.user} />} />}
      navbar={<NavbarContent />}
    >
      {children}
    </SidebarLayout>
  );
};

export default AppLayout;
