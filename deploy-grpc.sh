#!/bin/bash

echo "🚀 Deploying TeleHealth gRPC Services to Remote Server"
echo "======================================================"

# Set remote server details
REMOTE_HOST="207.180.247.153"
REMOTE_USER="root"  # Updated to root user
REMOTE_PATH="/opt/telehealth-grpc"

echo "📦 Preparing deployment package..."

# Create deployment directory
mkdir -p deploy/grpc
mkdir -p deploy/services

# Copy gRPC server files from backend directory
cp backend/grpc/doctorServer.js deploy/grpc/
cp backend/grpc/bookingServer.js deploy/grpc/ 2>/dev/null || echo "bookingServer.js not found"
cp backend/grpc/userServer.js deploy/grpc/ 2>/dev/null || echo "userServer.js not found"
cp backend/grpc/fileServer.js deploy/grpc/ 2>/dev/null || echo "fileServer.js not found"
cp backend/grpc/server.js deploy/grpc/ 2>/dev/null || echo "server.js not found"

# Copy service files
cp backend/services/rethinkdb.js deploy/services/

# Copy node_modules and package files
cp -r backend/node_modules deploy/ 2>/dev/null || echo "node_modules not found"
cp backend/package.json deploy/
cp backend/package-lock.json deploy/ 2>/dev/null || echo "package-lock.json not found"

# Create deployment script for remote server
cat > deploy/deploy-remote.sh << 'EOF'
#!/bin/bash

echo "🔧 Installing dependencies on remote server..."
npm install --production

echo "🗄️ Starting RethinkDB connection test..."
node -e "
const r = require('./services/rethinkdb');
r.table('doctors').count().then(count => {
  console.log('✅ Connected to RethinkDB. Doctors count:', count);
  process.exit(0);
}).catch(err => {
  console.error('❌ RethinkDB connection failed:', err.message);
  process.exit(1);
});
"

if [ $? -eq 0 ]; then
    echo "🚀 Starting gRPC services..."
    nohup node grpc/doctorServer.js > doctor.log 2>&1 &
    echo $! > doctor.pid

    nohup node grpc/bookingServer.js > booking.log 2>&1 &
    echo $! > booking.pid 2>/dev/null || echo "booking server not available"

    nohup node grpc/userServer.js > user.log 2>&1 &
    echo $! > user.pid 2>/dev/null || echo "user server not available"

    nohup node grpc/fileServer.js > file.log 2>&1 &
    echo $! > file.pid 2>/dev/null || echo "file server not available"

    echo "✅ gRPC services deployed and running!"
    echo "📊 Check logs: doctor.log, booking.log, user.log, file.log"
else
    echo "❌ Deployment failed - RethinkDB connection issue"
    exit 1
fi
EOF

chmod +x deploy/deploy-remote.sh

echo "📤 Copying files to remote server..."
echo "Run these commands on your remote server:"
echo ""
echo "  # Upload the deployment package"
echo "  scp -r deploy/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
echo ""
echo "  # SSH to remote server and run deployment"
echo "  ssh $REMOTE_USER@$REMOTE_HOST"
echo "  cd $REMOTE_PATH"
echo "  sudo ./deploy-remote.sh"
echo ""
echo "  # Verify services are running"
echo "  ps aux | grep node"
echo ""
echo "  # Check service logs"
echo "  tail -f *.log"

echo "✅ Deployment package ready in ./deploy/ directory"