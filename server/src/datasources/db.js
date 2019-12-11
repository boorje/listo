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
  async getUserGroceryLists({ owner }) {
    const lists = await this.store.GroceryList.findAll({
      include: [
        {
          as: "listEditors",
          model: this.store.User,
          through: { attributes: [] },
          where: { id: owner }
        },
        {
          model: this.store.User,
          as: "listOwner"
        },
        {
          model: this.store.GroceryItem,
          as: "items"
        }
      ]
    });
    return lists
      ? lists.map(list => {
          list = list.get({ plain: true });
          list.isOwner = list.owner === owner;
          list.owner = list.listOwner;
          return list;
        })
      : null;
  }

  async getListEditors({ listid }) {
    const list = await this.store.GroceryList.findByPk(listid, {
      include: [
        {
          as: "listEditors",
          model: this.store.User,
          through: { attributes: [] }
        }
      ]
    });
    return list ? list.get({ plain: true }).listEditors : null;
  }

  async findOrCreateUser({ id, attributes }) {
    const [user] = await this.store.User.findOrCreate({
      where: { id },
      defaults: attributes
    });
    return user
      ? user.get({
          plain: true
        })
      : null;
  }

  async getGroceryListItems({ list }) {
    const items = await this.store.GroceryItem.findAll({
      where: { list }
    });
    return items ? items : null;
  }

  // -- CREATE --
  async createGroceryList({ input }) {
    const { title, owner } = input;
    const res = await this.store.GroceryList.create({ title, owner });
    return res && res.dataValues ? res.dataValues : null;
  }

  async createGroceryItem({ input }) {
    const res = await this.store.GroceryItem.create(input);
    return res && res.dataValues ? res.dataValues : null;
  }

  async createUser(input) {
    const { id, email } = input;
    const user = await this.store.User.create({ id, email });
    return user
      ? user.get({
          plain: true
        })
      : null;
  }

  // -- UPDATE --
  async updateGroceryItem({ input }) {
    const res = await this.store.GroceryItem.update(input, {
      where: { id: input.id },
      returning: true,
      plain: true
    });
    return res && res[1] && res[1].dataValues ? res[1].dataValues : null;
  }

  // -- DELETE --
  async deleteGroceryList({ id }) {
    const res = await this.store.GroceryList.destroy({ where: { id } });
    return res && res === 1 ? { id } : null;
  }

  async deleteGroceryListItem({ id }) {
    const res = await this.store.GroceryItem.destroy({ where: { id } });
    return res && res === 1 ? { id } : null;
  }
}

module.exports = DB;
