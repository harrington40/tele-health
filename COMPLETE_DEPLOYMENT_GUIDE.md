# 🚀 TeleHealth Portal - Complete Deployment Guide

## 📋 Overview
This guide covers the complete process for deploying the TeleHealth Portal from development to production.

## 🎯 Current Status
- **Frontend**: ✅ Built and deployed
- **Backend**: ✅ Built and deployed
- **Services**: ✅ Running on remote server
- **Frontend Domain**: ✅ `tel.transtechologies.com` working
- **API Domain**: ❌ `api.tel.transtechologies.com` needs DNS

---

## 🔄 Update & Deployment Process

### Phase 1: Local Development Updates

#### 1.1 Update Frontend Code
```bash
cd /mnt/c/Users/harri/designProject2020/tele-health

# Make your code changes
# Edit src/components/, src/pages/, etc.

# Update API URL for production (if needed)
# REACT_APP_API_URL=https://api.tel.transtechologies.com/api
```

#### 1.2 Update Backend Code
```bash
cd backend

# Make your code changes
# Edit src/controllers/, src/routes/, etc.

# Update environment variables in .env if needed
```

#### 1.3 Build Applications
```bash
# Build frontend
cd /mnt/c/Users/harri/designProject2020/tele-health
npm run build

# Build backend
cd backend
npm run build
```

---

### Phase 2: Deploy to Remote Server

#### 2.1 Run Automated Deployment
```bash
cd /mnt/c/Users/harri/designProject2020/tele-health
./deploy-to-remote.sh
```

#### 2.2 Manual Deployment (Alternative)
```bash
# Upload frontend
scp -r build/* dev148@109.123.243.148:/tmp/telehealth-frontend/

# Upload backend
scp -r backend/dist/* dev148@109.123.243.148:/tmp/telehealth-backend/
scp backend/package.json dev148@109.123.243.148:/tmp/telehealth-backend/
scp backend/package-lock.json dev148@109.123.243.148:/tmp/telehealth-backend/
scp backend/ecosystem.config.js dev148@109.123.243.148:/tmp/telehealth-backend/
scp backend/api-bridge-full.js dev148@109.123.243.148:/tmp/telehealth-backend/

# Upload scripts
scp finalize-deployment.sh dev148@109.123.243.148:/tmp/

# Run deployment
ssh dev148@109.123.243.148 'chmod +x /tmp/finalize-deployment.sh && sudo /tmp/finalize-deployment.sh'
```

---

### Phase 3: DNS Configuration

#### 3.1 Add API Subdomain DNS Record
**Required for API to work!**

In your DNS provider (GoDaddy, Namecheap, etc.):

```
Type: A
Name/Host: api
Value/Target: 109.123.243.148
TTL: 3600
```

#### 3.2 Verify DNS
```bash
# Check DNS propagation
nslookup api.tel.transtechologies.com

# Should return: 109.123.243.148
```

---

### Phase 4: Verification

#### 4.1 Check Services Status
```bash
ssh dev148@109.123.243.148 'pm2 status'
```

#### 4.2 Test Frontend
```bash
curl -I http://tel.transtechologies.com
# Should return: HTTP/1.1 200 OK
```

#### 4.3 Test API (After DNS)
```bash
curl http://api.tel.transtechologies.com/api/doctors | jq length
# Should return: number > 0
```

#### 4.4 Check Logs
```bash
ssh dev148@109.123.243.148 'pm2 logs telehealth-api-bridge --lines 10'
```

---

## 🔧 Configuration Files

### Frontend .env (Local Development)
```env
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_RETHINKDB_HOST=localhost
REACT_APP_RETHINKDB_PORT=28015
REACT_APP_RETHINKDB_DB=telehealth_db_db
```

### Frontend .env (Production)
```env
REACT_APP_API_URL=https://api.tel.transtechologies.com/api
REACT_APP_RETHINKDB_HOST=207.180.247.153
REACT_APP_RETHINKDB_PORT=28015
REACT_APP_RETHINKDB_DB=telehealth_db_db
```

### Backend .env
```env
RETHINKDB_HOST=207.180.247.153
RETHINKDB_PORT=28015
RETHINKDB_DB=telehealth_db_db
RETHINKDB_AUTH_KEY=Cosinesine900**
```

---

## 🚨 Troubleshooting

### Issue: API Not Working
**Solution**: Check DNS for `api.tel.transtechologies.com`

### Issue: Services Not Starting
```bash
ssh dev148@109.123.243.148 'pm2 restart all'
```

### Issue: Nginx Errors
```bash
ssh dev148@109.123.243.148 'sudo nginx -t'
ssh dev148@109.123.243.148 'sudo systemctl reload nginx'
```

### Issue: Database Connection
```bash
ssh dev148@109.123.243.148 'curl -s http://localhost:8081/api/doctors | head -5'
```

---

## 📊 Service Architecture

```
Internet
    ↓
[DNS: tel.transtechologies.com → 109.123.243.148]
    ↓
[Nginx Load Balancer]
    ├── Frontend: /var/www/html/telehealth (Static Files)
    └── API Proxy: /api/* → localhost:8081
        ↓
    [PM2 Process Manager]
        ├── telehealth-api-bridge (Express.js API)
        └── telehealth-grpc-server (gRPC Services)
            ↓
        [RethinkDB: rethinkdb.transtechologies.com:28015]
```

---

## 🔄 Update Workflow

1. **Develop locally** → Make code changes
2. **Test locally** → `npm start` + `cd backend && npm run dev`
3. **Build applications** → `npm run build` + `cd backend && npm run build`
4. **Deploy to server** → `./deploy-to-remote.sh`
5. **Update DNS** → Add API subdomain if needed
6. **Verify deployment** → Test all endpoints
7. **Monitor logs** → Check PM2 and Nginx logs

---

## 📞 Support

**Server Access**: `ssh dev148@109.123.243.148`
**PM2 Commands**:
- `pm2 status` - Check service status
- `pm2 logs` - View logs
- `pm2 restart all` - Restart all services

**URLs**:
- Frontend: `http://tel.transtechologies.com`
- API: `http://api.tel.transtechologies.com` (after DNS)
- Database: `rethinkdb.transtechologies.com:28015`

---

## ✅ Success Checklist

- [ ] Code changes committed
- [ ] Frontend builds successfully
- [ ] Backend builds successfully
- [ ] Files uploaded to server
- [ ] Services restarted
- [ ] Frontend accessible
- [ ] API DNS configured
- [ ] API endpoints working
- [ ] Database connected
- [ ] Logs clean