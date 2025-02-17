"use client";

import { Field } from "@/components/catalyst-ui/fieldset";
import { Select } from "@/components/catalyst-ui/select";
import i18n from "@/i18n/i18n";
import { useLocale } from "next-intl";
import { ChangeEvent } from "react";
import { Locale, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "use-intl";
import { IoMdGlobe } from "react-icons/io";

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("language");

  const handleChange = (e: ChangeEvent) => {
    const nextLocale = (e.target as HTMLSelectElement).value;
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: nextLocale as Locale },
    );
  };

  return (
    <Field className={`flex items-center gap-2`}>
      <label>
        <IoMdGlobe />
      </label>
      <Select name="language" value={locale} onChange={handleChange}>
        {i18n.locales.map((loc) => (
          <option value={loc.value} key={loc.value}>
            {t(`${loc.value}`)}
          </option>
        ))}
      </Select>
    </Field>
  );
};

export default LanguageSwitcher;
