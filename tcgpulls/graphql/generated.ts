import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  accessToken?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiresAt?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  idToken?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  providerAccountId?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  scope?: Maybe<Scalars['String']['output']>;
  sessionState?: Maybe<Scalars['String']['output']>;
  tokenType?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userEmail?: Maybe<Scalars['String']['output']>;
};

export type AccountCreateInput = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  expiresAt?: InputMaybe<Scalars['Int']['input']>;
  idToken?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  providerAccountId?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  scope?: InputMaybe<Scalars['String']['input']>;
  sessionState?: InputMaybe<Scalars['String']['input']>;
  tokenType?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user?: InputMaybe<UserRelateToOneForCreateInput>;
};

export type AccountManyRelationFilter = {
  every?: InputMaybe<AccountWhereInput>;
  none?: InputMaybe<AccountWhereInput>;
  some?: InputMaybe<AccountWhereInput>;
};

export type AccountOrderByInput = {
  accessToken?: InputMaybe<OrderDirection>;
  createdAt?: InputMaybe<OrderDirection>;
  expiresAt?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  idToken?: InputMaybe<OrderDirection>;
  provider?: InputMaybe<OrderDirection>;
  providerAccountId?: InputMaybe<OrderDirection>;
  refreshToken?: InputMaybe<OrderDirection>;
  scope?: InputMaybe<OrderDirection>;
  sessionState?: InputMaybe<OrderDirection>;
  tokenType?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
  updatedAt?: InputMaybe<OrderDirection>;
};

export type AccountRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  create?: InputMaybe<Array<AccountCreateInput>>;
};

export type AccountRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  create?: InputMaybe<Array<AccountCreateInput>>;
  disconnect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  set?: InputMaybe<Array<AccountWhereUniqueInput>>;
};

export type AccountUpdateArgs = {
  data: AccountUpdateInput;
  where: AccountWhereUniqueInput;
};

export type AccountUpdateInput = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  expiresAt?: InputMaybe<Scalars['Int']['input']>;
  idToken?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  providerAccountId?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  scope?: InputMaybe<Scalars['String']['input']>;
  sessionState?: InputMaybe<Scalars['String']['input']>;
  tokenType?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user?: InputMaybe<UserRelateToOneForUpdateInput>;
};

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>;
  NOT?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
  accessToken?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeNullableFilter>;
  expiresAt?: InputMaybe<IntNullableFilter>;
  id?: InputMaybe<IdFilter>;
  idToken?: InputMaybe<StringFilter>;
  provider?: InputMaybe<StringFilter>;
  providerAccountId?: InputMaybe<StringFilter>;
  refreshToken?: InputMaybe<StringFilter>;
  scope?: InputMaybe<StringFilter>;
  sessionState?: InputMaybe<StringFilter>;
  tokenType?: InputMaybe<StringFilter>;
  type?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeNullableFilter>;
  user?: InputMaybe<UserWhereInput>;
};

export type AccountWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type AuthenticatedItem = CmsUser;

export type Authenticator = {
  __typename?: 'Authenticator';
  counter?: Maybe<Scalars['Int']['output']>;
  credentialBackedUp?: Maybe<Scalars['Boolean']['output']>;
  credentialDeviceType?: Maybe<Scalars['String']['output']>;
  credentialID?: Maybe<Scalars['String']['output']>;
  credentialPublicKey?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  providerAccountId?: Maybe<Scalars['String']['output']>;
  transports?: Maybe<Scalars['JSON']['output']>;
  user?: Maybe<User>;
};

export type AuthenticatorCreateInput = {
  counter?: InputMaybe<Scalars['Int']['input']>;
  credentialBackedUp?: InputMaybe<Scalars['Boolean']['input']>;
  credentialDeviceType?: InputMaybe<Scalars['String']['input']>;
  credentialID?: InputMaybe<Scalars['String']['input']>;
  credentialPublicKey?: InputMaybe<Scalars['String']['input']>;
  providerAccountId?: InputMaybe<Scalars['String']['input']>;
  transports?: InputMaybe<Scalars['JSON']['input']>;
  user?: InputMaybe<UserRelateToOneForCreateInput>;
};

export type AuthenticatorManyRelationFilter = {
  every?: InputMaybe<AuthenticatorWhereInput>;
  none?: InputMaybe<AuthenticatorWhereInput>;
  some?: InputMaybe<AuthenticatorWhereInput>;
};

export type AuthenticatorOrderByInput = {
  counter?: InputMaybe<OrderDirection>;
  credentialBackedUp?: InputMaybe<OrderDirection>;
  credentialDeviceType?: InputMaybe<OrderDirection>;
  credentialID?: InputMaybe<OrderDirection>;
  credentialPublicKey?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  providerAccountId?: InputMaybe<OrderDirection>;
};

export type AuthenticatorRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<AuthenticatorWhereUniqueInput>>;
  create?: InputMaybe<Array<AuthenticatorCreateInput>>;
};

export type AuthenticatorRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<AuthenticatorWhereUniqueInput>>;
  create?: InputMaybe<Array<AuthenticatorCreateInput>>;
  disconnect?: InputMaybe<Array<AuthenticatorWhereUniqueInput>>;
  set?: InputMaybe<Array<AuthenticatorWhereUniqueInput>>;
};

export type AuthenticatorUpdateArgs = {
  data: AuthenticatorUpdateInput;
  where: AuthenticatorWhereUniqueInput;
};

export type AuthenticatorUpdateInput = {
  counter?: InputMaybe<Scalars['Int']['input']>;
  credentialBackedUp?: InputMaybe<Scalars['Boolean']['input']>;
  credentialDeviceType?: InputMaybe<Scalars['String']['input']>;
  credentialID?: InputMaybe<Scalars['String']['input']>;
  credentialPublicKey?: InputMaybe<Scalars['String']['input']>;
  providerAccountId?: InputMaybe<Scalars['String']['input']>;
  transports?: InputMaybe<Scalars['JSON']['input']>;
  user?: InputMaybe<UserRelateToOneForUpdateInput>;
};

export type AuthenticatorWhereInput = {
  AND?: InputMaybe<Array<AuthenticatorWhereInput>>;
  NOT?: InputMaybe<Array<AuthenticatorWhereInput>>;
  OR?: InputMaybe<Array<AuthenticatorWhereInput>>;
  counter?: InputMaybe<IntNullableFilter>;
  credentialBackedUp?: InputMaybe<BooleanFilter>;
  credentialDeviceType?: InputMaybe<StringFilter>;
  credentialID?: InputMaybe<StringFilter>;
  credentialPublicKey?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  providerAccountId?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserWhereInput>;
};

export type AuthenticatorWhereUniqueInput = {
  credentialID?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<BooleanFilter>;
};

