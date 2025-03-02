// Server implementation for FileHasher Pro
// This file serves as the entry point for the application
const express = require('express');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'No file uploaded',
                message: 'Please select a file to upload'
            });
        }

        const fileBuffer = req.file.buffer;
        
        // Generate hashes
        const sha1Hash = generateHash(fileBuffer, 'sha1');
        const sha256Hash = generateHash(fileBuffer, 'sha256');
        const sha384Hash = generateHash(fileBuffer, 'sha384');
        const sha512Hash = generateHash(fileBuffer, 'sha512');

        // Add artificial delay for demo purposes (remove in production)
        // setTimeout(() => {
            // Return file information and hashes
            res.json({
                name: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size,
                sha1Hash,
                sha256Hash,
                sha384Hash,
                sha512Hash
            });
        // }, 500);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ 
            error: 'Error processing file',
            message: error.message
        });
    }
});

// Generate hash using Node.js crypto
function generateHash(data, algorithm) {
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    return hash.digest('hex');
}

// Start the server
app.listen(port, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   FileHasher Pro Server                        ║
║   Running on http://localhost:${port}              ║
║                                                ║
║   Version: 2.0.0                               ║
║   Author: Domi Adiwijaya                       ║
║                                                ║
╚════════════════════════════════════════════════╝
    `);
});