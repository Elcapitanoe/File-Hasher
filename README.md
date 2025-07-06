# File Hasher V2

A modern, secure file hash generator application built with TypeScript that generates multiple cryptographic hash values for uploaded files with real-time processing and a beautiful user interface.

## Features

- **Secure File Processing**: Client-side file handling with hash generation
- **Multiple Hash Algorithms**: Generates SHA-1, SHA-256, SHA-384, and SHA-512 hashes
- **Real-time Statistics**: Monitors processing speed with detailed metrics
- **Modern UI**: Clean, responsive design with animations and transitions
- **Drag & Drop**: Intuitive file upload interface
- **Theme Support**: Toggle between light and dark themes
- **Copy to Clipboard**: One-click hash copying
- **Mobile Friendly**: Fully responsive on all devices
- **TypeScript**: Full type safety and modern development experience

## Technical Details

- **Frontend**: TypeScript, HTML5, CSS3
- **Build Tool**: Vite
- **Styling**: Bootstrap 5 with custom CSS variables
- **Animations**: CSS animations and Animate.css
- **Icons**: Bootstrap Icons
- **Cryptography**: CryptoJS library
- **Type Safety**: Comprehensive TypeScript types and interfaces

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Elcapitanoe/File-Hasher-V2.git
   cd File-Hasher-V2
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Drag and drop a file onto the upload area or click to browse
2. Click the "Process File" button
3. View real-time processing progress and speed statistics
4. Once complete, view the file details and hash values
5. Copy any hash to clipboard with the copy button
6. Toggle between light and dark themes with the theme button

## Build

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Security

File Hasher V2 processes files securely:

- Files are processed entirely in the browser (client-side)
- All hash calculations are performed locally
- No file data is sent to any server
- File size limit of 50MB to prevent browser issues

## Performance

The application is optimized for performance:

- Asynchronous file processing
- Efficient hash generation with CryptoJS
- Real-time progress tracking
- Minimal dependencies
- Optimized animations and transitions
- TypeScript for better development experience

## Browser Support

- Modern browsers with ES2020 support
- Chrome 80+
- Firefox 72+
- Safari 13.1+
- Edge 80+

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Domi Adiwijaya - [GitHub](https://github.com/Elcapitanoe)