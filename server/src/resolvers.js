module.exports = {
  Query: {
    getUser: async (_, { id }, { dataSources }) =>
      await dataSources.db.getUser({ id }),
    getUserGroceryLists: async (_, { owner }, { dataSources }) =>
      await dataSources.db.getUserGroceryLists({ owner }),
    getGroceryListItems: async (_, { list }, { dataSources }) =>
      await dataSources.db.getGroceryListItems({ list })
  },
  Mutation: {
    createGroceryList: async (_, { input }, { dataSources }) => {
      const list = await dataSources.db.createGroceryList({ input });
      const response = {
        code: list ? 200 : 500,
        success: list ? true : false,
        message: "Successfully created the list",
        list
      };
      return response;
    },
    createGroceryItem: async (_, { input }, { dataSources }) => {
      const item = await dataSources.db.createGroceryItem({ input });
      const response = {
        code: item ? 200 : 500,
        success: item ? true : false,
        message: "Successfully created the item",
        item
      };
      return response;
    },
    deleteGroceryList: async (_, { id }, { dataSources }) => {
      const res = await dataSources.db.deleteGroceryList({ id });
      const response = {
        code: res ? 200 : 500,
        success: res ? true : false,
        message: "Successfully deleted the item",
        list: res
      };
      return response;
    },
    deleteGroceryListItem: async (_, { id }, { dataSources }) => {
      const res = await dataSources.db.deleteGroceryListItem({ id });
      const response = {
        code: res ? 200 : 500,
        success: res ? true : false,
        message: "Successfully deleted the item",
        item: res
      };
      return response;
    },
    updateGroceryItem: async (_, { input }, { dataSources }) => {
      const res = await dataSources.db.updateGroceryItem({ input });
      const response = {
        code: res ? 200 : 500,
        success: res ? true : false,
        message: "Successfully updated the item",
        item: res
      };
      return response;
    },
    createUser: async (_, { input }, { dataSources }) => {
      try {
        const user = await dataSources.cognito.signUp(input.email);
        if (user) {
          // add the user to the database
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
  },
  GroceryList: {
    items: (parent, _, { dataSources }, info) => {
      return dataSources.db.getGroceryListItems({ list: parent.dataValues.id });
    }
  }
};
