const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const Supervisor = sequelize.define('Supervisor', {
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
  deptrelate: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  type: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
}, {
  tableName: 'supervisor',
  timestamps: false // Disable automatic timestamps
});

module.exports = Supervisor;