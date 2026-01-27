#!/bin/bash

echo "🔧 Updating Nginx configuration to proxy /api requests"
echo "======================================================"

# Backup the current config
sudo cp /etc/nginx/sites-available/telehealth-frontend /etc/nginx/sites-available/telehealth-frontend.backup

# Create updated config with API proxy
sudo tee /etc/nginx/sites-available/telehealth-frontend > /dev/null << 'EOF'
server {
    listen 80;
    server_name tel.transtechologies.com;

    root /var/www/html/telehealth;
    index index.html;

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:8081/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

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

# Test nginx config
echo ""
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration is valid"
    echo "Reloading Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
    echo ""
    echo "API proxy is now active at tel.transtechologies.com/api"
else
    echo "❌ Configuration error. Restoring backup..."
    sudo mv /etc/nginx/sites-available/telehealth-frontend.backup /etc/nginx/sites-available/telehealth-frontend
    exit 1
fi
