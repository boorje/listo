const { AuthenticationError } = require("apollo-server");

const authenticated = next => (root, args, context, info) => {
  if (!context.user || !context.user.id) {
    //TODO: throw new AuthenticationError();
  }
  return next(root, args, context, info);
};

module.exports = {
  Query: {
    getUserGroceryLists: authenticated(
      async (_, { owner }, { dataSources }) =>
        await dataSources.db.getUserGroceryLists({ owner })
    ),
    getGroceryList: authenticated(
      async (_, { listid }, { dataSources }) =>
        await dataSources.db.getGroceryList(listid)
    ),
    getGroceryListItems: authenticated(
      async (_, { list }, { dataSources }) =>
        await dataSources.db.getGroceryListItems({ list })
    ),
    getListEditors: authenticated(
      async (_, { listid }, { dataSources }) =>
        await dataSources.db.getListEditors({ listid })
    )
  },
  Mutation: {
    createGroceryList: authenticated(async (_, { input }, { dataSources }) => {
      const list = await dataSources.db.createGroceryList(input);
      const response = {
        code: list ? 200 : 400,
        success: list ? true : false,
        message: list
          ? "Successfully created the list."
          : "The list could not be created.",
        list
      };
      return response;
    }),
    createListEditor: authenticated(async (_, { input }, { dataSources }) => {
      const editor = await dataSources.db.createListEditor(input);
      const response = {
        code: editor ? 200 : 400,
        success: editor ? true : false,
        message: editor
          ? "The user has been added as an editor."
          : "Could not add user as editor.",
        editor
      };
      return response;
    }),
    createGroceryItem: authenticated(async (_, { input }, { dataSources }) => {
      const item = await dataSources.db.createGroceryItem(input);
      const response = {
        code: item ? 200 : 500,
        success: item ? true : false,
        message: "Successfully created the item",
        item
      };
      return response;
    }),
    createGroceryItems: authenticated(async (_, { input }, { dataSources }) => {
      const items = await dataSources.db.createGroceryItems({ input });
      const response = {
        code: items.length > 0 ? 200 : 500,
        success: items.length > 0 ? true : false,
        message: "Successfully created the items",
        items
      };
      return response;
    }),
    updateListTitle: authenticated(async (_, { input }, { dataSources }) => {
      const list = await dataSources.db.updateListTitle(input);
      const response = {
        code: list ? 200 : 500,
        success: list ? true : false,
        message: "Successfully updated the list tile",
        list
      };
      return response;
    }),
    updateGroceryItem: authenticated(async (_, { input }, { dataSources }) => {
      const res = await dataSources.db.updateGroceryItem({ input });
      const response = {
        code: res ? 200 : 500,
        success: res ? true : false,
        message: "Successfully updated the item",
        item: res
      };
      return response;
    }),
    deleteGroceryList: authenticated(async (_, { id }, { dataSources }) => {
      const res = await dataSources.db.deleteGroceryList({ id });
      const response = {
        code: res ? 200 : 500,
        success: res ? true : false,
        message: "Successfully deleted the item",
        list: res
      };
      return response;
    }),
    deleteListEditor: authenticated(async (_, { input }, { dataSources }) => {
      const editor = await dataSources.db.deleteListEditor(input);
      const response = {
        code: editor ? 200 : 500,
        success: editor ? true : false,
        message: "Successfully deleted the item",
        editor
      };
      return response;
    }),
    deleteGroceryListItem: authenticated(async (_, { id }, { dataSources }) => {
      const res = await dataSources.db.deleteGroceryListItem({ id });
      const response = {
        code: res ? 200 : 500,
        success: res ? true : false,
        message: "Successfully deleted the item",
        item: res
      };
      return response;
    }),
    signup: async (_, { input }, { dataSources, user }) => {
      const createdUser = await dataSources.db.createUser({
        id: user.id,
        email: input.email
      });
      return {
        code: createdUser ? 200 : 500,
        success: createdUser ? true : false,
        message: "Successfully registered the user",
        user: createdUser
      };
    },
    signin: async (_, { input }, { dataSources, user }) => {
      const signedUser = await dataSources.db.findOrCreateUser({
        id: user.id,
        attributes: { email: input.email }
      });
      return {
        code: signedUser ? 200 : 500,
        success: signedUser ? true : false,
        message: "Successfully signed in the user",
        user: signedUser
      };
    }
  },
  GroceryList: {
    items: (parent, _, { dataSources }) => {
      return dataSources.db.getGroceryListItems({ list: parent.id });
    },
    editors: (parent, _, { dataSources }) => {
      return dataSources.db.getListEditors({ listid: parent.id });
    }
    // owner: ({ owner }, _, { dataSources }) => {
    //   return dataSources.db.getUser(owner);
    // }
  },
  MutationResponse: {
    __resolveType(mutationResponse, context, info) {
      return null;
    }
  }
};
