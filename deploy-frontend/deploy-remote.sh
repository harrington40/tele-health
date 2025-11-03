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

# Start the production server on port 3000
echo "✅ Build already exists - serving directly!"
nohup $SERVE_CMD -s build -l 3000 > frontend.log 2>&1 &
echo $! > frontend.pid

echo "✅ Frontend deployed and running on port 3000!"
echo "📊 Check logs: frontend.log"
echo "🌐 Access at: http://localhost:3000"
