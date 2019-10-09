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
