"use client";

import { ReactNode } from "react";
import { TcgLanguageProvider } from "@/context/TcgLanguageContext";

type Props = {
  children: ReactNode;
};

const TcgLanguageContextWrapper = ({ children }: Props) => {
  return <TcgLanguageProvider>{children}</TcgLanguageProvider>;
};

export default TcgLanguageContextWrapper;
