"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import i18n from "@/messages/i18n";

type LanguageContextType = {
  language: (typeof i18n.locales)[number]["value"];
  setLanguage: (newLanguage: string) => void; // Function to update the language
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({
  children,
  language: initialLanguage = i18n.defaultLocale, // Default to "en" if no language is provided
}: {
  children: ReactNode;
  language?: string; // Mark language as optional
}) => {
  const [language, setLanguage] = useState<string>(initialLanguage);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
