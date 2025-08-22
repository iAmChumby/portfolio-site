/**
 * Comprehensive error handling middleware for the portfolio backend API
 * Provides structured error responses, logging, and monitoring
 */

import { ApiError, createErrorFromUnknown, isOperationalError, getErrorSeverity, ERROR_SEVERITY } from '../utils/errors.js'
import fs from 'fs/promises'
import path from 'path'

/**
 * Logger utility for error handling
 */
class ErrorLogger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs')
    this.ensureLogDirectory()
  }

  async ensureLogDirectory() {
    try {
      await fs.access(this.logDir)
    } catch {
      await fs.mkdir(this.logDir, { recursive: true })
    }
  }

  async logError(error, req, severity = ERROR_SEVERITY.MEDIUM) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      severity,
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack
      },
      request: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection?.remoteAddress,
        userAgent: req.get('User-Agent'),
        headers: this.sanitizeHeaders(req.headers),
        body: this.sanitizeBody(req.body)
      },
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      pid: process.pid
    }

    // Console logging with colors
    this.logToConsole(logEntry)

    // File logging (only in production or when explicitly enabled)
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_FILE_LOGGING === 'true') {
      await this.logToFile(logEntry)
    }
  }

  logToConsole(logEntry) {
    const colors = {
      [ERROR_SEVERITY.LOW]: '\x1b[36m',      // Cyan
      [ERROR_SEVERITY.MEDIUM]: '\x1b[33m',   // Yellow
      [ERROR_SEVERITY.HIGH]: '\x1b[31m',     // Red
      [ERROR_SEVERITY.CRITICAL]: '\x1b[35m'  // Magenta
    }
    
    const reset = '\x1b[0m'
    const color = colors[logEntry.severity] || colors[ERROR_SEVERITY.MEDIUM]
    
    console.error(
      `${color}[${logEntry.severity.toUpperCase()}] ${logEntry.timestamp}${reset}`,
      `\n${color}Error:${reset} ${logEntry.error.name}: ${logEntry.error.message}`,
      `\n${color}Request:${reset} ${logEntry.request.method} ${logEntry.request.url}`,
      `\n${color}IP:${reset} ${logEntry.request.ip}`,
      logEntry.error.stack ? `\n${color}Stack:${reset}\n${logEntry.error.stack}` : ''
    )
  }

  async logToFile(logEntry) {
    try {
      const date = new Date().toISOString().split('T')[0]
      const logFile = path.join(this.logDir, `error-${date}.log`)
      const logLine = JSON.stringify(logEntry) + '\n'
      
      await fs.appendFile(logFile, logLine)
    } catch (fileError) {
      console.error('Failed to write error log to file:', fileError)
    }
  }

  sanitizeHeaders(headers) {
    const sanitized = { ...headers }
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token']
    
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]'
      }
    })
    
    return sanitized
  }

  sanitizeBody(body) {
    if (!body || typeof body !== 'object') {
      return body
    }

    const sanitized = { ...body }
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth']
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    })
    
    return sanitized
  }
}

const errorLogger = new ErrorLogger()

/**
 * Main error handler middleware
 */
export function errorHandler(err, req, res, next) {
  // Log the error
  errorLogger.logError(err, req)
  
  // Convert non-ApiError instances to ApiError
  let apiError
  if (err instanceof ApiError) {
    apiError = err
  } else {
    // For generic errors, convert to internal server error
    apiError = new ApiError('Internal server error', 500, 'INTERNAL_ERROR')
    // Preserve original error for logging in development
    if (process.env.NODE_ENV !== 'production') {
      apiError.originalError = err
    }
  }
  
  // Build error response
    const errorResponse = {
      success: false,
      error: {
        message: apiError.message,
        code: apiError.code,
        ...(apiError.field && { field: apiError.field }),
        ...(apiError.details?.resource && { resource: apiError.details.resource }),
        ...(apiError.details?.operation && { operation: apiError.details.operation }),
        ...(apiError.details?.endpoint && { endpoint: apiError.details.endpoint }),
        ...(apiError.details?.githubStatusCode && { githubStatusCode: apiError.details.githubStatusCode }),
        ...(process.env.NODE_ENV !== 'production' && {
          stack: apiError.stack,
          ...(apiError.originalError && { originalError: apiError.originalError.message })
        })
      },
      requestId: req.id,
      timestamp: new Date().toISOString()
    }
  
  // Set appropriate headers including security headers
  res.set({
    'Content-Type': 'application/json',
    'X-Error-Code': apiError.code,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-Error-ID': req.id
  })
  
  // Send error response
  res.status(apiError.statusCode).json(errorResponse)
}

/**
 * Async error wrapper for route handlers
 * Catches async errors and passes them to error handler
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Request ID middleware - adds unique ID to each request for tracking
 */
export function requestId(req, res, next) {
  // Use existing request ID from header if present, otherwise generate new one
  req.id = req.headers['x-request-id'] || req.headers['X-Request-ID'] || generateRequestId()
  res.set('X-Request-ID', req.id)
  next()
}

/**
 * Generate unique request ID
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req, res, next) {
  const error = new ApiError(
    `Route not found: ${req.method} ${req.path}`,
    404,
    'NOT_FOUND'
  )
  next(error)
}

/**
 * Graceful shutdown handler
 */
export function setupGracefulShutdown(server) {
  const shutdown = (signal) => {
    console.log(`\n🛑 ${signal} received, shutting down gracefully...`)
    
    server.close((err) => {
      if (err) {
        console.error('❌ Error during server shutdown:', err)
        process.exit(1)
      }
      
      console.log('✅ Server closed successfully')
      process.exit(0)
    })
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('❌ Forced shutdown after timeout')
      process.exit(1)
    }, 10000)
  }
  
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error)
    
    if (isOperationalError(error)) {
      console.log('🔄 Operational error, continuing...')
    } else {
      console.log('💥 Programming error, shutting down...')
      process.exit(1)
    }
  })
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
    
    if (isOperationalError(reason)) {
      console.log('🔄 Operational error, continuing...')
    } else {
      console.log('💥 Programming error, shutting down...')
      process.exit(1)
    }
  })
}

/**
 * Health check endpoint with error handling
 */
export function healthCheck(req, res) {
  try {
    res.json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    })
  } catch (error) {
    throw new ApiError('Health check failed', 503, 'HEALTH_CHECK_ERROR')
  }
}

export { errorLogger }