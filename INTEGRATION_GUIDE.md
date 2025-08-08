# Backend-Frontend Integration Guide

## Configuration Issues Fixed

### 1. Port Configuration Mismatch
**Issue**: Frontend was expecting API at `localhost:3001` while backend runs on `localhost:8000`

**Solution**: Updated frontend configuration to use correct backend port

### 2. Files Modified

#### Frontend Changes:
1. **`.env.example`** - Added `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
2. **`.env.local`** - Added `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
3. **`src/lib/api/client.ts`** - Updated default fallback from `3001` to `8000`

#### Backend Configuration:
- **Port**: `8000` (configured in `.env`)
- **CORS**: Allows `http://localhost:3000` (Next.js frontend)
- **Admin Key**: `admin123` (for dashboard access)

## Integration Architecture

### API Endpoints Available
The backend provides these endpoints that the frontend uses:

#### Public Endpoints:
- `GET /api/health` - System health check
- `GET /api/user` - GitHub user profile data
- `GET /api/repositories` - Repository list with stats
- `GET /api/languages` - Programming language statistics
- `GET /api/activity` - Recent GitHub activity
- `GET /api/workflows` - GitHub Actions workflow data
- `GET /api/stats` - Aggregated statistics
- `GET /api/all` - All data in one request

#### Admin Endpoints (require ADMIN_KEY):
- `POST /api/refresh` - Manual data refresh
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/system` - System information
- `GET /api/admin/logs` - Application logs

#### Webhook Endpoint:
- `POST /api/github/webhook` - GitHub webhook handler

### Frontend Integration Points

#### 1. API Client (`src/lib/api/client.ts`)
```typescript
// Configured to use backend at localhost:8000
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
```

#### 2. Custom Hooks (`src/lib/api/useApi.ts`)
- `useProjects()` - Fetches repository data
- `useSkills()` - Fetches language statistics
- `usePersonalData()` - Fetches user profile
- `useActivity()` - Fetches GitHub activity

#### 3. Admin Dashboard (`src/app/admin-dashboard-xyz123/page.tsx`)
- Authenticates with `ADMIN_KEY`
- Loads dashboard data from `/api/all`
- Triggers manual refresh via `/api/refresh`
- Shows system health from `/api/health`

## Data Flow

### 1. Data Synchronization
```
GitHub API → Backend DataSyncJob → lowdb (JSON file) → Frontend API calls
```

### 2. Real-time Updates
```
GitHub Webhooks → Backend webhook handler → Data sync → Frontend refresh
```

### 3. Admin Operations
```
Admin Dashboard → Backend admin routes → Manual data refresh → Updated frontend
```

## Environment Variables

### Frontend (`.env.local`)
```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# GitHub Integration
NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
NEXT_PUBLIC_GITHUB_USERNAME=your_username
```

### Backend (`.env`)
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# GitHub API Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_USERNAME=your_github_username_here

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Admin Dashboard Access
ADMIN_KEY=admin123
```

## Development Workflow

### 1. Start Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:8000
```

### 2. Start Frontend
```bash
cd src-code
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Access Admin Dashboard
- URL: `http://localhost:3000/admin-dashboard-xyz123`
- Admin Key: `admin123`

## Data Types & Interfaces

The frontend expects specific data structures from the backend:

### Repository Data
```typescript
interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  topics: string[]
  created_at: string
  updated_at: string
}
```

### User Data
```typescript
interface GitHubUser {
  login: string
  name: string
  bio: string
  location: string
  public_repos: number
  followers: number
  following: number
  avatar_url: string
}
```

### Activity Data
```typescript
interface GitHubActivity {
  id: string
  type: string
  repo: {
    name: string
    url: string
  }
  created_at: string
  payload: GitHubActivityPayload
}
```

## Testing Integration

### 1. Health Check
```bash
curl http://localhost:8000/api/health
```

### 2. Test Frontend API Calls
- Open browser dev tools
- Navigate to portfolio pages
- Check Network tab for API calls to `localhost:8000`

### 3. Admin Dashboard Test
- Access admin dashboard
- Enter admin key: `admin123`
- Verify data loads correctly
- Test refresh functionality

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `FRONTEND_URL=http://localhost:3000` in backend `.env`
2. **API Not Found**: Verify backend is running on port 8000
3. **Admin Access Denied**: Check `ADMIN_KEY` matches in backend `.env`
4. **No Data Loading**: Ensure GitHub token is valid in backend `.env`

### Debug Steps:
1. Check backend logs for errors
2. Verify environment variables are loaded
3. Test API endpoints directly with curl/Postman
4. Check browser network tab for failed requests

## Next Steps for Full Integration

### Phase 1: Basic Integration (COMPLETED)
- ✅ Fix port configuration
- ✅ Update environment files
- ✅ Ensure API client uses correct endpoints

### Phase 2: Enhanced Features (TODO)
- [ ] Implement AI content generation endpoints
- [ ] Add dashboard analytics
- [ ] Create code constellation data endpoints
- [ ] Add real-time WebSocket connections

### Phase 3: Advanced Features (TODO)
- [ ] Performance monitoring
- [ ] Advanced security features
- [ ] Accessibility enhancements
- [ ] Caching strategies

## Security Considerations

1. **Admin Key**: Change default `admin123` to secure value
2. **GitHub Token**: Use personal access token with minimal required scopes
3. **CORS**: Restrict to specific frontend domain in production
4. **Rate Limiting**: Configured to prevent API abuse
5. **Environment Variables**: Never commit sensitive values to git