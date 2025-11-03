# 🏥 Telehealth Portal

> A comprehensive telehealth platform similar to Sesame Care, providing accessible healthcare through video consultations, prescription refills, and appointment booking.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](http://207.180.247.153:3000)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org)

## ✨ Features

### Patient Features
- 🏥 **Find Your Doctor**: Browse and search 10+ licensed healthcare providers by specialty
- 📱 **Video Consultations**: Secure, HIPAA-compliant video calls with doctors
- 💊 **Prescription Refills**: Quick and easy medication renewal process
- 🗓️ **Appointment Booking**: Schedule same-day or future appointments
- 🧠 **Mental Health Support**: Access to therapy and counseling services
- 🚨 **Urgent Care**: Quick access to urgent medical care
- 💳 **Transparent Pricing**: Affordable healthcare starting at $34
- 📊 **Patient Dashboard**: Track appointments and medical history

### Provider Features
- 👨‍⚕️ **Provider Profiles**: Detailed profiles with ratings, reviews, and availability
- 🎯 **Smart Matching**: AI-powered algorithm to match patients with the right specialist
- 📍 **Location-Based**: Find doctors by city, state, and specialty
- ⭐ **Rating System**: View doctor ratings and patient reviews

## 🚀 Live Demo

**Access the application**: [http://207.180.247.153:3000](http://207.180.247.153:3000)

### Quick Tour:
1. **Home Page**: Overview of services and features
2. **Find Your Doctor**: Browse 10 doctors across various specialties
3. **Doctor Profiles**: View detailed provider information
4. **Booking System**: Schedule appointments with available doctors

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router DOM v6
- **Styling**: Emotion CSS-in-JS
- **Icons**: Material Icons
- **Forms**: Formik + Yup validation

### Backend
- **Microservices**: gRPC (Node.js)
- **API Bridge**: HTTP API on port 8081
- **Database**: RethinkDB at api.transtechologies.com
- **Real-time**: MQTT for notifications
- **File Storage**: Integrated file service

### Infrastructure
- **Web Server**: Serve (production) / React Scripts (development)
- **Deployment**: Automated bash scripts
- **Server**: Ubuntu Linux (207.180.247.153)
- **Protocol**: gRPC-Web for browser compatibility

## 📦 Getting Started

### Prerequisites

- **Node.js**: v16 or higher ([Download](https://nodejs.org))
- **npm**: v7 or higher (comes with Node.js)
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/harrington40/tele-health.git
cd tele-health
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment** (optional):
```bash
# Create .env file for custom configuration
cp .env.example .env

# Edit .env with your settings
REACT_APP_API_URL=http://207.180.247.153:8081/api
REACT_APP_GRPC_DOCTOR_HOST=http://207.180.247.153:8081
```

4. **Start development server**:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### 🏗️ Production Build

```bash
# Create optimized production build
npm run build

# The build folder will contain the production-ready files
# Deploy contents to your web server
```

## 🚀 Deployment

### Automated Deployment Scripts

The project includes automated deployment scripts for easy production deployment:

#### Deploy Frontend
```bash
# Build and deploy frontend to remote server
./deploy-frontend.sh

# Or deploy manually
npm run build
scp -r build/* root@207.180.247.153:/var/www/html/
```

#### Deploy Backend Services
```bash
# Deploy gRPC backend services
./deploy-grpc.sh
```

#### Check Service Status
```bash
# SSH to server and check frontend
ssh root@207.180.247.153
cd /opt/telehealth-frontend/deploy-frontend
./check-frontend.sh

# Check backend services
cd /opt/telehealth-grpc
netstat -tlnp | grep -E ':5005[1-4]|:8081'
```

### Production Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Port 3000)                 │
│              React + TypeScript + Material-UI            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│              HTTP API Bridge (Port 8081)                 │
│          Converts gRPC-Web ↔ gRPC Protocol              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│            gRPC Microservices (Ports 50051-50054)       │
│    Doctor Service | User Service | File Service         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│              RethinkDB (Port 28015)                      │
│           api.transtechologies.com                       │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
tele-health/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/          # Navigation, Footer
│   │   └── UI/              # Buttons, Cards, Forms
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── DoctorsPage.tsx  # Doctor listing and search
│   │   ├── BookingPage.tsx  # Appointment booking
│   │   ├── DashboardPage.tsx # Patient dashboard
│   │   └── AuthPage.tsx     # Login/Register
│   ├── services/            # API and service integrations
│   │   ├── api.ts          # HTTP API client
│   │   └── grpcClient.js   # gRPC-Web client
│   ├── hooks/              # Custom React hooks
│   │   └── useDoctors.ts   # Doctor data fetching
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types
│   └── App.tsx             # Main application component
├── backend/                # Backend services
│   ├── grpc/              # gRPC service implementations
│   │   ├── doctorServer.js    # Doctor service
│   │   ├── userServer.js      # User service
│   │   └── fileServer.js      # File service
│   └── services/          # Shared backend services
│       └── rethinkdb.js   # Database connection
├── deploy-frontend.sh     # Frontend deployment script
├── deploy-grpc.sh        # Backend deployment script
├── api-bridge.js         # HTTP to gRPC bridge
├── populate-db.js        # Database seeding script
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🎯 Available Scripts

### Development
```bash
npm start              # Start development server (port 3000)
npm run build          # Create production build
npm test               # Run tests
npm run eject          # Eject from Create React App
```

### Database
```bash
node populate-db.js    # Populate database with sample doctors
node setup-local-db.js # Setup local RethinkDB instance
```

### Deployment
```bash
./deploy-frontend.sh   # Deploy frontend to production
./deploy-grpc.sh       # Deploy backend services
```

## 🗄️ Database Schema

### Doctors Collection
```javascript
{
  doctorId: "1",
  name: "Dr. Sarah Johnson",
  specialty: "Family Medicine",
  rating: 4.8,
  experience: 12,
  location: {
    city: "New York",
    state: "NY",
    country: "USA"
  },
  availability: "Available Today",
  price: 75,
  imageUrl: "/api/placeholder/120/120",
  bio: "Experienced family medicine physician...",
  languages: ["English", "Spanish"],
  education: "MD from NYU School of Medicine",
  certifications: ["Board Certified Family Medicine"],
  isOnline: true
}
```

## 🔒 Security & Compliance

- **HIPAA Compliant**: Secure data handling and encryption
- **SSL/TLS**: Encrypted data transmission
- **Authentication**: JWT-based user authentication
- **Authorization**: Role-based access control (patient/doctor/admin)
- **Data Privacy**: Patient data encryption at rest

## 🌐 API Documentation

### REST API Endpoints (Port 8081)
```
GET    /api/doctors           # Get all doctors
GET    /api/doctors/:id       # Get doctor by ID
GET    /api/doctors/search    # Search doctors
POST   /api/appointments      # Create appointment
GET    /api/appointments/:id  # Get appointment details
```

### gRPC Services (Ports 50051-50054)
- **DoctorService** (50053): Doctor management
- **UserService** (50052): User authentication and profiles
- **BookingService** (50051): Appointment booking
- **FileService** (50054): File uploads and downloads

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Harrison** - [harrington40](https://github.com/harrington40)

## 🙏 Acknowledgments

- Inspired by [Sesame Care](https://sesamecare.com)
- Built with [Create React App](https://create-react-app.dev)
- UI components from [Material-UI](https://mui.com)
- Database powered by [RethinkDB](https://rethinkdb.com)

## 📞 Support

For support and questions:
- 📧 Email: support@telehealthportal.com
- 📱 Phone: +1 (234) 567-8900
- 🌐 Live Chat: Available on the website

## 🚦 Status

- ✅ **Frontend**: Deployed and running
- ✅ **Backend**: All services operational
- ✅ **Database**: Connected with 10 doctors
- ✅ **API Bridge**: Running on port 8081
- 🔄 **Mobile App**: In development

---

**Built with ❤️ for accessible healthcare**
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