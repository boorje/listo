import {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

/**
 * @typedef ID
 * @property {ID} id
 * @param {ID} id - of the user
 * @returns {Object.<string, ID>} {id}
 */
export const getUser = async id => {
  const {data} = await API.graphql(graphqlOperation(queries.getUser, {id}));
  return data.getUser;
};

/**
 * @typedef Email
 * @property {Email} email
 * @param {Email} email
 * @returns {Object.<string, Object.<string, ID>>} {items: [{id}]}
 */
export const getUserByEmail = async email => {
  const {data} = await API.graphql(
    graphqlOperation(queries.getUserByEmail, {email}),
  );
  return data.userByEmail;
};

/**
 * @typedef Email
 * @property {Email} email
 * @param {Email} email
 * @returns {Object} {id, email}
 */
export const createUser = async email => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createUser, {input: {email}}),
  );
  return data.createUser.id;
};
