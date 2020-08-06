import React from 'react'
import { ApolloClient, InMemoryCache, split, HttpLink, ApolloProvider as Provider } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

const wsLink = new WebSocketLink({
  uri: `${window.location.protocol.replace('http', 'ws')}//${window.location.host}/`,
  options: {
    reconnect: true
  }
})

const httpLink = new HttpLink({
  uri: '/'
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
)

type UpdatedAt = { updatedAt: number }
const MergeByUpdatedAt = {
  fields: {
    updatedAt: {
      merge(existing: UpdatedAt, incoming: UpdatedAt) {
        return existing.updatedAt < incoming.updatedAt ? incoming : existing
      }
    }
  }
}

const client = new ApolloClient({
  uri: '/',
  cache: new InMemoryCache({
    typePolicies: {
      Team: {
        keyFields: ['name'],
        ...MergeByUpdatedAt,
      },
      Service: {
        keyFields: ['name'],
        ...MergeByUpdatedAt,
      },
      ServiceState: {
        ...MergeByUpdatedAt,
      }
    }
  }),
  link: splitLink,
})

export const ApolloProvider: React.FC = ({ children }) => {
  return <Provider client={client}>{children}</Provider>
}
