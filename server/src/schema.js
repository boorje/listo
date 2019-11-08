const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    lists: GroceryList
  }

  type GroceryList {
    id: ID!
    title: String!
    owner: String!
    items: [GroceryItem]
    editors: [User]
  }

  type GroceryItem {
    id: ID!
    name: String!
    quantity: Int
    unit: String
    list: GroceryList!
  }

  type Query {
    getUser(id: ID!): User
    getUserGroceryLists(owner: ID!): [GroceryList]
    getGroceryListItems(list: ID!): [GroceryItem]
  }

  type Mutation {
    createUser(input: CreateUserInput!): CreateUserMutationResponse!
    createGroceryList(
      input: CreateGroceryListInput!
    ): CreateGroceryListMutationResponse!
    createGroceryItem(
      input: CreateGroceryItemInput!
    ): CreateGroceryItemMutationResponse!
  }

  input CreateUserInput {
    id: ID
    username: String!
  }

  input CreateGroceryListInput {
    id: ID
    title: String!
    owner: String!
  }

  input CreateGroceryItemInput {
    id: ID
    name: String!
    quantity: Int
    unit: String
    list: ID!
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type CreateUserMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
  }

  type CreateGroceryListMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    list: GroceryList
  }

  type CreateGroceryItemMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    item: GroceryItem
  }
`;

module.exports = typeDefs;
