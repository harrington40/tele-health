#!/bin/bash

echo "🚀 Deploying Backend Services with Patient Support"
echo "==================================================="

REMOTE_HOST="207.180.247.153"
REMOTE_USER="root"
BACKEND_PATH="/opt/telehealth-grpc"

echo "📦 Copying backend files to server..."

# Copy all backend files
scp -r backend/* $REMOTE_USER@$REMOTE_HOST:$BACKEND_PATH/

echo "📊 Populating patients table..."
ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
cd /opt/telehealth-grpc
node populate-patients.js
ENDSSH

echo "🔄 Restarting all backend services..."
ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
# Kill existing processes
pkill -f 'node.*doctorServer' || true
pkill -f 'node.*patientServer' || true
pkill -f 'node.*api-bridge' || true

# Start services
cd /opt/telehealth-grpc

# Start doctor server
nohup node grpc/doctorServer.js > logs/doctor.log 2>&1 &
echo "✓ Doctor server started (port 50053)"

# Start patient server
nohup node grpc/patientServer.js > logs/patient.log 2>&1 &
echo "✓ Patient server started (port 50054)"

# Wait for gRPC servers to start
sleep 3

# Start API bridge
nohup node api-bridge-full.js > logs/api-bridge.log 2>&1 &
echo "✓ API bridge started (port 8081)"

# Wait for API bridge to start
sleep 2

# Check services
echo ""
echo "📊 Service Status:"
netstat -tlnp | grep -E ':(50053|50054|8081)' || echo "⚠️  Some services may not be running"

# Test endpoints
echo ""
echo "🧪 Testing Endpoints:"
curl -s http://localhost:8081/api/doctors | head -c 100
echo ""
curl -s http://localhost:8081/api/patients | head -c 100
echo ""

echo "✅ Backend deployment complete!"
ENDSSH

echo ""
echo "✅ All services deployed!"
echo "📊 Access APIs at:"
echo "   - Doctors: http://$REMOTE_HOST:8081/api/doctors"
echo "   - Patients: http://$REMOTE_HOST:8081/api/patients"
