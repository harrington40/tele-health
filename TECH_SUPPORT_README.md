# Tech Support System - User Guide

## Overview
The TeleHealth portal now includes a comprehensive tech support system that allows support staff to assist customers, manage support tickets, and monitor user sessions in real-time.

## Tech Support Login

### Access URL
**Production:** http://tel.transtechologies.com/tech-support-login

### Default Tech Support Account
```
Email: support@transtechologies.com
Password: TechSupport2026!
Employee ID: TS001
Department: Technical Support
```

## Features

### 1. **Support Dashboard**
- **Real-time Statistics:**
  - Open Tickets count
  - In-Progress tickets count
  - Resolved Today count
  - Active Users count

### 2. **Ticket Management**
The support dashboard provides comprehensive ticket management:

- **Ticket Information:**
  - User name and email
  - Subject and message
  - Priority levels: Urgent, High, Medium, Low
  - Status: Open, In-Progress, Resolved, Closed
  - Category: Technical, Billing, Account, Medical, General
  - Creation and last updated timestamps
  - Unread message count

- **Ticket Actions:**
  - View ticket details
  - Send text replies to customers
  - Start live chat
  - Initiate video calls
  - Mark tickets as resolved
  - Assign tickets to specific support staff

### 3. **Search and Filtering**
- Search by:
  - Customer name
  - Email address
  - Ticket subject
- Filter by:
  - Status (All, Open, In-Progress, Resolved, Closed)
  - Priority (All, Urgent, High, Medium, Low)

### 4. **Live Chat Integration**
- Start live chat sessions with customers directly from tickets
- Real-time messaging through the MessagingSystem component
- Chat history and conversation tracking

### 5. **Active Session Monitoring**
The "Active Sessions" tab shows:
- Currently online users
- Current page/location in the app
- Last activity timestamp
- Users requesting help
- Quick access to start support chat

### 6. **Analytics Dashboard**
- Support performance metrics (coming soon)
- Ticket resolution trends
- Customer satisfaction scores
- Response time analytics

## How Customers Use Support

### For Customers to Request Support:
Currently, customers can:
1. Access the Help Center at `/help`
2. Contact support via email or phone
3. Use the contact form at `/contact`

### Future Customer-Facing Features:
- **In-App Support Chat Widget:** Customers will be able to click a floating help button to chat with support
- **Support Ticket Creation:** Customers can create tickets directly from their dashboard
- **Knowledge Base:** Self-service articles and FAQs
- **Chat Bot:** AI-powered initial support before connecting to human agents

## Creating Additional Tech Support Accounts

### Method 1: Using the API endpoint
```bash
curl -X POST http://api.tel.transtechologies.com/api/auth/register/tech-support \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newtech@transtechologies.com",
    "password": "SecurePassword123!",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "employee_id": "TS002",
    "department": "Technical Support"
  }'
```

### Method 2: Using the provided script
```bash
cd /mnt/c/Users/harri/designProject2020/tele-health/backend
# Edit create-tech-support.js to change credentials
node create-tech-support.js
```

## Architecture

### Backend Components
- **Route:** `/api/auth/register/tech-support` (POST)
- **User Type:** `tech_support` in database
- **Auto-verification:** Tech support accounts are automatically verified (no email verification required)
- **Fields:**
  - Standard user fields (email, password, name, phone)
  - employee_id (unique identifier)
  - department (e.g., "Technical Support", "Billing Support")

### Frontend Components
- **TechSupportLoginPage:** Dedicated login page for support staff
- **TechSupportDashboard:** Main dashboard with tickets, sessions, analytics
- **MessagingSystem:** Integrated chat component for customer support
- **AuthContext:** Updated to handle `tech_support` user type

### Routes
- `/tech-support-login` - Login page for support staff
- `/tech-support-dashboard` - Main support dashboard (requires authentication)

### User Type Handling
The system supports three user types:
- `patient` → mapped to `client` in frontend
- `doctor` → mapped to `provider` in frontend
- `tech_support` → mapped to `tech_support` in frontend

## Security Features

1. **Authentication Required:** All tech support routes require authentication
2. **Auto-verified Accounts:** Tech support accounts are pre-verified for immediate access
3. **Employee ID Tracking:** Each support staff has a unique employee ID
4. **Session Management:** Standard JWT-based session management
5. **Role-based Access:** Tech support users can only access support-specific features

## Customer Chat Integration

### How It Works:
1. **From Ticket:** Support staff clicks "Start Live Chat" on any ticket
2. **Real-time Communication:** Uses the MessagingSystem component for live chat
3. **Message History:** All conversations are tracked and stored
4. **Multi-channel:** Supports text, voice notes, and file attachments

### Future Enhancements:
- **Video Call Support:** Integrated video calls for complex support issues
- **Screen Sharing:** Allow customers to share screens for troubleshooting
- **Co-browsing:** Navigate the app together with customers
- **Canned Responses:** Quick reply templates for common issues
- **Ticket Escalation:** Escalate to senior support or specialists

## Best Practices

### For Support Staff:
1. **Respond Promptly:** Acknowledge tickets within 5 minutes
2. **Update Status:** Keep ticket status current (open → in-progress → resolved)
3. **Clear Communication:** Use clear, professional language
4. **Document Solutions:** Add notes about resolutions for future reference
5. **Prioritize Urgent Issues:** Handle urgent/high priority tickets first

### For Administrators:
1. **Monitor Performance:** Review analytics regularly
2. **Train Staff:** Ensure all support staff know the system
3. **Update Knowledge Base:** Keep help articles current
4. **Review Tickets:** Audit resolved tickets for quality assurance
5. **Gather Feedback:** Collect customer satisfaction data

## Troubleshooting

### Cannot Login to Tech Support
- Verify you're using the correct URL: `/tech-support-login`
- Check credentials (email and password)
- Ensure account is created with `tech_support` user type

### Tickets Not Appearing
- Check filter settings (status and priority)
- Verify search query
- Refresh the page
- Check browser console for errors

### Chat Not Working
- Ensure both users are online
- Check network connection
- Verify WebSocket connection (if implemented)
- Clear browser cache and reload

## API Endpoints

### Tech Support Registration
```
POST /api/auth/register/tech-support
Content-Type: application/json

Body:
{
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "phone": "string",
  "employee_id": "string",
  "department": "string"
}

Response (201):
{
  "message": "Tech support account created successfully",
  "user": {
    "id": "uuid",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "user_type": "tech_support",
    "employee_id": "string",
    "department": "string"
  }
}
```

### Standard Auth Endpoints
Tech support users can use all standard auth endpoints:
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

## Next Steps

### Immediate Improvements:
1. **Real API Integration:** Connect to actual ticket API instead of mock data
2. **WebSocket Support:** Add real-time updates for tickets and chat
3. **Notification System:** Alert support staff of new urgent tickets
4. **Customer Portal:** Add customer-facing support ticket creation

### Future Features:
1. **SLA Tracking:** Monitor response times and SLA compliance
2. **Automated Routing:** Assign tickets based on expertise/availability
3. **Knowledge Base:** Searchable help articles
4. **Chat Bots:** AI-powered initial support
5. **Multi-language Support:** Support in multiple languages
6. **Mobile App:** Support dashboard mobile app for iOS/Android

## Support

For technical issues with the support system itself:
- Email: dev@transtechologies.com
- GitHub: Create an issue in the repository
- Documentation: Refer to this README and code comments
