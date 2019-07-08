const { Query } = require('./Query');
const { UserMutations } = require('./mutations/user');

const resolvers = {
  Query,
  Mutation: {
    ...UserMutations
  },
  Node: {
    __resolveType() {
      return null;
    }
  }
};

module.exports = { resolvers };
