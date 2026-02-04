#!/bin/bash

echo "🚀 Deploying TeleHealth to Remote Server"
echo "========================================"

# Configuration
REMOTE_HOST="109.123.243.148"
REMOTE_USER="dev148"  # Adjust if different
REMOTE_PATH="/tmp"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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
if [ ! -d "build" ] || [ ! -d "backend/dist" ]; then
    print_error "Build files not found. Please run builds first:"
    echo "  npm run build"
    echo "  cd backend && npm run build"
    exit 1
fi

echo "Preparing deployment files..."

# Create deployment package
print_status "Creating deployment directories..."
mkdir -p deploy_tmp/telehealth-frontend
mkdir -p deploy_tmp/telehealth-backend

# Copy frontend build
print_status "Copying frontend build..."
cp -r build/* deploy_tmp/telehealth-frontend/

# Copy backend build and necessary files
print_status "Copying backend build..."
cp -r backend/dist/* deploy_tmp/telehealth-backend/
cp backend/package.json deploy_tmp/telehealth-backend/
cp backend/package-lock.json deploy_tmp/telehealth-backend/
cp backend/ecosystem.config.js deploy_tmp/telehealth-backend/
cp backend/api-bridge-full.js deploy_tmp/telehealth-backend/

# Copy deployment scripts
print_status "Copying deployment scripts..."
cp finalize-deployment.sh deploy_tmp/
cp setup-server.sh deploy_tmp/

echo "Uploading files to remote server..."

# Upload files to remote server
print_status "Uploading frontend build..."
scp -r deploy_tmp/telehealth-frontend/* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/telehealth-frontend/

print_status "Uploading backend build..."
scp -r deploy_tmp/telehealth-backend/* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/telehealth-backend/

print_status "Uploading deployment scripts..."
scp deploy_tmp/finalize-deployment.sh ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
scp deploy_tmp/setup-server.sh ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

# Make scripts executable on remote server
print_status "Making scripts executable on remote server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "chmod +x ${REMOTE_PATH}/finalize-deployment.sh ${REMOTE_PATH}/setup-server.sh"

echo "Running deployment on remote server..."

# Run the deployment script on remote server
print_status "Running finalize-deployment.sh on remote server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH} && sudo ./finalize-deployment.sh"

# Cleanup
print_status "Cleaning up temporary files..."
rm -rf deploy_tmp

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Frontend: https://tel.transtechologies.com"
echo "API: https://api.tel.transtechologies.com"
echo ""
echo "To check status on remote server:"
echo "  ssh ${REMOTE_USER}@${REMOTE_HOST} 'pm2 status'"
echo ""
echo "To view logs on remote server:"
echo "  ssh ${REMOTE_USER}@${REMOTE_HOST} 'pm2 logs'"