export type CmsRole = {
  __typename?: 'CmsRole';
  id: Scalars['ID']['output'];
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type CmsRoleCreateInput = {
  label?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CmsRoleOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  label?: InputMaybe<OrderDirection>;
  value?: InputMaybe<OrderDirection>;
};

export type CmsRoleRelateToOneForCreateInput = {
  connect?: InputMaybe<CmsRoleWhereUniqueInput>;
  create?: InputMaybe<CmsRoleCreateInput>;
};

export type CmsRoleRelateToOneForUpdateInput = {
  connect?: InputMaybe<CmsRoleWhereUniqueInput>;
  create?: InputMaybe<CmsRoleCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CmsRoleUpdateArgs = {
  data: CmsRoleUpdateInput;
  where: CmsRoleWhereUniqueInput;
};

export type CmsRoleUpdateInput = {
  label?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CmsRoleWhereInput = {
  AND?: InputMaybe<Array<CmsRoleWhereInput>>;
  NOT?: InputMaybe<Array<CmsRoleWhereInput>>;
  OR?: InputMaybe<Array<CmsRoleWhereInput>>;
  id?: InputMaybe<IdFilter>;
  label?: InputMaybe<StringFilter>;
  value?: InputMaybe<StringFilter>;
};

export type CmsRoleWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CmsUser = {
  __typename?: 'CmsUser';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<PasswordState>;
  role?: Maybe<CmsRole>;
};

export type CmsUserAuthenticationWithPasswordFailure = {
  __typename?: 'CmsUserAuthenticationWithPasswordFailure';
  message: Scalars['String']['output'];
};

export type CmsUserAuthenticationWithPasswordResult = CmsUserAuthenticationWithPasswordFailure | CmsUserAuthenticationWithPasswordSuccess;

export type CmsUserAuthenticationWithPasswordSuccess = {
  __typename?: 'CmsUserAuthenticationWithPasswordSuccess';
  item: CmsUser;
  sessionToken: Scalars['String']['output'];
};

export type CmsUserCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<CmsRoleRelateToOneForCreateInput>;
};

export type CmsUserOrderByInput = {
  createdAt?: InputMaybe<OrderDirection>;
  email?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type CmsUserUpdateArgs = {
  data: CmsUserUpdateInput;
  where: CmsUserWhereUniqueInput;
};

export type CmsUserUpdateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<CmsRoleRelateToOneForUpdateInput>;
};

export type CmsUserWhereInput = {
  AND?: InputMaybe<Array<CmsUserWhereInput>>;
  NOT?: InputMaybe<Array<CmsUserWhereInput>>;
  OR?: InputMaybe<Array<CmsUserWhereInput>>;
  createdAt?: InputMaybe<DateTimeNullableFilter>;
  email?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
  role?: InputMaybe<CmsRoleWhereInput>;
};

export type CmsUserWhereUniqueInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DecimalNullableFilter = {
  equals?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<Scalars['Decimal']['input']>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  not?: InputMaybe<DecimalNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Decimal']['input']>>;
};

export type IdFilter = {
  equals?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  gte?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  lte?: InputMaybe<Scalars['ID']['input']>;
  not?: InputMaybe<IdFilter>;
  notIn?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type KeystoneAdminMeta = {
  __typename?: 'KeystoneAdminMeta';
  list?: Maybe<KeystoneAdminUiListMeta>;
  lists: Array<KeystoneAdminUiListMeta>;
};


export type KeystoneAdminMetaListArgs = {
  key: Scalars['String']['input'];
};

export type KeystoneAdminUiFieldGroupMeta = {
  __typename?: 'KeystoneAdminUIFieldGroupMeta';
  description?: Maybe<Scalars['String']['output']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  label: Scalars['String']['output'];
};

export type KeystoneAdminUiFieldMeta = {
  __typename?: 'KeystoneAdminUIFieldMeta';
  createView: KeystoneAdminUiFieldMetaCreateView;
  customViewsIndex?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fieldMeta?: Maybe<Scalars['JSON']['output']>;
  isFilterable: Scalars['Boolean']['output'];
  isNonNull?: Maybe<Array<KeystoneAdminUiFieldMetaIsNonNull>>;
  isOrderable: Scalars['Boolean']['output'];
  itemView?: Maybe<KeystoneAdminUiFieldMetaItemView>;
  label: Scalars['String']['output'];
  listView: KeystoneAdminUiFieldMetaListView;
  path: Scalars['String']['output'];
  search?: Maybe<QueryMode>;
  viewsIndex: Scalars['Int']['output'];
};


export type KeystoneAdminUiFieldMetaItemViewArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type KeystoneAdminUiFieldMetaCreateView = {
  __typename?: 'KeystoneAdminUIFieldMetaCreateView';
  fieldMode: KeystoneAdminUiFieldMetaCreateViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaCreateViewFieldMode {
  Edit = 'edit',
  Hidden = 'hidden'
}

export enum KeystoneAdminUiFieldMetaIsNonNull {
  Create = 'create',
  Read = 'read',
  Update = 'update'
}

export type KeystoneAdminUiFieldMetaItemView = {
  __typename?: 'KeystoneAdminUIFieldMetaItemView';
  fieldMode?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldMode>;
  fieldPosition?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldPosition>;
};

export enum KeystoneAdminUiFieldMetaItemViewFieldMode {
  Edit = 'edit',
  Hidden = 'hidden',
  Read = 'read'
}

export enum KeystoneAdminUiFieldMetaItemViewFieldPosition {
  Form = 'form',
  Sidebar = 'sidebar'
}

export type KeystoneAdminUiFieldMetaListView = {
  __typename?: 'KeystoneAdminUIFieldMetaListView';
  fieldMode: KeystoneAdminUiFieldMetaListViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaListViewFieldMode {
  Hidden = 'hidden',
  Read = 'read'
}

export type KeystoneAdminUiGraphQl = {
  __typename?: 'KeystoneAdminUIGraphQL';
  names: KeystoneAdminUiGraphQlNames;
};

export type KeystoneAdminUiGraphQlNames = {
  __typename?: 'KeystoneAdminUIGraphQLNames';
  createInputName: Scalars['String']['output'];
  createManyMutationName: Scalars['String']['output'];
  createMutationName: Scalars['String']['output'];
  deleteManyMutationName: Scalars['String']['output'];
  deleteMutationName: Scalars['String']['output'];
  itemQueryName: Scalars['String']['output'];
  listOrderName: Scalars['String']['output'];
  listQueryCountName: Scalars['String']['output'];
  listQueryName: Scalars['String']['output'];
  outputTypeName: Scalars['String']['output'];
  relateToManyForCreateInputName: Scalars['String']['output'];
  relateToManyForUpdateInputName: Scalars['String']['output'];
  relateToOneForCreateInputName: Scalars['String']['output'];
  relateToOneForUpdateInputName: Scalars['String']['output'];
  updateInputName: Scalars['String']['output'];
  updateManyInputName: Scalars['String']['output'];
  updateManyMutationName: Scalars['String']['output'];
  updateMutationName: Scalars['String']['output'];
  whereInputName: Scalars['String']['output'];
  whereUniqueInputName: Scalars['String']['output'];
};

export type KeystoneAdminUiListMeta = {
  __typename?: 'KeystoneAdminUIListMeta';
  description?: Maybe<Scalars['String']['output']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  graphql: KeystoneAdminUiGraphQl;
  groups: Array<KeystoneAdminUiFieldGroupMeta>;
  hideCreate: Scalars['Boolean']['output'];
  hideDelete: Scalars['Boolean']['output'];
  initialColumns: Array<Scalars['String']['output']>;
  initialSort?: Maybe<KeystoneAdminUiSort>;
  isHidden: Scalars['Boolean']['output'];
  isSingleton: Scalars['Boolean']['output'];
  itemQueryName: Scalars['String']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  labelField: Scalars['String']['output'];
  listQueryName: Scalars['String']['output'];
  pageSize: Scalars['Int']['output'];
  path: Scalars['String']['output'];
  plural: Scalars['String']['output'];
  singular: Scalars['String']['output'];
};

export type KeystoneAdminUiSort = {
  __typename?: 'KeystoneAdminUISort';
  direction: KeystoneAdminUiSortDirection;
  field: Scalars['String']['output'];
};

export enum KeystoneAdminUiSortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type KeystoneMeta = {
  __typename?: 'KeystoneMeta';
  adminMeta: KeystoneAdminMeta;
};

export type Mutation = {
  __typename?: 'Mutation';
  authenticateCmsUserWithPassword?: Maybe<CmsUserAuthenticationWithPasswordResult>;
  createAccount?: Maybe<Account>;
  createAccounts?: Maybe<Array<Maybe<Account>>>;
  createAuthenticator?: Maybe<Authenticator>;
  createAuthenticators?: Maybe<Array<Maybe<Authenticator>>>;
  createCmsRole?: Maybe<CmsRole>;
  createCmsRoles?: Maybe<Array<Maybe<CmsRole>>>;
  createCmsUser?: Maybe<CmsUser>;
  createCmsUsers?: Maybe<Array<Maybe<CmsUser>>>;
  createPokemonCard?: Maybe<PokemonCard>;
  createPokemonCardAbilities?: Maybe<Array<Maybe<PokemonCardAbility>>>;
  createPokemonCardAbility?: Maybe<PokemonCardAbility>;
  createPokemonCardAttack?: Maybe<PokemonCardAttack>;
  createPokemonCardAttacks?: Maybe<Array<Maybe<PokemonCardAttack>>>;
  createPokemonCardPriceHistories?: Maybe<Array<Maybe<PokemonCardPriceHistory>>>;
  createPokemonCardPriceHistory?: Maybe<PokemonCardPriceHistory>;
  createPokemonCardResistance?: Maybe<PokemonCardResistance>;
  createPokemonCardResistances?: Maybe<Array<Maybe<PokemonCardResistance>>>;
  createPokemonCardWeakness?: Maybe<PokemonCardWeakness>;
  createPokemonCardWeaknesses?: Maybe<Array<Maybe<PokemonCardWeakness>>>;
  createPokemonCards?: Maybe<Array<Maybe<PokemonCard>>>;
  createPokemonCollectionItem?: Maybe<PokemonCollectionItem>;
  createPokemonCollectionItems?: Maybe<Array<Maybe<PokemonCollectionItem>>>;
  createPokemonSet?: Maybe<PokemonSet>;
  createPokemonSets?: Maybe<Array<Maybe<PokemonSet>>>;
  createSession?: Maybe<Session>;
  createSessions?: Maybe<Array<Maybe<Session>>>;
  createUser?: Maybe<User>;
  createUsers?: Maybe<Array<Maybe<User>>>;
  createVerificationToken?: Maybe<VerificationToken>;
  createVerificationTokens?: Maybe<Array<Maybe<VerificationToken>>>;
  deleteAccount?: Maybe<Account>;
  deleteAccounts?: Maybe<Array<Maybe<Account>>>;
  deleteAuthenticator?: Maybe<Authenticator>;
  deleteAuthenticators?: Maybe<Array<Maybe<Authenticator>>>;
  deleteCmsRole?: Maybe<CmsRole>;
  deleteCmsRoles?: Maybe<Array<Maybe<CmsRole>>>;
  deleteCmsUser?: Maybe<CmsUser>;
  deleteCmsUsers?: Maybe<Array<Maybe<CmsUser>>>;
  deletePokemonCard?: Maybe<PokemonCard>;
  deletePokemonCardAbilities?: Maybe<Array<Maybe<PokemonCardAbility>>>;
  deletePokemonCardAbility?: Maybe<PokemonCardAbility>;
  deletePokemonCardAttack?: Maybe<PokemonCardAttack>;
  deletePokemonCardAttacks?: Maybe<Array<Maybe<PokemonCardAttack>>>;
  deletePokemonCardPriceHistories?: Maybe<Array<Maybe<PokemonCardPriceHistory>>>;
  deletePokemonCardPriceHistory?: Maybe<PokemonCardPriceHistory>;
  deletePokemonCardResistance?: Maybe<PokemonCardResistance>;
  deletePokemonCardResistances?: Maybe<Array<Maybe<PokemonCardResistance>>>;
  deletePokemonCardWeakness?: Maybe<PokemonCardWeakness>;
  deletePokemonCardWeaknesses?: Maybe<Array<Maybe<PokemonCardWeakness>>>;
  deletePokemonCards?: Maybe<Array<Maybe<PokemonCard>>>;
  deletePokemonCollectionItem?: Maybe<PokemonCollectionItem>;
  deletePokemonCollectionItems?: Maybe<Array<Maybe<PokemonCollectionItem>>>;
  deletePokemonSet?: Maybe<PokemonSet>;
  deletePokemonSets?: Maybe<Array<Maybe<PokemonSet>>>;
  deleteSession?: Maybe<Session>;
  deleteSessions?: Maybe<Array<Maybe<Session>>>;
  deleteUser?: Maybe<User>;
  deleteUsers?: Maybe<Array<Maybe<User>>>;
  deleteVerificationToken?: Maybe<VerificationToken>;
  deleteVerificationTokens?: Maybe<Array<Maybe<VerificationToken>>>;
  endSession: Scalars['Boolean']['output'];
  updateAccount?: Maybe<Account>;
  updateAccounts?: Maybe<Array<Maybe<Account>>>;
  updateAuthenticator?: Maybe<Authenticator>;
  updateAuthenticators?: Maybe<Array<Maybe<Authenticator>>>;
  updateCmsRole?: Maybe<CmsRole>;
  updateCmsRoles?: Maybe<Array<Maybe<CmsRole>>>;
  updateCmsUser?: Maybe<CmsUser>;
  updateCmsUsers?: Maybe<Array<Maybe<CmsUser>>>;
  updatePokemonCard?: Maybe<PokemonCard>;
  updatePokemonCardAbilities?: Maybe<Array<Maybe<PokemonCardAbility>>>;
  updatePokemonCardAbility?: Maybe<PokemonCardAbility>;
  updatePokemonCardAttack?: Maybe<PokemonCardAttack>;
  updatePokemonCardAttacks?: Maybe<Array<Maybe<PokemonCardAttack>>>;
  updatePokemonCardPriceHistories?: Maybe<Array<Maybe<PokemonCardPriceHistory>>>;
  updatePokemonCardPriceHistory?: Maybe<PokemonCardPriceHistory>;
  updatePokemonCardResistance?: Maybe<PokemonCardResistance>;
  updatePokemonCardResistances?: Maybe<Array<Maybe<PokemonCardResistance>>>;
  updatePokemonCardWeakness?: Maybe<PokemonCardWeakness>;
  updatePokemonCardWeaknesses?: Maybe<Array<Maybe<PokemonCardWeakness>>>;
  updatePokemonCards?: Maybe<Array<Maybe<PokemonCard>>>;
  updatePokemonCollectionItem?: Maybe<PokemonCollectionItem>;
  updatePokemonCollectionItems?: Maybe<Array<Maybe<PokemonCollectionItem>>>;
  updatePokemonSet?: Maybe<PokemonSet>;
  updatePokemonSets?: Maybe<Array<Maybe<PokemonSet>>>;
  updateSession?: Maybe<Session>;
  updateSessions?: Maybe<Array<Maybe<Session>>>;
  updateUser?: Maybe<User>;
  updateUsers?: Maybe<Array<Maybe<User>>>;
  updateVerificationToken?: Maybe<VerificationToken>;
  updateVerificationTokens?: Maybe<Array<Maybe<VerificationToken>>>;
};


export type MutationAuthenticateCmsUserWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationCreateAccountArgs = {
  data: AccountCreateInput;
};


export type MutationCreateAccountsArgs = {
  data: Array<AccountCreateInput>;
};


export type MutationCreateAuthenticatorArgs = {
  data: AuthenticatorCreateInput;
};


export type MutationCreateAuthenticatorsArgs = {
  data: Array<AuthenticatorCreateInput>;
};


export type MutationCreateCmsRoleArgs = {
  data: CmsRoleCreateInput;
};


export type MutationCreateCmsRolesArgs = {
  data: Array<CmsRoleCreateInput>;
};


export type MutationCreateCmsUserArgs = {
  data: CmsUserCreateInput;
};


export type MutationCreateCmsUsersArgs = {
  data: Array<CmsUserCreateInput>;
};


export type MutationCreatePokemonCardArgs = {
  data: PokemonCardCreateInput;
};


export type MutationCreatePokemonCardAbilitiesArgs = {
  data: Array<PokemonCardAbilityCreateInput>;
};


export type MutationCreatePokemonCardAbilityArgs = {
  data: PokemonCardAbilityCreateInput;
};


export type MutationCreatePokemonCardAttackArgs = {
  data: PokemonCardAttackCreateInput;
};


export type MutationCreatePokemonCardAttacksArgs = {
  data: Array<PokemonCardAttackCreateInput>;
};


export type MutationCreatePokemonCardPriceHistoriesArgs = {
  data: Array<PokemonCardPriceHistoryCreateInput>;
};


export type MutationCreatePokemonCardPriceHistoryArgs = {
  data: PokemonCardPriceHistoryCreateInput;
};


export type MutationCreatePokemonCardResistanceArgs = {
  data: PokemonCardResistanceCreateInput;
};


export type MutationCreatePokemonCardResistancesArgs = {
  data: Array<PokemonCardResistanceCreateInput>;
};


export type MutationCreatePokemonCardWeaknessArgs = {
  data: PokemonCardWeaknessCreateInput;
};


export type MutationCreatePokemonCardWeaknessesArgs = {
  data: Array<PokemonCardWeaknessCreateInput>;
};


export type MutationCreatePokemonCardsArgs = {
  data: Array<PokemonCardCreateInput>;
};


export type MutationCreatePokemonCollectionItemArgs = {
  data: PokemonCollectionItemCreateInput;
};


export type MutationCreatePokemonCollectionItemsArgs = {
  data: Array<PokemonCollectionItemCreateInput>;
};


export type MutationCreatePokemonSetArgs = {
  data: PokemonSetCreateInput;
};


export type MutationCreatePokemonSetsArgs = {
  data: Array<PokemonSetCreateInput>;
};


export type MutationCreateSessionArgs = {
  data: SessionCreateInput;
};


export type MutationCreateSessionsArgs = {
  data: Array<SessionCreateInput>;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationCreateUsersArgs = {
  data: Array<UserCreateInput>;
};


export type MutationCreateVerificationTokenArgs = {
  data: VerificationTokenCreateInput;
};


export type MutationCreateVerificationTokensArgs = {
  data: Array<VerificationTokenCreateInput>;
};


export type MutationDeleteAccountArgs = {
  where: AccountWhereUniqueInput;
};


export type MutationDeleteAccountsArgs = {
  where: Array<AccountWhereUniqueInput>;
};


export type MutationDeleteAuthenticatorArgs = {
  where: AuthenticatorWhereUniqueInput;
};


export type MutationDeleteAuthenticatorsArgs = {
  where: Array<AuthenticatorWhereUniqueInput>;
};


export type MutationDeleteCmsRoleArgs = {
  where: CmsRoleWhereUniqueInput;
};


export type MutationDeleteCmsRolesArgs = {
  where: Array<CmsRoleWhereUniqueInput>;
};


export type MutationDeleteCmsUserArgs = {
  where: CmsUserWhereUniqueInput;
};


export type MutationDeleteCmsUsersArgs = {
  where: Array<CmsUserWhereUniqueInput>;
};


export type MutationDeletePokemonCardArgs = {
  where: PokemonCardWhereUniqueInput;
};


export type MutationDeletePokemonCardAbilitiesArgs = {
  where: Array<PokemonCardAbilityWhereUniqueInput>;
};


export type MutationDeletePokemonCardAbilityArgs = {
  where: PokemonCardAbilityWhereUniqueInput;
};


export type MutationDeletePokemonCardAttackArgs = {
  where: PokemonCardAttackWhereUniqueInput;
};


export type MutationDeletePokemonCardAttacksArgs = {
  where: Array<PokemonCardAttackWhereUniqueInput>;
};


export type MutationDeletePokemonCardPriceHistoriesArgs = {
  where: Array<PokemonCardPriceHistoryWhereUniqueInput>;
};


export type MutationDeletePokemonCardPriceHistoryArgs = {
  where: PokemonCardPriceHistoryWhereUniqueInput;
};


export type MutationDeletePokemonCardResistanceArgs = {
  where: PokemonCardResistanceWhereUniqueInput;
};


export type MutationDeletePokemonCardResistancesArgs = {
  where: Array<PokemonCardResistanceWhereUniqueInput>;
};


export type MutationDeletePokemonCardWeaknessArgs = {
  where: PokemonCardWeaknessWhereUniqueInput;
};


export type MutationDeletePokemonCardWeaknessesArgs = {
  where: Array<PokemonCardWeaknessWhereUniqueInput>;
};


export type MutationDeletePokemonCardsArgs = {
  where: Array<PokemonCardWhereUniqueInput>;
};


export type MutationDeletePokemonCollectionItemArgs = {
  where: PokemonCollectionItemWhereUniqueInput;
};


export type MutationDeletePokemonCollectionItemsArgs = {
  where: Array<PokemonCollectionItemWhereUniqueInput>;
};


export type MutationDeletePokemonSetArgs = {
  where: PokemonSetWhereUniqueInput;
};


export type MutationDeletePokemonSetsArgs = {
  where: Array<PokemonSetWhereUniqueInput>;
};


export type MutationDeleteSessionArgs = {
  where: SessionWhereUniqueInput;
};


export type MutationDeleteSessionsArgs = {
  where: Array<SessionWhereUniqueInput>;
};


export type MutationDeleteUserArgs = {
  where: UserWhereUniqueInput;
};


export type MutationDeleteUsersArgs = {
  where: Array<UserWhereUniqueInput>;
};


export type MutationDeleteVerificationTokenArgs = {
  where: VerificationTokenWhereUniqueInput;
};


export type MutationDeleteVerificationTokensArgs = {
  where: Array<VerificationTokenWhereUniqueInput>;
};


export type MutationUpdateAccountArgs = {
  data: AccountUpdateInput;
  where: AccountWhereUniqueInput;
};


export type MutationUpdateAccountsArgs = {
  data: Array<AccountUpdateArgs>;
};


export type MutationUpdateAuthenticatorArgs = {
  data: AuthenticatorUpdateInput;
  where: AuthenticatorWhereUniqueInput;
};


export type MutationUpdateAuthenticatorsArgs = {
  data: Array<AuthenticatorUpdateArgs>;
};


export type MutationUpdateCmsRoleArgs = {
  data: CmsRoleUpdateInput;
  where: CmsRoleWhereUniqueInput;
};


export type MutationUpdateCmsRolesArgs = {
  data: Array<CmsRoleUpdateArgs>;
};


export type MutationUpdateCmsUserArgs = {
  data: CmsUserUpdateInput;
  where: CmsUserWhereUniqueInput;
};


export type MutationUpdateCmsUsersArgs = {
  data: Array<CmsUserUpdateArgs>;
};


export type MutationUpdatePokemonCardArgs = {
  data: PokemonCardUpdateInput;
  where: PokemonCardWhereUniqueInput;
};


export type MutationUpdatePokemonCardAbilitiesArgs = {
  data: Array<PokemonCardAbilityUpdateArgs>;
};


export type MutationUpdatePokemonCardAbilityArgs = {
  data: PokemonCardAbilityUpdateInput;
  where: PokemonCardAbilityWhereUniqueInput;
};


export type MutationUpdatePokemonCardAttackArgs = {
  data: PokemonCardAttackUpdateInput;
  where: PokemonCardAttackWhereUniqueInput;
};


export type MutationUpdatePokemonCardAttacksArgs = {
  data: Array<PokemonCardAttackUpdateArgs>;
};


export type MutationUpdatePokemonCardPriceHistoriesArgs = {
  data: Array<PokemonCardPriceHistoryUpdateArgs>;
};


export type MutationUpdatePokemonCardPriceHistoryArgs = {
  data: PokemonCardPriceHistoryUpdateInput;
  where: PokemonCardPriceHistoryWhereUniqueInput;
};


export type MutationUpdatePokemonCardResistanceArgs = {
  data: PokemonCardResistanceUpdateInput;
  where: PokemonCardResistanceWhereUniqueInput;
};


export type MutationUpdatePokemonCardResistancesArgs = {
  data: Array<PokemonCardResistanceUpdateArgs>;
};


export type MutationUpdatePokemonCardWeaknessArgs = {
  data: PokemonCardWeaknessUpdateInput;
  where: PokemonCardWeaknessWhereUniqueInput;
};


export type MutationUpdatePokemonCardWeaknessesArgs = {
  data: Array<PokemonCardWeaknessUpdateArgs>;
};


export type MutationUpdatePokemonCardsArgs = {
  data: Array<PokemonCardUpdateArgs>;
};


export type MutationUpdatePokemonCollectionItemArgs = {
  data: PokemonCollectionItemUpdateInput;
  where: PokemonCollectionItemWhereUniqueInput;
};


export type MutationUpdatePokemonCollectionItemsArgs = {
  data: Array<PokemonCollectionItemUpdateArgs>;
};


export type MutationUpdatePokemonSetArgs = {
  data: PokemonSetUpdateInput;
  where: PokemonSetWhereUniqueInput;
};


export type MutationUpdatePokemonSetsArgs = {
  data: Array<PokemonSetUpdateArgs>;
};


export type MutationUpdateSessionArgs = {
  data: SessionUpdateInput;
  where: SessionWhereUniqueInput;
};


export type MutationUpdateSessionsArgs = {
  data: Array<SessionUpdateArgs>;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};


export type MutationUpdateUsersArgs = {
  data: Array<UserUpdateArgs>;
};


export type MutationUpdateVerificationTokenArgs = {
  data: VerificationTokenUpdateInput;
  where: VerificationTokenWhereUniqueInput;
};


export type MutationUpdateVerificationTokensArgs = {
  data: Array<VerificationTokenUpdateArgs>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PasswordState = {
  __typename?: 'PasswordState';
  isSet: Scalars['Boolean']['output'];
};

export type PokemonCard = {
  __typename?: 'PokemonCard';
  abilities?: Maybe<Array<PokemonCardAbility>>;
  abilitiesCount?: Maybe<Scalars['Int']['output']>;
  artist?: Maybe<Scalars['String']['output']>;
  attacks?: Maybe<Array<PokemonCardAttack>>;
  attacksCount?: Maybe<Scalars['Int']['output']>;
  collections?: Maybe<Array<PokemonCollectionItem>>;
  collectionsCount?: Maybe<Scalars['Int']['output']>;
  convertedRetreatCost?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  evolvesFrom?: Maybe<Scalars['String']['output']>;
  flavorText?: Maybe<Scalars['String']['output']>;
  hp?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  imageLargeApiUrl?: Maybe<Scalars['String']['output']>;
  imageLargeStorageUrl?: Maybe<Scalars['String']['output']>;
  imageSmallApiUrl?: Maybe<Scalars['String']['output']>;
  imageSmallStorageUrl?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nationalPokedexNumbers?: Maybe<Scalars['JSON']['output']>;
  normalizedNumber?: Maybe<Scalars['Int']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  priceHistories?: Maybe<Array<PokemonCardPriceHistory>>;
  priceHistoriesCount?: Maybe<Scalars['Int']['output']>;
  rarity?: Maybe<Scalars['String']['output']>;
  resistances?: Maybe<Array<PokemonCardResistance>>;
  resistancesCount?: Maybe<Scalars['Int']['output']>;
  retreatCost?: Maybe<Scalars['JSON']['output']>;
  set?: Maybe<PokemonSet>;
  subtypes?: Maybe<Scalars['JSON']['output']>;
  supertype?: Maybe<Scalars['String']['output']>;
  tcgCardId?: Maybe<Scalars['String']['output']>;
  tcgCardId_variant_language?: Maybe<Scalars['String']['output']>;
  tcgSetId?: Maybe<Scalars['String']['output']>;
  types?: Maybe<Scalars['JSON']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  variant?: Maybe<Scalars['String']['output']>;
  weaknesses?: Maybe<Array<PokemonCardWeakness>>;
  weaknessesCount?: Maybe<Scalars['Int']['output']>;
};


export type PokemonCardAbilitiesArgs = {
  cursor?: InputMaybe<PokemonCardAbilityWhereUniqueInput>;
  orderBy?: Array<PokemonCardAbilityOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardAbilityWhereInput;
};


export type PokemonCardAbilitiesCountArgs = {
  where?: PokemonCardAbilityWhereInput;
};


export type PokemonCardAttacksArgs = {
  cursor?: InputMaybe<PokemonCardAttackWhereUniqueInput>;
  orderBy?: Array<PokemonCardAttackOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardAttackWhereInput;
};


export type PokemonCardAttacksCountArgs = {
  where?: PokemonCardAttackWhereInput;
};


export type PokemonCardCollectionsArgs = {
  cursor?: InputMaybe<PokemonCollectionItemWhereUniqueInput>;
  orderBy?: Array<PokemonCollectionItemOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCollectionItemWhereInput;
};


export type PokemonCardCollectionsCountArgs = {
  where?: PokemonCollectionItemWhereInput;
};


export type PokemonCardPriceHistoriesArgs = {
  cursor?: InputMaybe<PokemonCardPriceHistoryWhereUniqueInput>;
  orderBy?: Array<PokemonCardPriceHistoryOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardPriceHistoryWhereInput;
};


export type PokemonCardPriceHistoriesCountArgs = {
  where?: PokemonCardPriceHistoryWhereInput;
};


export type PokemonCardResistancesArgs = {
  cursor?: InputMaybe<PokemonCardResistanceWhereUniqueInput>;
  orderBy?: Array<PokemonCardResistanceOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardResistanceWhereInput;
};


export type PokemonCardResistancesCountArgs = {
  where?: PokemonCardResistanceWhereInput;
};


export type PokemonCardWeaknessesArgs = {
  cursor?: InputMaybe<PokemonCardWeaknessWhereUniqueInput>;
  orderBy?: Array<PokemonCardWeaknessOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardWeaknessWhereInput;
};


export type PokemonCardWeaknessesCountArgs = {
  where?: PokemonCardWeaknessWhereInput;
};

export type PokemonCardAbility = {
  __typename?: 'PokemonCardAbility';
  card?: Maybe<PokemonCard>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type PokemonCardAbilityCreateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForCreateInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardAbilityManyRelationFilter = {
  every?: InputMaybe<PokemonCardAbilityWhereInput>;
  none?: InputMaybe<PokemonCardAbilityWhereInput>;
  some?: InputMaybe<PokemonCardAbilityWhereInput>;
};

export type PokemonCardAbilityOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  text?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
};

export type PokemonCardAbilityRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PokemonCardAbilityWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardAbilityCreateInput>>;
};

export type PokemonCardAbilityRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PokemonCardAbilityWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardAbilityCreateInput>>;
  disconnect?: InputMaybe<Array<PokemonCardAbilityWhereUniqueInput>>;
  set?: InputMaybe<Array<PokemonCardAbilityWhereUniqueInput>>;
};

export type PokemonCardAbilityUpdateArgs = {
  data: PokemonCardAbilityUpdateInput;
  where: PokemonCardAbilityWhereUniqueInput;
};

export type PokemonCardAbilityUpdateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForUpdateInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardAbilityWhereInput = {
  AND?: InputMaybe<Array<PokemonCardAbilityWhereInput>>;
  NOT?: InputMaybe<Array<PokemonCardAbilityWhereInput>>;
  OR?: InputMaybe<Array<PokemonCardAbilityWhereInput>>;
  card?: InputMaybe<PokemonCardWhereInput>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
  text?: InputMaybe<StringFilter>;
  type?: InputMaybe<StringFilter>;
};

export type PokemonCardAbilityWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type PokemonCardAttack = {
  __typename?: 'PokemonCardAttack';
  card?: Maybe<PokemonCard>;
  convertedEnergyCost?: Maybe<Scalars['Int']['output']>;
  cost?: Maybe<Scalars['JSON']['output']>;
  damage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
};

export type PokemonCardAttackCreateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForCreateInput>;
  convertedEnergyCost?: InputMaybe<Scalars['Int']['input']>;
  cost?: InputMaybe<Scalars['JSON']['input']>;
  damage?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardAttackManyRelationFilter = {
  every?: InputMaybe<PokemonCardAttackWhereInput>;
  none?: InputMaybe<PokemonCardAttackWhereInput>;
  some?: InputMaybe<PokemonCardAttackWhereInput>;
};

export type PokemonCardAttackOrderByInput = {
  convertedEnergyCost?: InputMaybe<OrderDirection>;
  damage?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  text?: InputMaybe<OrderDirection>;
};

export type PokemonCardAttackRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PokemonCardAttackWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardAttackCreateInput>>;
};

export type PokemonCardAttackRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PokemonCardAttackWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardAttackCreateInput>>;
  disconnect?: InputMaybe<Array<PokemonCardAttackWhereUniqueInput>>;
  set?: InputMaybe<Array<PokemonCardAttackWhereUniqueInput>>;
};

export type PokemonCardAttackUpdateArgs = {
  data: PokemonCardAttackUpdateInput;
  where: PokemonCardAttackWhereUniqueInput;
};

export type PokemonCardAttackUpdateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForUpdateInput>;
  convertedEnergyCost?: InputMaybe<Scalars['Int']['input']>;
  cost?: InputMaybe<Scalars['JSON']['input']>;
  damage?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardAttackWhereInput = {
  AND?: InputMaybe<Array<PokemonCardAttackWhereInput>>;
  NOT?: InputMaybe<Array<PokemonCardAttackWhereInput>>;
  OR?: InputMaybe<Array<PokemonCardAttackWhereInput>>;
  card?: InputMaybe<PokemonCardWhereInput>;
  convertedEnergyCost?: InputMaybe<IntFilter>;
  damage?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
  text?: InputMaybe<StringFilter>;
};

export type PokemonCardAttackWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type PokemonCardCreateInput = {
  abilities?: InputMaybe<PokemonCardAbilityRelateToManyForCreateInput>;
  artist?: InputMaybe<Scalars['String']['input']>;
  attacks?: InputMaybe<PokemonCardAttackRelateToManyForCreateInput>;
  collections?: InputMaybe<PokemonCollectionItemRelateToManyForCreateInput>;
  convertedRetreatCost?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  evolvesFrom?: InputMaybe<Scalars['String']['input']>;
  flavorText?: InputMaybe<Scalars['String']['input']>;
  hp?: InputMaybe<Scalars['Int']['input']>;
  imageLargeApiUrl?: InputMaybe<Scalars['String']['input']>;
  imageLargeStorageUrl?: InputMaybe<Scalars['String']['input']>;
  imageSmallApiUrl?: InputMaybe<Scalars['String']['input']>;
  imageSmallStorageUrl?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nationalPokedexNumbers?: InputMaybe<Scalars['JSON']['input']>;
  normalizedNumber?: InputMaybe<Scalars['Int']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  priceHistories?: InputMaybe<PokemonCardPriceHistoryRelateToManyForCreateInput>;
  rarity?: InputMaybe<Scalars['String']['input']>;
  resistances?: InputMaybe<PokemonCardResistanceRelateToManyForCreateInput>;
  retreatCost?: InputMaybe<Scalars['JSON']['input']>;
  set?: InputMaybe<PokemonSetRelateToOneForCreateInput>;
  subtypes?: InputMaybe<Scalars['JSON']['input']>;
  supertype?: InputMaybe<Scalars['String']['input']>;
  tcgCardId?: InputMaybe<Scalars['String']['input']>;
  tcgCardId_variant_language?: InputMaybe<Scalars['String']['input']>;
  tcgSetId?: InputMaybe<Scalars['String']['input']>;
  types?: InputMaybe<Scalars['JSON']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  variant?: InputMaybe<Scalars['String']['input']>;
  weaknesses?: InputMaybe<PokemonCardWeaknessRelateToManyForCreateInput>;
};

export type PokemonCardManyRelationFilter = {
  every?: InputMaybe<PokemonCardWhereInput>;
  none?: InputMaybe<PokemonCardWhereInput>;
  some?: InputMaybe<PokemonCardWhereInput>;
};

export type PokemonCardOrderByInput = {
  artist?: InputMaybe<OrderDirection>;
  convertedRetreatCost?: InputMaybe<OrderDirection>;
  createdAt?: InputMaybe<OrderDirection>;
  evolvesFrom?: InputMaybe<OrderDirection>;
  flavorText?: InputMaybe<OrderDirection>;
  hp?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  imageLargeApiUrl?: InputMaybe<OrderDirection>;
  imageLargeStorageUrl?: InputMaybe<OrderDirection>;
  imageSmallApiUrl?: InputMaybe<OrderDirection>;
  imageSmallStorageUrl?: InputMaybe<OrderDirection>;
  language?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  normalizedNumber?: InputMaybe<OrderDirection>;
  number?: InputMaybe<OrderDirection>;
  rarity?: InputMaybe<OrderDirection>;
  supertype?: InputMaybe<OrderDirection>;
  tcgCardId?: InputMaybe<OrderDirection>;
  tcgCardId_variant_language?: InputMaybe<OrderDirection>;
  tcgSetId?: InputMaybe<OrderDirection>;
  updatedAt?: InputMaybe<OrderDirection>;
  variant?: InputMaybe<OrderDirection>;
};

export type PokemonCardPriceHistory = {
  __typename?: 'PokemonCardPriceHistory';
  card?: Maybe<PokemonCard>;
  cardmarketData?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  fetchedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  priceDate?: Maybe<Scalars['DateTime']['output']>;
  tcgplayerData?: Maybe<Scalars['JSON']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  variant?: Maybe<Scalars['String']['output']>;
};

export type PokemonCardPriceHistoryCreateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForCreateInput>;
  cardmarketData?: InputMaybe<Scalars['JSON']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  fetchedAt?: InputMaybe<Scalars['DateTime']['input']>;
  priceDate?: InputMaybe<Scalars['DateTime']['input']>;
  tcgplayerData?: InputMaybe<Scalars['JSON']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  variant?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardPriceHistoryManyRelationFilter = {
  every?: InputMaybe<PokemonCardPriceHistoryWhereInput>;
  none?: InputMaybe<PokemonCardPriceHistoryWhereInput>;
  some?: InputMaybe<PokemonCardPriceHistoryWhereInput>;
};

export type PokemonCardPriceHistoryOrderByInput = {
  createdAt?: InputMaybe<OrderDirection>;
  fetchedAt?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  priceDate?: InputMaybe<OrderDirection>;
  updatedAt?: InputMaybe<OrderDirection>;
  variant?: InputMaybe<OrderDirection>;
};

export type PokemonCardPriceHistoryRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PokemonCardPriceHistoryWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardPriceHistoryCreateInput>>;
};

export type PokemonCardPriceHistoryRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PokemonCardPriceHistoryWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardPriceHistoryCreateInput>>;
  disconnect?: InputMaybe<Array<PokemonCardPriceHistoryWhereUniqueInput>>;
  set?: InputMaybe<Array<PokemonCardPriceHistoryWhereUniqueInput>>;
};

export type PokemonCardPriceHistoryUpdateArgs = {
  data: PokemonCardPriceHistoryUpdateInput;
  where: PokemonCardPriceHistoryWhereUniqueInput;
};

export type PokemonCardPriceHistoryUpdateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForUpdateInput>;
  cardmarketData?: InputMaybe<Scalars['JSON']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  fetchedAt?: InputMaybe<Scalars['DateTime']['input']>;
  priceDate?: InputMaybe<Scalars['DateTime']['input']>;
  tcgplayerData?: InputMaybe<Scalars['JSON']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  variant?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardPriceHistoryWhereInput = {
  AND?: InputMaybe<Array<PokemonCardPriceHistoryWhereInput>>;
  NOT?: InputMaybe<Array<PokemonCardPriceHistoryWhereInput>>;
  OR?: InputMaybe<Array<PokemonCardPriceHistoryWhereInput>>;
  card?: InputMaybe<PokemonCardWhereInput>;
  createdAt?: InputMaybe<DateTimeNullableFilter>;
  fetchedAt?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<IdFilter>;
  priceDate?: InputMaybe<DateTimeNullableFilter>;
  updatedAt?: InputMaybe<DateTimeNullableFilter>;
  variant?: InputMaybe<StringFilter>;
};

export type PokemonCardPriceHistoryWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type PokemonCardRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PokemonCardWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardCreateInput>>;
};

