import React from 'react'
import { ApolloClient, InMemoryCache, split, HttpLink, ApolloProvider as Provider } from '@apollo/client'
import { getMainDefinition, Reference } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { ServiceStateFragmentDoc, InitDocument, InitQuery, ServiceStateFragment } from './generated/graphql'

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
        console.log('merge', existing, incoming)
        return existing.updatedAt < incoming.updatedAt ? incoming : existing
      }
    }
  }
}

const removeOutdated = (states: ServiceStateFragment[]) => {
  // TODO: implement it
  return states
}

const client = new ApolloClient({
  uri: '/',
  cache: new InMemoryCache({
    typePolicies: {
      Config: {
        ...MergeByUpdatedAt,
      },
      Team: {
        keyFields: ['name'],
      },
      Service: {
        keyFields: ['name'],
      },
      ServiceState: {
        keyFields: (v) => {
          // @ts-ignore
          return `${v.team.name}.${v.service.name}`
        },
        ...MergeByUpdatedAt,
      },
      Mutation: {
        fields: {
          setServiceState: {
            merge (existing, incoming: Reference[], { cache }) {
              const old = cache.readQuery<InitQuery>({
                query: InitDocument
              })
              if (old) {
                const allState = [...old.allState, ...incoming.map(ref => cache.readFragment({
                  id: cache.identify(ref),
                  fragment: ServiceStateFragmentDoc,
                })) as ServiceStateFragment[] ]
                cache.writeQuery({
                  query: InitDocument,
                  data: {
                    ...old,
                    allState: removeOutdated(allState),
                  }
                })
              }
              // console.log('w', cache.readQuery({
              //   query: InitDocument
              // }))
              return incoming
            }
          }
        }
      },
    }
  }),
  link: splitLink,
})

export const ApolloProvider: React.FC = ({ children }) => {
  return <Provider client={client}>{children}</Provider>
}
