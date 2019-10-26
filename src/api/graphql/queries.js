export const getUser = `query getUser($id: ID!) {
  getUser(id: $id) {
    id
    email
    groceryLists {
      items {
        list {
          id
          title
          owner
        }
      }
    }
  }
}`;

/**
 * ---
 * List API
 * ---
 */

export const getEditorsByListID = `query editorsByListId($listId: ID!, $id: String!) {
  editorsByListId(listId: $listId, id: {beginsWith: $id}) {
    items {
      id
    }
  }
}`;

export const getGroceryList = `query getGroceryList($id: ID!) {
  getGroceryList(id: $id) {
    groceries {
      items {
        id
        content
        quantity
        unit
      }
    }
  }
}`;
