import { jest } from '@jest/globals'

// Mock the database module
const mockDatabase = {
  getRepositories: jest.fn(),
  setWorkflows: jest.fn()
}

// Use unstable_mockModule for ES modules
jest.unstable_mockModule('../src/config/database.js', () => ({
  default: mockDatabase
}))

// Import after mocking
const { default: database } = await import('../src/config/database.js')

describe('Database Mock Test', () => {
  test('should use mocked database', async () => {
    // Use stderr to ensure output is visible
    process.stderr.write('database: ' + JSON.stringify(database) + '\n')
    process.stderr.write('database.getRepositories: ' + typeof database.getRepositories + '\n')
    process.stderr.write('mockDatabase.getRepositories: ' + typeof mockDatabase.getRepositories + '\n')
    process.stderr.write('Are they the same? ' + (database.getRepositories === mockDatabase.getRepositories) + '\n')
    
    mockDatabase.getRepositories.mockResolvedValue([{ name: 'test' }])
    
    const result = await database.getRepositories()
    process.stderr.write('Result: ' + JSON.stringify(result) + '\n')
    process.stderr.write('Mock call count: ' + mockDatabase.getRepositories.mock.calls.length + '\n')
    
    expect(mockDatabase.getRepositories).toHaveBeenCalled()
    expect(result).toEqual([{ name: 'test' }])
  })
})
