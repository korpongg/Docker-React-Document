const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const Affiliation = sequelize.define('Affiliation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING, // Use STRING for NVARCHAR(MAX)
    allowNull: false
  }
}, {
  tableName: 'affiliation',
  timestamps: false // Disable automatic timestamps
});

module.exports = Affiliation;