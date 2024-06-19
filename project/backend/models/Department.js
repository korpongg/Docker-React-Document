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
  },
  email: {
    type: DataTypes.STRING(50), // Explicitly define length for email
    allowNull: true, // This is the default setting, so it's optional
    // defaultValue: null // Explicitly set the default value to null
  }
}, {
  tableName: 'department',
  timestamps: false // Disable automatic timestamps
});

module.exports = Department;