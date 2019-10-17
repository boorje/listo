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

export const getGroceryListEditors = `query getGroceryList($id: ID!) {
    getGroceryList(id: $id) {
       editors {
           items {
               editor {
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
    }
}`;

export const getUserLists = `query getUser($id: ID!) {
    getUser(id: $id) {
    	groceryLists {
    	    nextToken
            items {
                groceryList {
                    id
                    title
                }
            }
    	} 
    }
    listGroceryLists(filter: {owner: {eq: $id}}) {
    	items {
            id
            title
        }
    }
}
`;
