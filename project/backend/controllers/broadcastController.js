const sequelize = require('../config/dbConn').sequelize; // Import the sequelize instance

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
      LEFT JOIN [occurrence].[dbo].[user] AS u_accept ON u_accept.userid = occ.acceptby
      ORDER BY CASE WHEN occ.formstatus = '1' THEN 0 ELSE 1 END;
    `;
    const results = await sequelize.query(occQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      // Fetch department and affiliation data using raw query
      const deptAffData = await sequelize.query(
        `SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName
         FROM [occurrence].[dbo].[department] d
         LEFT JOIN [occurrence].[dbo].[affiliation] a ON a.id = d.relateid`,
        { type: sequelize.QueryTypes.SELECT }
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
    return [];
  } catch (error) {
    console.error("An error occurred while executing:", error);
    return [];
  }
};

const executeSQLQueryEvent = async (dep) => {
  try {
    // First query to get occurrences and user details
    const eventQuery = `
      SELECT e.id,
        e.reportid,
        e.code,
        CASE WHEN o.hn IS NULL THEN o.an ELSE o.hn END AS hn,
        o.occurrencedate,
        e.deptrelate,
        d.name AS depname,
        CASE WHEN o.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename,
        o.level,
        o.description,
        e.comment,
        e.summarydetail,
        o.activefailure,
        e.urgenttype,
        e.isnew,
        e.status,
        e.createby,
        CONCAT(u_request.title, ' ', u_request.name, ' ', u_request.lastname) AS createname,
        u_request.dep AS createdep,
        u_request.faction AS createfac,
        u_request.affiliation AS createaff,
        e.createAt,
        e.acceptby,
        CONCAT(u_accept.title, ' ', u_accept.name, ' ', u_accept.lastname) AS acceptname,
        u_accept.dep AS acceptdep,
        u_accept.faction AS acceptfac,
        u_accept.affiliation AS acceptaff,
        e.acceptAt,
        e.repeatAt,
        e.responsedate
      FROM [occurrence].[dbo].[event_logs] e
      LEFT JOIN [occurrence].[dbo].[occurrences] o ON o.reportid = e.reportid
      LEFT JOIN [occurrence].[dbo].[department] d ON d.id = e.deptrelate
      LEFT JOIN [occurrence].[dbo].[user] AS u_request ON u_request.userid = e.createby
      LEFT JOIN [occurrence].[dbo].[user] AS u_accept ON u_accept.userid = e.acceptby
      ${dep ? `WHERE d.name = :dep` : ''}
      ORDER BY e.createAt DESC;
    `;
    const results = await sequelize.query(eventQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { dep }
    });

    if (results.length > 0) {
      return results;
    }
    return [];
  } catch (error) {
    console.error("An error occurred while executing:", error);
    return [];
  }
};

module.exports = {
  executeSQLQuery,
  executeSQLQueryEvent
};