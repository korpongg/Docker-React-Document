const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const personcomplaint = sequelize.define('personcomplaint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportid: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
    number: {
    type: DataTypes.NUMBER,
    allowNull: true
  },
    id_document: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  department: {
    type: DataTypes.STRING(20),
    allowNull: true
  },


  faction: {
    type: DataTypes.STRING(250),
    allowNull: true
  },
  createby: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  createAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updateAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
date_document: {
    type: DataTypes.DATE,
    allowNull: true
  },
  program_document: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  urgent:{
 type: DataTypes.STRING(1),
    allowNull: true
  },
  status:{
 type: DataTypes.INTEGER(1),
    allowNull: true
  },
  reply:{
 type: DataTypes.STRING(1),
    allowNull: true
  },
  date_received:{
 type: DataTypes.DATE,
    allowNull: true
  },
  department_received:{
 type: DataTypes.STRING(20),
    allowNull: true
  },
  ordinal_number :{
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'person_complaint',
  timestamps: false // Disable automatic timestamps
});

module.exports = personcomplaint;