# Email Verification System - Implementation Guide

## Overview
This document describes the comprehensive email verification system integrated into the TeleHealth authentication flow.

## Features
- ✅ **7-Digit Verification Codes** - Secure, time-limited verification
- ✅ **15-Minute Expiration** - Codes expire after 15 minutes
- ✅ **Registration Verification** - Email verification required for new users
- ✅ **Login Verification** - Additional security layer for existing users
- ✅ **Logout Notifications** - Email alerts when users log out
- ✅ **Rate Limiting** - Protection against code spam (max 3 codes/hour)
- ✅ **Attempt Tracking** - Maximum 5 verification attempts per code
- ✅ **Smart Resend** - Users can request new codes with rate limiting

---

## Architecture

### Components

1. **Email Service** (`src/services/email.service.ts`)
   - Handles all email sending via SMTP
   - Templates for verification codes, welcome emails, and logout notifications
   - Configurable SMTP settings

2. **Verification Service** (`src/services/verification.service.ts`)
   - Generates secure 7-digit codes
   - Manages code lifecycle (creation, verification, expiration)
   - Tracks attempts and enforces rate limits
   - Automatic cleanup of expired codes

3. **Auth Routes** (`src/routes/auth.routes.ts`)
   - `/api/auth/register/patient` - Registration with email verification
   - `/api/auth/login` - Login with verification code
   - `/api/auth/verify-code` - Verify the 7-digit code
   - `/api/auth/resend-code` - Request a new verification code
   - `/api/auth/logout` - Logout with email notification

4. **Database** (`verification_codes` table)
   ```javascript
   {
     id: string,
     userId: string,
     email: string,
     code: string (7 digits),
     type: 'registration' | 'login' | 'password_reset',
     expiresAt: Date,
     verified: boolean,
     attempts: number,
     createdAt: Date
   }
   ```

---

## User Flows

### Registration Flow

```
1. User fills registration form
   ↓
2. POST /api/auth/register/patient
   - User created with email_verified: false
   - is_active: false (account inactive until verified)
   ↓
3. System generates 7-digit code
   ↓
4. Email sent with verification code
   ↓
5. User enters code in verification screen
   ↓
6. POST /api/auth/verify-code
   - Validates code
   - Sets email_verified: true
   - Sets is_active: true
   ↓
7. Welcome email sent
   ↓
8. User can now login
```

### Login Flow

```
1. User enters email and password
   ↓
2. POST /api/auth/login
   - Validates credentials
   - Checks if email_verified
   ↓
3. System generates 7-digit code
   ↓
4. Email sent with login verification code
   ↓
5. User enters code in verification screen
   ↓
6. POST /api/auth/verify-code
   - Validates code
   - Generates JWT token
   - Sets auth cookie
   ↓
7. User logged in successfully
```

### Logout Flow

```
1. User clicks logout
   ↓
2. POST /api/auth/logout
   - Extracts user info from JWT
   - Clears auth cookie
   ↓
3. Email notification sent
   - Includes logout timestamp
   - Device/browser information
   - Security alert if suspicious
   ↓
4. User logged out
```

---

## API Endpoints

### 1. Register Patient
```http
POST /api/auth/register/patient
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "consent_to_terms": true,
  "consent_to_privacy": true,
  "hipaa_consent": true
}
```

**Response:**
```json
{
  "message": "Registration successful. Please check your email for the verification code.",
  "requiresVerification": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "user_type": "patient",
    "email_verified": false
  }
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "Verification code sent to your email",
  "requiresVerification": true,
  "userId": "user-id",
  "email": "user@example.com"
}
```

### 3. Verify Code
```http
POST /api/auth/verify-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "1234567",
  "type": "login"
}
```

**Response (Login):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "user_type": "patient"
  }
}
```

**Response (Registration):**
```json
{
  "message": "Email verified successfully. You can now login.",
  "verified": true
}
```

### 4. Resend Code
```http
POST /api/auth/resend-code
Content-Type: application/json

{
  "email": "user@example.com",
  "type": "registration"
}
```

**Response:**
```json
{
  "message": "Verification code sent successfully",
  "success": true
}
```

### 5. Logout
```http
POST /api/auth/logout
Cookie: auth_token=<jwt-token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Email Templates

### Verification Code Email
- **Subject:** "Verify Your TeleHealth Account" or "Your TeleHealth Login Verification Code"
- **Contains:**
  - Large 7-digit code
  - 15-minute expiration notice
  - Security warnings
  - Next steps

