const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;
// const User = require("./User");

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
  board: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // reportdate: {
  //   type: DataTypes.DATEONLY,
  //   allowNull: false
  // },
  occurrencedate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // affrelate: {
  //   type: DataTypes.STRING(100),
  //   allowNull: false
  // },
  deptrelate: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  reporttype: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  type: {
    type: DataTypes.STRING(3),
    allowNull: true
  },
  risk: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  quality: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // urgenttype: {
  //   type: DataTypes.STRING(1),
  //   allowNull: true
  // },
  // isnew: {
  //   type: DataTypes.STRING(1),
  //   allowNull: true
  // },
  nurse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  administer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  operation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  director: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  doctor: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  compensation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  respond_radio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  respond_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summary_reply: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summary_analysis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summary_solving: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  manager: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  managementremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  level: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  renew: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  effectremark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reportdoc: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  docname: {
    type: DataTypes.TEXT,
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
  acceptby: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  acceptAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleteAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
    deptrelate2: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

complainant: {
    type: DataTypes.STRING(1),
    allowNull: true
  },

  problem:{
    type: DataTypes.STRING(1),
    allowNull: true
  }
}, {
  tableName: 'occurrences',
  timestamps: false // Disable automatic timestamps
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

module.exports = Occurrences;