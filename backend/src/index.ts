import { ApolloServer, gql, PubSub } from 'apollo-server'
import { readFileSync } from 'fs'
import * as path from 'path'
import { resolvers, Context } from './resolvers'

import {getConfig, startWatch} from  './storage';

async function main() {
  const schema = readFileSync(path.resolve(__dirname, '../../schema/schema.graphql')).toString()
  const typeDefs = gql`${schema}`
  const pubsub = new PubSub()
  const context: Context = {
    pubsub,
    getConfig
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  })

  // Watch the config
  await startWatch("./config.example.yaml", pubsub)

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
}
main().catch(e => console.error(e))
