# Setup Instructions

## Prerequisites

Before running this telehealth portal, you need to install:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## Installation Steps

1. **Install Node.js and npm**
   ```bash
   # Verify Node.js is installed
   node --version
   npm --version
   ```

2. **Install project dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## Mobile Development Setup

For mobile development (React Native/Expo):

1. **Install Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

2. **Install Expo Go app** on your mobile device:
   - iOS: Download from App Store
   - Android: Download from Google Play Store

3. **Start mobile development**
   ```bash
   npm run mobile
   ```

## Environment Variables

Create a `.env` file in the root directory with:

```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
REACT_APP_SOCKET_URL=http://localhost:3001
```

## Development Commands

- `npm start` - Start web development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run code linting
- `npm run format` - Format code
- `npm run mobile` - Start Expo development server
- `npm run mobile:ios` - Run on iOS simulator
- `npm run mobile:android` - Run on Android emulator

## Troubleshooting

### Common Issues

1. **npm command not found**
   - Install Node.js from nodejs.org
   - Restart your terminal/command prompt

2. **Port 3000 already in use**
   - Kill the process using port 3000
   - Or use a different port: `npm start -- --port 3001`

3. **Module not found errors**
   - Run `npm install` to install dependencies
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

### Support

For additional help:
- Check the README.md file
- Visit the project documentation
- Contact support team