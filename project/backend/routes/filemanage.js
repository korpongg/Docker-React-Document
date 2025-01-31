const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Define the route to handle file downloads
router.get('/:fileName', (req, res) => {
  const originalFileName = req.params.fileName ;
  const parts = originalFileName.split('.');
  const fileExtension = parts.pop();
  const fileNameWithoutExtension = parts.join('.');
  const newFileName = `${fileNameWithoutExtension}.${fileExtension}`;

  console.log(newFileName);

  const filePath = path.join(__dirname, process.env.DB_STORE2 , newFileName);
  console.log("filePath",filePath); //const filePath = path.join(__dirname, '../storage/attachfiles/', newFileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the response headers to specify the file type and attachment
    res.setHeader('Content-Disposition', `attachment; filename=${newFileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // If the file does not exist, return a 404 response
    res.status(404).json({ error: 'File not found' });
  }
});


// Define a route to handle file deletion
router.delete('/:fileName', (req, res) => {
  const originalFileName = req.params.fileName;
  const parts = originalFileName.split('.');
  const fileExtension = parts.pop();
  const fileNameWithoutExtension = parts.join('.');
  const newFileName = `${fileNameWithoutExtension}.${fileExtension}`;

  const filePath = path.join(__dirname, process.env.DB_STORE2 , newFileName);
  //const filePath = path.join(__dirname, '../storage/attachfiles/', newFileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    try {
      // Delete the file from the server
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      // Handle file deletion error
      res.status(500).json({ error: 'File deletion failed' });
    }
  } else {
    // If the file does not exist, return a 404 response
    res.status(404).json({ error: 'File not found' });
  }
});

module.exports = router;
