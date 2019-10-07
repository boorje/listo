import {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

// -- QUERIES --

export const listGroceryLists = async () => {
  const {data} = await API.graphql(
    graphqlOperation(queries.listGroceryLists, {}),
  );
  return data.listGroceryLists.items;
};

// -- MUTATIONS --

/**
 * Creates a new grocery list and returns it.
 * @param {Object} input
 */
export const createGroceryList = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createGroceryList, {input: input}),
  );
  return data.createGroceryList;
};
