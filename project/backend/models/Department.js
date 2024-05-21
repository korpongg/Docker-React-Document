const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  relateid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING, // Use STRING for NVARCHAR(MAX)
    allowNull: false
  }
}, {
  tableName: 'department',
  timestamps: false // Disable automatic timestamps
});

module.exports = Department;