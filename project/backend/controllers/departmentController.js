const sequelize = require("../config/dbConn").sequelize;
const Department = require('../models/Department');

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  try {
    const [results, metadata] = await sequelize.query(`
      SELECT d.id,
        d.name AS DepName,
        a.id AS AffID,
        a.name AS AffName
      FROM [occurrence].[dbo].[department] d
      LEFT JOIN [occurrence].[dbo].[affiliation] a ON a.id = d.[relateid]
    `);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  try {
    const id = req.params.id;
    const [results, metadata] = await sequelize.query(`
      SELECT d.id,
        d.name AS DepName,
        a.id AS AffID,
        a.name AS AffName
      FROM [occurrence].[dbo].[department] d
      LEFT JOIN [occurrence].[dbo].[affiliation] a ON a.id = d.[relateid]
      WHERE d.id = :id
    `, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    console.log(results)

    if (results) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status500.json({ error: error.message });
  }
};
