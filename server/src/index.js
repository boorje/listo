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

/**
 * finds or creates the user in the db
 * @param {String} id
 * @return The user from the db.
 */
function findOrCreateUser(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await store.users.findOrCreate({
        where: { id }
      });
      const user = users && users[0] ? users[0] : null;
      if (!user) throw "Could not find user.";
      resolve(user.dataValues);
    } catch (e) {
      reject(e);
    }
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
    try {
      const decodedToken = await verifyAndDecodeToken(token);
      const userId = decodedToken.username;
      const user = await findOrCreateUser(userId);
      // TODO: Check if user exists instead of findorcreate.
      //    user exists return all the models for the schema.
      //    user doesn't exists. only return the model for User: login: () => {findOrCreateUser}
      return { user: { id: user.id } };
    } catch (e) {
      throw new AuthenticationError(e);
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
