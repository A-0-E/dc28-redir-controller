import { Resolvers, Config } from './generated/graphql'
import { PubSub } from 'apollo-server'
import { SubscriptionType } from './messages'


export interface Context {
  pubsub: PubSub,
  getConfig: () => Config,
}

export const resolvers: Resolvers<Context> = {
  Query: {
    config(parent, args, { getConfig }) {
      return getConfig()
    },
    allState() {
      return []
    }
  },
  Subscription: {
    serviceStateChanged: {
      subscribe(parent, args, { pubsub }) {
        return pubsub.asyncIterator(SubscriptionType.ServiceStateChanged)
      }
    },
    config: {
      subscribe(parent, args, { pubsub }) {
        return pubsub.asyncIterator(SubscriptionType.Config)
      }
    },
    forceReload: {
      subscribe(parent, args, { pubsub }) {
        return pubsub.asyncIterator(SubscriptionType.ForceReload)
      }
    }
  }
}
