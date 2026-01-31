# Telehealth Portal

A comprehensive telehealth platform similar to Sesame Care, built with React for web and React Native for mobile/iOS.

## Features

- 🏥 **Doctor Discovery**: Browse and search licensed healthcare providers
- 📱 **Video Consultations**: Secure video calls with doctors
- 💊 **Prescription Refills**: Easy medication renewal process
- 🗓️ **Appointment Booking**: Schedule same-day or future appointments
- 🧠 **Mental Health Support**: Access to therapy and counseling
- 🚨 **Urgent Care**: Quick access to urgent medical care
- 💳 **Transparent Pricing**: Affordable healthcare starting at $34
- 📊 **Patient Dashboard**: Track appointments and medical history

## Technology Stack

- **Frontend (Web)**: React 18, TypeScript, Material-UI
- **Frontend (Mobile)**: React Native, Expo
- **Routing**: React Router DOM
- **Styling**: Material-UI, Emotion
- **State Management**: React Query
- **Forms**: Formik + Yup validation
- **Real-time**: Socket.io
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- For mobile development: Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd telehealth-portal
```

2. Install dependencies:
```bash
npm install
cd backend && npm install && cd ..
```

3. Start the application:
```bash
# Quick start script (starts both frontend and backend)
./start-dev.sh

# Or manually:
# Terminal 1 - Backend
cd backend && npm run build && npm start

# Terminal 2 - Frontend  
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000) with backend API at [http://localhost:8081/api](http://localhost:8081/api)

### Mobile Development

To run on mobile:

```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Start Expo development server
npm run mobile

# For iOS simulator
npm run mobile:ios

# For Android emulator
npm run mobile:android
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Navigation, Footer
│   ├── Forms/          # Form components
│   └── UI/             # Generic UI components
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── DoctorsPage.tsx # Doctor discovery
│   ├── BookingPage.tsx # Appointment booking
│   └── ...
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run mobile` - Start Expo development server

## Key Features Implementation

### Doctor Discovery
- Search and filter doctors by specialty, rating, and availability
- Real-time availability updates
- Doctor profiles with ratings and reviews

### Video Consultations
- WebRTC-based video calls
- Screen sharing capabilities
- Chat functionality during calls

### Appointment Booking
- Calendar integration
- Same-day appointment availability
- Automated reminders

### Payment Processing
- Stripe integration for secure payments
- Transparent pricing
- HSA/FSA support

## Mobile App (React Native)

The project is structured to support both web and mobile platforms:

- Shared business logic and components
- Platform-specific UI adaptations
- Native mobile features (camera, notifications)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@telehealthportal.com or visit our help center.