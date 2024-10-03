const sequelize = require("../config/dbConn").sequelize;
const Department = require('../models/Department');
const DB_NAME = process.env.DB_NAME;

// Helper function to handle errors
const handleError = (res, error) => {
  res.status(500).json({ error: error.message });
};

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    handleError(res, error);
  }
};

// Get all departments
// exports.getAllDepartments = async (req, res) => {
//   try {
//     const departments = await Department.findAll();
//     res.status(200).json(departments);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get all departments with custom SQL
exports.getAllDepartments = async (req, res) => {
  const sql = `
    SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName, d.email
    FROM ${DB_NAME}.[dbo].[department] d
    LEFT JOIN ${DB_NAME}.[dbo].[affiliation] a ON a.id = d.[relateid]
    -- WHERE d.id NOT IN ('89', '90')
    ORDER BY d.id ASC
  `;
  
  try {
    const [results] = await sequelize.query(sql);
    res.status(200).json(results);
  } catch (error) {
    handleError(res, error);
  }
};

// Get a single department by ID
// exports.getDepartmentById = async (req, res) => {
//   try {
//     const department = await Department.findByPk(req.params.id);
//     if (department) {
//       res.status(200).json(department);
//     } else {
//       res.status(404).json({ message: 'Department not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get a single department by ID with custom SQL
exports.getDepartmentById = async (req, res) => {
  const sql = `
    SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName, d.email
    FROM ${DB_NAME}.[dbo].[department] d
    LEFT JOIN ${DB_NAME}.[dbo].[affiliation] a ON a.id = d.[relateid]
    WHERE d.id = :id
  `;
  
  try {
    const [results] = await sequelize.query(sql, {
      replacements: { id: req.params.id },
      type: sequelize.QueryTypes.SELECT
    });

    if (results) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
};
exports.getAllDepartmentMed = async (req, res) => {
  const sql = `
    SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName
    FROM ${DB_NAME}.[dbo].[department] d
    LEFT JOIN ${DB_NAME}.[dbo].[affiliation] a ON a.id = d.[relateid]
    -- WHERE (d.relateid IN ('3', '5') OR d.id IN ('13', '146', '152', '153'))
    WHERE (d.relateid IN ('3', '5') OR d.name LIKE 'เภสัชกรรม%')
    AND d.id NOT IN ('69', '84', '89', '90', '140')
  `;
  
  try {
    const [results] = await sequelize.query(sql);
    res.status(200).json(results);
  } catch (error) {
    handleError(res, error);
  }
};

// Update a department
exports.updateDepartment = async (req, res) => {
  try {
    const [updated] = await Department.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated) {
      const updatedDepartment = await Department.findByPk(req.params.id);
      res.status(200).json(updatedDepartment);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a department
exports.deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.destroy({
      where: { id: req.params.id }
    });

    if (deleted) {
      res.status(204).json({ message: 'Department deleted' });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
};
