// components/Providers.tsx
"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/clients/apolloClient";

const Providers = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Providers;
