const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;
const User = require("./User");

const Occurrences = sequelize.define('Occurrences', {
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
  reportlocation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reportdate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  occurrencedate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  deptrelate: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  reporttype: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(1),
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
  patientcare: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  patientcareremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  patientsupport: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  patientsupportremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  utility: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  utilityremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  equipment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  equipmentremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  safety: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  safetyremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  service: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  serviceremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  management: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  managementremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  level: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  effectremark: {
    type: DataTypes.TEXT,
    allowNull: false
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
  impromptusolution: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activefailure: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  suggestion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  formstatus: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  createby: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  acceptby: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  updateby: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  createAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  acceptAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updateAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleteAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'occurrences',
  timestamps: false // Disable automatic timestamps
});

Occurrences.belongsTo(User, {
  foreignKey: 'createby',
  targetKey: 'userid',
  as: 'CreateBy',
});

Occurrences.belongsTo(User, {
  foreignKey: 'acceptby',
  targetKey: 'userid',
  as: 'AcceptBy',
});

Occurrences.belongsTo(User, {
  foreignKey: 'updateby',
  targetKey: 'userid',
  as: 'UpdateBy',
});

module.exports = Occurrences;