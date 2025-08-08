# Admin Dashboard Setup

This document explains how to set up and access the admin dashboard for your portfolio site.

## Setup

### 1. Environment Configuration

Add the following to your `.env` file in the backend directory:

```env
ADMIN_KEY=your_secure_admin_key_here
```

**Important:** Choose a strong, unique admin key. This is the only protection for your admin dashboard.

### 2. Backend Routes

The admin dashboard uses the following backend endpoints:

- `POST /api/admin/verify` - Verify admin access
- `GET /api/admin/all` - Get all dashboard data
- `POST /api/admin/refresh` - Trigger manual data refresh
- `GET /api/admin/system` - Get system information
- `GET /api/admin/logs` - Get recent logs

### 3. Frontend Access

The admin dashboard is accessible at:
```
http://localhost:3000/admin-dashboard-xyz123
```

**Security Note:** The URL path `admin-dashboard-xyz123` is intentionally obscure. You can change this by renaming the folder in `src-code/src/app/`.

## Usage

### Accessing the Dashboard

1. Navigate to `http://localhost:3000/admin-dashboard-xyz123`
2. Enter your admin key (the value from your `.env` file)
3. Click "Access Dashboard"

### Dashboard Features

- **System Health**: View server status and uptime
- **User Profile**: GitHub user information
- **Statistics**: Repository stats, stars, forks, followers
- **Recent Activity**: Latest GitHub activity
- **Repositories**: List of repositories with stats
- **Manual Refresh**: Trigger data synchronization

### Security Considerations

1. **Admin Key**: Keep your admin key secure and don't share it
2. **URL Path**: The dashboard URL is intentionally hard to guess
3. **No Persistent Sessions**: You'll need to re-enter the key if you refresh the page
4. **Environment Only**: The admin key is only stored in environment variables

### Changing the Admin Key

1. Update the `ADMIN_KEY` in your `.env` file
2. Restart the backend server
3. Use the new key to access the dashboard

### Changing the Dashboard URL

1. Rename the folder `src-code/src/app/admin-dashboard-xyz123` to your preferred path
2. Update any bookmarks or links accordingly

## Troubleshooting

### "Admin access not configured" Error
- Make sure `ADMIN_KEY` is set in your `.env` file
- Restart the backend server after adding the key

### "Invalid admin key" Error
- Double-check the admin key in your `.env` file
- Ensure there are no extra spaces or characters

### "Failed to load dashboard data" Error
- Check that the backend server is running
- Verify the API URL in the frontend (should be `http://localhost:8000`)
- Check backend logs for any errors

### Dashboard Not Loading
- Ensure you're using the correct URL path
- Check that the Next.js development server is running
- Verify there are no console errors in the browser

## Development Notes

- The dashboard is built with React and Tailwind CSS
- It uses the existing backend API endpoints
- No additional dependencies are required
- The dashboard is responsive and works on mobile devices