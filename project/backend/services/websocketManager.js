const WebSocket = require("ws");
const clients = {};

// Function to broadcast a message to all connected WebSocket clients
function broadcastMessage(message) {
  const currentDate = new Date().toLocaleString("en-GB", {
    hour12: false,
  });

  const payload =
    typeof message === "string"
      ? message
      : JSON.stringify(message);

  console.log(
    `Broadcasting Occurrence Report message to ${
      Object.keys(clients).length
    } clients At ${currentDate}.`
  );

  Object.entries(clients).forEach(([clientId, client]) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(payload);
      } catch (error) {
        console.error(
          `Error sending message to client ${clientId}:`,
          error
        );
      }
    } else {
      console.log(
        `Skipping client ${clientId} with readyState: ${client.readyState}`
      );
    }
  });
}

// Function to add a new WebSocket client
const addClient = (clientId, connection) => {
  clients[clientId] = connection;

  console.log(
    `Client added: ${clientId}. Total clients: ${Object.keys(clients).length}`
  );

  connection.on("close", () => {
    removeClient(clientId);
  });

  connection.on("error", (err) => {
    console.error(`WebSocket error from client ${clientId}:`, err);
    removeClient(clientId);
  });
};

// Function to remove a WebSocket client
const removeClient = (clientId) => {
  delete clients[clientId];

  console.log(
    `Client removed: ${clientId}. Total clients: ${Object.keys(clients).length}`
  );
};

module.exports = {
  addClient,
  removeClient,
  broadcastMessage,
};