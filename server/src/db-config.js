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
  const users = db.define("user", {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4, // TODO: should not create id. Should come from auth provider
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    created_at: {
      type: Sequelize.DATE
    },
    updated_at: {
      type: Sequelize.DATE
    }
  });
  const groceryLists = db.define("grocerylist", {
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
  const groceryItems = db.define("groceryitem", {
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
  groceryLists.belongsTo(users, {
    foreignKey: "owner",
    targetKey: "id",
    onDelete: "CASCADE"
  });
  groceryLists.hasMany(groceryItems, {
    foreignKey: "list",
    targetKey: "id"
  });
  users.hasMany(groceryLists, {
    foreignKey: "owner",
    targetKey: "id"
  });
  groceryItems.belongsTo(groceryLists, {
    foreignKey: "list",
    targetKey: "id",
    onDelete: "CASCADE"
  });

  return { groceryLists, groceryItems, users };
};
