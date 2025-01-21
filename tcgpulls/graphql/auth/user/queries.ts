import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`
  query GetUserByEmail($id: ID!) {
    user(where: { id: $id }) {
      id
      email
      name
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    user(where: { email: $email }) {
      id
      email
      name
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      email
      name
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $data: UserUpdateInput!) {
    updateUser(where: { id: $id }, data: $data) {
      id
      email
      name
      image
      emailVerified
    }
  }
`;

export const UPDATE_USER_LASTLOGIN = gql`
  mutation UpdateUserLastLogin($id: ID!, $data: UserUpdateInput!) {
    updateUser(where: { id: $id }, data: $data) {
      id
      lastLoginAt
    }
  }
`;
