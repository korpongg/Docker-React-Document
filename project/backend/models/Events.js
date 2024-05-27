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
  // affrelate: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // },
  deptrelate: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  urgenttype: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summarydetail: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  createby: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  createAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('GETDATE()'),
    allowNull: false
  },
  acceptby: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  acceptAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  responsedate: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
  tableName: 'event_logs',
  timestamps: false, // Disable automatic timestamps
  hooks: {
    afterDestroy: async (event, options) => {
      try {
        const resetIdentityQuery = `
          DECLARE @max INT;
          SELECT @max = MAX([id]) FROM [event_logs];
          IF @max IS NULL SET @max = 0;
          DBCC CHECKIDENT ('[event_logs]', RESEED, @max);
        `;

        await sequelize.query(resetIdentityQuery);
      } catch (error) {
        console.error('Error executing afterDestroy hook:', error);
      }
    }
  }
});

Events.belongsTo(User, {
  foreignKey: 'createby',
  targetKey: 'userid',
  as: 'CreateBy',
});

Events.belongsTo(User, {
  foreignKey: 'acceptby',
  targetKey: 'userid',
  as: 'AcceptBy',
});

module.exports = Events;