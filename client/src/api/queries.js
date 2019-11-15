import gql from 'graphql-tag';

export const GET_USERS_LISTS = gql`
  query getUserGroceryLists($owner: ID!) {
    getUserGroceryLists(owner: $owner) {
      id
      title
      items {
        id
        name
      }
    }
  }
`;

export const GET_GROCERY_LIST_ITEMS = gql`
  query getGroceryListItems($list: ID!) {
    getGroceryListItems(list: $list) {
      id
      name
      quantity
      unit
    }
  }
`;
