#!/bin/bash

echo "🚀 Deploying TeleHealth Frontend to Remote Server"
echo "================================================"

# Set remote server details
REMOTE_HOST="207.180.247.153"
REMOTE_USER="root"
REMOTE_FRONTEND_PATH="/opt/telehealth-frontend"

echo "📦 Preparing frontend deployment package..."

# Create deployment script for remote server
cat > deploy-frontend/deploy-remote.sh << 'EOF'
#!/bin/bash

echo "🔧 Checking system requirements..."

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js $(node --version) and npm $(npm --version) are available"

# Check if serve is installed globally
if ! command -v serve &> /dev/null; then
    echo "📦 Installing serve package globally..."
    # Reset npm registry to default if it's misconfigured
    npm config set registry https://registry.npmjs.org/
    if ! npm install -g serve; then
        echo "❌ Failed to install serve globally. Trying alternative installation..."
        # Try installing locally as fallback
        npm install serve
        export PATH="$PWD/node_modules/.bin:$PATH"
        SERVE_CMD="$PWD/node_modules/.bin/serve"
    else
        SERVE_CMD="serve"
    fi
else
    echo "✅ Serve package is already installed globally"
    SERVE_CMD="serve"
fi

echo "🌐 Starting production server..."
# Kill any existing serve processes
pkill -f "serve -s build" || true

# Change to deploy-frontend directory where build folder exists
cd deploy-frontend

# Start the production server on port 3000
echo "✅ Build directory found - serving directly!"
nohup $SERVE_CMD -s build -l 3000 > frontend.log 2>&1 &
echo $! > frontend.pid

echo "✅ Frontend deployed and running on port 3000!"
echo "📊 Check logs: frontend.log"
echo "🌐 Access at: http://localhost:3000"
EOF

chmod +x deploy-frontend/deploy-remote.sh

# Create status check script
cat > deploy-frontend/check-frontend.sh << 'EOF'
#!/bin/bash

echo "🔍 Checking frontend status..."

# Determine serve command
if command -v serve &> /dev/null; then
    SERVE_CMD="serve"
elif [ -f "/opt/telehealth-frontend/deploy-frontend/node_modules/.bin/serve" ]; then
    SERVE_CMD="/opt/telehealth-frontend/deploy-frontend/node_modules/.bin/serve"
else
    echo "❌ Serve command not found. Installing..."
    cd /opt/telehealth-frontend/deploy-frontend
    # Reset npm registry to default if it's misconfigured
    npm config set registry https://registry.npmjs.org/
    npm install serve
    SERVE_CMD="$PWD/node_modules/.bin/serve"
fi

# Check if serve process is running
if pgrep -f "serve -s build" > /dev/null; then
    echo "✅ Serve process is running"
    ps aux | grep "serve -s build" | grep -v grep
else
    echo "❌ Serve process is not running - restarting..."
    cd /opt/telehealth-frontend/deploy-frontend
    
    # Kill any existing processes on port 3000
    pkill -f "serve -s build" || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    # Start the server
    echo "🌐 Starting frontend server..."
    nohup $SERVE_CMD -s build -l 3000 > frontend.log 2>&1 &
    echo $! > frontend.pid
    
    sleep 2
    
    # Check if it started successfully
    if pgrep -f "serve -s build" > /dev/null; then
        echo "✅ Frontend server started successfully"
    else
        echo "❌ Failed to start frontend server"
        echo "📊 Check logs: frontend.log"
        cat frontend.log
        exit 1
    fi
fi

# Check if port 3000 is listening
if netstat -tlnp 2>/dev/null | grep :3000 > /dev/null || ss -tlnp 2>/dev/null | grep :3000 > /dev/null; then
    echo "✅ Port 3000 is listening"
else
    echo "❌ Port 3000 is not listening"
fi

# Test local access
if curl -s --max-time 5 http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is accessible locally at http://localhost:3000"
else
    echo "❌ Frontend is not accessible locally"
fi

echo "📊 Frontend PID: $(cat frontend.pid 2>/dev/null || echo 'N/A')"
echo "📊 Check logs: tail -f frontend.log"
EOF

chmod +x deploy-frontend/check-frontend.sh

echo "📤 Copying frontend files to remote server..."
echo "Run these commands on your remote server:"
echo ""
echo "  # Upload the frontend deployment package (SSH key authentication required)"
echo "  scp -r deploy-frontend/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_FRONTEND_PATH/"
echo ""
echo "  # SSH to remote server and run deployment"
echo "  ssh $REMOTE_USER@$REMOTE_HOST"
echo "  cd $REMOTE_FRONTEND_PATH"
echo "  ./deploy-remote.sh"
echo ""
echo "  # Check status and restart if needed"
echo "  ./check-frontend.sh"
echo ""
echo "  # Verify frontend is running"
echo "  curl http://localhost:3000"
echo ""
echo "✅ Frontend deployment package ready in ./deploy-frontend/ directory"