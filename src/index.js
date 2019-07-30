// src/index.js
const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const { resolvers } = require("./resolvers/index");
const jwt = require("jsonwebtoken");

const server = new GraphQLServer({
  typeDefs: __dirname + "/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: __dirname + "/../prisma/generated/prisma.graphql",
      endpoint: "https://us1.prisma.sh/david-ebdc6d/dnh-backend/dev"
    })
  })
});

server.start(() => console.log("Server is running on localhost:4000"));
