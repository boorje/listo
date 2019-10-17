import {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

export const getUser = async id => {
  const {data} = await API.graphql(graphqlOperation(queries.getUser, {id}));
  return data.getUser.id;
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
  const sharedLists = data.getUser.groceryLists.items.map(
    item => item.groceryList,
  );
  return ownedLists.concat(sharedLists);
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
