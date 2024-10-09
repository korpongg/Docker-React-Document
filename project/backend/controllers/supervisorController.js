const sequelize = require("../config/dbConn").sequelize;
const Supervisor = require('../models/Supervisor');
const User = require('../models/User');
const DB_NAME = process.env.DB_NAME;

// Helper function to handle errors
const handleError = (res, error) => {
  res.status(500).json({ error: error.message });
};

// Create a new supervisor
exports.createSupervisor = async (req, res) => {
  try {
    // Remove whitespace from userid
    const userid = req.body.userid.trim();
    const { type } = req.body;

    // Check if the userid exists in the User model
    const userExists = await User.findOne({ where: { userid } });
    
    if (!userExists) {
      return res.status(404).json({ error: 'User with this userid does not exist' });
    }

    // Check if a supervisor with the same userid and type already exists
    const existingSupervisor = await Supervisor.findOne({ where: { userid, type } });
    
    if (existingSupervisor) {
      return res.status(409).json({ error: 'Supervisor with this userid and type already exists' });
    }

    // Create a new supervisor with trimmed userid
    const supervisor = await Supervisor.create({ ...req.body, userid });
    res.status(201).json(supervisor);
  } catch (error) {
    handleError(res, error);
  }
};


// Get all supervisor
// exports.getAllSupervisor = async (req, res) => {
//   try {
//     const supervisor = await Supervisor.findAll();
//     res.status(200).json(supervisor);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get all supervisor with custom SQL
exports.getAllSupervisor = async (req, res) => {
  try {
    const sql = `
      SELECT s.id,
        CONCAT(u.title, ' ', u.name, ' ', u.lastname) AS supName,
        CASE WHEN s.type = '0' THEN 'Occurrence' ELSE 'Medication' END AS typename,
        s.deptrelate
      FROM ${DB_NAME}.[dbo].[supervisor] s
      LEFT JOIN ${DB_NAME}.[dbo].[user] u ON u.userid = s.userid
      ORDER BY s.id ASC
    `;
    
    const results = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      // Fetch department and affiliation data
      const deptAffData = await sequelize.query(
        `SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName
         FROM ${DB_NAME}.[dbo].[department] d
         LEFT JOIN ${DB_NAME}.[dbo].[affiliation] a ON a.id = d.relateid`,
        { type: sequelize.QueryTypes.SELECT }
      );

      // Parse and map data
      const parsedResults = results.map(supervisor => {
        let deptRelateIds = [];

        try {
          // Parse deptrelate as JSON
          deptRelateIds = JSON.parse(supervisor.deptrelate || '[]').map(id => parseInt(id, 10));
        } catch (e) {
          console.error("Error parsing deptrelate:", e);
        }

        // Map department and affiliation info
        const deptAffInfo = deptRelateIds.map(id => {
          return deptAffData.find(dept => dept.id === id) || {};
        });

        return {
          ...supervisor,
          deptrelate: JSON.parse(supervisor.deptrelate || '[]'),
          deptAffInfo,
        };
      });

      res.status(200).json(parsedResults);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Get a single supervisor by ID
exports.getSupervisorById = async (req, res) => {
  try {
    const supervisor = await Supervisor.findByPk(req.params.id);

    if (supervisor) {
      const supervisorData = {
        ...supervisor.toJSON(),
        deptrelate: JSON.parse(supervisor.deptrelate || '[]')
      };

      res.status(200).json(supervisorData);
    } else {
      res.status(204).json({ message: 'Supervisor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single supervisor by UserID
exports.getSupervisorByUserId = async (req, res) => {
  try {
    const supervisor = await Supervisor.findOne({ where: { userid: req.params.userid } });

    if (supervisor) {
      const supervisorData = {
        ...supervisor.toJSON(),
        deptrelate: JSON.parse(supervisor.deptrelate || '[]')
      };

      res.status(200).json(supervisorData);
    } else {
      res.status(204).json({ message: 'Supervisor not found1' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an supervisor
exports.updateSupervisor = async (req, res) => {
  try {
    const [updated] = await Supervisor.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedSupervisor = await Supervisor.findByPk(req.params.id);
      res.status(200).json(updatedSupervisor);
    } else {
      res.status(204).json({ message: 'Supervisor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an supervisor
exports.deleteSupervisor = async (req, res) => {
  try {
    const deleted = await Supervisor.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Supervisor deleted' });
    } else {
      res.status(204).json({ message: 'Supervisor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
