"use client";

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
import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";
import { useTranslations } from "use-intl";

const SidebarContent = () => {
  const t = useTranslations("common");

  return (
    <Sidebar>
      <SidebarHeader className={`mt-4`}>
        <Link href={`/`} aria-label="Home">
          <p className={`font-bold`}>{t("company")}</p>
        </Link>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href={`/`}>
            <HomeIcon />
            <SidebarLabel>{t("home")}</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSection>
          <SidebarHeading>{t("tcg")}</SidebarHeading>
          <SidebarItem href={`/tcg/pokemon/sets`}>
            <RectangleStackIcon />
            <SidebarLabel>{t("tcg_pokemon_short")}</SidebarLabel>
          </SidebarItem>
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
