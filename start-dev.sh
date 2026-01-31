#!/bin/bash
# Startup script for telehealth application with new backend
# Starts Express backend and React frontend

echo "=== Telehealth Application Startup ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the telehealth project root directory"
    exit 1
fi

echo "Starting telehealth application..."
echo ""

# Step 1: Start backend
echo "=== Starting Backend Server ==="
cd backend

# Build and start backend
print_status "Building backend..."
npm run build

print_status "Starting backend server..."
npm start &
BACKEND_PID=$!

cd ..
echo ""

# Step 2: Start frontend
echo "=== Starting Frontend Development Server ==="

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    npm install
fi

# Start frontend
print_status "Starting React development server..."
npm start &
FRONTEND_PID=$!

echo ""
echo "=== Startup Complete ==="
print_status "Backend server running on port 8081"
print_status "Frontend development server starting on port 3000"
print_status "Backend PID: $BACKEND_PID"
print_status "Frontend PID: $FRONTEND_PID"

echo ""
echo "=== Verification ==="
echo "Checking services..."
sleep 10

# Check backend
if curl -s http://127.0.0.1:8081/api/health > /dev/null 2>&1; then
    print_status "Backend API is responding"
else
    print_warning "Backend API check failed (may be WSL networking issue)"
fi

# Check if processes are running
if ps -p $BACKEND_PID > /dev/null 2>&1; then
    print_status "Backend process is running"
else
    print_error "Backend process failed to start"
fi

if ps -p $FRONTEND_PID > /dev/null 2>&1; then
    print_status "Frontend process is running"
else
    print_error "Frontend process failed to start"
fi

echo ""
print_status "Application startup complete!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8081/api"
echo ""
echo "To stop all services: kill $BACKEND_PID $FRONTEND_PID"