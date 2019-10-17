export const createGroceryList = `mutation createGroceryList($input: CreateGroceryListInput!) {
    createGroceryList(input: $input) {
      id
      title
      owner
    }
  }
  `;

export const createGroceryItem = `mutation createGroceryItem($input: CreateGroceryItemInput!) {
    createGroceryItem(input: $input) {
      id
    }
  }`;

export const deleteGroceryList = `mutation deleteGroceryList($input: DeleteGroceryListInput!) {
  deleteGroceryList(input: $input) {
    id
  }
}`;

// Add batch delete on editors
export const deleteGroceryListAndEditors = `mutation deleteGroceryListAndEditors($listInput: DeleteGroceryListInput!, $ids: [ID!]!) {
	deleteGroceryList(input: $listInput) {
    id
  }
  batchDeleteEditors(ids: $ids) {
    id
  }
}`;

export const deleteGroceryItem = `mutation deleteGroceryItem($input: DeleteGroceryItemInput!) {
  deleteGroceryItem(input: $input) {
    id
  }
}`;

export const updateGroceryList = `mutation updateGroceryList($input: UpdateGroceryListInput!) {
  updateGroceryList(input: $input) {
    id
    editors
  }
}`;

export const updateGroceryItem = `mutation updateGroceryItem($input: UpdateGroceryItemInput!) {
  updateGroceryItem(input: $input) {
    id
  }
}`;

// -- USER --

export const createUser = `mutation createUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
  }
}`;

// -- GROCERY LIST EDITORS --

export const createEditor = `mutation createEditor($input: CreateEditorInput!) {
  createEditor(input: $input) {
    user {
      id
      email
    }
  }
}`;

export const deleteEditor = `mutation deleteEditor($input: DeleteEditorInput!) {
  deleteEditor(input: $input) {
    list {
      id
    }
    user {
      id
      email
    }
  }
}`;