export type PokemonCardRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PokemonCardWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardCreateInput>>;
  disconnect?: InputMaybe<Array<PokemonCardWhereUniqueInput>>;
  set?: InputMaybe<Array<PokemonCardWhereUniqueInput>>;
};

export type PokemonCardRelateToOneForCreateInput = {
  connect?: InputMaybe<PokemonCardWhereUniqueInput>;
  create?: InputMaybe<PokemonCardCreateInput>;
};

export type PokemonCardRelateToOneForUpdateInput = {
  connect?: InputMaybe<PokemonCardWhereUniqueInput>;
  create?: InputMaybe<PokemonCardCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PokemonCardResistance = {
  __typename?: 'PokemonCardResistance';
  card?: Maybe<PokemonCard>;
  id: Scalars['ID']['output'];
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type PokemonCardResistanceCreateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForCreateInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardResistanceManyRelationFilter = {
  every?: InputMaybe<PokemonCardResistanceWhereInput>;
  none?: InputMaybe<PokemonCardResistanceWhereInput>;
  some?: InputMaybe<PokemonCardResistanceWhereInput>;
};

export type PokemonCardResistanceOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
  value?: InputMaybe<OrderDirection>;
};

export type PokemonCardResistanceRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PokemonCardResistanceWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardResistanceCreateInput>>;
};

