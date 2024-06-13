require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
const http = require('http');
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const { sequelize, connectDB } = require("./config/dbConn");
const PORT = process.env.BACKEND_PORT || 5000;

const { v4: uuidv4 } = require("uuid");

connectDB();

// custom middleware logger
//app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
//app.use(cors(corsOptions));
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/api/', express.static(path.join(__dirname, '/public')));

// Main routes
app.use("/api/", require("./routes/root"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/refresh", require("./routes/refresh"));
app.use("/api/logout", require("./routes/logout"));

//routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/affiliations", require("./routes/api/affiliations"));
app.use("/api/factions", require("./routes/api/factions"));
app.use("/api/departments", require("./routes/api/departments"));
app.use("/api/occurrences", require("./routes/api/occurrences"));
app.use("/api/events", require("./routes/api/events"));

const { WebSocketServer } = require("ws");
const WebSocket = require("ws");

const { addClient, removeClient } = require("./services/websocketManager");
const { executeAndStoreQueryResult } = require("./services/broadcastService");

// Spinning the HTTP server and the WebSocket server.
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server, path: "/broadcast" });

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});

//BoardCast Initialize the count of connected clients
let connectedClientsCount = 0;

// Function to handle new client connections
wsServer.on("connection", function (connection, request) {
  const userId = uuidv4();
  const userIP = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  console.log(`Received a new connection from user:${userId} With IP:${userIP}.`);
  addClient(userId, connection);
  executeAndStoreQueryResult();
  connectedClientsCount++; // Increment the count

  connection.on("message", async (message) => {
    // Log the received message
    try {
      const data = JSON.parse(message);
      console.log("Received message:", data);
      // Handle the cid parameter sent from the client
      
      await executeAndStoreQueryResult();
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  connection.on("close", () => {
    console.log(`user:${userId} With IP:${userIP} disconnected.`);
    removeClient(userId);
    connectedClientsCount--;
  });
});

// Set up the interval to run the function every 5 seconds
// Global variable to store the interval ID
global.intervalId = null;

// Function to execute periodically only if there are connected clients
global.resetInterval = () => {
  clearInterval(global.intervalId);

  global.intervalId = setInterval(async () => {
    if (connectedClientsCount > 0) {
      try {
        // Get the current date and time
        const currentTime = new Date();
        console.log(`..........Start Do interval......... At`, currentTime.toLocaleString("en-GB", { hour12: false }));
        await executeAndStoreQueryResult();
      } catch (error) {
        console.error("Error during periodic execution:", error);
      }
    }
  }, 30000);
};

// Initialize the interval
global.resetInterval();
//End BoardCast

// Serve static files from the React app
const FRONTEND_PORT = process.env.BACKEND_PORT2 || 3500;
const app2 = express();
app2.use(express.static(path.join(__dirname, '/frontend/dist')));
app2.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/dist/index.html'));
});

app2.use(errorHandler); 

app2.listen(FRONTEND_PORT, () => {
    console.log(`Server running on port ${FRONTEND_PORT}`);
});