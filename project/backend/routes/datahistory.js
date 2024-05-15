const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();


// Define the endpoint to get the filtered history data
router.get('/', async (req, res) => {
    try {
        // Read the contents of the fileDataHistory.json file
        const dataFilePath = path.join(__dirname, '../storage/fileDataHistory.json');
        const content = await fs.readFile(dataFilePath, 'utf8');
        const fileDataHistory = JSON.parse(content);

        // Filter the data based on your criteria (e.g., status is "ready")
        const filteredData = fileDataHistory.filter(entry => entry.status === 'ready');

        // Send the filtered data as an API response
        res.json(filteredData);
    } catch (error) {
        console.error(`Error reading fileDataHistory.json: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

