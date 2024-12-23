// 'use client'
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { POKEMON_SUPPORTED_TCG_LANGUAGES } from "@/constants/tcg/pokemon";
import Cookies from "js-cookie";

// Define the type for the context state
export type TcgLanguageContextState = {
  currentTcgLanguage: string;
  setCurrentTcgLanguage: (language: string) => void;
};

export type TcgLanguageProviderProps = {
  children: ReactNode;
};

// Initialize the context with a default value
export const TcgLanguageContext = createContext<
  TcgLanguageContextState | undefined
>(undefined);

export const TcgLanguageProvider: React.FC<TcgLanguageProviderProps> = ({
  children,
}) => {
  const [currentTcgLanguage, setCurrentTcgLanguage] = useState<string>(
    POKEMON_SUPPORTED_TCG_LANGUAGES[0],
  ); // "en"

  useEffect(() => {
    // Check for existing cookie on initial load
    const storedLanguage = Cookies.get("tcgLanguage");
    if (storedLanguage) {
      setCurrentTcgLanguage(storedLanguage);
    }
  }, []);

  const updateLanguage = (language: string) => {
    setCurrentTcgLanguage(language);
    Cookies.set("tcgLanguage", language, { expires: 365 }); // Set cookie to expire in 1 year
  };

  return (
    <TcgLanguageContext.Provider
      value={{ currentTcgLanguage, setCurrentTcgLanguage: updateLanguage }}
    >
      {children}
    </TcgLanguageContext.Provider>
  );
};
