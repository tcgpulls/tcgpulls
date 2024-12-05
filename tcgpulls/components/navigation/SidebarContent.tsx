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
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";
import { SignedIn } from "@clerk/nextjs";

type Props = {};

const SidebarContent = ({}: Props) => {
  const t = useTranslations("SidebarContent");

  return (
    <Sidebar>
      <SidebarHeader className={`mt-4`}>
        <Link href="#" aria-label="Home">
          <p className={`font-bold`}>TCGPulls</p>
        </Link>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href={`/`}>
            <HomeIcon />
            <SidebarLabel>{t("home")}</SidebarLabel>
          </SidebarItem>
          <SignedIn>
            <SidebarItem href={`/pulls`}>
              <FireIcon />
              <SidebarLabel>{t("pulls")}</SidebarLabel>
            </SidebarItem>
          </SignedIn>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <div className={`flex justify-between`}>
            <AccountBar />
            <LanguageSwitcher />
          </div>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarContent;
