const sequelize = require('../config/dbConn').sequelize; // Import the sequelize instance
const moment = require('moment-timezone');
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        include: [
          [sequelize.literal("CASE WHEN role = '3' THEN 'Admin' WHEN role = '2' THEN 'Edit' ELSE 'User' END"), "rolesname"],
          [sequelize.literal("CASE WHEN level = '1' THEN 'User' WHEN level = '2' THEN 'Staff' ELSE 'Manager' END"), "levelname"],
        ],
        exclude: ['password', 'updateAt'],
      },
      order: [["updateAt", "DESC"]],
    });

    if (!users || users.length === 0) {
      return res.status(204).json({ message: "No users found" });
    }

    res.status(201).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  const userId = req?.params?.userid;
  if (!userId) return res.status(400).json({ message: "User ID required" });

  try {    
    const user = await User.findOne({
      attributes: {
        include: [
          // Include the computed column 'affiliationname'
          // Add the new computed column based on the 'title' field
          [sequelize.literal("CASE WHEN title LIKE '%นาง%' THEN 'F' ELSE 'M' END"), "sex"],
          [sequelize.literal("CASE WHEN role = '3' THEN 'Admin' WHEN role = '2' THEN 'Edit' ELSE 'User' END"), "rolesname"],
          [sequelize.literal("CASE WHEN level = '1' THEN 'User' WHEN level = '2' THEN 'Staff' ELSE 'Manager' END"), "levelname"],
        ],
        exclude: ['updateAt'], // Exclude password column
      },
      where: {
        userid: userId,
      }
    });
    
    if (!user) {
      return res.status(204).json({ message: `User ID ${userId} not found` });
    }
    // Fetch additional data from [10.1.1.117].[DNHOS].[dbo].[HNPAT_RIGHT]
    const hn = user.hn; // Assuming 'hn' is the key to match
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  // console.log(req?.body);
  if (!req?.body?.userid) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const userid = req?.body?.userid;
  try {
    console.log(userid);
    const user = await User.findOne({ where: { userid: userid } });

    if (!user) {
      return res.status(204).json({ message: `No user matches ID ${req.body.userid}.` });
    }

    const validColumns = req.body;
    console.log("Data sets:", validColumns);

    // Loop through validColumns and update or remove values as needed
    for (const column in validColumns) {
      if (
        validColumns[column] === undefined ||
        validColumns[column] === null ||
        validColumns[column] === "Invalid date"
      ) {
        // Delete the property (column) from jobDescription
        delete user[column];
        console.log("Removed column:", column);
      } else {
        // Update the property (column) in jobDescription
        user[column] = validColumns[column];
        console.log("Updated column:", column);
        console.log("Updated value:", validColumns[column]);
      }
    }
    // Additional logging to trace the flow
    console.log("Before saving user:");
    console.log(user.toJSON());

    const result = await user.save();
    // Additional logging after saving
    console.log("After saving user:");
    console.log(result.toJSON());

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred.", err: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
};