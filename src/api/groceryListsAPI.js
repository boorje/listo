import {API, graphqlOperation} from 'aws-amplify';
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';

// -- QUERIES --

/**
 * Returns the users lists including title, id and owner
 * TODO: CHANGE TO USE getUser instead
 */
export const listGroceryLists = async () => {
  const {data} = await API.graphql(
    graphqlOperation(queries.listGroceryLists, {}),
  );
  return data.listGroceryLists.items;
};

/**
 *
 * @param {String}
 */
export const getEditors = async id => {
  const {data} = await API.graphql(graphqlOperation(queries.getEditors, {id}));
  return data.getGroceryList.editors.items.map(({user}) => user);
};

export const getEditorId = async (listID, userID) => {
  const filter = {
    editorListId: {eq: listID},
    editorUserId: {eq: userID},
  };
  const {data} = await API.graphql(
    graphqlOperation(queries.getEditorId, {filter}),
  );
  return data.listEditors.items[0].id;
};

// -- MUTATIONS --

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
 * Adds a editor to the grocery list and returns it.
 * @param {Object} input
 */
export const createEditor = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createEditor, {input}),
  );
  return data.createEditor.user;
};

/**
 * ----------------
 * UPDATED AND USED
 * ----------------
 */

/**
 * Creates a new grocery list and returns it.
 * @param {Object} input
 * @returns {Object} object of created grocery list
 * TODO: Add a resolver which adds the editor.
 */
export const createGroceryList = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.createGroceryList, {input}),
  );
  // TODO: Add a pipeline resolver which adds this.
  // What happens if the list is created but not added to the list editor?
  const {id, owner} = data.createGroceryList;
  const createEditorInput = {
    editorListId: id,
    editorUserId: owner,
  };
  await API.graphql(
    graphqlOperation(mutations.createEditor, {
      input: createEditorInput,
    }),
  );
  return data.createGroceryList;
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
 * Deletes the editor between user and list
 * @param {Object} input
 *  @returns {Object} object of deleted editor
 */
export const deleteEditor = async input => {
  const {data} = await API.graphql(
    graphqlOperation(mutations.deleteEditor, {input}),
  );
  return data.deleteEditor;
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
