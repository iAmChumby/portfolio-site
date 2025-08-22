# Portfolio Backend API Documentation

## Base URL
- **Production**: `https://api.lukeedwards.me`
- **Development**: `http://localhost:8000`

## Available Endpoints

Based on the actual API implementation, here are the confirmed available endpoints:

**Public Endpoints:**
- `GET /` - API information and endpoint list
- `GET /api/health` - Health check
- `GET /api/user` - User profile
- `GET /api/repositories` - All repositories
- `GET /api/repositories/featured` - Featured repositories
- `GET /api/languages` - Programming languages
- `GET /api/activity` - GitHub activity
- `GET /api/workflows` - Workflow runs
- `GET /api/stats` - Statistics
- `GET /api/all` - All data combined

**Webhook Endpoints:**
- `POST /api/github/webhook` - GitHub webhook

**Admin Endpoints (Authentication Required):**
- `POST /api/admin/verify` - Verify admin access
- `GET /api/admin/all` - All dashboard data
- `POST /api/admin/refresh` - Manual data refresh
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/system` - System information
- `GET /api/admin/logs` - Application logs

## Authentication

Admin endpoints require authentication via:
- **Header**: `x-admin-key: YOUR_ADMIN_KEY`
- **Body**: `{ "adminKey": "YOUR_ADMIN_KEY" }`

## Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "data": {}, // Response data
  "count": 0,  // Optional: number of items
  "message": "" // Optional: status message
}
```

Error responses:
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Rate Limiting

- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Scope**: All `/api/*` endpoints

---

# Public API Endpoints

## Health Check

### GET `/api/health`
Check API health status.

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": 52428800,
    "heapTotal": 20971520,
    "heapUsed": 15728640
  }
}
```

## User Profile

### GET `/api/user`
Get user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "login": "username",
    "name": "Full Name",
    "bio": "User bio",
    "location": "City, Country",
    "email": "user@example.com",
    "avatar_url": "https://github.com/avatar.jpg",
    "html_url": "https://github.com/username",
    "public_repos": 50,
    "followers": 100,
    "following": 75
  }
}
```

## Repositories

### GET `/api/repositories`
Get all repositories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123456789,
      "name": "repo-name",
      "full_name": "username/repo-name",
      "description": "Repository description",
      "html_url": "https://github.com/username/repo-name",
      "language": "JavaScript",
      "stargazers_count": 25,
      "forks_count": 5,
      "updated_at": "2024-01-20T10:30:00Z",
      "topics": ["react", "nodejs"]
    }
  ],
  "count": 50
}
```

### GET `/api/repositories/featured`
Get featured repositories (non-forks, sorted by stars and activity).

**Query Parameters:**
- `limit` (optional): Number of repositories to return (1-50, default: 6)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123456789,
      "name": "featured-repo",
      "description": "A featured repository",
      "html_url": "https://github.com/username/featured-repo",
      "language": "TypeScript",
      "stargazers_count": 100,
      "forks_count": 20,
      "updated_at": "2024-01-20T10:30:00Z"
    }
  ],
  "count": 6
}
```

## Languages

### GET `/api/languages`
Get programming languages used across repositories.

**Response:**
```json
{
  "success": true,
  "data": {
    "JavaScript": 45.2,
    "TypeScript": 30.1,
    "Python": 15.7,
    "CSS": 9.0
  }
}
```

## Activity

### GET `/api/activity`
Get recent GitHub activity/events.

**Query Parameters:**
- `limit` (optional): Number of events to return (minimum: 1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event-id",
      "type": "PushEvent",
      "repo": {
        "name": "username/repo-name"
      },
      "created_at": "2024-01-20T10:30:00Z",
      "payload": {
        "commits": [
          {
            "message": "feat: add new feature",
            "sha": "abc123"
          }
        ]
      }
    }
  ],
  "count": 10
}
```

## Workflows

### GET `/api/workflows`
Get GitHub Actions workflow runs.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123456789,
      "name": "CI/CD Pipeline",
      "status": "completed",
      "conclusion": "success",
      "created_at": "2024-01-20T10:30:00Z",
      "repository": "username/repo-name"
    }
  ],
  "count": 25
}
```

## Statistics

### GET `/api/stats`
Get overall GitHub statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRepos": 50,
    "totalStars": 250,
    "totalForks": 75,
    "totalCommits": 1500,
    "languageStats": {
      "JavaScript": 45.2,
      "TypeScript": 30.1
    }
  }
}
```

## All Data

### GET `/api/all`
Get all data in a single request (user, repositories, languages, activity, workflows, stats).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user profile data */ },
    "repositories": [ /* repositories array */ ],
    "languages": { /* languages object */ },
    "activity": [ /* activity array */ ],
    "workflows": [ /* workflows array */ ],
    "stats": { /* stats object */ }
  }
}
```

