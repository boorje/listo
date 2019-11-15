import gql from 'graphql-tag';

export const CREATE_GROCERY_LIST = gql`
  mutation createGroceryList($input: CreateGroceryListInput!) {
    createGroceryList(input: $input) {
      code
      message
      success
      list {
        id
        title
        owner
      }
    }
  }
`;

export const DELETE_GROCERY_LIST = gql`
  mutation deleteGroceryList($id: ID!) {
    deleteGroceryList(id: $id) {
      success
      message
      code
      list {
        id
      }
    }
  }
`;

export const CREATE_GROCERY_LIST_ITEM = gql`
  mutation createGroceryItem($input: CreateGroceryItemInput!) {
    createGroceryItem(input: $input) {
      item {
        name
        quantity
        unit
        id
      }
    }
  }
`;
