import gql from 'graphql-tag';

export const GET_USERS_LISTS = gql`
  query getUserGroceryLists($owner: ID!) {
    getUserGroceryLists(owner: $owner) {
      id
      title
      owner {
        id
        email
      }
      isOwner
      itemCount
    }
  }
`;

export const GET_LIST_EDITORS = gql`
  query getListEditors($listid: ID!) {
    getListEditors(listid: $listid) {
      id
      email
    }
  }
`;

export const GET_GROCERY_LIST = gql`
  query getGroceryList($listid: ID!) {
    getGroceryList(listid: $listid) {
      id
      title
      owner {
        id
        email
      }
      items {
        id
        name
        quantity
        unit
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

// local cache

export const GET_USER = gql`
  query getUser {
    user @client {
      id
      email
    }
  }
`;

export const GET_ACTIVE_LIST = gql`
  query activeList {
    list @client {
      id
      title
      isOwner
      owner {
        id
      }
    }
  }
`;
