const { sequelize } = require("../config/dbConn"); // Import the sequelize instance

// Main function to construct the JSON structure
const executeSQLQuery = async () => {
  try {
    // First query to get occurrences and user details
    const occQuery = `
    SELECT occ.*,
      CONCAT(u_request.title, ' ', u_request.name, ' ', u_request.lastname) AS requestby,
      u_request.dep AS requestdep,
      u_request.faction AS requestfac,
      u_request.affiliation AS requestaff,
      CONCAT(u_update.title, ' ', u_update.name, ' ', u_update.lastname) AS updateby,
      u_update.dep AS updatedep,
      u_update.faction AS updatefac,
      u_update.affiliation AS updateaff,
      CONCAT(u_accept.title, ' ', u_accept.name, ' ', u_accept.lastname) AS acceptby,
      u_accept.dep AS acceptdep,
      u_accept.faction AS acceptfac,
      u_accept.affiliation AS acceptaff,
      CASE WHEN occ.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename
    FROM [occurrence].[dbo].[occurrences] occ
    LEFT JOIN [occurrence].[dbo].[user] AS u_request ON u_request.userid = occ.createby
    LEFT JOIN [occurrence].[dbo].[user] AS u_update ON u_update.userid = occ.updateby
    LEFT JOIN [occurrence].[dbo].[user] AS u_accept ON u_accept.userid = occ.acceptby;
    `;
    const results = await sequelize.query(occQuery, {
      type: sequelize.Sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      // Fetch department and affiliation data using raw query
      const deptAffData = await sequelize.query(
        `SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName
         FROM [occurrence].[dbo].[department] d
         LEFT JOIN [occurrence].[dbo].[affiliation] a ON a.id = d.relateid`,
        { type: sequelize.Sequelize.QueryTypes.SELECT }
      );

      // Use map to parse JSON fields before sending the response
      const parsedResults = results.map(occurrence => {
        let deptRelateIds = [];

        try {
          // Parse deptrelate field assuming it's a JSON array of strings
          deptRelateIds = JSON.parse(occurrence.deptrelate || '[]').map(id => parseInt(id, 10));
        } catch (e) {
          // Handle parsing error if any
          console.error("Error parsing deptrelate:", e);
        }

        // Map deptRelateIds to department and affiliation data
        const deptAffInfo = deptRelateIds.map(id => {
          return deptAffData.find(dept => dept.id === id) || {};
        });

        return {
          ...occurrence,
          deptrelate: JSON.parse(occurrence.deptrelate || '[]'),
          patientcare: JSON.parse(occurrence.patientcare || '[]'),
          patientsupport: JSON.parse(occurrence.patientsupport || '[]'),
          utility: JSON.parse(occurrence.utility || '[]'),
          equipment: JSON.parse(occurrence.equipment || '[]'),
          safety: JSON.parse(occurrence.safety || '[]'),
          service: JSON.parse(occurrence.service || '[]'),
          management: JSON.parse(occurrence.management || '[]'),
          deptAffInfo
        };
      });

      return parsedResults;
    }
  } catch (error) {
    console.error("An error occurred while executing:", error);
  }
};

module.exports = {
  executeSQLQuery,
};
