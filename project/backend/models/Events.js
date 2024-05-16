const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;
const User = require("./User");

const Events = sequelize.define('Events', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportid: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  deptrelate: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  acceptdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  responsedate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  urgenttype: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  isnew: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  userid: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  createAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('GETDATE()'),
    allowNull: false
  }
}, {
  tableName: 'event_logs',
  timestamps: false // Disable automatic timestamps
});

Events.belongsTo(User, {
  foreignKey: 'userid',
  targetKey: 'userid',
  as: 'CreateBy',
});

module.exports = Events;