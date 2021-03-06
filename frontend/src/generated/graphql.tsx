import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Query = {
  __typename?: 'Query';
  config: Config;
  allState: Array<ServiceState>;
};

export type Mutation = {
  __typename?: 'Mutation';
  setServiceState?: Maybe<Array<ServiceState>>;
};


export type MutationSetServiceStateArgs = {
  teamName?: Maybe<Scalars['String']>;
  serviceName: Scalars['String'];
  state: State;
};

export type Subscription = {
  __typename?: 'Subscription';
  config: Config;
  serviceStateChanged: ServiceState;
  forceReload: Scalars['Boolean'];
};

export type Config = {
  __typename?: 'Config';
  team: Array<Team>;
  service: Array<Service>;
  /** updatedAt to prevent data race between subscription and query */
  updatedAt: Scalars['Date'];
};

export type Team = {
  __typename?: 'Team';
  name: Scalars['String'];
  ip: Scalars['String'];
};

export type Service = {
  __typename?: 'Service';
  name: Scalars['String'];
  normalPort: Scalars['Int'];
  stealthPort: Scalars['Int'];
};

export type ServiceState = {
  __typename?: 'ServiceState';
  team: Team;
  service: Service;
  state: State;
  /** updatedAt to prevent data race between subscription and query */
  updatedAt: Scalars['Date'];
};

export enum State {
  Ignore = 'Ignore',
  Normal = 'Normal',
  Stealth = 'Stealth'
}


export type ConfigFragment = (
  { __typename?: 'Config' }
  & Pick<Config, 'updatedAt'>
  & { team: Array<(
    { __typename?: 'Team' }
    & Pick<Team, 'name' | 'ip'>
  )>, service: Array<(
    { __typename?: 'Service' }
    & Pick<Service, 'name' | 'normalPort' | 'stealthPort'>
  )> }
);

export type InitQueryVariables = Exact<{ [key: string]: never; }>;


export type InitQuery = (
  { __typename?: 'Query' }
  & { config: (
    { __typename?: 'Config' }
    & ConfigFragment
  ), allState: Array<(
    { __typename?: 'ServiceState' }
    & ServiceStateFragment
  )> }
);

export type SubscriptionConfigSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscriptionConfigSubscription = (
  { __typename?: 'Subscription' }
  & { config: (
    { __typename?: 'Config' }
    & ConfigFragment
  ) }
);

export type SubscriptionServiceStateSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscriptionServiceStateSubscription = (
  { __typename?: 'Subscription' }
  & { serviceStateChanged: (
    { __typename?: 'ServiceState' }
    & ServiceStateFragment
  ) }
);

export type SubscriptionReloadSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscriptionReloadSubscription = (
  { __typename?: 'Subscription' }
  & Pick<Subscription, 'forceReload'>
);

export type ServiceStateFragment = (
  { __typename?: 'ServiceState' }
  & Pick<ServiceState, 'state' | 'updatedAt'>
  & { team: (
    { __typename?: 'Team' }
    & Pick<Team, 'name'>
  ), service: (
    { __typename?: 'Service' }
    & Pick<Service, 'name'>
  ) }
);

export type SetServiceStateMutationVariables = Exact<{
  teamName?: Maybe<Scalars['String']>;
  serviceName: Scalars['String'];
  state: State;
}>;


export type SetServiceStateMutation = (
  { __typename?: 'Mutation' }
  & { setServiceState?: Maybe<Array<(
    { __typename?: 'ServiceState' }
    & ServiceStateFragment
  )>> }
);

export const ConfigFragmentDoc = gql`
    fragment Config on Config {
  team {
    name
    ip
  }
  service {
    name
    normalPort
    stealthPort
  }
  updatedAt
}
    `;
export const ServiceStateFragmentDoc = gql`
    fragment ServiceState on ServiceState {
  team {
    name
  }
  service {
    name
  }
  state
  updatedAt
}
    `;
export const InitDocument = gql`
    query Init {
  config {
    ...Config
  }
  allState {
    ...ServiceState
  }
}
    ${ConfigFragmentDoc}
${ServiceStateFragmentDoc}`;

/**
 * __useInitQuery__
 *
 * To run a query within a React component, call `useInitQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitQuery({
 *   variables: {
 *   },
 * });
 */
export function useInitQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<InitQuery, InitQueryVariables>) {
        return ApolloReactHooks.useQuery<InitQuery, InitQueryVariables>(InitDocument, baseOptions);
      }
