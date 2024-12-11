"use client";

import * as Headless from "@headlessui/react";
import NextLink, { type LinkProps } from "next/link";
import React, { forwardRef } from "react";
import { useLanguage } from "@/context/LanguageContext"; // Import the language context

export const Link = forwardRef(function Link(
  props: LinkProps & React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  const { language } = useLanguage(); // Get the current language from the context

  // Ensure the href always includes the language parameter
  const updatedHref =
    typeof props.href === "string"
      ? `/${language}${props.href.startsWith("/") ? props.href : `/${props.href}`}`
      : props.href;

  return (
    <Headless.DataInteractive>
      <NextLink {...props} ref={ref} href={updatedHref} />
    </Headless.DataInteractive>
  );
});
