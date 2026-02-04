# Email Verification System - Quick Setup Guide

## ✅ What Was Implemented

### Core Features
1. **7-Digit Verification Codes**
   - Secure random code generation
   - 15-minute expiration time
   - One-time use only

2. **Email Notifications**
   - Registration verification code
   - Login verification code
   - Logout security alerts
   - Welcome email after verification

3. **Smart Security**
   - Rate limiting: Max 3 codes per hour
   - Attempt tracking: Max 5 verification attempts
   - Auto-invalidation of old codes
   - Protection against brute force

### New API Endpoints
- `POST /api/auth/register/patient` - Registration with email verification
- `POST /api/auth/login` - Login with 2FA code
- `POST /api/auth/verify-code` - Verify the 7-digit code
- `POST /api/auth/resend-code` - Request new code
- `POST /api/auth/logout` - Logout with email notification

---

## 🚀 Quick Setup

### 1. Configure Email Settings

Update `backend/.env` with your SMTP settings:

```bash
# For Gmail (recommended for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@telehealth.com
EMAIL_FROM_NAME=TeleHealth Portal
```

### 2. Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to "App passwords"
4. Generate password for "Mail"
5. Copy the 16-character password
6. Use it in `EMAIL_PASSWORD`

### 3. Database Setup

The system will automatically create the `verification_codes` table on startup.

### 4. Build and Deploy

```bash
# Build backend
cd backend
npm install
npm run build

# Deploy to production
cd ..
./quick-update-deploy.sh
```

---

## 📧 Email Templates

### Verification Code Email
```
Subject: Verify Your TeleHealth Account

Your Verification Code: 1234567
Valid for 15 minutes

Security Notice:
- Never share this code
- Code expires in 15 minutes
- TeleHealth will never ask for this code
```

### Logout Notification
```
Subject: TeleHealth Account Logout Notification

You have been logged out from your account.

Time: Feb 4, 2026 5:30 PM EST
Device: Chrome on Windows 10

If this wasn't you, please:
1. Change your password immediately
2. Review recent account activity
3. Contact support
```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|----------------|
| Code Length | 7 digits (10M combinations) |
| Expiration | 15 minutes |
| Max Attempts | 5 per code |
| Rate Limit | 3 codes/hour per email |
| One-time Use | Yes, auto-invalidated |
| Old Code Cleanup | Yes, automated |

---

## 🧪 Testing

### Test Registration Flow

```bash
# 1. Register new user
curl -X POST http://localhost:3001/api/auth/register/patient \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "SecurePass123!",
    "first_name": "New",
    "last_name": "User",
    "phone": "+1234567890",
    "consent_to_terms": true,
    "consent_to_privacy": true,
    "hipaa_consent": true
  }'

# Response: Check email for 7-digit code

# 2. Verify email
curl -X POST http://localhost:3001/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "code": "1234567",
    "type": "registration"
  }'

# Response: Account activated, welcome email sent
```

### Test Login Flow

```bash
# 1. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "SecurePass123!"
  }'

# Response: Verification code sent to email

# 2. Verify login
curl -X POST http://localhost:3001/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "newuser@test.com",
    "code": "7654321",
    "type": "login"
  }'

# Response: JWT token set in cookie

# 3. Logout
curl -X POST http://localhost:3001/api/auth/logout \
  -b cookies.txt

# Response: Logout notification email sent
```

---

## 📊 Monitoring

### Check Verification Stats

```javascript
// In RethinkDB admin panel or via API
r.table('verification_codes')
  .filter({verified: true})
  .count()

// Expired codes
r.table('verification_codes')
  .filter(r.row('expiresAt').lt(r.now()))
  .count()
```

### Cleanup Task (Optional)

Add to `backend/src/index.ts`:

```javascript
import verificationService from './services/verification.service';

// Run cleanup every hour
setInterval(async () => {
  await verificationService.cleanupExpiredCodes();
}, 60 * 60 * 1000);
```

---

## ⚠️ Common Issues

### Email Not Sending

**Problem:** Emails not arriving

**Solutions:**
1. Check EMAIL_USER and EMAIL_PASSWORD are correct
2. Verify Gmail App Password is used (not regular password)
3. Check spam/junk folder
4. Review backend logs for email errors
5. Test SMTP connection:
   ```bash
   telnet smtp.gmail.com 587
   ```

### Rate Limit Reached

**Problem:** "Too many verification attempts"

**Solution:**
- Wait 1 hour
- Or manually delete old codes from database:
  ```javascript
  r.table('verification_codes')
    .filter({email: 'user@test.com'})
    .delete()
  ```

### Code Expired

**Problem:** "Verification code has expired"

**Solution:**
- Use resend-code endpoint to get new code
- Codes expire after 15 minutes

---

## 🔧 Configuration Options

### Adjust Code Expiration

In `verification.service.ts`:
```javascript
const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
// Change to 30 minutes:
const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
```

### Adjust Rate Limit

In `verification.service.ts`:
```javascript
if (recentCodes >= 3) // Max 3 codes per hour
// Change to 5:
if (recentCodes >= 5) // Max 5 codes per hour
```

### Adjust Max Attempts

In `verification.service.ts`:
```javascript
if (verificationRecord.attempts >= 5) // Max 5 attempts
// Change to 10:
if (verificationRecord.attempts >= 10) // Max 10 attempts
```

---

## 📝 Frontend Integration (Next Steps)

Create verification UI components:

1. **Email Verification Screen**
   - 7-digit code input
   - Resend button
   - Timer showing expiration

2. **Login Verification Screen**
   - Code entry after password
   - Auto-submit on 7 digits
   - Error handling

3. **Registration Success**
   - Show "Check your email" message
   - Link to resend code
   - Support contact

---

## 📚 Documentation

- **Full Guide:** [EMAIL_VERIFICATION_GUIDE.md](./EMAIL_VERIFICATION_GUIDE.md)
- **API Endpoints:** See guide for detailed API documentation
- **Security:** Review security features in guide

---

## ✅ Deployment Checklist

- [ ] Update EMAIL_* environment variables in production
- [ ] Test email sending in production
- [ ] Verify SMTP credentials work
- [ ] Check firewall allows SMTP port 587
- [ ] Monitor email delivery rates
- [ ] Set up email service monitoring
- [ ] Configure SPF/DKIM records for production domain
- [ ] Test all flows (register, login, logout)
- [ ] Set up automated cleanup task
- [ ] Monitor verification success rates

---

## 🎉 Success!

Your TeleHealth portal now has:
- ✅ Secure email verification
- ✅ 7-digit codes with 15-min expiration
- ✅ Login 2FA protection
- ✅ Logout security alerts
- ✅ Professional email templates
- ✅ Smart rate limiting
- ✅ Complete documentation

**Next:** Configure your email settings and test the system!
