#!/bin/bash
# Comprehensive startup script for telehealth application
# Starts backend services and frontend development server

echo "=== Telehealth Application Startup Script ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
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

echo "Starting telehealth services..."
echo ""

# Step 1: Start backend services
echo "=== Starting Backend Services ==="
cd backend

# Check if backend dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "Installing backend dependencies..."
    npm install
fi

# Start all backend services
print_status "Starting gRPC services and API bridge..."
chmod +x start-all.sh
./start-all.sh

cd ..
echo ""

# Step 2: Start frontend development server
echo "=== Starting Frontend Development Server ==="

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    npm install
fi

# Check if .env file exists and has correct API URL
if [ -f ".env" ]; then
    if grep -q "REACT_APP_API_URL=http://localhost:8082/api" .env; then
        print_status "API URL configuration looks correct"
    else
        print_warning "Updating API URL to localhost:8082..."
        sed -i 's|REACT_APP_API_URL=.*|REACT_APP_API_URL=http://localhost:8082/api|' .env
    fi
else
    print_warning "Creating .env file with API URL..."
    echo "REACT_APP_API_URL=http://localhost:8082/api" > .env
fi

# Start the frontend development server
print_status "Starting React development server..."
npm start &
FRONTEND_PID=$!

echo ""
echo "=== Startup Complete ==="
print_status "Backend services should be running on ports 50052-50060 and 8082"
print_status "Frontend development server starting on port 3000"
print_status "Frontend PID: $FRONTEND_PID"

echo ""
echo "=== Verification ==="
echo "Checking backend services..."
sleep 5

# Check if services are running
SERVICES_RUNNING=true

# Check API bridge
if curl -s http://localhost:8082/api/doctors > /dev/null 2>&1; then
    print_status "API bridge is responding"
else
    print_error "API bridge is not responding"
    SERVICES_RUNNING=false
fi

# Check if frontend is starting
if ps -p $FRONTEND_PID > /dev/null 2>&1; then
    print_status "Frontend process is running"
else
    print_error "Frontend process failed to start"
    SERVICES_RUNNING=false
fi

echo ""
if [ "$SERVICES_RUNNING" = true ]; then
    print_status "All services appear to be running!"
    echo ""
    echo "🌐 Open your browser to: http://localhost:3000"
    echo "🔗 API endpoint: http://localhost:8082/api"
else
    print_error "Some services failed to start. Check the logs above."
fi

echo ""
echo "To stop all services, press Ctrl+C or run: kill $FRONTEND_PID"