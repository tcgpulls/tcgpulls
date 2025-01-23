import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import fetch from "cross-fetch";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
  fetch,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${process.env.KEYSTONE_ADMIN_TOKEN}`,
    },
  };
});

const adminClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  devtools: {
    enabled: true,
  },
});

export default adminClient;
