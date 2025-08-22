import { jest } from '@jest/globals'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.test') })

// Set NODE_ENV to test
process.env.NODE_ENV = 'test'

// Set test database path
process.env.DB_PATH = path.join(__dirname, '..', 'data', 'test-db.json')

// Mock console methods to reduce test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error // Keep error for debugging
}

// Global test setup
beforeAll(async () => {
  // Ensure test data directory exists
  const dataDir = path.dirname(process.env.DB_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
})

// Global test cleanup
afterAll(async () => {
  // Clean up test database
  if (fs.existsSync(process.env.DB_PATH)) {
    fs.unlinkSync(process.env.DB_PATH)
  }
})
