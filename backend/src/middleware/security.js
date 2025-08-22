import session from 'express-session'
import cookieParser from 'cookie-parser'

/**
 * Security middleware for enhanced HTTPS and session security
 */
export const securityMiddleware = () => {
  return [
    // Cookie parser middleware
    cookieParser(),
    
    // Session configuration with secure settings
    session({
      secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE === 'true',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.COOKIE_SAME_SITE || 'strict'
      },
      name: 'portfolio.sid' // Custom session name
    }),
    
    // Additional security headers middleware
    (req, res, next) => {
      // Prevent clickjacking
      res.setHeader('X-Frame-Options', 'DENY')
      
      // Prevent MIME type sniffing
      res.setHeader('X-Content-Type-Options', 'nosniff')
      
      // XSS protection
      res.setHeader('X-XSS-Protection', '1; mode=block')
      
      // Referrer policy
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
      
      // Feature policy
      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
      
      // Remove server information
      res.removeHeader('X-Powered-By')
      
      next()
    }
  ]
}

/**
 * HTTPS enforcement middleware
 */
export const httpsEnforcement = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && process.env.FORCE_HTTPS === 'true') {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(301, `https://${req.header('host')}${req.url}`)
    }
  }
  next()
}

/**
 * Security validation middleware
 */
export const validateSecurityHeaders = (req, res, next) => {
  // Log security-related headers for monitoring
  if (process.env.NODE_ENV !== 'test') {
    const securityHeaders = {
      'x-forwarded-proto': req.header('x-forwarded-proto'),
      'user-agent': req.header('user-agent'),
      'x-real-ip': req.header('x-real-ip'),
      'x-forwarded-for': req.header('x-forwarded-for')
    }
    
    // Log potential security issues
    if (req.header('x-forwarded-proto') === 'http' && process.env.NODE_ENV === 'production') {
      console.warn('HTTP request detected in production:', securityHeaders)
    }
  }
  
  next()
}