import { ReactNode } from "react";
import NavbarContent from "@/components/navigation/NavbarContent";
import { SidebarLayout } from "@/components/catalyst-ui/sidebar-layout";
import SidebarContent from "@/components/navigation/SidebarContent";
import Footer from "@/components/misc/Footer";

const AppLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <SidebarLayout sidebar={<SidebarContent />} navbar={<NavbarContent />}>
      <div className={`min-h-full flex flex-col justify-between flex-1`}>
        <div>{children}</div>
        <Footer />
      </div>
    </SidebarLayout>
  );
};

export default AppLayout;
