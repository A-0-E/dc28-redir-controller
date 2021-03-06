import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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


export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Config: ResolverTypeWrapper<Config>;
  Team: ResolverTypeWrapper<Team>;
  Service: ResolverTypeWrapper<Service>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ServiceState: ResolverTypeWrapper<ServiceState>;
  State: State;
  Date: ResolverTypeWrapper<Scalars['Date']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Mutation: {};
  String: Scalars['String'];
  Subscription: {};
  Boolean: Scalars['Boolean'];
  Config: Config;
  Team: Team;
  Service: Service;
  Int: Scalars['Int'];
  ServiceState: ServiceState;
  Date: Scalars['Date'];
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  config?: Resolver<ResolversTypes['Config'], ParentType, ContextType>;
  allState?: Resolver<Array<ResolversTypes['ServiceState']>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  setServiceState?: Resolver<Maybe<Array<ResolversTypes['ServiceState']>>, ParentType, ContextType, RequireFields<MutationSetServiceStateArgs, 'serviceName' | 'state'>>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  config?: SubscriptionResolver<ResolversTypes['Config'], "config", ParentType, ContextType>;
  serviceStateChanged?: SubscriptionResolver<ResolversTypes['ServiceState'], "serviceStateChanged", ParentType, ContextType>;
  forceReload?: SubscriptionResolver<ResolversTypes['Boolean'], "forceReload", ParentType, ContextType>;
}>;

export type ConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['Config'] = ResolversParentTypes['Config']> = ResolversObject<{
  team?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  service?: Resolver<Array<ResolversTypes['Service']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ip?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type ServiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Service'] = ResolversParentTypes['Service']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  normalPort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stealthPort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type ServiceStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['ServiceState'] = ResolversParentTypes['ServiceState']> = ResolversObject<{
  team?: Resolver<ResolversTypes['Team'], ParentType, ContextType>;
  service?: Resolver<ResolversTypes['Service'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['State'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Config?: ConfigResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  Service?: ServiceResolvers<ContextType>;
  ServiceState?: ServiceStateResolvers<ContextType>;
  Date?: GraphQLScalarType;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
