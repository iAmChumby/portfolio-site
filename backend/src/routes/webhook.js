import express from 'express'
import crypto from 'crypto'
import dataSyncJob from '../jobs/dataSync.js'

const router = express.Router()

// Middleware to verify GitHub webhook signature
const verifyGitHubSignature = (req, res, next) => {
  const signature = req.get('X-Hub-Signature-256')
  const payload = JSON.stringify(req.body)
  const secret = process.env.WEBHOOK_SECRET

  if (!secret) {
    console.warn('⚠️  WEBHOOK_SECRET not configured - skipping signature verification')
    return next()
  }

  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' })
  }

  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')}`

  try {
    // Ensure both signatures are the same length before comparing
    if (signature.length !== expectedSignature.length) {
      return res.status(401).json({ error: 'Invalid signature' })
    }
    
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return res.status(401).json({ error: 'Invalid signature' })
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  next()
}

// GitHub webhook endpoint
router.post('/github/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  // Convert raw body to JSON for signature verification
  try {
    req.body = JSON.parse(req.body)
    next()
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON payload' })
  }
}, verifyGitHubSignature, async (req, res) => {
  try {
    const event = req.get('X-GitHub-Event')
    const payload = req.body

    console.log(`📥 Received GitHub webhook: ${event}`)

    // Handle different webhook events
    switch (event) {
      case 'push':
        await handlePushEvent(payload)
        break
      case 'repository':
        await handleRepositoryEvent(payload)
        break
      case 'star':
        await handleStarEvent(payload)
        break
      case 'fork':
        await handleForkEvent(payload)
        break
      case 'release':
        await handleReleaseEvent(payload)
        break
      case 'workflow_run':
        await handleWorkflowRunEvent(payload)
        break
      case 'ping':
        console.log('🏓 Webhook ping received')
        break
      default:
        console.log(`ℹ️  Unhandled webhook event: ${event}`)
    }

    res.status(200).json({ 
      message: 'Webhook processed successfully',
      event,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message
    })
  }
})

// Event handlers
async function handlePushEvent (payload) {
  console.log(`📝 Push to ${payload.repository.name}/${payload.ref}`)
  
  // Trigger data refresh for repository updates
  await dataSyncJob.syncRepositories()
  await dataSyncJob.syncActivity()
}

async function handleRepositoryEvent (payload) {
  const action = payload.action
  console.log(`🏗️  Repository ${action}: ${payload.repository.name}`)
  
  // Refresh repository data for create, delete, or update actions
  if (['created', 'deleted', 'edited', 'publicized', 'privatized'].includes(action)) {
    await dataSyncJob.syncRepositories()
  }
}

async function handleStarEvent (payload) {
  const action = payload.action
  const repo = payload.repository.name
  console.log(`⭐ Repository ${repo} ${action === 'created' ? 'starred' : 'unstarred'}`)
  
  // Update repository stats
  await dataSyncJob.syncRepositories()
  await dataSyncJob.syncActivity()
}

async function handleForkEvent (payload) {
  const repo = payload.repository.name
  console.log(`🍴 Repository ${repo} forked`)
  
  // Update repository stats
  await dataSyncJob.syncRepositories()
  await dataSyncJob.syncActivity()
}

async function handleReleaseEvent (payload) {
  const action = payload.action
  const repo = payload.repository.name
  const release = payload.release.tag_name
  console.log(`🚀 Release ${release} ${action} for ${repo}`)
  
  // Refresh activity data to include release information
  await dataSyncJob.syncRepositories()
  await dataSyncJob.syncActivity()
}

async function handleWorkflowRunEvent (payload) {
  const status = payload.workflow_run.status
  const conclusion = payload.workflow_run.conclusion
  const repo = payload.repository.name
  console.log(`🔄 Workflow run ${status} (${conclusion}) for ${repo}`)
  
  // Refresh workflow data
  await dataSyncJob.syncWorkflows()
}

// Manual refresh endpoint removed for security - use /api/admin/refresh with authentication instead

export default router
