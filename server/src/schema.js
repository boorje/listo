const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
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
    getGroceryList(list: ID!): [GroceryItem]
  }

  type Mutation {
    createUser(input: CreateUserInput!): CreateUserMutationResponse!
    createGroceryList(
      input: CreateGroceryListInput!
    ): CreateGroceryListMutationResponse!
    createGroceryItem(
      input: CreateGroceryItemInput!
    ): CreateGroceryItemMutationResponse!
    updateGroceryItem(
      input: UpdateGroceryItemInput!
    ): UpdateGroceryItemMutationResponse!
    deleteGroceryList(id: ID!): DeleteGroceryListMutationResponse!
    deleteGroceryListItem(id: ID!): DeleteGroceryListItemMutationResponse!
  }

  input CreateUserInput {
    id: ID
    email: String!
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

  input UpdateGroceryItemInput {
    id: ID!
    name: String!
    quantity: Int
    unit: String
    list: ID
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

  type DeleteGroceryListMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    list: GroceryList
  }

  type DeleteGroceryListItemMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    item: GroceryItem
  }

  type UpdateGroceryItemMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    item: GroceryItem!
  }
`;

module.exports = typeDefs;
