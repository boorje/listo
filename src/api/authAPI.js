import {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

// ! UPDATED
export const getUser = async id => {
  const {data} = await API.graphql(graphqlOperation(queries.getUser, {id}));
  return data.getUser;
};

/**
 * Queries for the lists owned by the user and the lists shared with the user.
 * Returns one combined array with the lists.
 * @param {String} id
 */
export const getUserLists = async id => {
  const {data} = await API.graphql(
    graphqlOperation(queries.getUserLists, {id}),
  );
  const ownedLists = data.listGroceryLists.items.map(list => {
    list.isOwner = true;
    return list;
  });
  const sharedLists = data.getUser.groceryLists.items.map(({list}) => list);
  return ownedLists.concat(sharedLists);
};

/**
 * Queries for a users id by email. Returns the id of the user
 * @param {String} id
 * TODO: UPDATE
 */
export const getUserIDByEmail = async email => {
  const filter = {
    email: {
      eq: email,
    },
  };
  const {data} = await API.graphql(
    graphqlOperation(queries.getUserIDByEmail, {filter}),
  );
  if (data.listUsers.items.length < 1) {
    throw 'User does not exists. Please try again.';
  } else {
    return data.listUsers.items[0].id;
  }
};

/**
 * Adds the user to the database
 */
export const createUser = async email => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createUser, {input: {email}}),
  );
  return data.createUser.id;
};

// TODO: Move to grocerListAPI.js
export const deleteEditor = async id => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.deleteEditor, {id}),
  );
  return data;
};
