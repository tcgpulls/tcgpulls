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
import { useTranslations } from "use-intl";
import { ReactNode } from "react";
import { usePathname } from "@/i18n/routing";
import useTcgLanguage from "@/hooks/context/useTcgLanguage";
import AuthButton from "@/components/misc/AuthButton";
import { HiHome, HiUserCircle } from "react-icons/hi";
import { TbCards, TbPokeball } from "react-icons/tb";
import { BiGridAlt } from "react-icons/bi";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { useSession } from "next-auth/react";

type SidebarItem = {
  href: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  needAuth?: boolean;
};

type SidebarSection = {
  heading?: string;
  items: SidebarItem[];
  needAuth?: boolean;
};

type SidebarConfig = Array<SidebarItem | SidebarSection>;

const SidebarContent = () => {
  const t = useTranslations("common");
  const { status } = useSession();
  const pathname = usePathname();
  const { currentTcgLanguage } = useTcgLanguage();
  const isAuth = status === "authenticated";

  // Sidebar configuration
  const sidebarItems: SidebarConfig = [
    {
      href: "/app",
      label: t("home"),
      icon: <HiHome size={24} />,
    },
    {
      href: "/app/profile",
      label: t("profile"),
      icon: <HiUserCircle size={24} />,
      needAuth: true,
    },
    {
      heading: t("tcg"),
      items: [
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}`,
          label: t("tcg-pokemon-short"),
          icon: <TbPokeball size={24} />,
          className: ``,
        },
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}/collection`,
          label: t("collection"),
          className: "pl-4 text-xs! text-primary-300",
          icon: <MdOutlineCollectionsBookmark size={16} />,
          needAuth: true,
        },
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}/booster-packs`,
          label: t("booster-packs"),
          className: "pl-4 text-xs! text-primary-300",
          icon: <TbCards size={16} />,
        },
        {
          href: `/app/tcg/pokemon/${currentTcgLanguage}/sets`,
          label: t("sets"),
          className: "pl-4 text-xs! text-primary-300",
          icon: <BiGridAlt size={16} />,
        },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="mt-4">
        <div className={`flex items-center justify-between`}>
          <Link href="/app" aria-label="Home">
            <p className="font-bold">{t("company")}</p>
          </Link>
        </div>
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
                  <SidebarLabel className={`flex gap-2 items-center`}>
                    {item.label}
                    {item.needAuth && !isAuth && (
                      <FaLock className={`text-primary-600`} size={10} />
                    )}
                  </SidebarLabel>
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
              <SidebarLabel className={`flex gap-2 items-center`}>
                {section.label}
                {section.needAuth && !isAuth && (
                  <FaLock className={`text-primary-600`} size={10} />
                )}
              </SidebarLabel>
            </SidebarItem>
          ),
        )}
      </SidebarBody>
      <SidebarFooter>
        <SidebarSection>
          <div className="flex justify-end">
            <AuthButton />
          </div>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarContent;
