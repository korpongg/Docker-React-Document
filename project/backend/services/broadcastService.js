const { broadcastMessage } = require('./websocketManager');
const { executeSQLQuerywait } = require('../controllers/broadcastController'); // Import executeSQLQuery

async function executeAndStoreQueryResult() {
    try {
      
      global.resetInterval();

      const [queryResult,querybed] = await Promise.all([
        executeSQLQuerywait()
      ]);

      //const currentTime = new Date().toISOString();

      const dataWithHeader = {
        data_results: queryResult,
        data_bed: querybed,
      };

      // Store the query result data
      queryResultData = JSON.stringify(dataWithHeader);

      broadcastMessage(queryResultData);
  
    } catch (error) {
      console.error('Error executing SQL query:', error);
      // Handle the error gracefully, e.g., log it or send an error message to clients.
    }
  }

  module.exports = { executeAndStoreQueryResult };