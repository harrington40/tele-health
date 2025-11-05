# Telehealth User Management System

## User Table Schema

### Overview
The `users` table is designed to handle three types of users:
1. **Admin** - System administrators
2. **Patient/Client** - Patients using the platform
3. **Doctor** - Healthcare providers

### Database Structure

#### Core Fields (All Users)
| Field | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | UUID primary key |
| `user_type` | ENUM | 'admin', 'patient', 'doctor' |
| `email` | VARCHAR(255) | Unique email address |
| `password_hash` | VARCHAR(255) | Bcrypt hashed password |
| `phone` | VARCHAR(20) | Phone number |
| `first_name` | VARCHAR(100) | First name |
| `last_name` | VARCHAR(100) | Last name |
| `date_of_birth` | DATE | Date of birth |
| `gender` | ENUM | 'male', 'female', 'other', 'prefer_not_to_say' |
| `profile_picture_url` | TEXT | Profile image URL |

#### Patient-Specific Fields
| Field | Type | Description |
|-------|------|-------------|
| `blood_type` | VARCHAR(10) | Blood type (A+, O-, etc.) |
| `allergies` | TEXT | JSON array of allergies |
| `chronic_conditions` | TEXT | JSON array of conditions |
| `current_medications` | TEXT | JSON array of medications |
| `medical_history` | TEXT | JSON array of medical history |
| `emergency_contact_name` | VARCHAR(200) | Emergency contact name |
| `emergency_contact_phone` | VARCHAR(20) | Emergency contact phone |
| `emergency_contact_relationship` | VARCHAR(50) | Relationship |
| `insurance_provider` | VARCHAR(200) | Insurance company name |
| `insurance_policy_number` | VARCHAR(100) | Policy number |
| `insurance_group_number` | VARCHAR(100) | Group number |

#### Doctor-Specific Fields
| Field | Type | Description |
|-------|------|-------------|
| `specialty` | VARCHAR(100) | Medical specialty |
| `license_number` | VARCHAR(100) | Medical license number |
| `npi_number` | VARCHAR(50) | National Provider Identifier |
| `dea_number` | VARCHAR(50) | DEA number |
| `medical_school` | VARCHAR(255) | Medical school attended |
| `graduation_year` | INT | Year of graduation |
| `years_of_experience` | INT | Years of practice |
| `board_certifications` | TEXT | JSON array of certifications |
| `languages_spoken` | TEXT | JSON array of languages |
| `bio` | TEXT | Professional biography |
| `consultation_fee` | DECIMAL(10,2) | Consultation fee amount |
| `availability_schedule` | TEXT | JSON weekly schedule |
| `is_accepting_patients` | BOOLEAN | Accepting new patients |
| `average_rating` | DECIMAL(3,2) | Average rating (0-5) |
| `total_reviews` | INT | Number of reviews |
| `total_consultations` | INT | Total consultations |

#### Admin-Specific Fields
| Field | Type | Description |
|-------|------|-------------|
| `admin_level` | ENUM | 'super_admin', 'moderator', 'support' |
| `permissions` | TEXT | JSON array of permissions |

#### Verification & Security
| Field | Type | Description |
|-------|------|-------------|
| `verification_status` | ENUM | 'pending', 'verified', 'rejected', 'suspended' |
| `verification_documents` | TEXT | JSON array of document URLs |
| `verified_at` | TIMESTAMP | Verification timestamp |
| `verified_by` | VARCHAR(36) | Admin who verified |
| `two_factor_enabled` | BOOLEAN | 2FA enabled |
| `email_verified` | BOOLEAN | Email verified |
| `email_verified_at` | TIMESTAMP | Email verification timestamp |

## API Endpoints

### Patient Registration
```http
POST /api/auth/register/patient
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-123-4567",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "555-987-6543",
    "relationship": "Spouse"
  },
  "insurance": {
    "provider": "Blue Cross Blue Shield",
    "policyNumber": "BC123456789",
    "groupNumber": "GRP123"
  }
}
```

