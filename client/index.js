import React from 'react';
import {AppRegistry} from 'react-native';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {ApolloProvider} from '@apollo/react-hooks';
import {resolvers} from './src/api/resolvers';

import App from './App';
import {name as appName} from './app.json';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/',
});

const client = new ApolloClient({
  cache,
  link,
  resolvers,
});

const AppWrapper = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => AppWrapper);
