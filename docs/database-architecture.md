# Database Architecture - LowDB Implementation

## Overview

The portfolio site uses **LowDB** as its primary database solution - a lightweight, file-based JSON database perfect for small to medium-scale applications. LowDB provides a simple, synchronous API with automatic persistence to disk.

## Why LowDB?

- **Simplicity**: No database server setup required
- **Performance**: Fast read/write operations for small datasets
- **Portability**: Single JSON file storage
- **Zero Configuration**: Works out of the box
- **Perfect for GitHub Data**: Ideal for caching GitHub API responses
- **Development Friendly**: Easy to inspect and debug

## Database Configuration

### File Location
```javascript
// Default path: backend/data/portfolio.json
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/portfolio.json')
```

### Initialization
```javascript
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const adapter = new JSONFile(dbPath)
const db = new Low(adapter, defaultData)
```

## Database Schema

### Complete Data Structure
```json
{
  "user": {
    "login": "string",
    "id": "number",
    "name": "string",
    "email": "string",
    "bio": "string",
    "company": "string",
    "location": "string",
    "blog": "string",
    "twitter_username": "string",
    "public_repos": "number",
    "public_gists": "number",
    "followers": "number",
    "following": "number",
    "created_at": "ISO string",
    "updated_at": "ISO string",
    "avatar_url": "string"
  },
  "repositories": [
    {
      "id": "number",
      "name": "string",
      "full_name": "string",
      "description": "string",
      "private": "boolean",
      "fork": "boolean",
      "html_url": "string",
      "clone_url": "string",
      "stargazers_count": "number",
      "watchers_count": "number",
      "forks_count": "number",
      "language": "string",
      "topics": ["string"],
      "created_at": "ISO string",
      "updated_at": "ISO string",
      "pushed_at": "ISO string"
    }
  ],
  "languages": {
    "JavaScript": {
      "bytes": "number",
      "percentage": "string"
    },
    "Python": {
      "bytes": "number", 
      "percentage": "string"
    }
  },
  "activity": [
    {
      "id": "string",
      "type": "string",
      "repo": "string",
      "created_at": "ISO string",
      "payload": "object"
    }
  ],
  "workflows": [
    {
      "id": "number",
      "name": "string",
      "status": "string",
      "conclusion": "string",
      "created_at": "ISO string",
      "updated_at": "ISO string",
      "repo": "string"
    }
  ],
  "stats": {
    "totalStars": "number",
    "totalForks": "number", 
    "totalRepos": "number",
    "followers": "number",
    "following": "number"
  },
  "lastUpdated": "ISO string"
}
```

## Database Operations

### Core Database Class

The `Database` class provides a singleton pattern with the following methods:

#### Initialization Methods
```javascript
async initialize()     // Initialize database connection
async getDb()         // Get database instance
```

#### User Data Methods
```javascript
async getUser()           // Retrieve user profile
async setUser(userData)   // Update user profile
```

#### Repository Methods
```javascript
async getRepositories()              // Get all repositories
async setRepositories(repositories)  // Update repositories
```

#### Language Methods
```javascript
async getLanguages()            // Get language statistics
async setLanguages(languages)   // Update language data
```

#### Activity Methods
```javascript
async getActivity()           // Get recent activity
async setActivity(activity)   // Update activity data
```

#### Workflow Methods
```javascript
async getWorkflows()            // Get workflow runs
async setWorkflows(workflows)   // Update workflow data
```

#### Statistics Methods
```javascript
async getStats()          // Get calculated statistics
async setStats(stats)     // Update statistics
```

#### Utility Methods
```javascript
async getLastUpdated()    // Get last update timestamp
async getAllData()        // Get complete database content
```

## Data Synchronization

### Automatic Updates
All write operations automatically:
1. Update the `lastUpdated` timestamp
2. Persist changes to disk
3. Maintain data consistency

### Example Usage
```javascript
import database from '../config/database.js'

// Read data
const user = await database.getUser()
const repos = await database.getRepositories()

// Write data
await database.setUser(newUserData)
await database.setRepositories(updatedRepos)
```

## Performance Considerations

### Read Operations
- **Fast**: Direct JSON access
- **Cached**: Data stays in memory after first read
- **Efficient**: No network overhead

