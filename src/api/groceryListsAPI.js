import {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

// -- QUERIES --

/**
 * Returns the users lists including title, id and owner
 */
export const listGroceryLists = async () => {
  const {data} = await API.graphql(
    graphqlOperation(queries.listGroceryLists, {}),
  );
  return data.listGroceryLists.items;
};

/**
 * Returns a specific list based on id including the items inside the list
 * @param {String} id // the id to the list
 */
export const getGroceryList = async id => {
  const {data} = await API.graphql(
    graphqlOperation(queries.getGroceryList, {id}),
  );
  return data.getGroceryList.groceries.items;
};

/**
 *
 * @param {String}
 */
export const getEditors = async id => {
  const {data} = await API.graphql(graphqlOperation(queries.getEditors, {id}));
  console.log(data);
  return data.getGroceryList.editors.items.map(({user}) => user);
};

// -- MUTATIONS --

/**
 * Creates a new grocery list and returns it.
 * @param {Object} input
 */
export const createGroceryList = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createGroceryList, {input}),
  );
  return data.createGroceryList;
};

/**
 * Creates a new grocery item and returns the id.
 * @param {Object} input
 */
export const createGroceryItem = async (item, listID) => {
  const {content, unit, quantity} = item;
  const input = {content, groceryItemGroceryListId: listID};
  if (quantity.length > 0) {
    input.quantity = quantity;
    if (unit.length > 0) {
      input.unit = unit;
    }
  }
  const {data} = await API.graphql(
    graphqlOperation(mutations.createGroceryItem, {input}),
  );
  return data.createGroceryItem;
};

/**
 * Deletes a grocery list and returns the id of the deleted item
 * @param {String} id
 */
export const deleteGroceryList = async id => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.deleteGroceryList, {input: {id}}),
  );
  return data.deleteGroceryList;
};

/**
 * Deletes a grocery item and returns the id of the deleted item
 * @param {String} id
 */
export const deleteGroceryItem = async id => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.deleteGroceryItem, {input: {id}}),
  );
  return data.deleteGroceryItem;
};

/**
 * Updates a grocery list and returns ??
 * @param {String} id
 */
export const updateGroceryList = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.updateGroceryList, {input}),
  );
  return data.updateGroceryList;
};

/**
 * Updates a grocery item and returns the id of the updated item
 * @param {String} id
 */
export const updateGroceryItem = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.updateGroceryItem, {input}),
  );
  return data.updateGroceryItem;
};

/**
 * Adds a editor to the grocery list and returns it.
 * @param {Object} input
 */
export const createEditor = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createEditor, {input}),
  );
  return data.createEditor.user;
};
