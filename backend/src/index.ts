import { ApolloServer, gql, PubSub } from 'apollo-server'
import { readFileSync } from 'fs'
import * as path from 'path'
import { resolvers, Context } from './resolvers'

import {getConfig, startWatch} from  './storage';
import { watchState } from './states';
import { logRoot } from './logger';
import { configPath } from './environ';

const logger = logRoot.child({ defaultMeta: { service: 'endpoint' }, })


async function main() {
  const schema = readFileSync(path.resolve(__dirname, '../../schema/schema.graphql')).toString()
  const typeDefs = gql`${schema}`
  const pubsub = new PubSub()
  const context: Context = {
    pubsub,
    getConfig
  }

  const server = new ApolloServer({
    cors: true,
    typeDefs,
    resolvers,
    context,
  })

  // Watch the config
  await startWatch(configPath, pubsub)
  await watchState(10, pubsub, getConfig)

  const { url } = await server.listen()
  logger.info(`🚀  Server ready at ${url}`);
}
main().catch(e => logger.error(e))
