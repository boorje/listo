import {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

export const getUser = async id => {
  const {data} = await API.graphql(graphqlOperation(queries.getUser, {id}));
  return data.getUser;
};

export const createUser = async email => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createUser, {input: {email}}),
  );
  return data.createUser.id;
};

/**
 * @param {AWSEmail} email
 * @returns
 */
export const getUserByEmail = async email => {
  const {data} = await API.graphql(
    graphqlOperation(queries.getUserByEmail, {email}),
  );
  return data.userByEmail;
};
