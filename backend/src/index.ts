import { ApolloServer, gql, PubSub } from 'apollo-server'
import { readFileSync } from 'fs'
import * as path from 'path'
import { resolvers, Context } from './resolvers'

async function main() {
  const schema = readFileSync(path.resolve(__dirname, '../../schema/schema.graphql')).toString()
  const typeDefs = gql`${schema}`
  const pubsub = new PubSub()
  const context: Context = {
    pubsub
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  })

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
}
main().catch(e => console.error(e))
