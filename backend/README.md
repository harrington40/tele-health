# TeleHealth Backend Setup Guide

## 🚀 **Installation & Setup (No Docker)**

### **Prerequisites**

1. **Node.js** (v18 or higher)
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **RethinkDB**
   ```bash
   # Ubuntu/Debian
   source /etc/lsb-release && echo "deb https://download.rethinkdb.com/repository/ubuntu-$DISTRIB_CODENAME $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
   wget -qO- https://download.rethinkdb.com/repository/raw/pubkey.gpg | sudo apt-key add -
   sudo apt-get update
   sudo apt-get install rethinkdb
   
   # Start RethinkDB
   sudo systemctl start rethinkdb
   sudo systemctl enable rethinkdb
   ```

3. **Mosquitto MQTT Broker**
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install mosquitto mosquitto-clients
   
   # Start Mosquitto
   sudo systemctl start mosquitto
   sudo systemctl enable mosquitto
   ```

4. **PM2 Process Manager**
   ```bash
   npm install -g pm2
   ```

### **Backend Installation**

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate Protocol Buffer files**
   ```bash
   npm run proto:generate
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

### **Development Workflow**

1. **Start in development mode**
   ```bash
   npm run dev
   ```

2. **Start all services with PM2**
   ```bash
   npm run start:services
   ```

3. **Monitor services**
   ```bash
   npm run logs
   ```

4. **Stop services**
   ```bash
   npm run stop:services
   ```

### **Service Architecture**

```
Port Allocation:
├── API Gateway: 3001
├── Auth Service: gRPC 50051
├── Patient Service: gRPC 50052
├── Consultation Service: gRPC 50053
└── Notification Service: gRPC 50054

External Services:
├── RethinkDB: 28015
├── MQTT Broker: 1883
└── Web UI: 8080 (RethinkDB Admin)
```

### **MQTT Topic Structure**

```
telehealth/
├── consultations/{consultation_id}/
│   ├── chat                    # Real-time chat messages
│   ├── video_state            # Video call state changes
│   ├── participants           # Participant join/leave
│   └── screen_share          # Screen sharing events
├── notifications/{user_id}    # User-specific notifications
├── appointments/              # Appointment updates
│   ├── created
│   ├── updated
│   └── cancelled
└── system/
    ├── alerts                # System-wide alerts
    ├── maintenance          # Maintenance notifications
    └── broadcasts          # General announcements
```

### **Database Schema**

**Tables Created Automatically:**
- `users` - User accounts (patients, doctors, admins)
- `patients` - Patient-specific data
- `doctors` - Doctor profiles and availability
- `appointments` - Appointment scheduling
- `consultations` - Video consultation sessions
- `messages` - Chat messages
- `medical_records` - Patient medical history
- `notifications` - System notifications
- `payments` - Billing and payments
- `prescriptions` - Digital prescriptions

### **API Endpoints**

**REST API (Port 3001):**
- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /api/doctors` - List doctors
- `POST /api/appointments` - Book appointment

**gRPC Services:**
- **AuthService** (50051) - Authentication
- **PatientService** (50052) - Patient management
- **ConsultationService** (50053) - Video consultations
- **NotificationService** (50054) - Real-time notifications

### **Real-time Features**

1. **RethinkDB Changefeeds**
   - Live appointment updates
   - Real-time medical record sync
   - Instant notification delivery

2. **MQTT Messaging**
   - Chat during consultations
   - Video call signaling
   - Push notifications
   - System alerts

### **Security Features**

- JWT token authentication
- bcrypt password hashing
- CORS protection
- Rate limiting
- HIPAA compliance measures
- TLS/SSL ready

### **Production Deployment**

1. **System Service Setup**
   ```bash
   # Create systemd service
   sudo nano /etc/systemd/system/telehealth-backend.service
   ```

2. **Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **SSL Certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### **Monitoring & Logging**

- **PM2 Monitoring**: `pm2 monit`
- **Log Files**: Located in `logs/` directory
- **RethinkDB Admin**: http://localhost:8080
- **Health Checks**: http://localhost:3001/health

### **Troubleshooting**

1. **RethinkDB Connection Issues**
   ```bash
   sudo systemctl status rethinkdb
   sudo journalctl -u rethinkdb -f
   ```

2. **MQTT Broker Issues**
   ```bash
   sudo systemctl status mosquitto
   mosquitto_sub -t "telehealth/#" -v
   ```

3. **PM2 Service Issues**
   ```bash
   pm2 logs
   pm2 restart all
   ```

This architecture provides a scalable, maintainable backend without Docker dependencies!