---

# Analytics Data (Admin Only)

**Note**: Analytics data is only available through admin endpoints. There are no public analytics endpoints.

---

# Admin API Endpoints

**Authentication Required**: All admin endpoints require admin key authentication.

## Admin Authentication

### POST `/api/admin/verify`
Verify admin access.

**Request Body:**
```json
{
  "adminKey": "your-admin-key"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin access verified"
}
```

## Dashboard Data

### GET `/api/admin/all`
Get all dashboard data.

**Headers:**
```
x-admin-key: your-admin-key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user profile */ },
    "repositories": [ /* repositories */ ],
    "languages": { /* languages */ },
    "activity": [ /* activity */ ],
    "workflows": [ /* workflows */ ],
    "stats": { /* stats */ },
    "analytics": { /* analytics data */ }
  }
}
```

## Data Management

### POST `/api/admin/refresh`
Trigger manual data refresh from GitHub.

**Headers:**
```
x-admin-key: your-admin-key
```

**Response:**
```json
{
  "success": true,
  "message": "Data refresh completed successfully",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Error Response (if sync in progress):**
```json
{
  "error": "Data sync is already in progress"
}
```

## Analytics Dashboard

### GET `/api/admin/analytics`
Get comprehensive analytics data for admin dashboard.

**Headers:**
```
x-admin-key: your-admin-key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalVisits": 1500,
      "uniqueVisitors": 800,
      "topPages": [
        {
          "page": "/",
          "visits": 500
        }
      ],
      "dailyStats": {
        "today": 25,
        "todayUnique": 18
      },
      "bounceRate": 45.2,
      "avgSessionDuration": 180
    },
    "dailyVisits": [
      {
        "date": "2024-01-20",
        "visits": 45,
        "uniqueVisitors": 32
      }
    ],
    "popularPages": [
      {
        "page": "/",
        "visits": 500
      }
    ],
    "recentVisitors": [
      {
        "ip": "192.168.1.1",
        "timestamp": "2024-01-20T10:30:00Z",
        "userAgent": "Mozilla/5.0...",
        "path": "/"
      }
    ]
  }
}
```

## System Information

### GET `/api/admin/system`
Get system health and information.

**Headers:**
```
x-admin-key: your-admin-key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nodeVersion": "v18.17.0",
    "platform": "linux",
    "arch": "x64",
    "uptime": 3600,
    "memory": {
      "rss": "50 MB",
      "heapTotal": "20 MB",
      "heapUsed": "15 MB"
    },
    "env": "production",
    "timestamp": "2024-01-20T10:30:00.000Z",
    "pid": 1234,
    "cwd": "/app",
    "versions": {
      "node": "18.17.0",
      "v8": "10.2.154.26"
    },
    "database": {
      "connected": true
    },
    "lastUpdated": "2024-01-20T10:30:00.000Z"
  }
}
```

## Logs Management

### GET `/api/admin/logs`
Get application logs.

**Headers:**
```
x-admin-key: your-admin-key
```

**Query Parameters:**
- `limit` (optional): Number of log lines to return (1-1000, default: 100)
- `level` (optional): Log level filter (`all`, `error`, `warn`, `info`, `debug`, default: `all`)

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      "2024-01-20T10:30:00.000Z [INFO] Server started on port 8000",
      "2024-01-20T10:31:00.000Z [INFO] Data sync completed successfully"
    ],
    "file": "app-2024-01-20.log",
    "totalLines": 100,
    "level": "all",
    "limit": 100
  }
}
```

---

# Webhook Endpoints

### POST `/api/github/webhook`
GitHub webhook endpoint for automatic data updates.

**Headers:**
```
X-GitHub-Event: push
X-Hub-Signature-256: sha256=...
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

---

# Error Codes

- **400**: Bad Request - Invalid parameters or request format
- **401**: Unauthorized - Invalid or missing admin key
- **404**: Not Found - Resource not found
- **409**: Conflict - Operation already in progress
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server error

---

# Environment Variables

## Required
- `GITHUB_TOKEN`: GitHub personal access token
- `ADMIN_KEY`: Admin authentication key

## Optional
- `PORT`: Server port (default: 8000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)

---

# Data Sync

The backend automatically syncs data from GitHub:
- **Initial sync**: On server startup
- **Scheduled sync**: Every 6 hours
- **Manual sync**: Via `/api/admin/refresh` endpoint
- **Webhook sync**: On GitHub events (push, release, etc.)

---

# Security Features

- **HTTPS enforcement** in production
- **CORS protection** with configurable origins
- **Rate limiting** on all API endpoints
- **Helmet.js** security headers
- **Request ID tracking** for debugging
- **Admin key authentication** for sensitive endpoints
- **Input validation** and sanitization
- **Error handling** with structured responses