### Logout Notification Email
- **Subject:** "TeleHealth Account Logout Notification"
- **Contains:**
  - Logout timestamp
  - Device/browser information
  - Security alert section
  - Best practices recommendations

### Welcome Email
- **Subject:** "Welcome to TeleHealth - Your Account is Active!"
- **Contains:**
  - Welcome message
  - Platform features overview
  - Getting started guide
  - Support contact info

---

## Configuration

### Environment Variables (.env)

```bash
# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@telehealth.com
EMAIL_FROM_NAME=TeleHealth Portal
```

### Gmail Setup (for testing)
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an "App Password"
4. Use the app password in `EMAIL_PASSWORD`

---

## Security Features

### Rate Limiting
- **Code Generation:** Maximum 3 codes per hour per email
- **Verification Attempts:** Maximum 5 attempts per code
- **IP-based Rate Limiting:** Applied via authRateLimit middleware

### Code Security
- **Length:** 7 digits (10,000,000 possible combinations)
- **Expiration:** 15 minutes from generation
- **One-time Use:** Codes marked as used after successful verification
- **Invalidation:** Previous codes invalidated when new one is generated

### Attempt Tracking
```javascript
{
  attempts: 0,  // Incremented on each verification attempt
  maxAttempts: 5 // Code disabled after 5 failed attempts
}
```

---

## Database Schema

### verification_codes Table
```javascript
{
  id: "auto-generated-uuid",
  userId: "user-uuid",
  email: "user@example.com",
  code: "1234567",
  type: "registration" | "login" | "password_reset",
  expiresAt: "2026-02-04T06:00:00.000Z",
  verified: false,
  attempts: 0,
  createdAt: "2026-02-04T05:45:00.000Z",
  verifiedAt: null,
  invalidatedAt: null
}
```

### Indexes
- `userId` - Fast lookup by user
- `email` - Fast lookup by email
- `type` - Filter by verification type
- `verified` - Find unverified codes
- `expiresAt` - Cleanup expired codes
- `createdAt` - Rate limiting queries

---

## Testing

### Test Registration with Verification
```bash
# 1. Register
curl -X POST http://localhost:3001/api/auth/register/patient \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+1234567890"
  }'

# 2. Check email for code (or check database)
# 3. Verify code
curl -X POST http://localhost:3001/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "1234567",
    "type": "registration"
  }'
```

### Test Login with Verification
```bash
# 1. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# 2. Check email for code
# 3. Verify code
curl -X POST http://localhost:3001/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "1234567",
    "type": "login"
  }'
```

---

## Maintenance

### Cleanup Expired Codes
The system should periodically clean up expired verification codes:

```javascript
// Run this as a cron job or scheduled task
import verificationService from './services/verification.service';

// Run every hour
setInterval(async () => {
  await verificationService.cleanupExpiredCodes();
}, 60 * 60 * 1000);
```

### Monitoring
- Track verification success rates
- Monitor email delivery failures
- Alert on suspicious patterns (many failed attempts)
- Log verification statistics per user

---

## Error Handling

### Common Errors

1. **Invalid or Expired Code**
   ```json
   {
     "error": "Invalid or expired verification code"
   }
   ```

2. **Maximum Attempts Exceeded**
   ```json
   {
     "error": "Maximum verification attempts exceeded. Please request a new code."
   }
   ```

3. **Rate Limit Exceeded**
   ```json
   {
     "error": "Too many verification attempts. Please try again in 1 hour."
   }
   ```

4. **Email Not Verified**
   ```json
   {
     "error": "Email not verified. Please verify your email first.",
     "requiresVerification": true,
     "email": "user@example.com"
   }
   ```

---

## Future Enhancements

1. **SMS Verification** - Option to receive codes via SMS
2. **Backup Codes** - Generate recovery codes for account access
3. **Biometric Authentication** - Fingerprint/Face ID support
4. **Trusted Devices** - Skip verification for trusted devices
5. **Geolocation Alerts** - Notify users of logins from new locations
6. **Login History** - View all login attempts and sessions

---

## Support

For questions or issues:
- Email: support@telehealth.com
- Documentation: [TeleHealth Docs]
- GitHub: [Repository Issues]

---

**Last Updated:** February 4, 2026
**Version:** 1.0.0
