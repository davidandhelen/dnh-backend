const { Query } = require('./Query');
const { UserMutations } = require('./mutations/user');

const resolvers = {
  Query,
  Mutation: {
    ...UserMutations
  }
};

module.exports = { resolvers };