export type PokemonCardResistanceRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PokemonCardResistanceWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardResistanceCreateInput>>;
  disconnect?: InputMaybe<Array<PokemonCardResistanceWhereUniqueInput>>;
  set?: InputMaybe<Array<PokemonCardResistanceWhereUniqueInput>>;
};

export type PokemonCardResistanceUpdateArgs = {
  data: PokemonCardResistanceUpdateInput;
  where: PokemonCardResistanceWhereUniqueInput;
};

export type PokemonCardResistanceUpdateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForUpdateInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardResistanceWhereInput = {
  AND?: InputMaybe<Array<PokemonCardResistanceWhereInput>>;
  NOT?: InputMaybe<Array<PokemonCardResistanceWhereInput>>;
  OR?: InputMaybe<Array<PokemonCardResistanceWhereInput>>;
  card?: InputMaybe<PokemonCardWhereInput>;
  id?: InputMaybe<IdFilter>;
  type?: InputMaybe<StringFilter>;
  value?: InputMaybe<StringFilter>;
};

export type PokemonCardResistanceWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type PokemonCardUpdateArgs = {
  data: PokemonCardUpdateInput;
  where: PokemonCardWhereUniqueInput;
};

export type PokemonCardUpdateInput = {
  abilities?: InputMaybe<PokemonCardAbilityRelateToManyForUpdateInput>;
  artist?: InputMaybe<Scalars['String']['input']>;
  attacks?: InputMaybe<PokemonCardAttackRelateToManyForUpdateInput>;
  collections?: InputMaybe<PokemonCollectionItemRelateToManyForUpdateInput>;
  convertedRetreatCost?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  evolvesFrom?: InputMaybe<Scalars['String']['input']>;
  flavorText?: InputMaybe<Scalars['String']['input']>;
  hp?: InputMaybe<Scalars['Int']['input']>;
  imageLargeApiUrl?: InputMaybe<Scalars['String']['input']>;
  imageLargeStorageUrl?: InputMaybe<Scalars['String']['input']>;
  imageSmallApiUrl?: InputMaybe<Scalars['String']['input']>;
  imageSmallStorageUrl?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nationalPokedexNumbers?: InputMaybe<Scalars['JSON']['input']>;
  normalizedNumber?: InputMaybe<Scalars['Int']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  priceHistories?: InputMaybe<PokemonCardPriceHistoryRelateToManyForUpdateInput>;
  rarity?: InputMaybe<Scalars['String']['input']>;
  resistances?: InputMaybe<PokemonCardResistanceRelateToManyForUpdateInput>;
  retreatCost?: InputMaybe<Scalars['JSON']['input']>;
  set?: InputMaybe<PokemonSetRelateToOneForUpdateInput>;
  subtypes?: InputMaybe<Scalars['JSON']['input']>;
  supertype?: InputMaybe<Scalars['String']['input']>;
  tcgCardId?: InputMaybe<Scalars['String']['input']>;
  tcgCardId_variant_language?: InputMaybe<Scalars['String']['input']>;
  tcgSetId?: InputMaybe<Scalars['String']['input']>;
  types?: InputMaybe<Scalars['JSON']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  variant?: InputMaybe<Scalars['String']['input']>;
  weaknesses?: InputMaybe<PokemonCardWeaknessRelateToManyForUpdateInput>;
};

export type PokemonCardWeakness = {
  __typename?: 'PokemonCardWeakness';
  card?: Maybe<PokemonCard>;
  id: Scalars['ID']['output'];
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type PokemonCardWeaknessCreateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForCreateInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardWeaknessManyRelationFilter = {
  every?: InputMaybe<PokemonCardWeaknessWhereInput>;
  none?: InputMaybe<PokemonCardWeaknessWhereInput>;
  some?: InputMaybe<PokemonCardWeaknessWhereInput>;
};

export type PokemonCardWeaknessOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
  value?: InputMaybe<OrderDirection>;
};

export type PokemonCardWeaknessRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PokemonCardWeaknessWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardWeaknessCreateInput>>;
};

export type PokemonCardWeaknessRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PokemonCardWeaknessWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCardWeaknessCreateInput>>;
  disconnect?: InputMaybe<Array<PokemonCardWeaknessWhereUniqueInput>>;
  set?: InputMaybe<Array<PokemonCardWeaknessWhereUniqueInput>>;
};

export type PokemonCardWeaknessUpdateArgs = {
  data: PokemonCardWeaknessUpdateInput;
  where: PokemonCardWeaknessWhereUniqueInput;
};

export type PokemonCardWeaknessUpdateInput = {
  card?: InputMaybe<PokemonCardRelateToOneForUpdateInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCardWeaknessWhereInput = {
  AND?: InputMaybe<Array<PokemonCardWeaknessWhereInput>>;
  NOT?: InputMaybe<Array<PokemonCardWeaknessWhereInput>>;
  OR?: InputMaybe<Array<PokemonCardWeaknessWhereInput>>;
  card?: InputMaybe<PokemonCardWhereInput>;
  id?: InputMaybe<IdFilter>;
  type?: InputMaybe<StringFilter>;
  value?: InputMaybe<StringFilter>;
};

export type PokemonCardWeaknessWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type PokemonCardWhereInput = {
  AND?: InputMaybe<Array<PokemonCardWhereInput>>;
  NOT?: InputMaybe<Array<PokemonCardWhereInput>>;
  OR?: InputMaybe<Array<PokemonCardWhereInput>>;
  abilities?: InputMaybe<PokemonCardAbilityManyRelationFilter>;
  artist?: InputMaybe<StringFilter>;
  attacks?: InputMaybe<PokemonCardAttackManyRelationFilter>;
  collections?: InputMaybe<PokemonCollectionItemManyRelationFilter>;
  convertedRetreatCost?: InputMaybe<IntNullableFilter>;
  createdAt?: InputMaybe<DateTimeNullableFilter>;
  evolvesFrom?: InputMaybe<StringFilter>;
  flavorText?: InputMaybe<StringFilter>;
  hp?: InputMaybe<IntNullableFilter>;
  id?: InputMaybe<IdFilter>;
  imageLargeApiUrl?: InputMaybe<StringFilter>;
  imageLargeStorageUrl?: InputMaybe<StringFilter>;
  imageSmallApiUrl?: InputMaybe<StringFilter>;
  imageSmallStorageUrl?: InputMaybe<StringFilter>;
  language?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  normalizedNumber?: InputMaybe<IntNullableFilter>;
  number?: InputMaybe<StringFilter>;
  priceHistories?: InputMaybe<PokemonCardPriceHistoryManyRelationFilter>;
  rarity?: InputMaybe<StringFilter>;
  resistances?: InputMaybe<PokemonCardResistanceManyRelationFilter>;
  set?: InputMaybe<PokemonSetWhereInput>;
  supertype?: InputMaybe<StringFilter>;
  tcgCardId?: InputMaybe<StringFilter>;
  tcgCardId_variant_language?: InputMaybe<StringFilter>;
  tcgSetId?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeNullableFilter>;
  variant?: InputMaybe<StringFilter>;
  weaknesses?: InputMaybe<PokemonCardWeaknessManyRelationFilter>;
};

export type PokemonCardWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  tcgCardId_variant_language?: InputMaybe<Scalars['String']['input']>;
};

