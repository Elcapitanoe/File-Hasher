# FileHasher

A modern, secure file upload application that generates multiple hash values for uploaded files with real-time statistics and a beautiful user interface.

## Features

- **Secure File Processing**: Client-side file handling with server-side hash generation
- **Multiple Hash Algorithms**: Generates SHA-1, SHA-256, SHA-384, and SHA-512 hashes
- **Real-time Statistics**: Monitors upload speed with detailed metrics
- **Modern UI**: Clean, responsive design with animations and transitions
- **Drag & Drop**: Intuitive file upload interface
- **Theme Support**: Toggle between light and dark themes
- **Copy to Clipboard**: One-click hash copying
- **Mobile Friendly**: Fully responsive on all devices

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Styling**: Bootstrap 5 with custom CSS
- **Animations**: CSS animations and transitions
- **Icons**: Bootstrap Icons
- **File Handling**: Multer for file uploads
- **Cryptography**: Node.js Crypto module

## Installation

1. Clone the repository
   ```
   git clone https://github.com/Elcapitanoe/File-Hasher-V2
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the server
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Drag and drop a file onto the upload area or click to browse
2. Click the "Process File" button
3. View real-time upload progress and speed statistics
4. Once complete, view the file details and hash values
5. Copy any hash to clipboard with the copy button
6. Toggle between light and dark themes with the theme button

## Security

FileHasher Pro processes files securely:

- Files are processed in memory and not stored on disk
- All hash calculations are performed server-side
- No file data is retained after processing
- File size limit of 50MB to prevent abuse

## Performance

The application is optimized for performance:

- Asynchronous file processing
- Efficient hash generation
- Real-time progress tracking
- Minimal dependencies
- Optimized animations and transitions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Domi Adiwijaya