### Doctor Registration
```http
POST /api/auth/register/doctor
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "SecurePass123!",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "phone": "555-456-7890",
  "dateOfBirth": "1985-03-15",
  "gender": "female",
  "specialty": "Cardiology",
  "licenseNumber": "MD12345",
  "npiNumber": "NPI1234567890",
  "deaNumber": "DEA123456",
  "medicalSchool": "Harvard Medical School",
  "graduationYear": 2010,
  "yearsOfExperience": 15,
  "boardCertifications": [
    "American Board of Internal Medicine",
    "American Board of Cardiovascular Disease"
  ],
  "languagesSpoken": ["English", "Spanish"],
  "bio": "Board-certified cardiologist with 15 years of experience.",
  "consultationFee": 150.00
}
```

### Admin Registration
```http
POST /api/auth/register/admin
Authorization: Bearer {super_admin_token}
Content-Type: application/json

{
  "email": "admin@telehealth.com",
  "password": "SecurePass123!",
  "firstName": "Admin",
  "lastName": "User",
  "phone": "555-000-0000",
  "adminLevel": "moderator",
  "permissions": ["manage_users", "view_reports"]
}
```

## User Workflow

### Patient Registration Flow
1. Patient submits registration form
2. System validates data
3. Password is hashed with bcrypt
4. User created with `verification_status: 'pending'`
5. Verification email sent
6. Patient verifies email
7. Status updated to `verification_status: 'verified'`
8. Patient can book appointments

### Doctor Registration Flow
1. Doctor submits registration form
2. System validates data
3. Password is hashed with bcrypt
4. User created with `verification_status: 'pending'`
5. Verification email sent
6. Doctor uploads credentials at `/doctor/verification`
7. Admin reviews and verifies credentials
8. Status updated to `verification_status: 'verified'`
9. Doctor can accept patients

### Admin Creation Flow
1. Super admin creates admin account
2. System validates requester is super admin
3. Admin account created with `verification_status: 'verified'`
4. Admin can login immediately

## Security Features

### Password Security
- Passwords hashed using bcrypt with salt rounds of 10
- Minimum password strength requirements enforced
- Password reset tokens expire after 1 hour

### Email Verification
- Unique verification token sent on registration
- Token stored in `email_verification_token`
- Cleared after successful verification

### Two-Factor Authentication
- Optional 2FA using TOTP
- Secret stored in `two_factor_secret`
- Enabled via `two_factor_enabled` flag

### Session Management
- JWT tokens for authentication
- Session tracking in `user_sessions` table
- IP address and device info logged

### HIPAA Compliance
- Consent flags: `consent_to_terms`, `consent_to_privacy`, `hipaa_consent`
- All consents logged with timestamp
- Activity logging for audit trail

## Data Privacy

### Protected Health Information (PHI)
Patient medical data is protected:
- `allergies`
- `chronic_conditions`
- `current_medications`
- `medical_history`
- `insurance_policy_number`

### Access Control
- Patients can only access their own data
- Doctors can only access assigned patients
- Admins have full access with activity logging

## Usage Examples

### Check User Role
```javascript
const user = await db.query('SELECT user_type FROM users WHERE id = ?', [userId]);
if (user[0].user_type === 'doctor') {
  // Grant doctor access
}
```

### Verify Doctor Status
```javascript
const doctor = await db.query(
  'SELECT verification_status FROM users WHERE id = ? AND user_type = "doctor"',
  [doctorId]
);
if (doctor[0].verification_status === 'verified') {
  // Allow dashboard access
}
```

### Update Patient Medical Info
```javascript
const allergies = JSON.stringify(['Penicillin', 'Shellfish']);
await db.query(
  'UPDATE users SET allergies = ? WHERE id = ?',
  [allergies, patientId]
);
```

## Installation

1. Create the database:
```bash
mysql -u root -p < backend/database/user_schema.sql
```

2. Install dependencies:
```bash
npm install bcrypt uuid
```

3. Configure environment:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=telehealth
JWT_SECRET=your_jwt_secret
```

## Migration from Existing System

If you have existing users, run:
```sql
-- Add new columns to existing table
ALTER TABLE users ADD COLUMN user_type ENUM('admin', 'patient', 'doctor');
ALTER TABLE users ADD COLUMN verification_status ENUM('pending', 'verified', 'rejected', 'suspended') DEFAULT 'pending';
-- ... add other columns as needed
```

## Support

For issues or questions, contact: dev@telehealth.com
