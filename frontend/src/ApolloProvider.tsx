import React, { useMemo, useState } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider as Provider, Reference } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { ConnectionCtx, ConnectionState } from './components/Connection'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { ServiceStateFragment, ServiceStateFragmentDoc, InitDocument } from './generated/graphql'

const BACKEND_ENDPOINT = 'localhost:4000'


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

const removeOutdated = (states: ServiceStateFragment[]) => {
  const map: Record<string, Record<string, ServiceStateFragment>> = {}
  const getter = (s: ServiceStateFragment): ServiceStateFragment | undefined => map[s.team.name]?.[s.service.name]
  const setter = (s: ServiceStateFragment) => {
    map[s.team.name] = {
      ...map[s.team.name] ?? {},
      [s.service.name]: s,
    }
  }
  for (const s of states) {
    const v = getter(s)
    if (v) {
      setter(v.updatedAt < s.updatedAt ? s : v)
    } else {
      setter(s)
    }
  }

  let out: ServiceStateFragment[] = []
  for (const i of Object.values(map)) {
    out.push(...Object.values(i))
  }
  return out
}

export const ApolloProvider: React.FC = ({ children }) => {
  const [ state, setState ] = useState(ConnectionState.Connecting)
  const client = useMemo(() => {
    const subClient = new SubscriptionClient(
      `${window.location.protocol.replace('http', 'ws')}//${BACKEND_ENDPOINT ?? window.location.host}/graphql`,
      {
        reconnect: true,
      }
    )
    subClient.onConnected(() => setState(ConnectionState.Connected))
    subClient.onDisconnected(() => setState(ConnectionState.Disconnect))
    subClient.onConnecting(() => setState(ConnectionState.Connecting))
    subClient.onReconnecting(() => setState(ConnectionState.Connecting))
    subClient.onReconnected(() => setState(ConnectionState.Connected))
    const wsLink = new WebSocketLink(subClient)
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
                merge (existing: ServiceStateFragment[] | undefined, incoming: ServiceStateFragment[], { cache }) {
                  const e = [...existing ?? [], ...incoming].map(ref => cache.readFragment({
                    id: cache.identify(ref),
                    fragment: ServiceStateFragmentDoc,
                  })) as ServiceStateFragment[]
                  const r = removeOutdated(e)

                  // console.log(e, r, existing, incoming)

                  return r
                }
              }
            }
          },
          Mutation: {
            fields: {
              setServiceState: {
                merge (existing, incoming: Reference[], { cache }) {
                  cache.writeQuery({
                    query: InitDocument,
                    data: {
                      allState: incoming.map(ref => cache.readFragment({
                        id: cache.identify(ref),
                        fragment: ServiceStateFragmentDoc,
                      })),
                    }
                  })
                  return incoming
                }
              }
            }
          },
          Subscription: {
            fields: {
              serviceStateChanged: {
                merge (existing, incoming: Reference, { cache }) {
                  cache.writeQuery({
                    query: InitDocument,
                    data: {
                      allState: [cache.readFragment({
                        id: cache.identify(incoming),
                        fragment: ServiceStateFragmentDoc,
                      })],
                    }
                  })
                }
              }
            }
          }
        }
      }),
      link: wsLink,
    })
    return client
  }, [])
  return <>
    <ConnectionCtx.Provider value={state}>
      <Provider client={client}>{children}</Provider>
    </ConnectionCtx.Provider>
  </>
}
