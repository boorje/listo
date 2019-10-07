export const listGroceryLists = `query listGroceryLists($filter: ModelGroceryListFilterInput, $limit: Int, $nextToken: String) {
    listGroceryLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
            id 
            owner
            title
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
