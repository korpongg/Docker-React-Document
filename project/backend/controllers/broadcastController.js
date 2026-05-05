const { sequelize } = require("../config/dbConn");
const { QueryTypes } = require("sequelize");

const DB_NAME = process.env.DB_NAME;


const getCenter1 = async (payload = {}) => {
  
};


const getCenter2 = async (payload = {}) => {
  try {
    const { createby, excludeStatus } = payload;
   //  ${createby ? `WHERE person.createby = :createby` : ""}
    const occQuery = `
      SELECT
        reportid,
        person.id as id,
        id_document,
        department,
        faction,
        createby,
        createAt,
        ordinal_number,
        date_document,
        program_document,
        urgent,
        status,
        reply,
        date_received,
        department_received,
        dep.name as dep_name_send,
        dep2.name as dep_name_received
      FROM [dbo].[department_list] as person
      LEFT JOIN [dbo].[department] as dep ON person.department = dep.id
      LEFT JOIN [dbo].[department] as dep2 ON person.department_received = dep2.id
       

      ORDER BY person.updateAt DESC, person.createAt DESC
    `;

    const results = await sequelize.query(occQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { createby, excludeStatus },
    });

    return results;
  } catch (error) {
    console.error("An error occurred while executing:", error);
    return [];
  }
};

const getCenter3 = async (payload = {}) => {
  
};


const getCenter4 = async (payload = {}) => {

};


module.exports = {
  getCenter1,
  getCenter2,
  getCenter3,
  getCenter4,
};