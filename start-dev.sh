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

# Function to check and kill process on specified port
check_and_kill_port() {
    local port=$1
    print_status "Checking for existing process on port $port..."
    
    # Find process using the specified port
    PORT_PROCESS=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$PORT_PROCESS" ]; then
        print_warning "Found process $PORT_PROCESS using port $port, terminating..."
        kill -9 $PORT_PROCESS 2>/dev/null
        sleep 3  # Wait longer for process to fully terminate
        print_status "Port $port cleared"
    else
        print_status "Port $port is available"
    fi
}

# Function to kill any remaining node processes (safety cleanup)
kill_remaining_node_processes() {
    print_status "Performing final cleanup of any remaining Node.js processes..."
    
    # Kill any remaining node processes related to our app
    pkill -f "node.*telehealth" 2>/dev/null || true
    pkill -f "react-scripts" 2>/dev/null || true
    pkill -f "npm.*start" 2>/dev/null || true
    
    sleep 2
    print_status "Cleanup completed"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the telehealth project root directory"
    exit 1
fi

echo "Starting telehealth application..."
echo ""

# Perform initial cleanup
kill_remaining_node_processes
echo ""

# Step 1: Start backend
echo "=== Starting Backend Server ==="
cd backend

# Check and kill any existing process on port 8081 (backend)
check_and_kill_port 8081

# Build and start backend
print_status "Building backend..."
npm run build

print_status "Starting backend server..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

cd ..
echo ""

# Step 2: Start frontend
echo "=== Starting Frontend Development Server ==="

# Check and kill any existing process on port 3000 (frontend)
check_and_kill_port 3000

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    npm install
fi

# Start frontend
print_status "Starting React development server..."
npm start &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo ""
echo "=== Startup Complete ==="
print_status "Backend server running on port 8081"
print_status "Frontend development server starting on port 3000"
print_status "Backend PID: $BACKEND_PID"
print_status "Frontend PID: $FRONTEND_PID"

echo ""
echo "=== Verification ==="
echo "Checking services..."
sleep 15  # Wait longer for services to fully start

SERVICES_RUNNING=true

# Check if backend process is still running
if ps -p $BACKEND_PID > /dev/null 2>&1; then
    print_status "Backend process is running (PID: $BACKEND_PID)"
    
    # Check if backend API is responding
    if curl -s --max-time 5 http://127.0.0.1:8081/api/auth/me > /dev/null 2>&1; then
        print_status "Backend API is responding"
    else
        print_warning "Backend API check failed (may be WSL networking issue)"
    fi
else
    print_error "Backend process failed to start"
    SERVICES_RUNNING=false
fi

# Check if frontend process is still running
if ps -p $FRONTEND_PID > /dev/null 2>&1; then
    print_status "Frontend process is running (PID: $FRONTEND_PID)"
    
    # Check if frontend is responding
    if curl -s --max-time 5 http://127.0.0.1:3000 > /dev/null 2>&1; then
        print_status "Frontend is responding"
    else
        print_warning "Frontend check failed (may still be starting)"
    fi
else
    print_error "Frontend process failed to start"
    SERVICES_RUNNING=false
fi

echo ""
if [ "$SERVICES_RUNNING" = true ]; then
    print_status "✅ All services started successfully!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔗 Backend API: http://localhost:8081/api"
    echo ""
    echo "To stop all services: kill $BACKEND_PID $FRONTEND_PID"
else
    print_error "❌ Some services failed to start properly"
    echo ""
    echo "Try running the script again or check the logs above for errors"
fi