#!/bin/bash

echo "🚀 Finalizing TeleHealth Deployment"
echo "==================================="

# Move backend files
echo "Moving backend files..."
sudo mkdir -p /opt/telehealth-grpc
sudo cp -r /tmp/telehealth-backend/* /opt/telehealth-grpc/
sudo chown -R dev148:dev148 /opt/telehealth-grpc

# Move frontend files
echo "Moving frontend files..."
sudo mkdir -p /var/www/html/telehealth
sudo cp -r /tmp/telehealth-frontend/* /var/www/html/telehealth/
sudo chown -R www-data:www-data /var/www/html/telehealth

# Create nginx config for frontend
echo "Creating Nginx configuration for frontend..."
sudo tee /etc/nginx/sites-available/telehealth-frontend > /dev/null << 'EOF'
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
EOF

# Create nginx config for backend API
echo "Creating Nginx configuration for backend API..."
sudo tee /etc/nginx/sites-available/telehealth-api > /dev/null << 'EOF'
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
EOF

# Enable sites
sudo ln -sf /etc/nginx/sites-available/telehealth-frontend /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/telehealth-api /etc/nginx/sites-enabled/

# Test nginx
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Nginx configured"

# Install dependencies in backend
cd /opt/telehealth-grpc
npm install

# Start services
echo "Starting backend services..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "Frontend Domain: tel.transtechologies.com"
echo "API Domain: api.tel.transtechologies.com"
echo "Database: rethinkdb.transtechologies.com"
echo ""
echo "Services:"
echo "- Frontend: http://tel.transtechologies.com"
echo "- API: http://api.tel.transtechologies.com"
echo "- MQTT: Port 1883"
echo "- gRPC: Ports 50051-50054"
echo ""
echo "Check status: pm2 status"