export type PokemonCollectionItem = {
  __typename?: 'PokemonCollectionItem';
  acquiredAt?: Maybe<Scalars['DateTime']['output']>;
  card?: Maybe<PokemonCard>;
  cardName?: Maybe<Scalars['String']['output']>;
  condition?: Maybe<Scalars['String']['output']>;
  gradingCompany?: Maybe<Scalars['String']['output']>;
  gradingRating?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
};

export type PokemonCollectionItemCreateInput = {
  acquiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  card?: InputMaybe<PokemonCardRelateToOneForCreateInput>;
  cardName?: InputMaybe<Scalars['String']['input']>;
  condition?: InputMaybe<Scalars['String']['input']>;
  gradingCompany?: InputMaybe<Scalars['String']['input']>;
  gradingRating?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<UserRelateToOneForCreateInput>;
};

export type PokemonCollectionItemManyRelationFilter = {
  every?: InputMaybe<PokemonCollectionItemWhereInput>;
  none?: InputMaybe<PokemonCollectionItemWhereInput>;
  some?: InputMaybe<PokemonCollectionItemWhereInput>;
};

export type PokemonCollectionItemOrderByInput = {
  acquiredAt?: InputMaybe<OrderDirection>;
  cardName?: InputMaybe<OrderDirection>;
  condition?: InputMaybe<OrderDirection>;
  gradingCompany?: InputMaybe<OrderDirection>;
  gradingRating?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  notes?: InputMaybe<OrderDirection>;
  price?: InputMaybe<OrderDirection>;
  quantity?: InputMaybe<OrderDirection>;
};

export type PokemonCollectionItemRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PokemonCollectionItemWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCollectionItemCreateInput>>;
};

export type PokemonCollectionItemRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PokemonCollectionItemWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonCollectionItemCreateInput>>;
  disconnect?: InputMaybe<Array<PokemonCollectionItemWhereUniqueInput>>;
  set?: InputMaybe<Array<PokemonCollectionItemWhereUniqueInput>>;
};

export type PokemonCollectionItemUpdateArgs = {
  data: PokemonCollectionItemUpdateInput;
  where: PokemonCollectionItemWhereUniqueInput;
};

export type PokemonCollectionItemUpdateInput = {
  acquiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  card?: InputMaybe<PokemonCardRelateToOneForUpdateInput>;
  cardName?: InputMaybe<Scalars['String']['input']>;
  condition?: InputMaybe<Scalars['String']['input']>;
  gradingCompany?: InputMaybe<Scalars['String']['input']>;
  gradingRating?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<UserRelateToOneForUpdateInput>;
};

export type PokemonCollectionItemWhereInput = {
  AND?: InputMaybe<Array<PokemonCollectionItemWhereInput>>;
  NOT?: InputMaybe<Array<PokemonCollectionItemWhereInput>>;
  OR?: InputMaybe<Array<PokemonCollectionItemWhereInput>>;
  acquiredAt?: InputMaybe<DateTimeNullableFilter>;
  card?: InputMaybe<PokemonCardWhereInput>;
  cardName?: InputMaybe<StringFilter>;
  condition?: InputMaybe<StringNullableFilter>;
  gradingCompany?: InputMaybe<StringNullableFilter>;
  gradingRating?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IdFilter>;
  notes?: InputMaybe<StringFilter>;
  price?: InputMaybe<DecimalNullableFilter>;
  quantity?: InputMaybe<IntFilter>;
  user?: InputMaybe<UserWhereInput>;
};

export type PokemonCollectionItemWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type PokemonSet = {
  __typename?: 'PokemonSet';
  cards?: Maybe<Array<PokemonCard>>;
  cardsCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isBoosterPack?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastPriceFetchDate?: Maybe<Scalars['DateTime']['output']>;
  logoApiUrl?: Maybe<Scalars['String']['output']>;
  logoStorageUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parentSet?: Maybe<PokemonSet>;
  printedTotal?: Maybe<Scalars['Int']['output']>;
  ptcgoCode?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  series?: Maybe<Scalars['String']['output']>;
  subsets?: Maybe<Array<PokemonSet>>;
  subsetsCount?: Maybe<Scalars['Int']['output']>;
  symbolApiUrl?: Maybe<Scalars['String']['output']>;
  symbolStorageUrl?: Maybe<Scalars['String']['output']>;
  tcgSetId?: Maybe<Scalars['String']['output']>;
  tcgSetId_language?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type PokemonSetCardsArgs = {
  cursor?: InputMaybe<PokemonCardWhereUniqueInput>;
  orderBy?: Array<PokemonCardOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardWhereInput;
};


export type PokemonSetCardsCountArgs = {
  where?: PokemonCardWhereInput;
};


export type PokemonSetSubsetsArgs = {
  cursor?: InputMaybe<PokemonSetWhereUniqueInput>;
  orderBy?: Array<PokemonSetOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonSetWhereInput;
};


export type PokemonSetSubsetsCountArgs = {
  where?: PokemonSetWhereInput;
};

export type PokemonSetCreateInput = {
  cards?: InputMaybe<PokemonCardRelateToManyForCreateInput>;
  isBoosterPack?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  lastPriceFetchDate?: InputMaybe<Scalars['DateTime']['input']>;
  logoApiUrl?: InputMaybe<Scalars['String']['input']>;
  logoStorageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentSet?: InputMaybe<PokemonSetRelateToOneForCreateInput>;
  printedTotal?: InputMaybe<Scalars['Int']['input']>;
  ptcgoCode?: InputMaybe<Scalars['String']['input']>;
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  series?: InputMaybe<Scalars['String']['input']>;
  subsets?: InputMaybe<PokemonSetRelateToManyForCreateInput>;
  symbolApiUrl?: InputMaybe<Scalars['String']['input']>;
  symbolStorageUrl?: InputMaybe<Scalars['String']['input']>;
  tcgSetId?: InputMaybe<Scalars['String']['input']>;
  tcgSetId_language?: InputMaybe<Scalars['String']['input']>;
  total?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PokemonSetManyRelationFilter = {
  every?: InputMaybe<PokemonSetWhereInput>;
  none?: InputMaybe<PokemonSetWhereInput>;
  some?: InputMaybe<PokemonSetWhereInput>;
};

export type PokemonSetOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  isBoosterPack?: InputMaybe<OrderDirection>;
  language?: InputMaybe<OrderDirection>;
  lastPriceFetchDate?: InputMaybe<OrderDirection>;
  logoApiUrl?: InputMaybe<OrderDirection>;
  logoStorageUrl?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  printedTotal?: InputMaybe<OrderDirection>;
  ptcgoCode?: InputMaybe<OrderDirection>;
  releaseDate?: InputMaybe<OrderDirection>;
  series?: InputMaybe<OrderDirection>;
  symbolApiUrl?: InputMaybe<OrderDirection>;
  symbolStorageUrl?: InputMaybe<OrderDirection>;
  tcgSetId?: InputMaybe<OrderDirection>;
  tcgSetId_language?: InputMaybe<OrderDirection>;
  total?: InputMaybe<OrderDirection>;
  updatedAt?: InputMaybe<OrderDirection>;
};

export type PokemonSetRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<PokemonSetWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonSetCreateInput>>;
};

export type PokemonSetRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<PokemonSetWhereUniqueInput>>;
  create?: InputMaybe<Array<PokemonSetCreateInput>>;
  disconnect?: InputMaybe<Array<PokemonSetWhereUniqueInput>>;
  set?: InputMaybe<Array<PokemonSetWhereUniqueInput>>;
};

export type PokemonSetRelateToOneForCreateInput = {
  connect?: InputMaybe<PokemonSetWhereUniqueInput>;
  create?: InputMaybe<PokemonSetCreateInput>;
};

export type PokemonSetRelateToOneForUpdateInput = {
  connect?: InputMaybe<PokemonSetWhereUniqueInput>;
  create?: InputMaybe<PokemonSetCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PokemonSetUpdateArgs = {
  data: PokemonSetUpdateInput;
  where: PokemonSetWhereUniqueInput;
};

export type PokemonSetUpdateInput = {
  cards?: InputMaybe<PokemonCardRelateToManyForUpdateInput>;
  isBoosterPack?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  lastPriceFetchDate?: InputMaybe<Scalars['DateTime']['input']>;
  logoApiUrl?: InputMaybe<Scalars['String']['input']>;
  logoStorageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentSet?: InputMaybe<PokemonSetRelateToOneForUpdateInput>;
  printedTotal?: InputMaybe<Scalars['Int']['input']>;
  ptcgoCode?: InputMaybe<Scalars['String']['input']>;
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  series?: InputMaybe<Scalars['String']['input']>;
  subsets?: InputMaybe<PokemonSetRelateToManyForUpdateInput>;
  symbolApiUrl?: InputMaybe<Scalars['String']['input']>;
  symbolStorageUrl?: InputMaybe<Scalars['String']['input']>;
  tcgSetId?: InputMaybe<Scalars['String']['input']>;
  tcgSetId_language?: InputMaybe<Scalars['String']['input']>;
  total?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PokemonSetWhereInput = {
  AND?: InputMaybe<Array<PokemonSetWhereInput>>;
  NOT?: InputMaybe<Array<PokemonSetWhereInput>>;
  OR?: InputMaybe<Array<PokemonSetWhereInput>>;
  cards?: InputMaybe<PokemonCardManyRelationFilter>;
  id?: InputMaybe<IdFilter>;
  isBoosterPack?: InputMaybe<BooleanFilter>;
  language?: InputMaybe<StringFilter>;
  lastPriceFetchDate?: InputMaybe<DateTimeNullableFilter>;
  logoApiUrl?: InputMaybe<StringFilter>;
  logoStorageUrl?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  parentSet?: InputMaybe<PokemonSetWhereInput>;
  printedTotal?: InputMaybe<IntFilter>;
  ptcgoCode?: InputMaybe<StringNullableFilter>;
  releaseDate?: InputMaybe<DateTimeFilter>;
  series?: InputMaybe<StringFilter>;
  subsets?: InputMaybe<PokemonSetManyRelationFilter>;
  symbolApiUrl?: InputMaybe<StringFilter>;
  symbolStorageUrl?: InputMaybe<StringFilter>;
  tcgSetId?: InputMaybe<StringFilter>;
  tcgSetId_language?: InputMaybe<StringFilter>;
  total?: InputMaybe<IntFilter>;
  updatedAt?: InputMaybe<DateTimeNullableFilter>;
};

export type PokemonSetWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  tcgSetId_language?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accounts?: Maybe<Array<Account>>;
  accountsCount?: Maybe<Scalars['Int']['output']>;
  authenticatedItem?: Maybe<AuthenticatedItem>;
  authenticator?: Maybe<Authenticator>;
  authenticators?: Maybe<Array<Authenticator>>;
  authenticatorsCount?: Maybe<Scalars['Int']['output']>;
  cmsRole?: Maybe<CmsRole>;
  cmsRoles?: Maybe<Array<CmsRole>>;
  cmsRolesCount?: Maybe<Scalars['Int']['output']>;
  cmsUser?: Maybe<CmsUser>;
  cmsUsers?: Maybe<Array<CmsUser>>;
  cmsUsersCount?: Maybe<Scalars['Int']['output']>;
  keystone: KeystoneMeta;
  pokemonCard?: Maybe<PokemonCard>;
  pokemonCardAbilities?: Maybe<Array<PokemonCardAbility>>;
  pokemonCardAbilitiesCount?: Maybe<Scalars['Int']['output']>;
  pokemonCardAbility?: Maybe<PokemonCardAbility>;
  pokemonCardAttack?: Maybe<PokemonCardAttack>;
  pokemonCardAttacks?: Maybe<Array<PokemonCardAttack>>;
  pokemonCardAttacksCount?: Maybe<Scalars['Int']['output']>;
  pokemonCardPriceHistories?: Maybe<Array<PokemonCardPriceHistory>>;
  pokemonCardPriceHistoriesCount?: Maybe<Scalars['Int']['output']>;
  pokemonCardPriceHistory?: Maybe<PokemonCardPriceHistory>;
  pokemonCardResistance?: Maybe<PokemonCardResistance>;
  pokemonCardResistances?: Maybe<Array<PokemonCardResistance>>;
  pokemonCardResistancesCount?: Maybe<Scalars['Int']['output']>;
  pokemonCardWeakness?: Maybe<PokemonCardWeakness>;
  pokemonCardWeaknesses?: Maybe<Array<PokemonCardWeakness>>;
  pokemonCardWeaknessesCount?: Maybe<Scalars['Int']['output']>;
  pokemonCards?: Maybe<Array<PokemonCard>>;
  pokemonCardsCount?: Maybe<Scalars['Int']['output']>;
  pokemonCollectionItem?: Maybe<PokemonCollectionItem>;
  pokemonCollectionItems?: Maybe<Array<PokemonCollectionItem>>;
  pokemonCollectionItemsCount?: Maybe<Scalars['Int']['output']>;
  pokemonSet?: Maybe<PokemonSet>;
  pokemonSets?: Maybe<Array<PokemonSet>>;
  pokemonSetsCount?: Maybe<Scalars['Int']['output']>;
  session?: Maybe<Session>;
  sessions?: Maybe<Array<Session>>;
  sessionsCount?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  usersCount?: Maybe<Scalars['Int']['output']>;
  verificationToken?: Maybe<VerificationToken>;
  verificationTokens?: Maybe<Array<VerificationToken>>;
  verificationTokensCount?: Maybe<Scalars['Int']['output']>;
};


export type QueryAccountArgs = {
  where: AccountWhereUniqueInput;
};


export type QueryAccountsArgs = {
  cursor?: InputMaybe<AccountWhereUniqueInput>;
  orderBy?: Array<AccountOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: AccountWhereInput;
};


export type QueryAccountsCountArgs = {
  where?: AccountWhereInput;
};


export type QueryAuthenticatorArgs = {
  where: AuthenticatorWhereUniqueInput;
};


export type QueryAuthenticatorsArgs = {
  cursor?: InputMaybe<AuthenticatorWhereUniqueInput>;
  orderBy?: Array<AuthenticatorOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: AuthenticatorWhereInput;
};


export type QueryAuthenticatorsCountArgs = {
  where?: AuthenticatorWhereInput;
};


export type QueryCmsRoleArgs = {
  where: CmsRoleWhereUniqueInput;
};


export type QueryCmsRolesArgs = {
  cursor?: InputMaybe<CmsRoleWhereUniqueInput>;
  orderBy?: Array<CmsRoleOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: CmsRoleWhereInput;
};


export type QueryCmsRolesCountArgs = {
  where?: CmsRoleWhereInput;
};


export type QueryCmsUserArgs = {
  where: CmsUserWhereUniqueInput;
};


export type QueryCmsUsersArgs = {
  cursor?: InputMaybe<CmsUserWhereUniqueInput>;
  orderBy?: Array<CmsUserOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: CmsUserWhereInput;
};


export type QueryCmsUsersCountArgs = {
  where?: CmsUserWhereInput;
};


export type QueryPokemonCardArgs = {
  where: PokemonCardWhereUniqueInput;
};


export type QueryPokemonCardAbilitiesArgs = {
  cursor?: InputMaybe<PokemonCardAbilityWhereUniqueInput>;
  orderBy?: Array<PokemonCardAbilityOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardAbilityWhereInput;
};


export type QueryPokemonCardAbilitiesCountArgs = {
  where?: PokemonCardAbilityWhereInput;
};


export type QueryPokemonCardAbilityArgs = {
  where: PokemonCardAbilityWhereUniqueInput;
};


export type QueryPokemonCardAttackArgs = {
  where: PokemonCardAttackWhereUniqueInput;
};


export type QueryPokemonCardAttacksArgs = {
  cursor?: InputMaybe<PokemonCardAttackWhereUniqueInput>;
  orderBy?: Array<PokemonCardAttackOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardAttackWhereInput;
};


export type QueryPokemonCardAttacksCountArgs = {
  where?: PokemonCardAttackWhereInput;
};


export type QueryPokemonCardPriceHistoriesArgs = {
  cursor?: InputMaybe<PokemonCardPriceHistoryWhereUniqueInput>;
  orderBy?: Array<PokemonCardPriceHistoryOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardPriceHistoryWhereInput;
};


export type QueryPokemonCardPriceHistoriesCountArgs = {
  where?: PokemonCardPriceHistoryWhereInput;
};


export type QueryPokemonCardPriceHistoryArgs = {
  where: PokemonCardPriceHistoryWhereUniqueInput;
};


export type QueryPokemonCardResistanceArgs = {
  where: PokemonCardResistanceWhereUniqueInput;
};


export type QueryPokemonCardResistancesArgs = {
  cursor?: InputMaybe<PokemonCardResistanceWhereUniqueInput>;
  orderBy?: Array<PokemonCardResistanceOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardResistanceWhereInput;
};


export type QueryPokemonCardResistancesCountArgs = {
  where?: PokemonCardResistanceWhereInput;
};


export type QueryPokemonCardWeaknessArgs = {
  where: PokemonCardWeaknessWhereUniqueInput;
};


export type QueryPokemonCardWeaknessesArgs = {
  cursor?: InputMaybe<PokemonCardWeaknessWhereUniqueInput>;
  orderBy?: Array<PokemonCardWeaknessOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardWeaknessWhereInput;
};


export type QueryPokemonCardWeaknessesCountArgs = {
  where?: PokemonCardWeaknessWhereInput;
};


export type QueryPokemonCardsArgs = {
  cursor?: InputMaybe<PokemonCardWhereUniqueInput>;
  orderBy?: Array<PokemonCardOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCardWhereInput;
};


export type QueryPokemonCardsCountArgs = {
  where?: PokemonCardWhereInput;
};


export type QueryPokemonCollectionItemArgs = {
  where: PokemonCollectionItemWhereUniqueInput;
};


export type QueryPokemonCollectionItemsArgs = {
  cursor?: InputMaybe<PokemonCollectionItemWhereUniqueInput>;
  orderBy?: Array<PokemonCollectionItemOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCollectionItemWhereInput;
};


export type QueryPokemonCollectionItemsCountArgs = {
  where?: PokemonCollectionItemWhereInput;
};


export type QueryPokemonSetArgs = {
  where: PokemonSetWhereUniqueInput;
};


export type QueryPokemonSetsArgs = {
  cursor?: InputMaybe<PokemonSetWhereUniqueInput>;
  orderBy?: Array<PokemonSetOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonSetWhereInput;
};


export type QueryPokemonSetsCountArgs = {
  where?: PokemonSetWhereInput;
};


export type QuerySessionArgs = {
  where: SessionWhereUniqueInput;
};


export type QuerySessionsArgs = {
  cursor?: InputMaybe<SessionWhereUniqueInput>;
  orderBy?: Array<SessionOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: SessionWhereInput;
};


export type QuerySessionsCountArgs = {
  where?: SessionWhereInput;
};


export type QueryUserArgs = {
  where: UserWhereUniqueInput;
};


export type QueryUsersArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>;
  orderBy?: Array<UserOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: UserWhereInput;
};


