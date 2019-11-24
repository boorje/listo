const { ApolloServer } = require("apollo-server");
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
 * @return - The decoded JWT token
 */
function verifyAndDecodeToken(token) {
  const pem = jwkToPem(jwks.keys[1]);
  const verificationOpt = {
    algorithms: ["RS256"],
    client_id: process.env.COGNITO_CLIENT_ID,
    issuer: process.env.COGNITO_USER_POOL_ID
  };
  jwt.verify(token, pem, verificationOpt, function(err, decodedToken) {
    if (err) throw new AuthenticationError(err);
    return decodedToken;
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
    if (!token) throw new AuthenticationError();
    const decodedToken = verifyAndDecodeToken(token);
    const userId = decodedToken.username;
    // const users = await store.db.users.findOrCreate({ where: { email } });
    // const user = users && users[0] ? users[0] : null;
    // if (!user) throw new AuthenticationError("you must be logged in");
    // TODO: return the id and email: {user: {id, email}}
    return { user: { id: userId } };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
