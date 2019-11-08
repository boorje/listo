const { DataSource } = require("apollo-datasource");

class DB extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getUser({ id }) {
    const user = await this.store.users.findByPk(id);
    return user && user.dataValues ? user.dataValues : null;
  }

  async getUserGroceryLists({ owner }) {
    const lists = await this.store.groceryLists.findAll({
      where: { owner },
      include: [
        {
          model: this.store.groceryItems,
          where: { list: "c425e503-7fdc-4a2b-b970-427d458740ff" }
        }
      ]
    });
    console.log(lists);
    return lists ? lists : null;
  }

  async getGroceryListItems({ list }) {
    const items = await this.store.groceryItems.findAll({
      where: { list }
    });
    return items ? items : null;
  }

  async createGroceryList({ input }) {
    const { title, owner } = input;
    const res = await this.store.groceryLists.create({ title, owner });
    return res && res.dataValues ? res.dataValues : null;
  }

  async createGroceryItem({ input }) {
    const res = await this.store.groceryItems.create(input);
    return res && res.dataValues ? res.dataValues : null;
  }
}

module.exports = DB;
