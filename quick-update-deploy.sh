#!/bin/bash

echo "🚀 TeleHealth Quick Update & Deploy Script"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

REMOTE_HOST="109.123.243.148"
REMOTE_USER="dev148"

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
    print_error "Run this script from the telehealth project root directory"
    exit 1
fi

echo "Step 1: Building applications..."
print_status "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

print_status "Building backend..."
cd backend
npm run build
if [ $? -ne 0 ]; then
    print_error "Backend build failed"
    exit 1
fi
cd ..
print_status "Builds completed successfully"

echo ""
echo "Step 2: Deploying to remote server..."
print_status "Uploading frontend build..."
scp -r build/* ${REMOTE_USER}@${REMOTE_HOST}:/tmp/telehealth-frontend/ 2>/dev/null
if [ $? -ne 0 ]; then
    print_error "Frontend upload failed"
    exit 1
fi

print_status "Uploading backend build..."
scp -r backend/dist/* ${REMOTE_USER}@${REMOTE_HOST}:/tmp/telehealth-backend/ 2>/dev/null
scp backend/package.json ${REMOTE_USER}@${REMOTE_HOST}:/tmp/telehealth-backend/ 2>/dev/null
scp backend/package-lock.json ${REMOTE_USER}@${REMOTE_HOST}:/tmp/telehealth-backend/ 2>/dev/null
scp backend/ecosystem.config.js ${REMOTE_USER}@${REMOTE_HOST}:/tmp/telehealth-backend/ 2>/dev/null
scp backend/api-bridge-full.js ${REMOTE_USER}@${REMOTE_HOST}:/tmp/telehealth-backend/ 2>/dev/null

print_status "Uploading deployment script..."
scp finalize-deployment.sh ${REMOTE_USER}@${REMOTE_HOST}:/tmp/ 2>/dev/null

print_status "Running deployment on server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} 'chmod +x /tmp/finalize-deployment.sh && sudo /tmp/finalize-deployment.sh' 2>/dev/null
if [ $? -ne 0 ]; then
    print_error "Server deployment failed"
    exit 1
fi

echo ""
echo "Step 3: Verification..."
print_status "Checking service status..."
ssh ${REMOTE_USER}@${REMOTE_HOST} 'pm2 jlist' | jq -r '.[] | select(.name | contains("telehealth")) | "\(.name): \(.pm2_env.status)"' 2>/dev/null

print_status "Testing frontend..."
curl -s -I http://tel.transtechologies.com | head -1 | grep -q "200" && print_status "Frontend: OK" || print_warning "Frontend: Check logs"

print_status "Testing API DNS..."
nslookup api.tel.transtechologies.com 2>/dev/null | grep -q "109.123.243.148" && print_status "API DNS: Configured" || print_warning "API DNS: Not configured yet"

echo ""
echo -e "${GREEN}🎉 Update & Deploy Complete!${NC}"
echo ""
echo "📊 Status Summary:"
echo "   Frontend: http://tel.transtechologies.com"
echo "   API: http://api.tel.transtechologies.com (after DNS)"
echo "   Services: Check with 'ssh ${REMOTE_USER}@${REMOTE_HOST} pm2 status'"
echo ""
echo "📝 Next Steps:"
echo "   1. Configure DNS for api.tel.transtechologies.com if not done"
echo "   2. Test full application functionality"
echo "   3. Monitor logs: pm2 logs"