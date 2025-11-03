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
