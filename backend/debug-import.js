// Debug script to test ES module imports
try {
  console.log('Testing import...')
  const analytics = await import('./src/middleware/analytics.js')
  console.log('Import successful!')
  console.log('Available exports:', Object.keys(analytics))
  console.log('analyticsMiddleware type:', typeof analytics.analyticsMiddleware)
  console.log('getAnalyticsSummary type:', typeof analytics.getAnalyticsSummary)
  console.log('generateVisitorId type:', typeof analytics.generateVisitorId)
  console.log('shouldExcludePath type:', typeof analytics.shouldExcludePath)
} catch (error) {
  console.error('Import failed:', error.message)
  console.error('Stack:', error.stack)
}