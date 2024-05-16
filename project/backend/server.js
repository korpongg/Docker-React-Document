require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http'); // Import the 'http' module
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const { sequelize, connectDB } = require('./config/dbConn');


connectDB();

const PORT = process.env.BACKEND_PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Define other routes and middleware as needed
app.use('/api/', express.static(path.join(__dirname, '/public')));
app.use('/api/', require('./routes/root'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/refresh', require('./routes/refresh'));
app.use('/api/logout', require('./routes/logout'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/occurrences', require('./routes/api/occurrences'));
app.use('/api/events', require('./routes/api/events'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);


const { WebSocketServer } = require('ws');
const WebSocket = require('ws');

const { addClient, removeClient } = require('./services/websocketManager');

//resetFileData(); //Reset fileData.json


// Spinning the HTTP server and the WebSocket server.
const server = http.createServer(app);


server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});


// I'm maintaining all active connections in this object
const clients = {};

// Initialize the count of connected clients
let connectedClientsCount = 0;

// Function to handle new client connections


 // Set up the interval to run the function every 5 seconds
// Global variable to store the interval ID
global.intervalId = null;


// Function to execute periodically only if there are connected clients

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

