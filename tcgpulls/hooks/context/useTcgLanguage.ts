// 'use client'
import { useContext } from "react";
import {
  TcgLanguageContext,
  TcgLanguageContextState,
} from "@/context/TcgLanguageContext";

const useTcgLanguage = (): TcgLanguageContextState => {
  const context = useContext(TcgLanguageContext);
  if (!context) {
    throw new Error("useTcgLanguage must be used within a TcgLanguageProvider");
  }
  return context;
};

export default useTcgLanguage;