export function useInitLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<InitQuery, InitQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<InitQuery, InitQueryVariables>(InitDocument, baseOptions);
        }
export type InitQueryHookResult = ReturnType<typeof useInitQuery>;
export type InitLazyQueryHookResult = ReturnType<typeof useInitLazyQuery>;
export type InitQueryResult = ApolloReactCommon.QueryResult<InitQuery, InitQueryVariables>;
export const SubscriptionConfigDocument = gql`
    subscription SubscriptionConfig {
  config {
    ...Config
  }
}
    ${ConfigFragmentDoc}`;

/**
 * __useSubscriptionConfigSubscription__
 *
 * To run a query within a React component, call `useSubscriptionConfigSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionConfigSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionConfigSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscriptionConfigSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<SubscriptionConfigSubscription, SubscriptionConfigSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<SubscriptionConfigSubscription, SubscriptionConfigSubscriptionVariables>(SubscriptionConfigDocument, baseOptions);
      }
export type SubscriptionConfigSubscriptionHookResult = ReturnType<typeof useSubscriptionConfigSubscription>;
export type SubscriptionConfigSubscriptionResult = ApolloReactCommon.SubscriptionResult<SubscriptionConfigSubscription>;
export const SubscriptionServiceStateDocument = gql`
    subscription SubscriptionServiceState {
  serviceStateChanged {
    ...ServiceState
  }
}
    ${ServiceStateFragmentDoc}`;

/**
 * __useSubscriptionServiceStateSubscription__
 *
 * To run a query within a React component, call `useSubscriptionServiceStateSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionServiceStateSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionServiceStateSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscriptionServiceStateSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<SubscriptionServiceStateSubscription, SubscriptionServiceStateSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<SubscriptionServiceStateSubscription, SubscriptionServiceStateSubscriptionVariables>(SubscriptionServiceStateDocument, baseOptions);
      }
export type SubscriptionServiceStateSubscriptionHookResult = ReturnType<typeof useSubscriptionServiceStateSubscription>;
export type SubscriptionServiceStateSubscriptionResult = ApolloReactCommon.SubscriptionResult<SubscriptionServiceStateSubscription>;
export const SubscriptionReloadDocument = gql`
    subscription SubscriptionReload {
  forceReload
}
    `;

/**
 * __useSubscriptionReloadSubscription__
 *
 * To run a query within a React component, call `useSubscriptionReloadSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionReloadSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionReloadSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscriptionReloadSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<SubscriptionReloadSubscription, SubscriptionReloadSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<SubscriptionReloadSubscription, SubscriptionReloadSubscriptionVariables>(SubscriptionReloadDocument, baseOptions);
      }
export type SubscriptionReloadSubscriptionHookResult = ReturnType<typeof useSubscriptionReloadSubscription>;
export type SubscriptionReloadSubscriptionResult = ApolloReactCommon.SubscriptionResult<SubscriptionReloadSubscription>;
export const SetServiceStateDocument = gql`
    mutation SetServiceState($teamName: String, $serviceName: String!, $state: State!) {
  setServiceState(teamName: $teamName, serviceName: $serviceName, state: $state) {
    ...ServiceState
  }
}
    ${ServiceStateFragmentDoc}`;
export type SetServiceStateMutationFn = ApolloReactCommon.MutationFunction<SetServiceStateMutation, SetServiceStateMutationVariables>;

/**
 * __useSetServiceStateMutation__
 *
 * To run a mutation, you first call `useSetServiceStateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetServiceStateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setServiceStateMutation, { data, loading, error }] = useSetServiceStateMutation({
 *   variables: {
 *      teamName: // value for 'teamName'
 *      serviceName: // value for 'serviceName'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useSetServiceStateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetServiceStateMutation, SetServiceStateMutationVariables>) {
        return ApolloReactHooks.useMutation<SetServiceStateMutation, SetServiceStateMutationVariables>(SetServiceStateDocument, baseOptions);
      }
export type SetServiceStateMutationHookResult = ReturnType<typeof useSetServiceStateMutation>;
export type SetServiceStateMutationResult = ApolloReactCommon.MutationResult<SetServiceStateMutation>;
export type SetServiceStateMutationOptions = ApolloReactCommon.BaseMutationOptions<SetServiceStateMutation, SetServiceStateMutationVariables>;