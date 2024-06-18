const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;
// const User = require("./User");

const Medication = sequelize.define('Medication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportid: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  hn: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  an: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  age: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  dx: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pct: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  occurrencedate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  deptrelate: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reporttype: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(3),
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
  prescribing: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prescribingremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dispensing: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dispensingremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  administration: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  administrationremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  level: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  effect: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  effectremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  drugrelate: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  drugremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  renew: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reportdoc: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  docname: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  medicalrecorded: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  reportacknowledge: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  reportother: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  otherremark: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  analysis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  solution: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rca: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rcaremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  formstatus: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
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
  updateby: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  updateAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approveby: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  approveAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleteAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'medication',
  timestamps: false
});

// Occurrences.belongsTo(User, {
//   foreignKey: 'createby',
//   targetKey: 'userid',
//   as: 'CreateBy',
// });

// Occurrences.belongsTo(User, {
//   foreignKey: 'acceptby',
//   targetKey: 'userid',
//   as: 'AcceptBy',
// });

// Occurrences.belongsTo(User, {
//   foreignKey: 'updateby',
//   targetKey: 'userid',
//   as: 'UpdateBy',
// });

module.exports = Medication;