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
import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";
import { useTranslations } from "use-intl";
import { ReactNode } from "react";
import { usePathname } from "@/i18n/routing";
import useTcgLanguage from "@/hooks/context/useTcgLanguage";
import AuthButton from "@/components/misc/AuthButton";
import { HiHome, HiUserCircle } from "react-icons/hi";
import { TbCardsFilled } from "react-icons/tb";
import { BiGridAlt } from "react-icons/bi";
import { MdCollectionsBookmark } from "react-icons/md";

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
      icon: <HiHome size={20} />,
    },
    {
      href: "/app/profile",
      label: t("profile"),
      icon: <HiUserCircle size={20} />,
    },
    {
      heading: t("tcg"),
      items: [
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}`,
          label: t("tcg-pokemon-short"),
          // icon: <HiRectangleStack size={20} />,
          className: `pl-2`,
        },
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}/collection`,
          label: t("collection"),
          className: "pl-4 text-xs! text-primary-300",
          icon: <MdCollectionsBookmark />,
        },
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}/booster-packs`,
          label: t("booster-packs"),
          className: "pl-4 text-xs! text-primary-300",
          icon: <TbCardsFilled />,
        },
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}/sets`,
          label: t("sets"),
          className: "pl-4 text-xs! text-primary-300",
          icon: <BiGridAlt />,
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
            <SidebarSection key={index} className={`pt-8`}>
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
            <SidebarItem
              key={index}
              href={section.href}
              current={pathname === section.href}
              className={section.className}
            >
              {section.icon && section.icon}
              <SidebarLabel>{section.label}</SidebarLabel>
            </SidebarItem>
          ),
        )}
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <div className="flex justify-between">
            <AuthButton />
            <LanguageSwitcher />
          </div>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarContent;
