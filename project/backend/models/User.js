const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  hn: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  affiliation: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  jobtitle: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  faction: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  dep: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  role: {
    type: DataTypes.STRING(1),
    allowNull: false,
    defaultValue: '1'
  },
  level: {
    type: DataTypes.STRING(1),
    allowNull: false,
    defaultValue: '1'
  },
  createAt: {
    type: DataTypes.DATE,
    defaultValue:  sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: true
  },
  updateAt: {
    type: DataTypes.DATE,
    defaultValue:  sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false
  },
  deleteAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  // Model tableName will be the same as the model name
  tableName: 'user',
  timestamps: true, // Enable automatic timestamps
  createdAt: 'createAt',
  updatedAt: 'updateAt'
});

module.exports = User;