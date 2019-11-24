import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type User {
    token: String!
  }

  extend type Query {
    userToken: String!
  }

  extend type Mutation {
    addToken: [User]
  }
`;

export const resolvers = {};
