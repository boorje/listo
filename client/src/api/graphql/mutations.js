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

export const deleteGroceryListAndEditors = `mutation deleteGroceryListAndEditors($listId: ID!) {
  deleteGroceryListAndEditors(listId: $listId) {
    id
  }
}`;

export const deleteGroceryList = `mutation deleteGroceryList($input: DeleteGroceryListInput!) {
  deleteGroceryList(input: $input) {
    id
  }
}`;

export const updateGroceryList = `mutation updateGroceryList($input: UpdateGroceryListInput!) {
  updateGroceryList(input: $input) {
    id
    title
    owner
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

export const deleteListEditor = `mutation deleteListEditor($input: DeleteListEditorInput!) {
  deleteListEditor(input: $input) {
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