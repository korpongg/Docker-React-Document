// websocketManager.js
const WebSocket = require('ws');
const clients = {}; // This holds the connected WebSocket clients

// Function to broadcast a message to all connected WebSocket clients
function broadcastMessage(message) {
    console.log(`Broadcasting Xray-cd-Request message to ${Object.keys(clients).length} clients.`);
    Object.values(clients).forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send(message);
                //console.log('Message sent to a client.');
            } catch (error) {
                console.error('Error sending message to a client:', error);
            }
        } else {
            console.log(`Skipping a client with readyState: ${client.readyState}`);
        }
    });
}

// Function to add a new WebSocket client
const addClient = (clientId, connection) => {
    clients[clientId] = connection;
};

// Function to remove a WebSocket client
const removeClient = (clientId) => {
    delete clients[clientId];
};

module.exports = { addClient, removeClient, broadcastMessage };
