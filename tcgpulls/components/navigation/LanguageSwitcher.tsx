"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Field } from "@/components/catalyst-ui/fieldset";
import { Select } from "@/components/catalyst-ui/select";
import Cookies from "js-cookie";
import i18n from "@/messages/i18n";

const LanguageSwitcher = () => {
  const [locale, setLocale] = useState(i18n.defaultLocale);

  // Synchronize state with the NEXT_LOCALE cookie on initial render
  useEffect(() => {
    const currentLocale = Cookies.get("NEXT_LOCALE") || i18n.defaultLocale;
    setLocale(currentLocale);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    setLocale(newLocale);
    Cookies.set("NEXT_LOCALE", newLocale, { expires: 365 });
    window.location.reload();
  };

  return (
    <Field className="flex">
      <Select name="language" value={locale} onChange={handleChange}>
        {i18n.locales.map((locale) => (
          <option value={locale.value} key={locale.value}>
            {locale.label}
          </option>
        ))}
      </Select>
    </Field>
  );
};

export default LanguageSwitcher;
