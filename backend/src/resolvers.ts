import { Resolvers, Config } from './generated/graphql'
import { PubSub } from 'apollo-server'
import { SubscriptionType } from './messages'
import { getAllStatus } from './native_cmds'
import { getState, changeState } from './states'


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
      return getState()
    }
  },
  Mutation: {
    setServiceState(parent, args, { pubsub, getConfig }) {
      return changeState(getConfig(), pubsub, args.state, args.serviceName, args.teamName)
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
