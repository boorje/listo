import {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

export const getUser = async id => {
  const {data} = await API.graphql(graphqlOperation(queries.getUser, {id}));
  return data.getUser.id;
};

/**
 * Finds and return the user id by email
 * @param {String} email
 */
export const getUserID = async email => {
  //   const {data} = await API.graphql(
  //     graphqlOperation(mutations.deleteGroceryItem, {input: {email}}),
  //   );
  //   return data.deleteGroceryItem;
  return '1c8f66ad-04ac-4fad-9588-8db5a044e2e8';
};

/**
 * Adds the user to the database
 * @param {Object} input // user's id and email
 */
export const createUser = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createUser, {input}),
  );
  return data.createUser;
};
