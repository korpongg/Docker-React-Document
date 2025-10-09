const sequelize = require('../config/dbConn').sequelize; // Import the sequelize instance
const DB_NAME = process.env.DB_NAME;

// Main function to construct the JSON structure
const executeSQLQuery = async () => {
  try {
    // First query to get occurrences and user details
    const occQuery = `
      SELECT occ.*,
        CONCAT(u_request.title, ' ', u_request.name, ' ', u_request.lastname) AS requestby,
        u_request.dep AS requestdep,
        dep.id AS requestdepID,
        u_request.faction AS requestfac,
        u_request.affiliation AS requestaff,
        CASE
          WHEN u_update.userid IS NULL THEN NULL
          ELSE CONCAT(u_update.title, ' ', u_update.name, ' ', u_update.lastname)
        END AS updateby,
        u_update.dep AS updatedep,
        u_update.faction AS updatefac,
        u_update.affiliation AS updateaff,
        CASE 
          WHEN u_accept.userid IS NULL THEN NULL
          ELSE CONCAT(u_accept.title, ' ', u_accept.name, ' ', u_accept.lastname)
        END AS acceptby,
        u_accept.dep AS acceptdep,
        u_accept.faction AS acceptfac,
        u_accept.affiliation AS acceptaff,
        CASE WHEN occ.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename
      FROM ${DB_NAME}.[dbo].[occurrences] occ
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_request ON u_request.userid = occ.createby
      LEFT JOIN ${DB_NAME}.[dbo].[affiliation] AS aff ON aff.name = u_request.affiliation
      LEFT JOIN ${DB_NAME}.[dbo].[department] AS dep ON dep.name = u_request.dep AND dep.relateid = aff.id
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_update ON u_update.userid = occ.updateby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_accept ON u_accept.userid = occ.acceptby
      WHERE occ.createAt BETWEEN DATEADD(MONTH, -2, GETDATE()) AND GETDATE()
      ORDER BY 
        CASE 
          WHEN occ.formstatus = '1' THEN 1
          WHEN occ.formstatus = '2' THEN 2
          WHEN occ.formstatus = '4' THEN 3
          WHEN occ.formstatus = '0' THEN 4
          WHEN occ.formstatus = '5' THEN 5
          WHEN occ.formstatus = '3' THEN 6
          ELSE 6 
        END;
    `;
    const results = await sequelize.query(occQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      // Fetch department and affiliation data using raw query
      const deptAffData = await sequelize.query(
        `SELECT d.id, d.name AS DepName, a.id AS AffID, a.name AS AffName
         FROM ${DB_NAME}.[dbo].[department] d
         LEFT JOIN ${DB_NAME}.[dbo].[affiliation] a ON a.id = d.relateid`,
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

const executeSQLQueryMedication = async () => {
  try {
    // First query to get occurrences and user details
    const medQuery = `
      SELECT med.*,
        CONCAT(u_request.title, ' ', u_request.name, ' ', u_request.lastname) AS requestby,
        u_request.dep AS requestdep,
        u_request.faction AS requestfac,
        u_request.affiliation AS requestaff,
        CASE
          WHEN u_update.userid IS NULL THEN NULL
          ELSE CONCAT(u_update.title, ' ', u_update.name, ' ', u_update.lastname)
        END AS updateby,
        u_update.dep AS updatedep,
        u_update.faction AS updatefac,
        u_update.affiliation AS updateaff,
        CASE 
          WHEN u_approve.userid IS NULL THEN NULL
          ELSE CONCAT(u_approve.title, ' ', u_approve.name, ' ', u_approve.lastname)
        END AS approveby,
        u_approve.dep AS approvedep,
        u_approve.faction AS approvefac,
        u_approve.affiliation AS approveaff,
        CASE WHEN med.reporttype = '0' THEN 'General Risk' ELSE 'Clinical Risk' END AS reporttypename,
        dep.id AS DepID,
        dep.name AS DepName,
        aff.id AS AffID,
        aff.name AS AffName
      FROM ${DB_NAME}.[dbo].[medication] med
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_request ON u_request.userid = med.createby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_update ON u_update.userid = med.updateby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_approve ON u_approve.userid = med.approveby
      LEFT JOIN ${DB_NAME}.[dbo].[department] as dep ON dep.id = med.deptrelate
      LEFT JOIN ${DB_NAME}.[dbo].[affiliation] as aff ON aff.id = dep.relateid
      WHERE med.createAt BETWEEN DATEADD(MONTH, -2, GETDATE()) AND GETDATE()
      ORDER BY 
        CASE 
          WHEN med.formstatus = '1' THEN 1
          WHEN med.formstatus = '4' THEN 2
          WHEN med.formstatus = '0' THEN 3
          WHEN med.formstatus = '2' THEN 4
          WHEN med.formstatus = '3' THEN 5
          ELSE 6 
        END;
    `;
    const results = await sequelize.query(medQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      // Use map to parse JSON fields before sending the response
      const parsedResults = results.map(medication => {
        const {
          DepID,
          DepName,
          AffID,
          AffName,
          ...rest
        } = medication;

        return {
          ...rest,
          prescribing: JSON.parse(medication.prescribing || '[]'),
          dispensing: JSON.parse(medication.dispensing || '[]'),
          administration: JSON.parse(medication.administration || '[]'),
          transcribing: JSON.parse(medication.transcribing || '[]'),
          effect: JSON.parse(medication.effect || '[]'),
          drugrelate: JSON.parse(medication.drugrelate || '[]'),
          rca: JSON.parse(medication.rca || '[]'),
          deptAffInfo: {
            AffID,
            AffName,
            DepID,
            DepName,
          },
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
        o.renew,
        o.effectremark,
        o.impromptusolution,
        o.activefailure,
        o.suggestion,
        e.risk,
        e.factors,
        e.comment,
        e.suggestion,
        e.forwardtxt,
        e.summarydetail,
        o.activefailure,
        e.urgenttype,
        e.isnew,
        e.status,
        o.formstatus,
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
      FROM ${DB_NAME}.[dbo].[event_logs] e
      LEFT JOIN ${DB_NAME}.[dbo].[occurrences] o ON o.reportid = e.reportid
      LEFT JOIN ${DB_NAME}.[dbo].[department] d ON d.id = e.deptrelate
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_request ON u_request.userid = e.createby
      LEFT JOIN ${DB_NAME}.[dbo].[user] AS u_accept ON u_accept.userid = e.acceptby
      ${dep ? `WHERE d.name = :dep AND o.createAt BETWEEN DATEADD(MONTH, -2, GETDATE()) AND GETDATE()` : `WHERE o.createAt BETWEEN DATEADD(MONTH, -2, GETDATE()) AND GETDATE()`}
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
  executeSQLQueryMedication,
  executeSQLQueryEvent
};