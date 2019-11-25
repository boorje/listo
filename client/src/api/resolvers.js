import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    getUser: User!
  }

  extend type User {
    email: String
  }
`;

export const resolvers = {};
