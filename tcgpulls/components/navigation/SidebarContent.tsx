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
import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";
import { useTranslations } from "use-intl";
import { ReactNode } from "react";
import { usePathname } from "@/i18n/routing";
import useTcgLanguage from "@/hooks/context/useTcgLanguage";

type SidebarItem = {
  href: string;
  label: string;
  icon?: ReactNode;
  className?: string;
};

type SidebarSection = {
  heading?: string;
  items: SidebarItem[];
};

type SidebarConfig = Array<SidebarItem | SidebarSection>;

const SidebarContent = () => {
  const t = useTranslations("common");
  const pathname = usePathname();
  const { currentTcgLanguage } = useTcgLanguage();

  // Sidebar configuration
  const sidebarItems: SidebarConfig = [
    {
      href: "/app",
      label: t("home"),
      icon: <HomeIcon />,
    },
    {
      heading: t("tcg"),
      items: [
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}`,
          label: t("tcg-pokemon-short"),
          icon: <RectangleStackIcon />,
        },
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}/booster-packs`,
          label: t("booster-packs"),
          className: "pl-8 text-xs text-zinc-300",
        },
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}/sets`,
          label: t("sets"),
          className: "pl-8 text-xs text-zinc-300",
        },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="mt-4">
        <Link href="/app" aria-label="Home">
          <p className="font-bold">{t("company")}</p>
        </Link>
      </SidebarHeader>
      <SidebarBody>
        {sidebarItems.map((section, index) =>
          "items" in section ? (
            <SidebarSection key={index}>
              {section.heading && (
                <SidebarHeading>{section.heading}</SidebarHeading>
              )}
              {section.items.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  current={pathname === item.href}
                  className={item.className}
                >
                  {item.icon && item.icon}
                  <SidebarLabel>{item.label}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
          ) : (
            <SidebarSection key={index}>
              <SidebarItem
                href={section.href}
                current={pathname === section.href}
                className={section.className}
              >
                {section.icon && section.icon}
                <SidebarLabel>{section.label}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          ),
        )}
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarContent;