export type QueryUsersCountArgs = {
  where?: UserWhereInput;
};


export type QueryVerificationTokenArgs = {
  where: VerificationTokenWhereUniqueInput;
};


export type QueryVerificationTokensArgs = {
  cursor?: InputMaybe<VerificationTokenWhereUniqueInput>;
  orderBy?: Array<VerificationTokenOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: VerificationTokenWhereInput;
};


export type QueryVerificationTokensCountArgs = {
  where?: VerificationTokenWhereInput;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type Session = {
  __typename?: 'Session';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expires?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  sessionToken?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
};

export type SessionCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  expires?: InputMaybe<Scalars['DateTime']['input']>;
  sessionToken?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user?: InputMaybe<UserRelateToOneForCreateInput>;
};

export type SessionManyRelationFilter = {
  every?: InputMaybe<SessionWhereInput>;
  none?: InputMaybe<SessionWhereInput>;
  some?: InputMaybe<SessionWhereInput>;
};

export type SessionOrderByInput = {
  createdAt?: InputMaybe<OrderDirection>;
  expires?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  sessionToken?: InputMaybe<OrderDirection>;
  updatedAt?: InputMaybe<OrderDirection>;
};

export type SessionRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<SessionWhereUniqueInput>>;
  create?: InputMaybe<Array<SessionCreateInput>>;
};

export type SessionRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<SessionWhereUniqueInput>>;
  create?: InputMaybe<Array<SessionCreateInput>>;
  disconnect?: InputMaybe<Array<SessionWhereUniqueInput>>;
  set?: InputMaybe<Array<SessionWhereUniqueInput>>;
};

export type SessionUpdateArgs = {
  data: SessionUpdateInput;
  where: SessionWhereUniqueInput;
};

export type SessionUpdateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  expires?: InputMaybe<Scalars['DateTime']['input']>;
  sessionToken?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user?: InputMaybe<UserRelateToOneForUpdateInput>;
};

export type SessionWhereInput = {
  AND?: InputMaybe<Array<SessionWhereInput>>;
  NOT?: InputMaybe<Array<SessionWhereInput>>;
  OR?: InputMaybe<Array<SessionWhereInput>>;
  createdAt?: InputMaybe<DateTimeNullableFilter>;
  expires?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<IdFilter>;
  sessionToken?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeNullableFilter>;
  user?: InputMaybe<UserWhereInput>;
};

export type SessionWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  sessionToken?: InputMaybe<Scalars['String']['input']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<StringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  access?: Maybe<UserAccessType>;
  accounts?: Maybe<Array<Account>>;
  accountsCount?: Maybe<Scalars['Int']['output']>;
  active?: Maybe<Scalars['Boolean']['output']>;
  authenticators?: Maybe<Array<Authenticator>>;
  authenticatorsCount?: Maybe<Scalars['Int']['output']>;
  collections?: Maybe<Array<PokemonCollectionItem>>;
  collectionsCount?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sessions?: Maybe<Array<Session>>;
  sessionsCount?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};


export type UserAccountsArgs = {
  cursor?: InputMaybe<AccountWhereUniqueInput>;
  orderBy?: Array<AccountOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: AccountWhereInput;
};


export type UserAccountsCountArgs = {
  where?: AccountWhereInput;
};


export type UserAuthenticatorsArgs = {
  cursor?: InputMaybe<AuthenticatorWhereUniqueInput>;
  orderBy?: Array<AuthenticatorOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: AuthenticatorWhereInput;
};


export type UserAuthenticatorsCountArgs = {
  where?: AuthenticatorWhereInput;
};


export type UserCollectionsArgs = {
  cursor?: InputMaybe<PokemonCollectionItemWhereUniqueInput>;
  orderBy?: Array<PokemonCollectionItemOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PokemonCollectionItemWhereInput;
};


export type UserCollectionsCountArgs = {
  where?: PokemonCollectionItemWhereInput;
};


export type UserSessionsArgs = {
  cursor?: InputMaybe<SessionWhereUniqueInput>;
  orderBy?: Array<SessionOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: SessionWhereInput;
};


export type UserSessionsCountArgs = {
  where?: SessionWhereInput;
};

export enum UserAccessType {
  Freemium = 'freemium',
  Premium = 'premium'
}

export type UserAccessTypeNullableFilter = {
  equals?: InputMaybe<UserAccessType>;
  in?: InputMaybe<Array<UserAccessType>>;
  not?: InputMaybe<UserAccessTypeNullableFilter>;
  notIn?: InputMaybe<Array<UserAccessType>>;
};

export type UserCreateInput = {
  access?: InputMaybe<UserAccessType>;
  accounts?: InputMaybe<AccountRelateToManyForCreateInput>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  authenticators?: InputMaybe<AuthenticatorRelateToManyForCreateInput>;
  collections?: InputMaybe<PokemonCollectionItemRelateToManyForCreateInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailVerified?: InputMaybe<Scalars['DateTime']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  lastLoginAt?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sessions?: InputMaybe<SessionRelateToManyForCreateInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UserOrderByInput = {
  access?: InputMaybe<OrderDirection>;
  active?: InputMaybe<OrderDirection>;
  createdAt?: InputMaybe<OrderDirection>;
  email?: InputMaybe<OrderDirection>;
  emailVerified?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  image?: InputMaybe<OrderDirection>;
  lastLoginAt?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  updatedAt?: InputMaybe<OrderDirection>;
  username?: InputMaybe<OrderDirection>;
};

export type UserRelateToOneForCreateInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  create?: InputMaybe<UserCreateInput>;
};

export type UserRelateToOneForUpdateInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  create?: InputMaybe<UserCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserUpdateArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};

export type UserUpdateInput = {
  access?: InputMaybe<UserAccessType>;
  accounts?: InputMaybe<AccountRelateToManyForUpdateInput>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  authenticators?: InputMaybe<AuthenticatorRelateToManyForUpdateInput>;
  collections?: InputMaybe<PokemonCollectionItemRelateToManyForUpdateInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailVerified?: InputMaybe<Scalars['DateTime']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  lastLoginAt?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sessions?: InputMaybe<SessionRelateToManyForUpdateInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  access?: InputMaybe<UserAccessTypeNullableFilter>;
  accounts?: InputMaybe<AccountManyRelationFilter>;
  active?: InputMaybe<BooleanFilter>;
  authenticators?: InputMaybe<AuthenticatorManyRelationFilter>;
  collections?: InputMaybe<PokemonCollectionItemManyRelationFilter>;
  createdAt?: InputMaybe<DateTimeNullableFilter>;
  email?: InputMaybe<StringFilter>;
  emailVerified?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<IdFilter>;
  image?: InputMaybe<StringFilter>;
  lastLoginAt?: InputMaybe<DateTimeNullableFilter>;
  name?: InputMaybe<StringFilter>;
  sessions?: InputMaybe<SessionManyRelationFilter>;
  updatedAt?: InputMaybe<DateTimeNullableFilter>;
  username?: InputMaybe<StringFilter>;
};

