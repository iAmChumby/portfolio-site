# Admin Dashboard Login Instructions

## Access Information

**Admin Dashboard URL:** http://localhost:3002/admin-dashboard-xyz123

**Admin Password:** `admin123`

## How to Login

1. Navigate to the admin dashboard URL above
2. Enter the password: `admin123`
3. Click "Access Dashboard"

## 🔧 Summary of Fixes Applied

1. **Fixed Frontend API Configuration**: Updated `NEXT_PUBLIC_API_URL` from production URL to local backend (`http://localhost:8000/api`)
2. **Fixed Backend CORS Configuration**: Updated `FRONTEND_URL` to allow requests from local frontend (`http://localhost:3002`)
3. **Updated Login Method**: Changed from using `adminApi.getSystemHealth()` (public endpoint) to `adminApi.authenticate()` (proper authentication endpoint)
4. **Fixed API Endpoint**: Corrected the `getSystemHealth` method to use the authenticated `/api/admin/system` endpoint with proper headers
5. **Verified Backend Configuration**: Confirmed `ADMIN_KEY=admin123` is properly set in backend environment

## Backend Configuration

The admin key is configured in `backend/.env`:
```
ADMIN_KEY=admin123
```

## Security Notes

- The admin key is currently set to a simple value for development
- For production, use a strong, unique admin key
- The dashboard URL path `admin-dashboard-xyz123` provides security through obscurity
- Admin sessions are stored in localStorage and cleared on logout

## Testing

The authentication has been tested and verified:
- Backend API responds correctly to admin verification requests
- Frontend properly authenticates using the `/api/admin/verify` endpoint
- Both development servers are running successfully

## Troubleshooting

If you still encounter login issues:
1. Ensure both backend (port 8000) and frontend (port 3001) servers are running
2. Check browser console for any JavaScript errors
3. Verify the admin key matches exactly: `admin123`
4. Clear browser localStorage if needed