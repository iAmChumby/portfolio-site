import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Import routes
import apiRoutes from './routes/api.js'
import webhookRoutes from './routes/webhook.js'
import adminRoutes from './routes/admin.js'
import analyticsRoutes from './routes/analytics.js'

// Import services
import database from './config/database.js'
import dataSyncJob from './jobs/dataSync.js'
import { analyticsMiddleware } from './middleware/analytics.js'
import { securityMiddleware, httpsEnforcement, validateSecurityHeaders } from './middleware/security.js'
import { errorHandler, requestId, notFoundHandler, setupGracefulShutdown, healthCheck } from './middleware/errorHandler.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Security middleware with enhanced HTTPS security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
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
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for GitHub integration
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}))

// HTTPS enforcement and security validation
app.use(httpsEnforcement)
app.use(validateSecurityHeaders)

// Enhanced security middleware
app.use(securityMiddleware())

// Compression middleware
app.use(compression())

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api', limiter)

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'))
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request ID middleware (for error tracking)
app.use(requestId)

// Analytics middleware (track all requests)
app.use(analyticsMiddleware())

// Health check endpoint (before other routes)
app.get('/api/health', healthCheck)

// Routes
app.use('/api', apiRoutes)
app.use('/api', webhookRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/analytics', analyticsRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      user: '/api/user',
      repositories: '/api/repositories',
      featured: '/api/repositories/featured',
      languages: '/api/languages',
      activity: '/api/activity',
      workflows: '/api/workflows',
      stats: '/api/stats',
      all: '/api/all',
      webhook: '/api/github/webhook',
      admin: '/api/admin/*',
      analytics: '/api/analytics/*'
    }
  })
})

// 404 handler for unmatched routes
app.use('*', notFoundHandler)

// Global error handler (must be last)
app.use(errorHandler)

// Start server and setup graceful shutdown
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 API URL: http://localhost:${PORT}`)
  
  // Initialize and start data sync job
  await dataSyncJob.initialize()
  dataSyncJob.startScheduledSync()
  await dataSyncJob.performInitialSync()
  console.log('📡 Data sync job started')
})

// Setup graceful shutdown handling
setupGracefulShutdown(server)

// Initialize and start services
async function initializeServices() {
  try {
    // Initialize database
    console.log('🔧 Initializing database...')
    await database.initialize()
    
    // Initialize and start data sync job
    console.log('🔧 Initializing data sync job...')
    await dataSyncJob.initialize()
    
    // Perform initial data sync
    await dataSyncJob.performInitialSync()
    
    // Start scheduled sync jobs
    dataSyncJob.startScheduledSync()
    
    console.log('✅ All services initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize services:', error)
    process.exit(1)
  }
}

// Initialize services
initializeServices()

export default app