export type UserWhereUniqueInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type VerificationToken = {
  __typename?: 'VerificationToken';
  expires?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type VerificationTokenCreateInput = {
  expires?: InputMaybe<Scalars['DateTime']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
};

export type VerificationTokenOrderByInput = {
  expires?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  identifier?: InputMaybe<OrderDirection>;
  token?: InputMaybe<OrderDirection>;
};

export type VerificationTokenUpdateArgs = {
  data: VerificationTokenUpdateInput;
  where: VerificationTokenWhereUniqueInput;
};

export type VerificationTokenUpdateInput = {
  expires?: InputMaybe<Scalars['DateTime']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
};

export type VerificationTokenWhereInput = {
  AND?: InputMaybe<Array<VerificationTokenWhereInput>>;
  NOT?: InputMaybe<Array<VerificationTokenWhereInput>>;
  OR?: InputMaybe<Array<VerificationTokenWhereInput>>;
  expires?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<IdFilter>;
  identifier?: InputMaybe<StringFilter>;
  token?: InputMaybe<StringFilter>;
};

export type VerificationTokenWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type PokemonCardItemFragment = { __typename?: 'PokemonCard', id: string, tcgSetId?: string | null, tcgCardId?: string | null, tcgCardId_variant_language?: string | null, name?: string | null, number?: string | null, variant?: string | null, imageSmallApiUrl?: string | null, imageLargeApiUrl?: string | null, imageSmallStorageUrl?: string | null, imageLargeStorageUrl?: string | null, supertype?: string | null, subtypes?: any | null, hp?: number | null, types?: any | null, evolvesFrom?: string | null, flavorText?: string | null, artist?: string | null, rarity?: string | null, retreatCost?: any | null, convertedRetreatCost?: number | null, nationalPokedexNumbers?: any | null, set?: { __typename?: 'PokemonSet', id: string, tcgSetId?: string | null, name?: string | null, series?: string | null, releaseDate?: any | null, logoApiUrl?: string | null, symbolApiUrl?: string | null } | null, abilities?: Array<{ __typename?: 'PokemonCardAbility', id: string, name?: string | null, text?: string | null, type?: string | null }> | null, attacks?: Array<{ __typename?: 'PokemonCardAttack', id: string, name?: string | null, text?: string | null, cost?: any | null, damage?: string | null, convertedEnergyCost?: number | null }> | null, weaknesses?: Array<{ __typename?: 'PokemonCardWeakness', id: string, type?: string | null, value?: string | null }> | null, resistances?: Array<{ __typename?: 'PokemonCardResistance', id: string, type?: string | null, value?: string | null }> | null };

export type GetPokemonCardQueryVariables = Exact<{
  where: PokemonCardWhereUniqueInput;
}>;


export type GetPokemonCardQuery = { __typename?: 'Query', pokemonCard?: { __typename?: 'PokemonCard', id: string, tcgSetId?: string | null, tcgCardId?: string | null, tcgCardId_variant_language?: string | null, name?: string | null, number?: string | null, variant?: string | null, imageSmallApiUrl?: string | null, imageLargeApiUrl?: string | null, imageSmallStorageUrl?: string | null, imageLargeStorageUrl?: string | null, supertype?: string | null, subtypes?: any | null, hp?: number | null, types?: any | null, evolvesFrom?: string | null, flavorText?: string | null, artist?: string | null, rarity?: string | null, retreatCost?: any | null, convertedRetreatCost?: number | null, nationalPokedexNumbers?: any | null, set?: { __typename?: 'PokemonSet', id: string, tcgSetId?: string | null, name?: string | null, series?: string | null, releaseDate?: any | null, logoApiUrl?: string | null, symbolApiUrl?: string | null } | null, abilities?: Array<{ __typename?: 'PokemonCardAbility', id: string, name?: string | null, text?: string | null, type?: string | null }> | null, attacks?: Array<{ __typename?: 'PokemonCardAttack', id: string, name?: string | null, text?: string | null, cost?: any | null, damage?: string | null, convertedEnergyCost?: number | null }> | null, weaknesses?: Array<{ __typename?: 'PokemonCardWeakness', id: string, type?: string | null, value?: string | null }> | null, resistances?: Array<{ __typename?: 'PokemonCardResistance', id: string, type?: string | null, value?: string | null }> | null } | null };

export type GetPokemonCardsQueryVariables = Exact<{
  where: PokemonCardWhereInput;
  orderBy: Array<PokemonCardOrderByInput> | PokemonCardOrderByInput;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip: Scalars['Int']['input'];
}>;


export type GetPokemonCardsQuery = { __typename?: 'Query', pokemonCards?: Array<{ __typename?: 'PokemonCard', id: string, tcgSetId?: string | null, tcgCardId?: string | null, tcgCardId_variant_language?: string | null, name?: string | null, number?: string | null, variant?: string | null, imageSmallApiUrl?: string | null, imageLargeApiUrl?: string | null, imageSmallStorageUrl?: string | null, imageLargeStorageUrl?: string | null, supertype?: string | null, subtypes?: any | null, hp?: number | null, types?: any | null, evolvesFrom?: string | null, flavorText?: string | null, artist?: string | null, rarity?: string | null, retreatCost?: any | null, convertedRetreatCost?: number | null, nationalPokedexNumbers?: any | null, set?: { __typename?: 'PokemonSet', id: string, tcgSetId?: string | null, name?: string | null, series?: string | null, releaseDate?: any | null, logoApiUrl?: string | null, symbolApiUrl?: string | null } | null, abilities?: Array<{ __typename?: 'PokemonCardAbility', id: string, name?: string | null, text?: string | null, type?: string | null }> | null, attacks?: Array<{ __typename?: 'PokemonCardAttack', id: string, name?: string | null, text?: string | null, cost?: any | null, damage?: string | null, convertedEnergyCost?: number | null }> | null, weaknesses?: Array<{ __typename?: 'PokemonCardWeakness', id: string, type?: string | null, value?: string | null }> | null, resistances?: Array<{ __typename?: 'PokemonCardResistance', id: string, type?: string | null, value?: string | null }> | null }> | null };

export type GetUserPokemonCollectionItemsQueryVariables = Exact<{
  where: PokemonCollectionItemWhereInput;
  orderBy: Array<PokemonCollectionItemOrderByInput> | PokemonCollectionItemOrderByInput;
  take: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
}>;


export type GetUserPokemonCollectionItemsQuery = { __typename?: 'Query', pokemonCollectionItems?: Array<{ __typename?: 'PokemonCollectionItem', id: string, acquiredAt?: any | null, price?: any | null, quantity?: number | null, condition?: string | null, gradingCompany?: string | null, gradingRating?: string | null, card?: { __typename?: 'PokemonCard', id: string, tcgSetId?: string | null, tcgCardId?: string | null, number?: string | null, variant?: string | null, name?: string | null, rarity?: string | null, imageSmallStorageUrl?: string | null, imageSmallApiUrl?: string | null, imageLargeStorageUrl?: string | null, imageLargeApiUrl?: string | null, set?: { __typename?: 'PokemonSet', id: string, name?: string | null, series?: string | null } | null } | null }> | null };

export type GetUserPokemonCollectionItemsForCardQueryVariables = Exact<{
  where: PokemonCollectionItemWhereInput;
  orderBy: Array<PokemonCollectionItemOrderByInput> | PokemonCollectionItemOrderByInput;
  take: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
}>;


export type GetUserPokemonCollectionItemsForCardQuery = { __typename?: 'Query', pokemonCollectionItems?: Array<{ __typename?: 'PokemonCollectionItem', id: string, price?: any | null, quantity?: number | null, condition?: string | null, gradingCompany?: string | null, gradingRating?: string | null, notes?: string | null, acquiredAt?: any | null, card?: { __typename?: 'PokemonCard', id: string, name?: string | null, imageSmallApiUrl?: string | null, imageSmallStorageUrl?: string | null } | null }> | null };

export type GetPokemonCollectionCardQueryVariables = Exact<{
  cardWhere: PokemonCardWhereUniqueInput;
}>;


export type GetPokemonCollectionCardQuery = { __typename?: 'Query', pokemonCard?: { __typename?: 'PokemonCard', id: string, collections?: Array<{ __typename?: 'PokemonCollectionItem', id: string, user?: { __typename?: 'User', id: string } | null }> | null } | null };

export type AddCardToPokemonCollectionMutationVariables = Exact<{
  data: PokemonCollectionItemCreateInput;
}>;


export type AddCardToPokemonCollectionMutation = { __typename?: 'Mutation', createPokemonCollectionItem?: { __typename?: 'PokemonCollectionItem', id: string, card?: { __typename?: 'PokemonCard', id: string } | null } | null };

export type UpdateCardInCollectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: PokemonCollectionItemUpdateInput;
}>;


export type UpdateCardInCollectionMutation = { __typename?: 'Mutation', updatePokemonCollectionItem?: { __typename?: 'PokemonCollectionItem', id: string, price?: any | null, quantity?: number | null, condition?: string | null, gradingCompany?: string | null, gradingRating?: string | null, notes?: string | null, acquiredAt?: any | null, card?: { __typename?: 'PokemonCard', id: string, name?: string | null } | null } | null };

export type RemoveCardFromCollectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveCardFromCollectionMutation = { __typename?: 'Mutation', deletePokemonCollectionItem?: { __typename?: 'PokemonCollectionItem', id: string } | null };

export type PokemonSetItemFragment = { __typename?: 'PokemonSet', id: string, tcgSetId?: string | null, name?: string | null, series?: string | null, language?: string | null, releaseDate?: any | null, ptcgoCode?: string | null, logoApiUrl?: string | null, logoStorageUrl?: string | null, total?: number | null, printedTotal?: number | null };

export type GetPokemonSetQueryVariables = Exact<{
  where: PokemonSetWhereUniqueInput;
}>;


export type GetPokemonSetQuery = { __typename?: 'Query', pokemonSet?: { __typename?: 'PokemonSet', id: string, tcgSetId?: string | null, name?: string | null, series?: string | null, language?: string | null, releaseDate?: any | null, ptcgoCode?: string | null, logoApiUrl?: string | null, logoStorageUrl?: string | null, total?: number | null, printedTotal?: number | null } | null };

export type GetPokemonSetsQueryVariables = Exact<{
  where: PokemonSetWhereInput;
  orderBy: Array<PokemonSetOrderByInput> | PokemonSetOrderByInput;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip: Scalars['Int']['input'];
}>;


export type GetPokemonSetsQuery = { __typename?: 'Query', pokemonSets?: Array<{ __typename?: 'PokemonSet', id: string, tcgSetId?: string | null, name?: string | null, series?: string | null, language?: string | null, releaseDate?: any | null, ptcgoCode?: string | null, logoApiUrl?: string | null, logoStorageUrl?: string | null, total?: number | null, printedTotal?: number | null }> | null };

export const PokemonCardItemFragmentDoc = gql`
    fragment PokemonCardItem on PokemonCard {
  id
  tcgSetId
  tcgCardId
  tcgCardId_variant_language
  name
  number
  variant
  imageSmallApiUrl
  imageLargeApiUrl
  imageSmallStorageUrl
  imageLargeStorageUrl
  supertype
  subtypes
  hp
  types
  evolvesFrom
  flavorText
  artist
  rarity
  retreatCost
  convertedRetreatCost
  nationalPokedexNumbers
  set {
    id
    tcgSetId
    name
    series
    releaseDate
    logoApiUrl
    symbolApiUrl
  }
  abilities {
    id
    name
    text
    type
  }
  attacks {
    id
    name
    text
    cost
    damage
    convertedEnergyCost
  }
  weaknesses {
    id
    type
    value
  }
  resistances {
    id
    type
    value
  }
}
    `;
export const PokemonSetItemFragmentDoc = gql`
    fragment PokemonSetItem on PokemonSet {
  id
  tcgSetId
  name
  series
  language
  releaseDate
  ptcgoCode
  logoApiUrl
  logoStorageUrl
  total
  printedTotal
}
    `;
export const GetPokemonCardDocument = gql`
    query GetPokemonCard($where: PokemonCardWhereUniqueInput!) {
  pokemonCard(where: $where) {
    ...PokemonCardItem
  }
}
    ${PokemonCardItemFragmentDoc}`;

