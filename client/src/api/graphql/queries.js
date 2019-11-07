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

export const getUserByEmail = `query userByEmail($email: AWSEmail!) {
  userByEmail(email: $email, limit: 1) {
    items {
      id
    }
  }
}`;

/**
 * ---
 * List API
 * ---
 */

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

export const getEditors = `query getEditors($id: ID!) {
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
}`;
