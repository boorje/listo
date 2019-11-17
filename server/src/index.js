const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { createStore } = require("./db-config");

const DB = require("./datasources/db");
const Cognito = require("./datasources/aws-cognito");

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    db: new DB({ store }),
    cognito: new Cognito({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
