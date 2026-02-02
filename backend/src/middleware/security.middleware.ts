import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "http://localhost:8081", "ws://localhost:8081"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
});

// Input validation middleware
export const validateLoginInput = (req: any, res: any, next: any) => {
  const { email, password } = req.body;

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  // Password strength validation
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  // Check for common weak passwords
  const weakPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return res.status(400).json({ error: 'Password is too weak. Please choose a stronger password.' });
  }

  next();
};

// Brute force protection - track failed login attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const bruteForceProtection = (req: any, res: any, next: any) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const attempts = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 };

  // Reset counter if window has passed
  if (now - attempts.lastAttempt > windowMs) {
    attempts.count = 0;
  }

  if (attempts.count >= maxAttempts) {
    return res.status(429).json({
      error: 'Too many failed attempts. Account temporarily locked. Try again later.'
    });
  }

  // Store original send method
  const originalSend = res.send;
  res.send = function(data: any) {
    // If login failed (401), increment counter
    if (res.statusCode === 401) {
      attempts.count++;
      attempts.lastAttempt = now;
      failedAttempts.set(ip, attempts);
    } else if (res.statusCode === 200) {
      // Successful login, reset counter
      failedAttempts.delete(ip);
    }

    originalSend.call(this, data);
  };

  next();
};