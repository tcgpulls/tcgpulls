"use client";

import { Href } from "@react-types/shared";
import useConditionalRedirect from "@/hooks/useConditionalRedirect";

type Props = {
  from: Href;
  to: Href;
};

const ClientRedirect = ({ to, from }: Props) => {
  useConditionalRedirect(to, from);
  return null;
};

export default ClientRedirect;
