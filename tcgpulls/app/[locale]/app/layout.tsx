import { ReactNode } from "react";
import NavbarContent from "@/components/navigation/NavbarContent";
import { SidebarLayout } from "@/components/catalyst-ui/sidebar-layout";
import SidebarContent from "@/components/navigation/SidebarContent";

const AppLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <SidebarLayout sidebar={<SidebarContent />} navbar={<NavbarContent />}>
      {children}
    </SidebarLayout>
  );
};

export default AppLayout;
