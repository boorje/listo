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
    owner: {
      type: Sequelize.UUIDV4,
      references: {
        model: "user",
        key: "id",
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
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
    list: {
      type: Sequelize.UUIDV4,
      references: {
        model: "grocerylist",
        key: "id",
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    created_at: {
      type: Sequelize.DATE
    },
    updated_at: {
      type: Sequelize.DATE
    }
  });
  return { groceryLists, groceryItems, users };
};