### Write Operations
- **Atomic**: Complete file replacement
- **Safe**: Automatic backup during write
- **Consistent**: Always valid JSON

### Optimization Strategies
1. **Batch Updates**: Group related updates together
2. **Selective Reads**: Use specific getters instead of `getAllData()`
3. **Rate Limiting**: Prevent excessive write operations
4. **Data Validation**: Ensure data integrity before writes

## Error Handling

### Database Initialization
```javascript
try {
  await database.initialize()
  console.log('✅ Database initialized successfully')
} catch (error) {
  console.error('❌ Database initialization failed:', error)
  throw error
}
```

### Operation Error Handling
- **File System Errors**: Disk space, permissions
- **JSON Parsing Errors**: Corrupted data files
- **Concurrent Access**: Multiple write operations
- **Data Validation**: Schema compliance

## Backup and Recovery

### Automatic Backups
LowDB creates temporary files during write operations to prevent data loss.

### Manual Backup Strategy
```bash
# Copy database file
cp backend/data/portfolio.json backend/data/portfolio.backup.json

# Scheduled backup (recommended)
0 2 * * * cp /path/to/portfolio.json /path/to/backups/portfolio-$(date +\%Y\%m\%d).json
```

### Recovery Process
1. Stop the application
2. Replace corrupted file with backup
3. Restart application
4. Verify data integrity

## Monitoring and Maintenance

### Health Checks
```javascript
// Check database connectivity
const lastUpdated = await database.getLastUpdated()
const isHealthy = lastUpdated && (Date.now() - new Date(lastUpdated).getTime()) < 24 * 60 * 60 * 1000
```

### Data Validation
```javascript
// Validate data structure
const data = await database.getAllData()
const isValid = data.user && Array.isArray(data.repositories) && data.stats
```

### Performance Monitoring
- File size growth
- Read/write operation frequency
- Response times
- Error rates

## Migration and Scaling

### Schema Evolution
```javascript
// Handle schema changes
if (!db.data.newField) {
  db.data.newField = defaultValue
  await db.write()
}
```

### Scaling Considerations
- **File Size Limit**: ~100MB recommended maximum
- **Concurrent Users**: Single-writer, multiple-reader pattern
- **Migration Path**: Easy transition to PostgreSQL/MongoDB if needed

## Security Considerations

### File Permissions
```bash
# Secure database file
chmod 600 backend/data/portfolio.json
chown app:app backend/data/portfolio.json
```

### Data Sanitization
- Validate all input data
- Sanitize user-generated content
- Prevent JSON injection attacks

### Access Control
- Database operations through controlled API
- Admin-only write operations
- Rate limiting on public endpoints

## Integration with GitHub API

### Data Flow
1. **GitHub API** → **GitHub Service** → **Database**
2. **Database** → **API Routes** → **Frontend**

### Sync Strategy
- **Full Sync**: Every 6 hours
- **Activity Sync**: Every hour  
- **Webhook Updates**: Real-time
- **Manual Refresh**: On-demand

### Rate Limit Management
- Respect GitHub API limits
- Implement exponential backoff
- Cache data to reduce API calls
- Prioritize critical data updates

## Development and Testing

### Local Development
```javascript
// Use separate database for development
const dbPath = process.env.NODE_ENV === 'test' 
  ? './test/data/portfolio.test.json'
  : './data/portfolio.json'
```

### Testing Strategy
```javascript
// Reset database for tests
beforeEach(async () => {
  await database.initialize()
  // Reset to default state
})
```

### Debugging
```javascript
// Inspect database content
console.log(JSON.stringify(await database.getAllData(), null, 2))
```

## Future Enhancements

### Potential Improvements
1. **Compression**: Gzip database file
2. **Encryption**: Encrypt sensitive data
3. **Sharding**: Split data across multiple files
4. **Indexing**: Add search capabilities
5. **Replication**: Multiple database copies

### Migration Path
When scaling beyond LowDB:
1. **SQLite**: For complex queries
2. **PostgreSQL**: For production scale
3. **MongoDB**: For document-based needs
4. **Redis**: For caching layer

## Conclusion

LowDB provides an excellent foundation for the portfolio site's data storage needs. Its simplicity, reliability, and zero-configuration approach make it perfect for GitHub data caching and portfolio content management. The current implementation supports all required features while maintaining excellent performance and developer experience.