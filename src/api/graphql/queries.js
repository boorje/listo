export const listGroceryLists = `query listGroceryLists($filter: ModelGroceryListFilterInput, $limit: Int, $nextToken: String) {
    listGroceryLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
            id 
            owner
            title
            editors {
                items {
                    id
                }
            }
        }
        nextToken
    }
}
`;

export const getGroceryList = `query getGroceryList($id: ID!) {
    getGroceryList(id: $id) {
       id
       groceries {
        items {
            id
            content
            quantity
            unit
        }
       }
    }
}
`;

export const getEditors = `query getGroceryList($id: ID!) {
    getGroceryList(id: $id) {
       editors {
           items {
                user {
                   id
                   email
               }
           }
       }
    }
}
`;

// -- USER --

export const getUser = `query getUser($id: ID!) {
    getUser(id: $id) {
        id
        email
    }
}`;

export const getUserLists = `query getUser($id: ID!) {
    getUser(id: $id) {
    	groceryLists {
    	    nextToken
            items {
                list {
                    id
                    title
                    owner
                }
            }
    	} 
    }
    listGroceryLists(filter: {owner: {eq: $id}}) {
    	items {
            id
            title
            owner
        }
    }
}
`;

export const getUserIDByEmail = `query getUserIDByEmail($filter: ModelUserFilterInput) {
    listUsers(filter: $filter) {
      items {
        id
      }
    }
  }`;

export const getEditorId = `query listEditors($filter: ModelEditorFilterInput) {
    listEditors(filter: $filter) {
      items {
        id
      }
    }
  }`;
