const { ApolloServer, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const jwks = require("../jwks");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { createStore } = require("./db-config");
const DB = require("./datasources/db");

const store = createStore();

/**
 * verifies and decodes the token
 * @param {String} token
 * @return The decoded JWT token
 */
function verifyAndDecodeToken(token) {
  return new Promise((resolve, reject) => {
    const pem = jwkToPem(jwks.keys[1]);
    const verificationOpt = {
      algorithms: ["RS256"],
      client_id: process.env.COGNITO_CLIENT_ID,
      issuer: process.env.COGNITO_USER_POOL_ID,
      token_use: "access"
    };
    jwt.verify(token, pem, verificationOpt, function(err, decodedToken) {
      if (err) reject(err);
      resolve(decodedToken);
    });
  });
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    db: new DB({ store })
  }),
  context: async ({ req }) => {
    const token = req.headers.authorization || null;
    if (token) {
      try {
        const decodedToken = await verifyAndDecodeToken(token);
        const userId = decodedToken.username;
        return { user: { id: userId } };
      } catch (e) {
        //TODO: throw new AuthenticationError();
      }
    }
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
