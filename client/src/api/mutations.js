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
