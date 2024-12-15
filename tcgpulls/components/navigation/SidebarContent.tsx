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
import { Link } from "@/components/catalyst-ui/link";
import { HomeIcon, RectangleStackIcon } from "@heroicons/react/20/solid";
// import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";
import { useTranslations } from "use-intl";

type Props = {
  footer?: React.ReactNode;
};

const SidebarContent = ({ footer }: Props) => {
  const t = useTranslations("common");

  return (
    <Sidebar>
      <SidebarHeader className={`mt-4`}>
        <Link href={`/app`} aria-label="Home">
          <p className={`font-bold`}>{t("company")}</p>
        </Link>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href={`/app`}>
            <HomeIcon />
            <SidebarLabel>{t("home")}</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSection>
          <SidebarHeading>{t("tcg")}</SidebarHeading>
          <SidebarItem href={`/app/tcg/pokemon`}>
            <RectangleStackIcon />
            <SidebarLabel>{t("tcg_pokemon_short")}</SidebarLabel>
          </SidebarItem>
          <SidebarItem href={`/app/tcg/pokemon/packs`} className={`pl-8`}>
            <SidebarLabel className={`text-xs text-zinc-300`}>
              {t("packs")}
            </SidebarLabel>
          </SidebarItem>
          <SidebarItem href={`/app/tcg/pokemon/sets`} className={`pl-8`}>
            <SidebarLabel className={`text-xs text-zinc-300`}>
              {t("sets")}
            </SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      {/* <SidebarFooter>
        <SidebarSection>
          <div className={`flex justify-end`}>
            <LanguageSwitcher />
          </div>
        </SidebarSection>
      </SidebarFooter> */}
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  );
};

export default SidebarContent;
