const Sequelize = require("sequelize");
require("dotenv").config();

module.exports.createStore = () => {
  const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      define: {
        createdAt: "created_at",
        updatedAt: "updated_at"
      }
    }
  );

  // defining schemas
  const User = db.define("user", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4, // TODO: should not provide default value id. Should come from auth provider
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    created_at: {
      type: Sequelize.DATE
    },
    updated_at: {
      type: Sequelize.DATE
    }
  });
  const GroceryList = db.define("grocerylist", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE
    },
    updated_at: {
      type: Sequelize.DATE
    }
  });
  const GroceryItem = db.define("groceryitem", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: { type: Sequelize.STRING, allowNull: false },
    quantity: Sequelize.INTEGER,
    unit: Sequelize.STRING,
    created_at: {
      type: Sequelize.DATE
    },
    updated_at: {
      type: Sequelize.DATE
    }
  });

  // defining the relations
  GroceryList.belongsTo(User, {
    foreignKey: "owner",
    targetKey: "id",
    onDelete: "CASCADE",
    as: "listOwner"
  });
  User.hasMany(GroceryList, {
    foreignKey: "owner",
    targetKey: "id",
    as: "listOwner"
  });

  GroceryList.hasMany(GroceryItem, {
    foreignKey: "list",
    targetKey: "id",
    as: "items"
  });
  GroceryItem.belongsTo(GroceryList, {
    foreignKey: "list",
    targetKey: "id",
    onDelete: "CASCADE",
    as: "items"
  });
  // creates the model ListEditors with user and list as PK.
  // default onDelete is CASCADE
  GroceryList.belongsToMany(User, {
    through: "listeditors",
    foreignKey: "listid",
    as: "listEditors"
  });
  User.belongsToMany(GroceryList, {
    through: "listeditors",
    foreignKey: "userid",
    as: "listEditors"
  });
  return { GroceryList, GroceryItem, User, ListEditor: db.models.listeditors };
};
