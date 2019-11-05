export const createUser = `mutation createUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
  }
}`;

/**
 * --------
 * List API
 * --------
 */

/**
 * Grocery List
 */

export const createGroceryListAndEditor = `mutation createGroceryListAndEditor($title: String!) {
  createGroceryListAndEditor(title: $title) {
    id
    title
    owner
  }
}`;

export const deleteGroceryList = `mutation deleteGroceryList($input: DeleteGroceryListInput!) {
  deleteGroceryList(input: $input) {
    id
  }
}`;

export const deleteGroceryListAndEditors = `mutation deleteGroceryListAndEditors($listId: ID!) {
  deleteGroceryListAndEditors(listId: $listId) {
    id
  }
}`;

/**
 * Editor
 */

export const createEditor = `mutation createEditor($input: CreateEditorInput!) {
  createEditor(input: $input) {
    user {
      id
      email
    }
    list {
      id
    }
  }
}`;

export const createOwnerEditor = `mutation createEditor($input: CreateEditorInput!) {
  createEditor(input: $input) {
    id
  }
 }`;

export const deleteEditor = `mutation deleteEditor($input: DeleteEditorInput!) {
  deleteEditor(input: $input) {
    id
  }
}`;

/**
 * Grocery Item
 */

export const createGroceryItem = `mutation createGroceryItem($input: CreateGroceryItemInput!) {
  createGroceryItem(input: $input) {
    id
  }
}`;

export const deleteGroceryItem = `mutation deleteGroceryItem($input: DeleteGroceryItemInput!) {
  deleteGroceryItem(input: $input) {
    id
  }
}`;

export const updateGroceryItem = `mutation updateGroceryItem($input: UpdateGroceryItemInput!) {
  updateGroceryItem(input: $input) {
    id
  }
}`;
