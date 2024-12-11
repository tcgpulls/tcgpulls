"use client";

import { ChangeEvent, useEffect } from "react";
import { Field } from "@/components/catalyst-ui/fieldset";
import { Select } from "@/components/catalyst-ui/select";
import Cookies from "js-cookie";
import i18n from "@/messages/i18n";
import { useLanguage } from "@/context/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage(); // Get language and setter from context

  // Synchronize state with the NEXT_LOCALE cookie on initial render
  useEffect(() => {
    const currentLocale = Cookies.get("NEXT_LOCALE") || i18n.defaultLocale;

    // Only update the context if the cookie differs from the current language
    if (currentLocale !== language) {
      setLanguage(currentLocale);
    }
  }, [language, setLanguage]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    setLanguage(newLocale); // Update context
    Cookies.set("NEXT_LOCALE", newLocale, { expires: 365 });
    // Optionally navigate to the new language route if necessary:
    window.location.href = `/${newLocale}${window.location.pathname.substring(3)}`;
  };

  return (
    <Field className="flex">
      <Select name="language" value={language} onChange={handleChange}>
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
