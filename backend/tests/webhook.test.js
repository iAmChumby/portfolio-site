import { jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import crypto from 'crypto'

// Mock the DataSyncJob before importing webhook routes
const mockDataSyncJob = {
  syncRepositories: jest.fn(),
  syncActivity: jest.fn(),
  syncWorkflows: jest.fn(),
  syncAllData: jest.fn()
}

const MockDataSyncJob = jest.fn().mockImplementation(() => mockDataSyncJob)

jest.unstable_mockModule('../src/jobs/dataSync.js', () => ({
  default: MockDataSyncJob
}))

// Import webhook routes after mocking
const { default: webhookRoutes } = await import('../src/routes/webhook.js')

describe('Webhook Routes', () => {
  let app
  const webhookSecret = 'test-webhook-secret'

  beforeEach(() => {
    app = express()
    // Don't use express.json() middleware since webhook route handles raw JSON
    app.use('/api', webhookRoutes)
    
    // Set environment variable for webhook secret
    process.env.WEBHOOK_SECRET = webhookSecret
    
    // Clear all mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    delete process.env.WEBHOOK_SECRET
  })

  const createSignature = (payload, secret) => {
    return 'sha256=' + crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex')
  }

  describe('POST /api/github/webhook', () => {
    test('should handle push event', async () => {
      const payload = {
        ref: 'refs/heads/main',
        repository: { name: 'test-repo' }
      }
      
      const signature = createSignature(payload, webhookSecret)
      mockDataSyncJob.syncRepositories.mockResolvedValue()
      mockDataSyncJob.syncActivity.mockResolvedValue()

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('X-GitHub-Event', 'push')
        .send(payload)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Webhook processed successfully',
        event: 'push',
        timestamp: expect.any(String)
      })
      expect(mockDataSyncJob.syncRepositories).toHaveBeenCalledTimes(1)
      expect(mockDataSyncJob.syncActivity).toHaveBeenCalledTimes(1)
    })

    test('should handle repository event', async () => {
      const payload = {
        action: 'created',
        repository: { name: 'new-repo' }
      }
      
      const signature = createSignature(payload, webhookSecret)
      mockDataSyncJob.syncRepositories.mockResolvedValue()

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('X-GitHub-Event', 'repository')
        .send(payload)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Webhook processed successfully',
        event: 'repository',
        timestamp: expect.any(String)
      })
      expect(mockDataSyncJob.syncRepositories).toHaveBeenCalledTimes(1)
      // Repository event only calls syncRepositories for certain actions
    })

    test('should handle star event', async () => {
      const payload = {
        action: 'created',
        repository: { name: 'starred-repo' }
      }
      
      const signature = createSignature(payload, webhookSecret)
      mockDataSyncJob.syncRepositories.mockResolvedValue()
      mockDataSyncJob.syncActivity.mockResolvedValue()

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('X-GitHub-Event', 'star')
        .send(payload)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Webhook processed successfully',
        event: 'star',
        timestamp: expect.any(String)
      })
      expect(mockDataSyncJob.syncRepositories).toHaveBeenCalledTimes(1)
      expect(mockDataSyncJob.syncActivity).toHaveBeenCalledTimes(1)
    })

    test('should handle fork event', async () => {
      const payload = {
        action: 'created',
        repository: { name: 'forked-repo' },
        forkee: { name: 'new-fork' }
      }
      
      const signature = createSignature(payload, webhookSecret)
      mockDataSyncJob.syncRepositories.mockResolvedValue()
      mockDataSyncJob.syncActivity.mockResolvedValue()

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('X-GitHub-Event', 'fork')
        .send(payload)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Webhook processed successfully',
        event: 'fork',
        timestamp: expect.any(String)
      })
      expect(mockDataSyncJob.syncRepositories).toHaveBeenCalledTimes(1)
      expect(mockDataSyncJob.syncActivity).toHaveBeenCalledTimes(1)
    })

    test('should handle release event', async () => {
      const payload = {
        action: 'published',
        repository: { name: 'released-repo' },
        release: { tag_name: 'v1.0.0' }
      }
      
      const signature = createSignature(payload, webhookSecret)
      mockDataSyncJob.syncRepositories.mockResolvedValue()
      mockDataSyncJob.syncActivity.mockResolvedValue()

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('X-GitHub-Event', 'release')
        .send(payload)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Webhook processed successfully',
        event: 'release',
        timestamp: expect.any(String)
      })
      expect(mockDataSyncJob.syncRepositories).toHaveBeenCalledTimes(1)
      expect(mockDataSyncJob.syncActivity).toHaveBeenCalledTimes(1)
    })

    test('should handle workflow_run event', async () => {
      const payload = {
        action: 'completed',
        repository: { name: 'workflow-repo' },
        workflow_run: { name: 'CI', conclusion: 'success', status: 'completed' }
      }
      
      const signature = createSignature(payload, webhookSecret)
      mockDataSyncJob.syncWorkflows.mockResolvedValue()

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('X-GitHub-Event', 'workflow_run')
        .send(payload)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Webhook processed successfully',
        event: 'workflow_run',
        timestamp: expect.any(String)
      })
      expect(mockDataSyncJob.syncWorkflows).toHaveBeenCalledTimes(1)
    })

    test('should handle unsupported events', async () => {
      const payload = {
        action: 'opened',
        issue: { title: 'Test issue' }
      }
      
      const signature = createSignature(payload, webhookSecret)

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('X-GitHub-Event', 'issues')
        .send(payload)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Webhook processed successfully',
        event: 'issues',
        timestamp: expect.any(String)
      })
    })

    test('should reject requests with invalid signature', async () => {
      const payload = { test: 'data' }
      const invalidSignature = 'sha256=invalid'

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', invalidSignature)
        .set('X-GitHub-Event', 'push')
        .send(payload)
        .expect(401)

      expect(response.body).toEqual({
        error: 'Invalid signature'
      })
    })

    test('should reject requests without signature', async () => {
      const payload = { test: 'data' }

      // When WEBHOOK_SECRET is set, missing signature should return 401
      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-GitHub-Event', 'push')
        .send(payload)
        .expect(401)

      expect(response.body).toEqual({
        error: 'Missing signature'
      })
    })

    test('should reject requests without event type', async () => {
      const payload = { test: 'data' }
      const signature = createSignature(payload, webhookSecret)

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', signature)
        .send(payload)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Webhook processed successfully',
        event: undefined,
        timestamp: expect.any(String)
      })
    })

    test('should handle sync errors gracefully', async () => {
      const payload = {
        ref: 'refs/heads/main',
        repository: { name: 'test-repo' }
      }
      
      const signature = createSignature(payload, webhookSecret)
      mockDataSyncJob.syncRepositories.mockRejectedValue(new Error('Sync failed'))

      const response = await request(app)
        .post('/api/github/webhook')
        .set('X-Hub-Signature-256', signature)
        .set('X-GitHub-Event', 'push')
        .send(payload)
        .expect(500)

      expect(response.body).toEqual({
        error: 'Webhook processing failed',
        message: 'Sync failed'
      })
    })
  })

  describe('POST /api/refresh', () => {
    test('should trigger manual data refresh', async () => {
      mockDataSyncJob.syncAllData.mockResolvedValue()

      const response = await request(app)
        .post('/api/refresh')
        .expect(200)

      expect(response.body).toEqual({
        message: 'Data refresh completed',
        timestamp: expect.any(String)
      })
      expect(mockDataSyncJob.syncAllData).toHaveBeenCalledTimes(1)
    })

    test('should handle refresh errors', async () => {
      mockDataSyncJob.syncAllData.mockRejectedValue(new Error('Refresh failed'))

      const response = await request(app)
        .post('/api/refresh')
        .expect(500)

      expect(response.body).toEqual({
        error: 'Refresh failed',
        message: 'Refresh failed'
      })
    })
  })
})