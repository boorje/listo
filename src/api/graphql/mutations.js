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
