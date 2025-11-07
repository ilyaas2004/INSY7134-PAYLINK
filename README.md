# 💳 Paylink - Secure International Payment Portal

PayLink is a secure web-based international payment portal that enables customers to make SWIFT payments through a bank's internal system. The application implements comprehensive security measures including SSL/TLS encryption, JWT authentication, input validation, and protection against common web vulnerabilities.



![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

------------------------------------------

## YouTube Link:
[![Watch the video](https://img.youtube.com/vi/5L26TxlCIS4/maxresdefault.jpg)](https://youtu.be/5L26TxlCIS4)

Youtube link:
https://youtu.be/5L26TxlCIS4

## Developement Team 👨‍💻

| Name | Student Number |
| ---- | -------------- |
| Ilyaas Kamish | ST10391174 |
| Daniel Wulfse | ST10285153 |
| Nomvuselelo Mlambo | ST10264503 |
| Caleb Searle | ST10254714 |

## 🛠️ Technology Stack

### Frontend
- **React** 18.2.0 - UI framework
- **React Router DOM** 6.x - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** 3.4.1 - Styling
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.21.2 - Web framework
- **MongoDB** - Database
- **Mongoose** 8.18.3 - ODM

### Security Packages
- **bcryptjs** 3.0.2 - Password hashing
- **jsonwebtoken** 9.0.2 - JWT authentication
- **helmet** 8.1.0 - Security headers
- **express-rate-limit** 8.1.0 - Rate limiting
- **express-validator** 7.2.1 - Input validation
- **cors** 2.8.5 - CORS handling

## 🔒 Security Features Implemented

### 1. Password Security
- **Bcrypt Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
- **Password Validation**: Enforces strong passwords (minimum 8 characters, uppercase, lowercase, numbers, special characters)
- **No Plain-Text Storage**: Passwords are never stored in readable format

### 2. SSL/TLS Implementation
- **HTTPS Only**: All traffic served over encrypted HTTPS connections
- **TLS 1.2+**: Modern TLS protocols with strong cipher suites
- **HSTS Enabled**: HTTP Strict Transport Security enforces secure connections
- **Certificate Validation**: SSL certificates configured and validated

### 3. Input Validation & Whitelisting
- **RegEx Patterns**: All inputs validated using regular expressions
- **Whitelist Approach**: Only expected characters allowed
- **Frontend & Backend Validation**: Double validation layer
- **Sanitization**: All user inputs sanitized before processing

### 4. Attack Protection

#### Session Hijacking Prevention
- JWT tokens with 1-hour expiry
- Secure token storage
- Token validation on every request
- Automatic logout on token expiration

#### Clickjacking Prevention
- X-Frame-Options: DENY header
- Content Security Policy (CSP) configured
- Frame-ancestors directive set

#### SQL Injection Prevention
- MongoDB (NoSQL database)
- Parameterized queries via Mongoose
- Input validation and sanitization
- Schema-based validation

#### Cross-Site Scripting (XSS) Prevention
- Input sanitization on all user inputs
- Output encoding via React
- Content Security Policy headers
- X-XSS-Protection header enabled

#### Man-in-the-Middle (MITM) Prevention
- End-to-end TLS encryption
- HSTS enforced
- Strong cipher suites
- Certificate pinning ready

#### DDoS Protection
- Rate limiting (100 requests per 15 minutes)
- Authentication rate limiting (5 attempts per 15 minutes)
- Express-brute for brute force protection
- Request throttling

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenSSL (for certificate generation)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd paylink-project
```

### Step 2: Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Generate SSL Certificates (Development)
```bash
# Create ssl directory
mkdir -p backend/config/ssl
cd backend/config/ssl

# Generate self-signed certificate
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 \
  -keyout key.pem -out cert.pem \
  -subj "/C=ZA/ST=Western Cape/L=Cape Town/O=PayLink/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \
  -addext "keyUsage=digitalSignature,keyEncipherment" \
  -addext "extendedKeyUsage=serverAuth"

cd ../../..
```

#### Install Certificate (Windows)
```bash
# Convert to .crt
openssl x509 -outform der -in backend/config/ssl/cert.pem -out backend/config/ssl/cert.crt

# Double-click cert.crt and install to:
# "Local Machine" -> "Trusted Root Certification Authorities"
```

#### Configure Environment Variables
Create `.env` in root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/paylink

# JWT Configuration
JWT_SECRET=your_64_character_secret_key_here
JWT_EXPIRE=1h

# SSL Certificates
SSL_KEY_PATH=backend/config/ssl/key.pem
SSL_CERT_PATH=backend/config/ssl/cert.pem

# CORS
CLIENT_URL=https://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create `frontend/.env`:
```env
REACT_APP_API_URL=https://localhost:5000/api
HTTPS=true
SSL_CRT_FILE=../backend/config/ssl/cert.pem
SSL_KEY_FILE=../backend/config/ssl/key.pem
```

#### Copy SSL Certificates (if needed)
```bash
mkdir ssl
copy ../backend/config/ssl/cert.pem ssl/
copy ../backend/config/ssl/key.pem ssl/
```

---

## 🚀 Running the Application

### Terminal 1 - Backend
```bash
# From project root
npm run dev
```
Server starts at: `https://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
Application opens at: `https://localhost:3000`

**Note**: Browser will show security warning for self-signed certificate. Click "Advanced" → "Proceed to localhost" to accept.

## 🧪 Testing the Application

### 1. Registration Test
- Navigate to `https://localhost:3000`
- Click "Create Account"
- Fill in the form:
  - Full Name: `John Doe`
  - ID Number: `9001015009087` (13 digits)
  - Account Number: `1234567890` (10-16 digits)
  - Username: `johndoe` (alphanumeric + underscore)
  - Password: `Test@1234` (8+ chars, uppercase, lowercase, number, special char)
- Submit and verify redirect to dashboard

### 2. Login Test
- Logout from dashboard
- Navigate to login page
- Enter credentials
- Verify JWT token storage (DevTools → Application → Local Storage)
- Verify redirect to dashboard

### 3. Payment Creation Test
- On dashboard, fill payment form:
  - Amount: `1000.00`
  - Currency: `USD`
  - Payee Account: `9876543210`
  - SWIFT Code: `ABNANL2A` (format: 6 letters + 2 alphanumeric)
- Submit payment
- Verify success message
- Check payment appears in "Recent Payments"
- Verify in MongoDB that payment status is "pending"

### 4. Security Tests

#### Input Validation
- Try invalid ID number (not 13 digits)
- Try invalid SWIFT code (wrong format)
- Try weak password (less than 8 characters)
- Verify error messages display

#### Protected Routes
- Logout
- Try to access `https://localhost:3000/dashboard` directly
- Verify redirect to login page

#### Rate Limiting
- Make 6+ failed login attempts quickly
- Verify rate limit error message

#### HTTPS Verification
- Check browser address bar for padlock icon
- Open DevTools → Network
- Verify all requests use HTTPS protocol
- Check response headers for security headers (Helmet)

## Github
### 📁 Repo Structure
```
paylink-project/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── ssl/                     # SSL certificates
│   │       ├── cert.pem
│   │       └── key.pem
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   └── paymentController.js     # Payment logic
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── validation.js            # Input validation
│   │   └── security.js              # Security middleware
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Payment.js               # Payment schema
│   └── routes/
│       ├── auth.js                  # Auth routes
│       └── payment.js               # Payment routes
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js    # Route protection
│   │   ├── pages/
│   │   │   ├── LandingPage.js       # Landing page
│   │   │   ├── RegisterPage.js      # Registration
│   │   │   ├── LoginPage.js         # Login
│   │   │   └── Dashboard.js         # Dashboard & payments
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # Entry point
│   └── .env                         # Frontend environment variables
├── .env                             # Backend environment variables
├── server.js                        # Main server file
├── package.json                     # Backend dependencies
└── README.md                        # This file
```

### Version Control Practices 
- Commit Messages: context-important commit messages with releavant information
- Branching Rule: branches are made then merged into main instead of developing in main
- Pull Requests: Rule that all merges from branches to main require atleast one reviewer

## 🔐 Security Validation Patterns

### Input Validation RegEx

```javascript
// Full Name: Letters and spaces only
/^[a-zA-Z\s]+$/

// ID Number: Exactly 13 digits
/^[0-9]{13}$/

// Account Number: 10-16 digits
/^[0-9]{10,16}$/

// Username: Alphanumeric and underscore
/^[a-zA-Z0-9_]+$/

// Password: Strong password requirements
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

// SWIFT Code: 8 or 11 characters
/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/

// Payee Account: 8-34 alphanumeric characters
/^[0-9A-Z]{8,34}$/
```

## 🐛 Troubleshooting

### Issue: "Certificate not trusted" error
**Solution**: Install the self-signed certificate in Windows Trusted Root Certification Authorities (see installation instructions above).

### Issue: CORS error
**Solution**: Ensure `CLIENT_URL` in backend `.env` matches frontend URL (including https://).

### Issue: MongoDB connection failed
**Solution**: Check `MONGODB_URI` in `.env` file. Verify MongoDB is running (local) or check Atlas credentials.

### Issue: JWT token invalid
**Solution**: Ensure `JWT_SECRET` in `.env` is at least 32 characters. Check token hasn't expired (default 1 hour).

### Issue: Rate limiting blocking legitimate requests
**Solution**: For testing, temporarily increase limits in `backend/middleware/security.js` or clear localStorage and wait 15 minutes.

### Issue: Validation errors on registration
**Solution**: Ensure all fields match the required formats (see validation patterns above).

---

## 📊 API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "fullName": "John Doe",
  "idNumber": "9001015009087",
  "accountNumber": "1234567890",
  "username": "johndoe",
  "password": "Test@1234"
}
```

#### POST /api/auth/login
Authenticate user
```json
{
  "username": "johndoe",
  "accountNumber": "1234567890",
  "password": "Test@1234"
}
```

#### GET /api/auth/me
Get current user (requires JWT token)

### Payment Endpoints

#### POST /api/payments
Create new payment (requires JWT token)
```json
{
  "amount": 1000.00,
  "currency": "USD",
  "provider": "SWIFT",
  "payeeAccount": "9876543210",
  "swiftCode": "ABNANL2A"
}
```

#### GET /api/payments
Get user's payments (requires JWT token)

#### GET /api/payments/:id
Get specific payment (requires JWT token)

## ✅ POE Requirements Checklist

### Task 2 Requirements - All Met ✓

- [x] **Password Security**: Bcrypt hashing and salting implemented
- [x] **Input Whitelisting**: RegEx patterns on all inputs
- [x] **SSL/TLS**: All traffic served over HTTPS
- [x] **Session Hijacking Protection**: JWT tokens, secure storage, expiry
- [x] **Clickjacking Protection**: X-Frame-Options, CSP headers
- [x] **SQL Injection Protection**: MongoDB with validation, parameterized queries
- [x] **XSS Protection**: Input sanitization, output encoding, CSP
- [x] **MITM Protection**: TLS encryption, HSTS, secure certificates
- [x] **DDoS Protection**: Rate limiting, brute force protection, throttling
- [x] **Video Demonstration**: OBS recording showing all features

---

##(Part 3 implemented :

- Employee portal with pre-registered users
- Payment verification workflow
- Submit to SWIFT functionality
- DevSecOps pipeline with SonarQube
- CircleCI integration
- Additional security scanning tools

---

## 📚 References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/
- JWT Best Practices: https://tools.ietf.org/html/rfc7519
- Helmet.js Documentation: https://helmetjs.github.io/
- bcrypt Documentation: https://www.npmjs.com/package/bcryptjs
- Express Rate Limit: https://www.npmjs.com/package/express-rate-limit

---

## 📝 Notes

- This is an academic project for educational purposes
- Self-signed certificates are used for development only
- For production deployment, use proper SSL certificates (Let's Encrypt, etc.)
- MongoDB Atlas is recommended for production database hosting
- Environment variables should never be committed to version control

---

## 🆘 Support

For issues or questions:
- Contact team members via university email
- Refer to POE documentation
- Check OWASP guidelines for security best practices

---

**Last Updated**: October 2025
**Version**: 1.0.0 - Part 2 Submission

