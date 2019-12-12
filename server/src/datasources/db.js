const { DataSource } = require("apollo-datasource");
const Sequelize = require("sequelize");

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
      where: {
        [Sequelize.Op.or]: [{ owner }, { "$listEditors.id$": owner }]
      },
      include: [
        {
          as: "listEditors",
          model: this.store.User,
          through: { attributes: [] }
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
          console.log(list);
          list.isOwner = list.owner === owner;
          list.owner = list.listOwner;
          return list;
        })
      : null;
  }

  async getListEditors({ listid }) {
    const listItem = await this.store.GroceryList.findByPk(listid, {
      attributes: [],
      include: [
        { as: "listOwner", model: this.store.User },
        {
          as: "listEditors",
          model: this.store.User,
          through: { attributes: [] }
        }
      ]
    });
    const list = listItem.get({ plain: true });
    //? Append listOwner: true?
    list.listEditors.push(list.listOwner);
    return list ? list.listEditors : null;
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
    return res ? res.get({ plain: true }) : null;
  }

  async createListEditor({ listid, email }) {
    const user = await this.store.User.findOne({
      where: { email },
      attributes: ["id"]
    });
    if (!user) return null; // TODO: error message should be that the user doesn't exist
    const userid = user.get({ plain: true }).id;
    const editor = await this.store.ListEditor.create({ listid, userid });
    return editor ? { email } : null;
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

  async updateListTitle({ id, title }) {
    const updatedList = await this.store.GroceryList.update(
      { title },
      {
        where: { id },
        fields: ["title"],
        returning: true,
        plain: true
      }
    );
    return updatedList[1] ? updatedList[1].get({ plain: true }) : null;
  }

  async updateGroceryItem({ input }) {
    const res = await this.store.GroceryItem.update(input, {
      where: { id: input.id },
      // fields: ["name", "quantity", "unit"],
      returning: true,
      plain: true
    });
    return res[1] ? res[1].get({ plain: true }) : null;
  }

  // -- DELETE --
  async deleteGroceryList({ id }) {
    const res = await this.store.GroceryList.destroy({ where: { id } });
    return res && res === 1 ? { id } : null;
  }

  async deleteListEditor({ listid, email }) {
    const user = await this.store.User.findOne({
      where: { email },
      attributes: ["id"]
    });
    const userid = user.get({ plain: true }).id;
    const deleted = await this.store.ListEditor.destroy({
      where: { listid, userid }
    });
    return deleted === 1 ? { email } : null;
  }

  async deleteGroceryListItem({ id }) {
    const res = await this.store.GroceryItem.destroy({ where: { id } });
    return res && res === 1 ? { id } : null;
  }
}

module.exports = DB;
