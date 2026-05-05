const { broadcastMessage } = require("./websocketManager");

global.isExecuting = false;

async function executeAndStoreQueryResult(reportidWhere = null) {
  try {
    if (global.isExecuting) return;

    global.isExecuting = true;

    broadcastMessage({
      type: "FORCE_REFRESH",
      requestType: "DATA2",
      action: "REFRESH",
      reportid: reportidWhere,
      timestamp: Date.now(),
    });

    console.log("Broadcast sent for reportid:", reportidWhere);

  } catch (error) {
    console.error("Error executing broadcast:", error);
  } finally {
    global.isExecuting = false;
  }
}

module.exports = { executeAndStoreQueryResult };