"use client";

import { ReactNode, useMemo } from "react";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "@/lib/clients/createApolloClient";
import { useSession } from "next-auth/react";

type Props = {
  children: ReactNode;
};

const CustomApolloProvider = ({ children }: Props) => {
  const { data: session } = useSession();
  const token = session?.user?.token; // the raw JWT token

  const client = useMemo(() => {
    return createApolloClient(token);
  }, [token]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default CustomApolloProvider;
