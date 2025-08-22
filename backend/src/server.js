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

// Import services
import database from './config/database.js'
import dataSyncJob from './jobs/dataSync.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

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

// Routes
app.use('/api', apiRoutes)
app.use('/api', webhookRoutes)
app.use('/api/admin', adminRoutes)

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
      admin: '/api/admin/*'
    }
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/user',
      'GET /api/repositories',
      'GET /api/repositories/featured',
      'GET /api/languages',
      'GET /api/activity',
      'GET /api/workflows',
      'GET /api/stats',
      'GET /api/all',
      'POST /api/github/webhook',
      'POST /api/admin/verify',
      'GET /api/admin/all',
      'POST /api/admin/refresh',
      'GET /api/admin/system',
      'GET /api/admin/logs'
    ]
  })
})

// Global error handler
app.use((error, req, res, _next) => {
  console.error('❌ Unhandled error:', error)
  
  res.status(error.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  })
})

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...')
  process.exit(0)
})

// Start server
async function startServer () {
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
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log('🚀 Portfolio Backend Server Started')
      console.log(`📡 Server running on port ${PORT}`)
      console.log(`🌐 API available at http://localhost:${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
      console.log('✅ Server ready to accept connections')
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

export default app
