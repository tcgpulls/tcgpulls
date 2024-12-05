import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/components/catalyst-ui/sidebar";
import AccountBar from "@/components/navigation/AccountBar";
import { Link } from "@/components/catalyst-ui/link";
import { FireIcon, HomeIcon } from "@heroicons/react/20/solid";

type Props = {};

const SidebarContent = ({}: Props) => {
  return (
    <Sidebar>
      <SidebarHeader className={`mt-4`}>
        <Link href="#" aria-label="Home">
          <p className={`font-bold`}>TCGPulls</p>
        </Link>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem>
            <HomeIcon />
            <SidebarLabel>Home</SidebarLabel>
          </SidebarItem>
          <SidebarItem>
            <FireIcon />
            <SidebarLabel>Pulls</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <AccountBar />
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarContent;
