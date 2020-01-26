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
      endpoint: process.env.PRISMA_ENDPOINT
    })
  })
});

server.start(() => console.log("Server is running on localhost:4000"));
