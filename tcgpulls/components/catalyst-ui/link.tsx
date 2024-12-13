"use client";

import * as Headless from "@headlessui/react";
import NextLink, { type LinkProps } from "next/link";
import React, { forwardRef } from "react";
import { useLocale } from "next-intl";

export const Link = forwardRef(function Link(
  props: LinkProps & React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  const locale = useLocale();

  return (
    <Headless.DataInteractive>
      <NextLink {...props} ref={ref} href={`/${locale}${props.href}`} />
    </Headless.DataInteractive>
  );
});
