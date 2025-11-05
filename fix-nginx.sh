#!/bin/bash

echo "🔧 Fixing nginx configuration for React Router..."

# Backup existing config
ssh root@207.180.247.153 'cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup'

# Update nginx config to support React Router
ssh root@207.180.247.153 'cat > /etc/nginx/sites-available/default << "NGINX_EOF"
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm;

    server_name _;

    # React Router support - try files first, then fallback to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend (if needed)
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

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF'

# Test nginx configuration
echo "Testing nginx configuration..."
ssh root@207.180.247.153 'nginx -t'

if [ $? -eq 0 ]; then
    echo "✅ Configuration is valid, reloading nginx..."
    ssh root@207.180.247.153 'systemctl reload nginx'
    echo "✅ Nginx reloaded successfully!"
    echo ""
    echo "🌐 Your dashboard should now be accessible at:"
    echo "   http://207.180.247.153/doctor-dashboard"
else
    echo "❌ Configuration test failed, restoring backup..."
    ssh root@207.180.247.153 'cp /etc/nginx/sites-available/default.backup /etc/nginx/sites-available/default'
    exit 1
fi
