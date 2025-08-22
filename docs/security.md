# Security Implementation

This document outlines the comprehensive security measures implemented in the portfolio application to ensure secure HTTPS communication and protect against common web vulnerabilities.

## Overview

The application implements multiple layers of security including:
- HTTPS enforcement
- Security headers
- Session security
- CORS protection
- Rate limiting
- Content Security Policy (CSP)

## Backend Security Features

### 1. HTTPS Enforcement

**Location**: `src/middleware/security.js`

- Automatically redirects HTTP requests to HTTPS in production
- Uses 301 permanent redirects for SEO benefits
- Configurable via `FORCE_HTTPS` environment variable

```javascript
// Automatic HTTPS redirect in production
if (process.env.NODE_ENV === 'production' && process.env.FORCE_HTTPS === 'true') {
  if (req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.header('host')}${req.url}`)
  }
}
```

### 2. Security Headers

**Location**: `src/server.js` (Helmet configuration)

Implemented security headers:
- **HSTS**: Forces HTTPS for 1 year with subdomain inclusion
- **CSP**: Restricts resource loading to prevent XSS attacks
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables browser XSS filtering
- **Referrer-Policy**: Controls referrer information leakage

```javascript
app.use(helmet({
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      // ... more directives
    }
  }
}))
```

### 3. Session Security

**Location**: `src/middleware/security.js`

Secure session configuration:
- HTTP-only cookies to prevent XSS
- Secure flag for HTTPS-only transmission
- SameSite protection against CSRF
- Custom session name for security through obscurity

```javascript
session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  }
})
```

### 4. Rate Limiting

**Location**: `src/server.js`

- Limits requests per IP address
- Configurable window and request limits
- Applied to all API routes
- Returns structured error responses

## Frontend Security Features

### 1. Next.js Security Headers

**Location**: `next.config.js`

Implemented headers:
- **X-Frame-Options**: Prevents embedding in frames
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

### 2. HTTPS Redirects

**Location**: `next.config.js`

- Automatic HTTP to HTTPS redirects in production
- Permanent redirects (301) for SEO benefits
- Header-based detection for proxy environments

## Environment Configuration

### Backend Environment Variables

```bash
# SSL/TLS Configuration
SSL_CERT_PATH=/path/to/ssl/certificate.crt
SSL_KEY_PATH=/path/to/ssl/private.key
SSL_CA_PATH=/path/to/ssl/ca-bundle.crt
FORCE_HTTPS=true

# Security Configuration
SESSION_SECRET=your-super-secret-session-key
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
```

### Frontend Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.lukeedwards.me/api
NEXTAUTH_URL=https://lukeedwards.me
```

## Security Testing

### Test Coverage

**Location**: `src/tests/middleware/security.test.js`

Comprehensive tests covering:
- HTTPS enforcement in different environments
- Security header validation
- Session configuration
- Cookie security settings
- Integration testing

### Running Security Tests

```bash
# Run security-specific tests
npm test -- --testPathPattern=security.test.js

# Run all tests
npm test
```

## Production Deployment Checklist

### SSL Certificate Setup

1. **Obtain SSL Certificate**
   - Use Let's Encrypt for free certificates
   - Or purchase from a trusted CA

2. **Configure Certificate Paths**
   ```bash
   SSL_CERT_PATH=/etc/ssl/certs/lukeedwards.me.crt
   SSL_KEY_PATH=/etc/ssl/private/lukeedwards.me.key
   SSL_CA_PATH=/etc/ssl/certs/ca-bundle.crt
   ```

3. **Set Production Environment**
   ```bash
   NODE_ENV=production
   FORCE_HTTPS=true
   COOKIE_SECURE=true
   ```

### Security Validation

1. **SSL Labs Test**
   - Test at: https://www.ssllabs.com/ssltest/
   - Target grade: A or A+

2. **Security Headers Check**
   - Test at: https://securityheaders.com/
   - Verify all headers are properly set

3. **HSTS Preload**
   - Submit to: https://hstspreload.org/
   - Ensure HSTS is working correctly

## Security Monitoring

### Logging

- Security-related events are logged
- HTTP requests in production are flagged
- Failed authentication attempts are tracked

### Alerts

- Monitor for HTTP requests in production
- Track unusual request patterns
- Alert on security header failures

## Best Practices

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Update SSL certificates before expiry

2. **Environment Separation**
   - Different secrets for each environment
   - Strict production configurations
   - Regular security audits

3. **Monitoring**
   - Continuous security monitoring
   - Regular penetration testing
   - Log analysis and alerting

## Troubleshooting

### Common Issues

1. **Mixed Content Warnings**
   - Ensure all resources use HTTPS
   - Check CSP directives
   - Verify API endpoints

2. **CORS Errors**
   - Verify FRONTEND_URL configuration
   - Check credentials setting
   - Validate origin headers

3. **Session Issues**
   - Verify SESSION_SECRET is set
   - Check cookie security settings
   - Validate domain configuration

### Debug Commands

```bash
# Check SSL certificate
openssl x509 -in certificate.crt -text -noout

# Test HTTPS connection
curl -I https://api.lukeedwards.me/api/health

# Verify security headers
curl -I https://lukeedwards.me
```

## Security Compliance

This implementation follows:
- OWASP Top 10 security guidelines
- Mozilla Security Guidelines
- NIST Cybersecurity Framework
- Industry best practices for web application security