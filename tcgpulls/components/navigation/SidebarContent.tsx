import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/components/catalyst-ui/sidebar";
import AccountBar from "@/components/navigation/AccountBar";
import { Link } from "@/components/catalyst-ui/link";
import { HomeIcon, RectangleStackIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
// import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";

type Props = {};

const SidebarContent = ({}: Props) => {
  const t = useTranslations();

  return (
    <Sidebar>
      <SidebarHeader className={`mt-4`}>
        <Link href="#" aria-label="Home">
          <p className={`font-bold`}>{t("common.company")}</p>
        </Link>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href={`/`}>
            <HomeIcon />
            <SidebarLabel>{t("sidebar_component.home")}</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSection>
          <SidebarHeading>{t("common.tcg")}</SidebarHeading>
          <SidebarItem href={`/tcg/pokemon/sets`}>
            <RectangleStackIcon />
            <SidebarLabel>{t("common.tcg_pokemon")}</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <div className={`flex justify-between`}>
            <AccountBar />
            {/*<LanguageSwitcher />*/}
          </div>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarContent;
