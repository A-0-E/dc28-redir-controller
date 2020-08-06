import { Resolvers } from './generated/graphql'

export const resolvers: Resolvers = {
  Query: {
    team: () => [{
      id: '1',
      name: 'ooo'
    }],
  },
}
