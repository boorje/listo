import {API, Auth, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

/**
 * Finds and return the user id by email
 * @param {String} email
 */
export const getUserID = async email => {
  //   const {data} = await API.graphql(
  //     graphqlOperation(mutations.deleteGroceryItem, {input: {email}}),
  //   );
  //   return data.deleteGroceryItem;
  //   const res = Auth.admin
  return '1c8f66ad-04ac-4fad-9588-8db5a044e2e8';
};
