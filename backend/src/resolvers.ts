import { Resolvers } from './generated/graphql'
import { PubSub } from 'apollo-server'

enum SubscriptionType {
  ServiceStateChanged = 'ServiceStateChanged',
}

export interface Context {
  pubsub: PubSub,
}

export const resolvers: Resolvers<Context> = {
  Query: {
  },
  Subscription: {
    serviceStateChanged: {
      subscribe (parent, args, { pubsub }) {
        return pubsub.asyncIterator(SubscriptionType.ServiceStateChanged)
      }
    }
  }
}