/**
 * __useGetPokemonCardQuery__
 *
 * To run a query within a React component, call `useGetPokemonCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPokemonCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPokemonCardQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetPokemonCardQuery(baseOptions: Apollo.QueryHookOptions<GetPokemonCardQuery, GetPokemonCardQueryVariables> & ({ variables: GetPokemonCardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPokemonCardQuery, GetPokemonCardQueryVariables>(GetPokemonCardDocument, options);
      }
export function useGetPokemonCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPokemonCardQuery, GetPokemonCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPokemonCardQuery, GetPokemonCardQueryVariables>(GetPokemonCardDocument, options);
        }
export function useGetPokemonCardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPokemonCardQuery, GetPokemonCardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPokemonCardQuery, GetPokemonCardQueryVariables>(GetPokemonCardDocument, options);
        }
export type GetPokemonCardQueryHookResult = ReturnType<typeof useGetPokemonCardQuery>;
export type GetPokemonCardLazyQueryHookResult = ReturnType<typeof useGetPokemonCardLazyQuery>;
export type GetPokemonCardSuspenseQueryHookResult = ReturnType<typeof useGetPokemonCardSuspenseQuery>;
export type GetPokemonCardQueryResult = Apollo.QueryResult<GetPokemonCardQuery, GetPokemonCardQueryVariables>;
export const GetPokemonCardsDocument = gql`
    query GetPokemonCards($where: PokemonCardWhereInput!, $orderBy: [PokemonCardOrderByInput!]!, $take: Int, $skip: Int!) {
  pokemonCards(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
    ...PokemonCardItem
  }
}
    ${PokemonCardItemFragmentDoc}`;

/**
 * __useGetPokemonCardsQuery__
 *
 * To run a query within a React component, call `useGetPokemonCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPokemonCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPokemonCardsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetPokemonCardsQuery(baseOptions: Apollo.QueryHookOptions<GetPokemonCardsQuery, GetPokemonCardsQueryVariables> & ({ variables: GetPokemonCardsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPokemonCardsQuery, GetPokemonCardsQueryVariables>(GetPokemonCardsDocument, options);
      }
export function useGetPokemonCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPokemonCardsQuery, GetPokemonCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPokemonCardsQuery, GetPokemonCardsQueryVariables>(GetPokemonCardsDocument, options);
        }
export function useGetPokemonCardsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPokemonCardsQuery, GetPokemonCardsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPokemonCardsQuery, GetPokemonCardsQueryVariables>(GetPokemonCardsDocument, options);
        }
export type GetPokemonCardsQueryHookResult = ReturnType<typeof useGetPokemonCardsQuery>;
export type GetPokemonCardsLazyQueryHookResult = ReturnType<typeof useGetPokemonCardsLazyQuery>;
export type GetPokemonCardsSuspenseQueryHookResult = ReturnType<typeof useGetPokemonCardsSuspenseQuery>;
export type GetPokemonCardsQueryResult = Apollo.QueryResult<GetPokemonCardsQuery, GetPokemonCardsQueryVariables>;
export const GetUserPokemonCollectionItemsDocument = gql`
    query GetUserPokemonCollectionItems($where: PokemonCollectionItemWhereInput!, $orderBy: [PokemonCollectionItemOrderByInput!]!, $take: Int!, $skip: Int!) {
  pokemonCollectionItems(
    where: $where
    orderBy: $orderBy
    take: $take
    skip: $skip
  ) {
    id
    acquiredAt
    price
    quantity
    condition
    gradingCompany
    gradingRating
    card {
      id
      tcgSetId
      tcgCardId
      number
      variant
      name
      rarity
      imageSmallStorageUrl
      imageSmallApiUrl
      imageLargeStorageUrl
      imageLargeApiUrl
      set {
        id
        name
        series
      }
    }
  }
}
    `;

/**
 * __useGetUserPokemonCollectionItemsQuery__
 *
 * To run a query within a React component, call `useGetUserPokemonCollectionItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPokemonCollectionItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPokemonCollectionItemsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetUserPokemonCollectionItemsQuery(baseOptions: Apollo.QueryHookOptions<GetUserPokemonCollectionItemsQuery, GetUserPokemonCollectionItemsQueryVariables> & ({ variables: GetUserPokemonCollectionItemsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPokemonCollectionItemsQuery, GetUserPokemonCollectionItemsQueryVariables>(GetUserPokemonCollectionItemsDocument, options);
      }
export function useGetUserPokemonCollectionItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPokemonCollectionItemsQuery, GetUserPokemonCollectionItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPokemonCollectionItemsQuery, GetUserPokemonCollectionItemsQueryVariables>(GetUserPokemonCollectionItemsDocument, options);
        }
export function useGetUserPokemonCollectionItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserPokemonCollectionItemsQuery, GetUserPokemonCollectionItemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserPokemonCollectionItemsQuery, GetUserPokemonCollectionItemsQueryVariables>(GetUserPokemonCollectionItemsDocument, options);
        }
export type GetUserPokemonCollectionItemsQueryHookResult = ReturnType<typeof useGetUserPokemonCollectionItemsQuery>;
export type GetUserPokemonCollectionItemsLazyQueryHookResult = ReturnType<typeof useGetUserPokemonCollectionItemsLazyQuery>;
export type GetUserPokemonCollectionItemsSuspenseQueryHookResult = ReturnType<typeof useGetUserPokemonCollectionItemsSuspenseQuery>;
export type GetUserPokemonCollectionItemsQueryResult = Apollo.QueryResult<GetUserPokemonCollectionItemsQuery, GetUserPokemonCollectionItemsQueryVariables>;
export const GetUserPokemonCollectionItemsForCardDocument = gql`
    query GetUserPokemonCollectionItemsForCard($where: PokemonCollectionItemWhereInput!, $orderBy: [PokemonCollectionItemOrderByInput!]!, $take: Int!, $skip: Int!) {
  pokemonCollectionItems(
    where: $where
    orderBy: $orderBy
    take: $take
    skip: $skip
  ) {
    id
    price
    quantity
    condition
    gradingCompany
    gradingRating
    notes
    acquiredAt
    card {
      id
      name
      imageSmallApiUrl
      imageSmallStorageUrl
    }
  }
}
    `;

/**
 * __useGetUserPokemonCollectionItemsForCardQuery__
 *
 * To run a query within a React component, call `useGetUserPokemonCollectionItemsForCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPokemonCollectionItemsForCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPokemonCollectionItemsForCardQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetUserPokemonCollectionItemsForCardQuery(baseOptions: Apollo.QueryHookOptions<GetUserPokemonCollectionItemsForCardQuery, GetUserPokemonCollectionItemsForCardQueryVariables> & ({ variables: GetUserPokemonCollectionItemsForCardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPokemonCollectionItemsForCardQuery, GetUserPokemonCollectionItemsForCardQueryVariables>(GetUserPokemonCollectionItemsForCardDocument, options);
      }
export function useGetUserPokemonCollectionItemsForCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPokemonCollectionItemsForCardQuery, GetUserPokemonCollectionItemsForCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPokemonCollectionItemsForCardQuery, GetUserPokemonCollectionItemsForCardQueryVariables>(GetUserPokemonCollectionItemsForCardDocument, options);
        }
export function useGetUserPokemonCollectionItemsForCardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserPokemonCollectionItemsForCardQuery, GetUserPokemonCollectionItemsForCardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserPokemonCollectionItemsForCardQuery, GetUserPokemonCollectionItemsForCardQueryVariables>(GetUserPokemonCollectionItemsForCardDocument, options);
        }
export type GetUserPokemonCollectionItemsForCardQueryHookResult = ReturnType<typeof useGetUserPokemonCollectionItemsForCardQuery>;
export type GetUserPokemonCollectionItemsForCardLazyQueryHookResult = ReturnType<typeof useGetUserPokemonCollectionItemsForCardLazyQuery>;
export type GetUserPokemonCollectionItemsForCardSuspenseQueryHookResult = ReturnType<typeof useGetUserPokemonCollectionItemsForCardSuspenseQuery>;
export type GetUserPokemonCollectionItemsForCardQueryResult = Apollo.QueryResult<GetUserPokemonCollectionItemsForCardQuery, GetUserPokemonCollectionItemsForCardQueryVariables>;
export const GetPokemonCollectionCardDocument = gql`
    query GetPokemonCollectionCard($cardWhere: PokemonCardWhereUniqueInput!) {
  pokemonCard(where: $cardWhere) {
    id
    collections {
      id
      user {
        id
      }
    }
  }
}
    `;

/**
 * __useGetPokemonCollectionCardQuery__
 *
 * To run a query within a React component, call `useGetPokemonCollectionCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPokemonCollectionCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPokemonCollectionCardQuery({
 *   variables: {
 *      cardWhere: // value for 'cardWhere'
 *   },
 * });
 */
export function useGetPokemonCollectionCardQuery(baseOptions: Apollo.QueryHookOptions<GetPokemonCollectionCardQuery, GetPokemonCollectionCardQueryVariables> & ({ variables: GetPokemonCollectionCardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPokemonCollectionCardQuery, GetPokemonCollectionCardQueryVariables>(GetPokemonCollectionCardDocument, options);
      }
export function useGetPokemonCollectionCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPokemonCollectionCardQuery, GetPokemonCollectionCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPokemonCollectionCardQuery, GetPokemonCollectionCardQueryVariables>(GetPokemonCollectionCardDocument, options);
        }
export function useGetPokemonCollectionCardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPokemonCollectionCardQuery, GetPokemonCollectionCardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPokemonCollectionCardQuery, GetPokemonCollectionCardQueryVariables>(GetPokemonCollectionCardDocument, options);
        }
export type GetPokemonCollectionCardQueryHookResult = ReturnType<typeof useGetPokemonCollectionCardQuery>;
export type GetPokemonCollectionCardLazyQueryHookResult = ReturnType<typeof useGetPokemonCollectionCardLazyQuery>;
export type GetPokemonCollectionCardSuspenseQueryHookResult = ReturnType<typeof useGetPokemonCollectionCardSuspenseQuery>;
export type GetPokemonCollectionCardQueryResult = Apollo.QueryResult<GetPokemonCollectionCardQuery, GetPokemonCollectionCardQueryVariables>;
export const AddCardToPokemonCollectionDocument = gql`
    mutation AddCardToPokemonCollection($data: PokemonCollectionItemCreateInput!) {
  createPokemonCollectionItem(data: $data) {
    id
    card {
      id
    }
  }
}
    `;
export type AddCardToPokemonCollectionMutationFn = Apollo.MutationFunction<AddCardToPokemonCollectionMutation, AddCardToPokemonCollectionMutationVariables>;

/**
 * __useAddCardToPokemonCollectionMutation__
 *
 * To run a mutation, you first call `useAddCardToPokemonCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCardToPokemonCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCardToPokemonCollectionMutation, { data, loading, error }] = useAddCardToPokemonCollectionMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddCardToPokemonCollectionMutation(baseOptions?: Apollo.MutationHookOptions<AddCardToPokemonCollectionMutation, AddCardToPokemonCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCardToPokemonCollectionMutation, AddCardToPokemonCollectionMutationVariables>(AddCardToPokemonCollectionDocument, options);
      }
export type AddCardToPokemonCollectionMutationHookResult = ReturnType<typeof useAddCardToPokemonCollectionMutation>;
export type AddCardToPokemonCollectionMutationResult = Apollo.MutationResult<AddCardToPokemonCollectionMutation>;
export type AddCardToPokemonCollectionMutationOptions = Apollo.BaseMutationOptions<AddCardToPokemonCollectionMutation, AddCardToPokemonCollectionMutationVariables>;
export const UpdateCardInCollectionDocument = gql`
    mutation UpdateCardInCollection($id: ID!, $data: PokemonCollectionItemUpdateInput!) {
  updatePokemonCollectionItem(where: {id: $id}, data: $data) {
    id
    price
    quantity
    condition
    gradingCompany
    gradingRating
    notes
    acquiredAt
    card {
      id
      name
    }
  }
}
    `;
export type UpdateCardInCollectionMutationFn = Apollo.MutationFunction<UpdateCardInCollectionMutation, UpdateCardInCollectionMutationVariables>;

/**
 * __useUpdateCardInCollectionMutation__
 *
 * To run a mutation, you first call `useUpdateCardInCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardInCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardInCollectionMutation, { data, loading, error }] = useUpdateCardInCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateCardInCollectionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCardInCollectionMutation, UpdateCardInCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCardInCollectionMutation, UpdateCardInCollectionMutationVariables>(UpdateCardInCollectionDocument, options);
      }
export type UpdateCardInCollectionMutationHookResult = ReturnType<typeof useUpdateCardInCollectionMutation>;
export type UpdateCardInCollectionMutationResult = Apollo.MutationResult<UpdateCardInCollectionMutation>;
export type UpdateCardInCollectionMutationOptions = Apollo.BaseMutationOptions<UpdateCardInCollectionMutation, UpdateCardInCollectionMutationVariables>;
export const RemoveCardFromCollectionDocument = gql`
    mutation RemoveCardFromCollection($id: ID!) {
  deletePokemonCollectionItem(where: {id: $id}) {
    id
  }
}
    `;
export type RemoveCardFromCollectionMutationFn = Apollo.MutationFunction<RemoveCardFromCollectionMutation, RemoveCardFromCollectionMutationVariables>;

/**
 * __useRemoveCardFromCollectionMutation__
 *
 * To run a mutation, you first call `useRemoveCardFromCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCardFromCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCardFromCollectionMutation, { data, loading, error }] = useRemoveCardFromCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveCardFromCollectionMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCardFromCollectionMutation, RemoveCardFromCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveCardFromCollectionMutation, RemoveCardFromCollectionMutationVariables>(RemoveCardFromCollectionDocument, options);
      }
export type RemoveCardFromCollectionMutationHookResult = ReturnType<typeof useRemoveCardFromCollectionMutation>;
export type RemoveCardFromCollectionMutationResult = Apollo.MutationResult<RemoveCardFromCollectionMutation>;
export type RemoveCardFromCollectionMutationOptions = Apollo.BaseMutationOptions<RemoveCardFromCollectionMutation, RemoveCardFromCollectionMutationVariables>;
export const GetPokemonSetDocument = gql`
    query GetPokemonSet($where: PokemonSetWhereUniqueInput!) {
  pokemonSet(where: $where) {
    ...PokemonSetItem
  }
}
    ${PokemonSetItemFragmentDoc}`;

/**
 * __useGetPokemonSetQuery__
 *
 * To run a query within a React component, call `useGetPokemonSetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPokemonSetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPokemonSetQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetPokemonSetQuery(baseOptions: Apollo.QueryHookOptions<GetPokemonSetQuery, GetPokemonSetQueryVariables> & ({ variables: GetPokemonSetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPokemonSetQuery, GetPokemonSetQueryVariables>(GetPokemonSetDocument, options);
      }
export function useGetPokemonSetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPokemonSetQuery, GetPokemonSetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPokemonSetQuery, GetPokemonSetQueryVariables>(GetPokemonSetDocument, options);
        }
export function useGetPokemonSetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPokemonSetQuery, GetPokemonSetQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPokemonSetQuery, GetPokemonSetQueryVariables>(GetPokemonSetDocument, options);
        }
export type GetPokemonSetQueryHookResult = ReturnType<typeof useGetPokemonSetQuery>;
export type GetPokemonSetLazyQueryHookResult = ReturnType<typeof useGetPokemonSetLazyQuery>;
export type GetPokemonSetSuspenseQueryHookResult = ReturnType<typeof useGetPokemonSetSuspenseQuery>;
export type GetPokemonSetQueryResult = Apollo.QueryResult<GetPokemonSetQuery, GetPokemonSetQueryVariables>;
export const GetPokemonSetsDocument = gql`
    query GetPokemonSets($where: PokemonSetWhereInput!, $orderBy: [PokemonSetOrderByInput!]!, $take: Int, $skip: Int!) {
  pokemonSets(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
    ...PokemonSetItem
  }
}
    ${PokemonSetItemFragmentDoc}`;

/**
 * __useGetPokemonSetsQuery__
 *
 * To run a query within a React component, call `useGetPokemonSetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPokemonSetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPokemonSetsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetPokemonSetsQuery(baseOptions: Apollo.QueryHookOptions<GetPokemonSetsQuery, GetPokemonSetsQueryVariables> & ({ variables: GetPokemonSetsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPokemonSetsQuery, GetPokemonSetsQueryVariables>(GetPokemonSetsDocument, options);
      }
export function useGetPokemonSetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPokemonSetsQuery, GetPokemonSetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPokemonSetsQuery, GetPokemonSetsQueryVariables>(GetPokemonSetsDocument, options);
        }
export function useGetPokemonSetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPokemonSetsQuery, GetPokemonSetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPokemonSetsQuery, GetPokemonSetsQueryVariables>(GetPokemonSetsDocument, options);
        }
export type GetPokemonSetsQueryHookResult = ReturnType<typeof useGetPokemonSetsQuery>;
export type GetPokemonSetsLazyQueryHookResult = ReturnType<typeof useGetPokemonSetsLazyQuery>;
export type GetPokemonSetsSuspenseQueryHookResult = ReturnType<typeof useGetPokemonSetsSuspenseQuery>;
export type GetPokemonSetsQueryResult = Apollo.QueryResult<GetPokemonSetsQuery, GetPokemonSetsQueryVariables>;