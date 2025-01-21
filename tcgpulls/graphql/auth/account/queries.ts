import { gql } from "@apollo/client";

export const GET_ACCOUNT_BY_PROVIDER = gql`
  query GetAccountByProvider($provider: String!, $providerAccountId: String!) {
    accounts(
      where: {
        AND: [
          { provider: { equals: $provider } }
          { providerAccountId: { equals: $providerAccountId } }
        ]
      }
    ) {
      id
      provider
      providerAccountId
      accessToken
      refreshToken
      idToken
      tokenType
      scope
      expiresAt
    }
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($data: AccountCreateInput!) {
    createAccount(data: $data) {
      id
      provider
      providerAccountId
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: ID!, $data: AccountUpdateInput!) {
    updateAccount(where: { id: $id }, data: $data) {
      id
      provider
      providerAccountId
      accessToken
      refreshToken
      idToken
      tokenType
      scope
      expiresAt
    }
  }
`;
