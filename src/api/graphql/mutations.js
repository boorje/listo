export const createGroceryList = `mutation CreateList($input: CreateGroceryListInput!) {
    createGroceryList(input: $input) {
      id
      title
      owner
    }
  }
  `;
