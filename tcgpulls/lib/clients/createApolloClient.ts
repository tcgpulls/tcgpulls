import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const createApolloClient = (token?: string) => {
  return new ApolloClient({
    link: createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
