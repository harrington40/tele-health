#!/bin/bash

echo "🚀 Deploying TeleHealth App to Server"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p /opt/telehealth-grpc
mkdir -p /var/www/html/telehealth
mkdir -p /var/log/telehealth

# Install dependencies
echo -e "${YELLOW}Installing system dependencies...${NC}"
sudo apt update
sudo apt install -y nodejs npm

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# Try to install Mosquitto (MQTT) if available
if command -v apt &> /dev/null; then
    sudo apt install -y mosquitto mosquitto-clients 2>/dev/null || echo "Mosquitto not available, skipping..."
fi

# Install Backblaze CLI
curl -s https://api.github.com/repos/Backblaze/B2_Command_Line_Tool/releases/latest | grep "browser_download_url.*linux" | cut -d '"' -f 4 | xargs curl -L -o b2 2>/dev/null && chmod +x b2 && sudo mv b2 /usr/local/bin/ 2>/dev/null || echo "Backblaze CLI installation failed, skipping..."

echo -e "${GREEN}✅ System dependencies installed${NC}"

# Configure services (skip if not available)
echo -e "${YELLOW}Configuring services...${NC}"

# Try to configure Mosquitto if installed
if systemctl list-units --type=service | grep -q mosquitto; then
    sudo systemctl enable mosquitto 2>/dev/null || echo "Could not enable mosquitto"
    sudo systemctl start mosquitto 2>/dev/null || echo "Could not start mosquitto"
else
    echo "Mosquitto service not available, skipping..."
fi

echo -e "${GREEN}✅ Services configured${NC}"

# Create Nginx configuration for telehealth frontend
echo -e "${YELLOW}Configuring Nginx for Frontend...${NC}"
sudo tee /etc/nginx/sites-available/telehealth-frontend > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name tel.transtechologies.com;

    root /var/www/html/telehealth;
    index index.html;

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/telehealth_frontend_access.log;
    error_log /var/log/nginx/telehealth_frontend_error.log;
}
NGINX_EOF

# Create Nginx configuration for telehealth backend API
echo -e "${YELLOW}Configuring Nginx for Backend API...${NC}"
sudo tee /etc/nginx/sites-available/telehealth-api > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name api.tel.transtechologies.com;

    # API proxy to backend
    location / {
        proxy_pass http://localhost:8081/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/telehealth_api_access.log;
    error_log /var/log/nginx/telehealth_api_error.log;
}
NGINX_EOF

# Enable the sites
sudo ln -sf /etc/nginx/sites-available/telehealth-frontend /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/telehealth-api /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx configured and reloaded${NC}"
else
    echo -e "${RED}❌ Nginx configuration error${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Server setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Copy your backend files to /opt/telehealth-grpc/"
echo "2. Copy your frontend build to /var/www/html/telehealth/"
echo "3. Start the backend services"
echo ""
echo "Frontend Domain: tel.transtechologies.com"
echo "API Domain: api.tel.transtechologies.com"
echo "Database: rethinkdb.transtechologies.com"