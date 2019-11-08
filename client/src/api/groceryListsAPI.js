import {API, graphqlOperation} from 'aws-amplify';
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';

/**
 * ----------------
 * UPDATED AND USED
 * ----------------
 * TODO: Update doc of funcs to include spec of objects
 */

/**
 * PIPELINE RESOLVER - Creates a grocery list and adds the signed in owner as editor.
 * @param {object} input - the input to create a new grocery list
 * @param {string} input.title - the list of the title
 * @returns {Object} object of created grocery list
 */
export const createGroceryList = async title => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createGroceryListAndEditor, {title}),
  );
  return data.createGroceryListAndEditor;
};

/**
 * Deletes a grocery list and returns the id of the deleted item
 * @param {String} id
 * @returns {Object} object of deleted grocery list
 */
export const deleteGroceryList = async id => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.deleteGroceryList, {input: {id}}),
  );
  return data.deleteGroceryList;
};

/**
 * Deletes a grocery list and returns the id of the deleted item
 * @param {String} id
 * @returns {Object} object of deleted grocery list
 */
export const deleteGroceryListAndEditors = async listId => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.deleteGroceryListAndEditors, {listId}),
  );
  return data.deleteGroceryListAndEditors;
};

/**
 * Updates a grocery list and returns the id, new title and the owner of the list
 * @param {String} id - of the list
 * @param {String} title - the updated title
 * @returns {Object} object of the updated grocery list
 */
export const updateGroceryList = async (id, title) => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.updateGroceryList, {
      input: {id, title},
    }),
  );
  return data.updateGroceryList;
};

/**
 * Returns the email of editors for the list
 * @param {String} id list id
 * @returns {Object} object with editors
 */
export const getEditors = async id => {
  const {data} = await API.graphql(graphqlOperation(queries.getEditors, {id}));
  return data.getGroceryList;
};

/**
 * Adds a editor to the grocery list and returns it.
 * @param {Object} input
 * @returns {Object} object with user and list
 */
export const createEditor = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createEditor, {input}),
  );
  return data.createEditor;
};

/**
 * Deletes the editor of the list
 * @param {Object} input
 *  @returns {Object} object of deleted editor
 */
export const deleteListEditor = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.deleteListEditor, {input}),
  );
  return data.deleteListEditor;
};

/**
 * Returns a specific list based on id including the items inside the list
 * @param {String} id // the id to the list
 * @returns list of grocery lists
 */
export const getGroceryList = async id => {
  const {data} = await API.graphql(
    graphqlOperation(queries.getGroceryList, {id}),
  );
  return data.getGroceryList.groceries.items;
};

/**
 * Creates a new grocery item and returns the id.
 * @param {Object} input
 * @returns {String} id of the created item
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
  return data.createGroceryItem.id;
};

/**
 * Deletes a grocery item and returns the id of the deleted item
 * @param {String} id
 * @returns {Object} object of deleted item
 */
export const deleteGroceryItem = async id => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.deleteGroceryItem, {input: {id}}),
  );
  return data.deleteGroceryItem;
};

/**
 * Updates a grocery item and returns the id of the updated item
 * @param {String} id
 * @returns {Object} object of updated grocery item
 */
export const updateGroceryItem = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.updateGroceryItem, {input}),
  );
  return data.updateGroceryItem;
};