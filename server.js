import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Compression middleware
app.use(compression());

// Rate limiting
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 uploads per windowMs
  message: {
    error: 'Too many upload attempts',
    message: 'Please wait before uploading another file'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

app.use(generalLimiter);

// File upload configuration with enhanced security
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1 // Only allow single file upload
  },
  fileFilter: (req, file, cb) => {
    // Basic file validation - you can extend this based on requirements
    if (file.size === 0) {
      return cb(new Error('Empty file not allowed'), false);
    }
    cb(null, true);
  }
});

// Serve static files with proper caching headers
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Enhanced file upload endpoint with better error handling
app.post('/upload', uploadLimiter, (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ 
            error: 'File too large',
            message: 'File size must be less than 50MB'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ 
            error: 'Too many files',
            message: 'Only one file allowed per upload'
          });
        }
        return res.status(400).json({ 
          error: 'Upload error',
          message: err.message
        });
      }
      
      if (err) {
        return res.status(400).json({ 
          error: 'Upload error',
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          error: 'No file uploaded',
          message: 'Please select a file to upload'
        });
      }

      const fileBuffer = req.file.buffer;
      
      // Validate file buffer
      if (!fileBuffer || fileBuffer.length === 0) {
        return res.status(400).json({ 
          error: 'Invalid file',
          message: 'File appears to be empty or corrupted'
        });
      }

      // Generate hashes asynchronously for better performance
      const [sha1Hash, sha256Hash, sha384Hash, sha512Hash] = await Promise.all([
        generateHashAsync(fileBuffer, 'sha1'),
        generateHashAsync(fileBuffer, 'sha256'),
        generateHashAsync(fileBuffer, 'sha384'),
        generateHashAsync(fileBuffer, 'sha512')
      ]);

      // Return file information and hashes
      res.json({
        name: sanitizeFilename(req.file.originalname),
        type: req.file.mimetype || 'application/octet-stream',
        size: req.file.size,
        sha1Hash,
        sha256Hash,
        sha384Hash,
        sha512Hash,
        processedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'An error occurred while processing your file'
      });
    }
  });
});

// Async hash generation for better performance
function generateHashAsync(data, algorithm) {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash(algorithm);
      hash.update(data);
      resolve(hash.digest('hex'));
    } catch (error) {
      reject(error);
    }
  });
}

// Sanitize filename to prevent potential security issues
function sanitizeFilename(filename) {
  if (!filename || typeof filename !== 'string') {
    return 'unknown';
  }
  
  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/^\.+/, '')
    .substring(0, 255) || 'unknown';
}

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found'
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
const server = app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   FileHasher Pro Server                        ║
║   Running on http://localhost:${port}              ║
║                                                ║
║   Version: 2.0.0                               ║
║   Author: Domi Adiwijaya                       ║
║   Node.js: ${process.version}                        ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

export default server;