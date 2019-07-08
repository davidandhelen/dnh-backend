// src/index.js
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
  Query: {
    users: (_, args, context, info) => {
      return context.prisma.query.users({}, info);
    },
    user: (_, args, context, info) => {
      return context.prisma.query.user(
        {
          where: {
            id: args.id
          }
        },
        info
      );
    }
  },

  Mutation: {
    createUser: (_, args, context, info) => {
      return context.prisma.mutation.createUser(
        {
          data: {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            phone: args.phone,
            note: args.note ? args.note : '' /* Optional */,
            attending: args.attending
          }
        },
        info
      );
    }
  },
  Node: {
    __resolveType() {
      return null;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    req,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/david-ebdc6d/dnh-backend/dev'
    })
  })
});
server.start(() =>
  console.log(`GraphQL server is running on http://localhost:4000`)
);
