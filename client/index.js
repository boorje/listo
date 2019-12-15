import React from 'react';
import {AppRegistry} from 'react-native';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {concat} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {ApolloProvider} from '@apollo/react-hooks';
import {resolvers} from './src/api/resolvers';
import Amplify, {Auth} from 'aws-amplify';
import {AmazonAIPredictionsProvider} from '@aws-amplify/predictions';

import env from 'react-native-config';
import App from './App';
import {name as appName} from './app.json';

// configure aws
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

// apollo config
const cache = new InMemoryCache();
const httpLink = createHttpLink({
  uri: env.GRAPHQL_API_ENDPOINT,
});

const authMiddleware = setContext(async (req, {headers}) => {
  const token = await Auth.currentSession()
    .then(user => user.getAccessToken().getJwtToken())
    .catch(() => null);
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, httpLink),
  resolvers,
});

const AppWrapper = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => AppWrapper);
