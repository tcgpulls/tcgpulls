import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
    credentials: "include", // Include cookies for authentication
  }),
  cache: new InMemoryCache(),
  devtools: {
    enabled: true,
  },
});

export default client;
