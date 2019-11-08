module.exports = {
  Query: {
    getUser: (_, { id }, { dataSources }) => dataSources.db.getUser({ id }),
    getUserGroceryLists: (_, { owner }, { dataSources }) =>
      dataSources.db.getUserGroceryLists({ owner }),
    getGroceryListItems: (_, { list }, { dataSources }) =>
      dataSources.db.getGroceryListItems({ list })
  },
  Mutation: {
    createGroceryList: (_, { input }, { dataSources }) => {
      const list = dataSources.db.createGroceryList({ input });
      response = {
        code: list ? 200 : 500,
        success: list ? true : false,
        message: "Successfully created the list",
        list
      };
      return response;
    },
    createGroceryItem: (_, { input }, { dataSources }) => {
      const item = dataSources.db.createGroceryItem({ input });
      response = {
        code: item ? 200 : 500,
        success: item ? true : false,
        message: "Successfully created the item",
        item
      };
      return response;
    }
  }
};
