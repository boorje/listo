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
