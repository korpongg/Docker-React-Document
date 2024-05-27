const { broadcastMessage } = require("./websocketManager");
const { executeSQLQuery } = require("../controllers/broadcastController"); // Import executeSQLQuery

async function executeAndStoreQueryResult() {
  try {
    global.resetInterval();

    const [queryResult] = await Promise.all([executeSQLQuery()]);

    // Store the query result data
    queryResultData = JSON.stringify(queryResult);

    broadcastMessage(queryResultData);
  } catch (error) {
    console.error("Error executing SQL query:", error);
  }
}

module.exports = { executeAndStoreQueryResult };