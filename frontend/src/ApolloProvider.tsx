import React from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider as Provider } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'

const BACKEND_ENDPOINT = 'localhost:4000'

const wsLink = new WebSocketLink({
  uri: `${window.location.protocol.replace('http', 'ws')}//${BACKEND_ENDPOINT ?? window.location.host}/graphql`,
  options: {
    reconnect: true
  }
})

// const httpLink = new HttpLink({
//   uri: `${window.location.protocol}//${BACKEND_ENDPOINT ?? window.location.host}/graphql`,
// })

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink,
// )

type UpdatedAt = { updatedAt: number }
const mergedByUpdatedAt = (existing: UpdatedAt | undefined, incoming: UpdatedAt) => {
  if (existing) {
    return existing.updatedAt < incoming.updatedAt ? incoming : existing
  }
  return incoming
}

// const removeOutdated = (states: ServiceStateFragment[]) => {
//   const map: Record<string, Record<string, ServiceStateFragment>> = {}
//   const getter = (s: ServiceStateFragment): ServiceStateFragment | undefined => map[s.team.name]?.[s.service.name]
//   const setter = (s: ServiceStateFragment) => {
//     map[s.team.name] = {
//       ...map[s.team.name] ?? {},
//       [s.service.name]: s,
//     }
//   }
//   for (const s of states) {
//     const v = getter(s)
//     if (v) {
//       setter(v.updatedAt < s.updatedAt ? s : v)
//     } else {
//       setter(s)
//     }
//   }

//   let out: ServiceStateFragment[] = []
//   for (const i of Object.values(map)) {
//     out.push(...Object.values(i))
//   }
//   return out
// }

const client = new ApolloClient({
  uri: '/',
  cache: new InMemoryCache({
    typePolicies: {
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
      },
      Query: {
        fields: {
          config: {
            merge: mergedByUpdatedAt,
          },
          allState: {
            // merge (existing: ServiceStateFragment[] | undefined, incoming: ServiceStateFragment[], { cache }) {
            //   const e = [...existing ?? [], ...incoming].map(ref => cache.readFragment({
            //     id: cache.identify(ref),
            //     fragment: ServiceStateFragmentDoc,
            //   })) as ServiceStateFragment[]

            //   return removeOutdated(e)
            // }
          }
        }
      },
      Mutation: {
        fields: {
          setServiceState: {
            // merge (existing, incoming: Reference[], { cache }) {
            //   cache.writeQuery({
            //     query: InitDocument,
            //     data: {
            //       allState: incoming.map(ref => cache.readFragment({
            //         id: cache.identify(ref),
            //         fragment: ServiceStateFragmentDoc,
            //       })),
            //     }
            //   })
            //   return incoming
            // }
          }
        }
      },
      Subscription: {
        fields: {
          serviceStateChanged: {
            // merge (existing, incoming: Reference[], { cache }) {
            //   const old = cache.readQuery<InitQuery>({
            //     query: InitDocument
            //   })
            //   if (old) {
            //     const allState = [...old.allState, ...incoming.map(ref => cache.readFragment({
            //       id: cache.identify(ref),
            //       fragment: ServiceStateFragmentDoc,
            //     })) as ServiceStateFragment[] ]
            //     cache.writeQuery({
            //       query: InitDocument,
            //       data: {
            //         ...old,
            //         allState: removeOutdated(allState),
            //       }
            //     })
            //   }
            //   return incoming
            // }
          }
        }
      }
    }
  }),
  link: wsLink,
})

export const ApolloProvider: React.FC = ({ children }) => {
  return <Provider client={client}>{children}</Provider>
}
