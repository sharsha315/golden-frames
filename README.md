# GoldenFrames - AI-Enhanced Photo Gallery

GoldenFrames is a privacy-focused photo gallery application that uses AI to organize, tag, and create meaningful compilations of your photos. All processing happens locally in your browser - your photos never leave your device.

## Features

- **Upload and organize photos** in a beautiful, responsive gallery
- **AI-powered automatic tagging** of photos using TensorFlow.js
- **Create albums** to organize your memories
- **AI-generated memory compilations** based on photo content and themes
- **Privacy-first approach** with all processing done client-side
- **Responsive design** that works on desktop and mobile devices

## Technology Stack

- **React.js** for the user interface
- **TensorFlow.js** for client-side AI image classification
- **Dexie.js** (IndexedDB) for client-side storage
- **Tailwind CSS** for styling
- **Framer Motion** for animations

## How It Works

1. **Upload photos**: Drag and drop or select photos to upload
2. **AI processing**: Photos are automatically analyzed to extract tags and metadata
3. **Organization**: Create albums to organize your photos
4. **Memory Compilations**: Let AI find patterns and create meaningful compilations

## Privacy

GoldenFrames is designed with privacy in mind:
- All processing happens in your browser
- Photos are stored locally on your device using IndexedDB
- No data is sent to any server
- Works offline after initial load

## Demo

![GoldenFrames Demo](demo-screenshot.png)

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone the repository
```bash
git clone https://github.com/sharsha315/golden-frames.git
cd golden-frames
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `src/components/` - React components
- `src/pages/` - Page components
- `src/utils/` - Utility functions and services
- `src/utils/db.js` - Database operations
- `src/utils/aiService.js` - AI processing functions

## Future Enhancements

- Face recognition for better people tagging
- Location-based organization
- Timeline view
- Export/import functionality
- Video support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow.js team for making AI accessible in the browser
- React and Tailwind CSS communities
```
