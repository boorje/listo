const { DataSource } = require("apollo-datasource");

class DB extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  // -- READ --
  async getUser({ id }) {
    const user = await this.store.users.findByPk(id);
    return user && user.dataValues ? user.dataValues : null;
  }

  async findOrCreateUser({ id }) {
    const user = await this.store.users.findOrCreate({ where: { id } });
    return user && user[0] ? user[0].dataValues : null;
  }

  async getUserGroceryLists({ owner }) {
    const lists = await this.store.groceryLists.findAll({
      where: { owner }
    });
    return lists ? lists : null;
  }

  async getGroceryListItems({ list }) {
    const items = await this.store.groceryItems.findAll({
      where: { list }
    });
    return items ? items : null;
  }

  // -- CREATE --
  async createGroceryList({ input }) {
    const { title, owner } = input;
    const res = await this.store.groceryLists.create({ title, owner });
    return res && res.dataValues ? res.dataValues : null;
  }

  async createGroceryItem({ input }) {
    const res = await this.store.groceryItems.create(input);
    return res && res.dataValues ? res.dataValues : null;
  }

  // -- UPDATE --
  async updateGroceryItem({ input }) {
    const res = await this.store.groceryItems.update(input, {
      where: { id: input.id },
      returning: true,
      plain: true
    });
    return res && res[1] && res[1].dataValues ? res[1].dataValues : null;
  }

  // -- DELETE --
  async deleteGroceryList({ id }) {
    const res = await this.store.groceryLists.destroy({ where: { id } });
    return res && res === 1 ? { id } : null;
  }

  async deleteGroceryListItem({ id }) {
    const res = await this.store.groceryItems.destroy({ where: { id } });
    return res && res === 1 ? { id } : null;
  }
}

module.exports = DB;
