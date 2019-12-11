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

export const DELETE_GROCERY_LIST_ITEM = gql`
  mutation deleteGroceryListItem($id: ID!) {
    deleteGroceryListItem(id: $id) {
      success
      message
      code
      item {
        id
      }
    }
  }
`;

export const UPDATE_GROCERY_ITEM = gql`
  mutation updateGroceryItem($input: UpdateGroceryItemInput!) {
    updateGroceryItem(input: $input) {
      code
      success
      message
      item {
        id
        name
        unit
        quantity
      }
    }
  }
`;

export const SIGN_IN = gql`
  mutation signin($input: CreateUserInput!) {
    signin(input: $input) {
      code
      message
      success
      user {
        id
        email
      }
    }
  }
`;

export const SIGN_UP = gql`
  mutation signup($input: CreateUserInput!) {
    signup(input: $input) {
      code
      success
      message
      user {
        id
        email
      }
    }
  }
`;
