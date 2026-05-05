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
  name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  related: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(10),
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

  date: {
    type: DataTypes.DATE,
    allowNull: true
  },
    time: {
    type: DataTypes.TIME,
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
  record: {
    type: DataTypes.TEXT,
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
  complaints: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  involved: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  appeal: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  complaint: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  achievement: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prevent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summarize: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expectation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  decision: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  urgent: {
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
  renew: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  risk: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  record_other: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  complaints_other: {
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

  
  patient_hn: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  patient_name: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  patient_age: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  patient_an: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  patient_diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
     urgentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
    faction: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
}, {
  tableName: 'occurrences2',
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