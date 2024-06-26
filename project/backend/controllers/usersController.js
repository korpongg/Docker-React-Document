const sequelize = require('../config/dbConn').sequelize;
const User = require("../models/User");
const bcrypt = require('bcrypt');

// Create a new medication record
const createUser = async (req, res) => {
  try {
    // Generate hashed password
    const hashedPwd = await bcrypt.hash(req?.body?.userid, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPwd,
      createAt: sequelize.literal("CURRENT_TIMESTAMP")
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    const [results, metadata] = await sequelize.query(`
      SELECT u.*,
        CASE WHEN title LIKE '%นาง%' THEN 'F' ELSE 'M' END sex,
        CASE WHEN role = '3' THEN 'Admin' WHEN role = '2' THEN 'Edit' ELSE 'User' END rolesname,
        CASE WHEN level = '1' THEN 'User' WHEN level = '2' THEN 'Staff' ELSE 'Manager' END levelname,
        a.id AS AffID,
        d.id AS DepID
      FROM [user] u
      LEFT JOIN [affiliation] a ON a.name = u.affiliation
      LEFT JOIN [department] d ON d.name = u.dep
      WHERE u.userid = :userId;
    `, {
      replacements: { userId }
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// const getUser = async (req, res) => {
//   const userId = req?.params?.userid;
//   if (!userId) return res.status(400).json({ message: "User ID required" });

//   try {    
//     const user = await User.findOne({
//       attributes: {
//         include: [
//           // Include the computed column 'affiliationname'
//           // Add the new computed column based on the 'title' field
//           [sequelize.literal("CASE WHEN title LIKE '%นาง%' THEN 'F' ELSE 'M' END"), "sex"],
//           [sequelize.literal("CASE WHEN role = '3' THEN 'Admin' WHEN role = '2' THEN 'Edit' ELSE 'User' END"), "rolesname"],
//           [sequelize.literal("CASE WHEN level = '1' THEN 'User' WHEN level = '2' THEN 'Staff' ELSE 'Manager' END"), "levelname"],
//         ],
//         exclude: ['updateAt'], // Exclude password column
//       },
//       where: {
//         userid: userId,
//       }
//     });
    
//     if (!user) {
//       return res.status(204).json({ message: `User ID ${userId} not found` });
//     }
//     // Fetch additional data from [10.1.1.117].[DNHOS].[dbo].[HNPAT_RIGHT]
//     const hn = user.hn; // Assuming 'hn' is the key to match
//     res.status(201).json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

const updateUser = async (req, res) => {
  // console.log(req?.body);
  if (!req?.body?.userid) {
    return res.status(400).json({ message: "userid is required." });
  }

  const userid = req?.body?.userid;
  try {
    console.log(userid);
    const user = await User.findOne({ where: { userid: userid } });

    // if (!user) {
    //   if (
    //     !req?.body?.title ||
    //     !req?.body?.name ||
    //     !req?.body?.lastname ||
    //     !req?.body?.affiliation ||
    //     !req?.body?.faction ||
    //     !req?.body?.dep ||
    //     typeof req.body.title !== 'string' || req.body.title.trim().length < 1 ||
    //     typeof req.body.name !== 'string' || req.body.name.trim().length < 1 ||
    //     typeof req.body.lastname !== 'string' || req.body.lastname.trim().length < 1 ||
    //     typeof req.body.affiliation !== 'string' || req.body.affiliation.trim().length < 1 ||
    //     typeof req.body.faction !== 'string' || req.body.faction.trim().length < 1 ||
    //     typeof req.body.dep !== 'string' || req.body.dep.trim().length < 1
    //   ) {
    //     return res.status(400).json({ message: "userid, title, name, lastname, affiliation, faction and dep are required fields with valid non-empty string values." });
    //   }

    //   console.log(`User with ID ${userid} not found. Creating a new user.`);

    //   // Generate hashed password
    //   const hashedPwd = await bcrypt.hash(req?.body?.userid, 10);

    //   // Create new user with hashed password
    //   user = await User.create({ ...req.body, password: hashedPwd });

    //   return res.status(201).json(user); // Return newly created user
    // }

    if (!user) {
      return res.status(204).json({ message: "not fond user" });
    }

    const validColumns = req.body;
    console.log("Data sets:", validColumns);

    // Validate and format the deleteAt field
    if (validColumns.deleteAt) {
      const deleteAtDate = moment(validColumns.deleteAt).format('YYYY-MM-DD HH:mm:ss');
      validColumns.deleteAt = deleteAtDate
    }

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
// const updateUser = async (req, res) => {
//   // console.log(req?.body);
//   if (!req?.body?.userid) {
//     return res.status(400).json({ message: "ID parameter is required." });
//   }

//   const userid = req?.body?.userid;
//   try {
//     console.log(userid);
//     const user = await User.findOne({ where: { userid: userid } });

//     if (!user) {
//       return res.status(204).json({ message: `No user matches ID ${req.body.userid}.` });
//     }

//     const validColumns = req.body;
//     console.log("Data sets:", validColumns);

//     // Loop through validColumns and update or remove values as needed
//     for (const column in validColumns) {
//       if (
//         validColumns[column] === undefined ||
//         validColumns[column] === null ||
//         validColumns[column] === "Invalid date"
//       ) {
//         // Delete the property (column) from jobDescription
//         delete user[column];
//         console.log("Removed column:", column);
//       } else {
//         // Update the property (column) in jobDescription
//         user[column] = validColumns[column];
//         console.log("Updated column:", column);
//         console.log("Updated value:", validColumns[column]);
//       }
//     }
//     // Additional logging to trace the flow
//     console.log("Before saving user:");
//     console.log(user.toJSON());

//     const result = await user.save();
//     // Additional logging after saving
//     console.log("After saving user:");
//     console.log(result.toJSON());

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "An error occurred.", err: err.message });
//   }
// };

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
};