import { ApolloServer, gql } from 'apollo-server'
import { readFileSync } from 'fs'
import * as path from 'path'
import { resolvers } from './resolvers'

async function main() {
  const schema = readFileSync(path.resolve(__dirname, '../../schema/schema.graphql')).toString()
  const typeDefs = gql`${schema}`

  const server = new ApolloServer({ typeDefs, resolvers })

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
}
main().catch(e => console.error(e))
