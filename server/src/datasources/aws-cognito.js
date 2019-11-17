const { DataSource } = require("apollo-datasource");
global.fetch = require("node-fetch");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const crypto = require("crypto");
require("dotenv").config();

function getRandomString(bytes) {
  return crypto.randomBytes(bytes).toString("hex");
}

class Cognito extends DataSource {
  constructor({ store }) {
    super();
    //? is store needed?
    this.store = store;

    // aws configure
    const poolData = {
      UserPoolId: process.env.COGNITO_USER_POOL,
      ClientId: process.env.COGNITO_APP_CLIENT_ID
    };
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  }

  initialize(config) {
    this.context = config.context;
  }

  async signUp(email) {
    const params = {
      username: email,
      password: getRandomString(30)
    };
    this.userPool.signUp(params.username, params.password, null, null, function(
      err,
      result
    ) {
      if (err) {
        return null;
      }
      const cognitoUser = result.user;
      return cognitoUser.getUsername();
    });
  }
}

module.exports = Cognito;
