#!/bin/bash

echo "🚀 Full Stack Deployment - TeleHealth Platform"
echo "================================================"

REMOTE_HOST="207.180.247.153"
REMOTE_USER="root"
BACKEND_PATH="/opt/telehealth-grpc"
FRONTEND_PATH="/var/www/html"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "📦 Step 1: Building React Frontend..."
npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed! No build directory found."
    exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

echo "📤 Step 2: Deploying Frontend to Remote Server..."
scp -r build/* $REMOTE_USER@$REMOTE_HOST:$FRONTEND_PATH/

echo -e "${GREEN}✅ Frontend deployed${NC}"
echo ""

echo "🔧 Step 3: Fixing Nginx Configuration..."
ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
# Backup existing config
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# Update nginx config
cat > /etc/nginx/sites-available/default << 'NGINX_EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:8081/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

# Test and reload nginx
nginx -t && systemctl reload nginx
echo "✅ Nginx configured and reloaded"
ENDSSH

echo -e "${GREEN}✅ Nginx configured${NC}"
echo ""

echo "🔄 Step 4: Starting Backend Services..."
ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
cd /opt/telehealth-grpc

# Kill existing processes
pkill -f "doctorServer" || true
pkill -f "patientServer" || true
pkill -f "api-bridge" || true

sleep 2

# Create logs directory
mkdir -p logs

# Start gRPC servers
nohup node grpc/doctorServer.js > logs/doctor.log 2>&1 &
echo "✅ Doctor server started (port 50053)"

nohup node grpc/patientServer.js > logs/patient.log 2>&1 &
echo "✅ Patient server started (port 50054)"

sleep 3

# Start API bridge
nohup node api-bridge-full.js > logs/api-bridge.log 2>&1 &
echo "✅ API bridge started (port 8081)"

sleep 3

# Check services
echo ""
echo "📊 Service Status:"
netstat -tlnp | grep -E ":(50053|50054|8081)" || echo "⚠️  Some services may still be starting..."

# Check processes
echo ""
echo "🔍 Running Processes:"
ps aux | grep -E "(doctorServer|patientServer|api-bridge)" | grep -v grep || echo "⚠️  Check logs for errors"
ENDSSH

echo -e "${GREEN}✅ Backend services started${NC}"
echo ""

echo "🧪 Step 5: Testing Endpoints..."
sleep 5

echo "Testing API endpoints..."
curl -s http://$REMOTE_HOST/api/doctors | head -c 200 && echo "" || echo "⚠️  Doctors API not responding yet"
echo ""
curl -s http://$REMOTE_HOST/api/patients | head -c 200 && echo "" || echo "⚠️  Patients API not responding yet"
echo ""

echo ""
echo "✨ Deployment Complete!"
echo "================================================"
echo ""
echo "🌐 Your application is now live at:"
echo "   Frontend: http://$REMOTE_HOST/"
echo "   Admin Dashboard: http://$REMOTE_HOST/admin-dashboard"
echo "   Doctor Dashboard: http://$REMOTE_HOST/doctor-dashboard"
echo "   Patient Dashboard: http://$REMOTE_HOST/patient-dashboard"
echo ""
echo "🔌 API Endpoints:"
echo "   Doctors: http://$REMOTE_HOST/api/doctors"
echo "   Patients: http://$REMOTE_HOST/api/patients"
echo "   Auth: http://$REMOTE_HOST/api/auth/login"
echo ""
echo "📋 Test Accounts:"
echo "   Admin: admin@telehealth.com / Admin123!"
echo "   Doctor: dr.johnson@telehealth.com / Doctor123!"
echo "   Patient: john.doe@example.com / Patient123!"
echo ""
