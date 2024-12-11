"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Href } from "@react-types/shared";

const useConditionalRedirect = (to: Href, from: Href) => {
  const router = useRouter();

  useEffect(() => {
    // Check if we're on the "from" page and redirect to the "to" page
    if (window.location.pathname === from) {
      router.replace(`/${to}`);
    }
  }, [router, from, to]);

  return null;
};

export default useConditionalRedirect;
