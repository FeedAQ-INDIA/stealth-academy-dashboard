# Notification API Integration Guide

## Overview
This document explains the integration of the Notification API with the frontend Notifications component.

## Backend API Analysis

### API Endpoint: `POST /notifications/getNotifications`

**Request Body:**
```json
{
  "status": "UNREAD",  // Optional: UNREAD, READ, ARCHIVED
  "limit": 20,         // Optional: Number of notifications to fetch
  "offset": 0          // Optional: Pagination offset
}
```

**Actual Response Format (from your API):**
```json
{
  "status": 200,
  "message": "Notifications fetched successfully",
  "data": {
    "total": 1,
    "notifications": [
      {
        "notificationId": 3,
        "userId": 1,
        "notificationType": "COURSE_INVITE",
        "notificationReq": {
          "email": "avikumarshooters@gmail.com",
          "courseId": 1,
          "inviteId": 8,
          "expiresAt": "2025-10-24T11:42:57.123Z",
          "inviteToken": "b6b1c3d8094e8f38eb5eb06e2dd48d305f4a845131fb31cc4e4606d591922fb3"
        },
        "status": "UNREAD",
        "isActionRequired": true,
        "created_date": "17-Oct-2025",
        "v_created_time": "17:13:09",
        "v_updated_date": "17-Oct-2025",
        "v_updated_time": "17:13:09",
        "notification_created_at": "2025-10-17T11:43:09.064Z",
        "notification_updated_at": "2025-10-17T11:43:09.064Z"
      }
    ]
  }
}
```

### Notification Types
Backend supports the following notification types:
- `COURSE_INVITE` - Course room invitation
- `STUDY_GROUP_INVITE` - Study group invitation
- `COURSE_UPDATE` - Updates to course content
- `SYSTEM` - System-wide notifications
- `CREDIT_UPDATE` - Credit balance updates

### Notification Status
- `UNREAD` - New notifications
- `READ` - Viewed notifications
- `ARCHIVED` - Archived notifications

## Frontend Integration

### Key Features Implemented

1. **Fetch Notifications**
   - Automatically fetches notifications on component mount
   - Refetches when status filter changes
   - Displays loading state during API calls

2. **Filter by Status**
   - Dropdown to filter notifications by UNREAD, READ, or ARCHIVED
   - Updates URL query params for bookmarking

3. **Archive Notifications**
   - Archive button for each notification
   - Calls `/notifications/archiveNotifications` API
   - Refreshes list after successful archival

4. **Mark as Read**
   - Automatically marks notifications as read when actions are performed
   - Calls `/notifications/markAsRead` API
   - Updates local state optimistically

5. **Type Mapping**
   - Maps backend notification types to frontend templates
   - Supports custom rendering for each notification type

### Component State

```javascript
const [notifications, setNotifications] = useState([]);
const [loading, setLoading] = useState(false);
const [statusFilter, setStatusFilter] = useState('UNREAD');
const [totalCount, setTotalCount] = useState(0);
```

### Data Transformation

Backend data is transformed to match component expectations:

```javascript
const transformedNotifications = fetchedNotifications.map(notif => ({
  id: notif.notificationId,
  type: mapNotificationType(notif.notificationType),
  data: notif.notificationReq || {},
  status: notif.status?.toLowerCase() || 'unread',
  timestamp: `${notif.created_date} at ${notif.v_created_time}`,
  isActionRequired: notif.isActionRequired,
  originalType: notif.notificationType
}));
```

### Course Invite Notification Structure

For `COURSE_INVITE` type, the `notificationReq` contains:
- `email`: The email address that received the invite
- `courseId`: The ID of the course being invited to
- `inviteId`: The unique invite ID
- `inviteToken`: Token for accepting/rejecting the invitation
- `expiresAt`: ISO date string when the invitation expires

### API Calls Used

1. **GET Notifications:**
   ```javascript
   await axiosConn.post('/notifications/getNotifications', {
     status: statusFilter,
     limit: limit,
     offset: offset
   });
   ```

2. **Archive Notifications:**
   ```javascript
   await axiosConn.post('/notifications/archiveNotifications', {
     notificationIds: [notificationId]
   });
   ```

3. **Mark as Read:**
   ```javascript
   await axiosConn.post('/notifications/markAsRead', {
     notificationIds: [notificationId]
   });
   ```

## User Experience Features

### Empty States
- Shows appropriate message when no notifications exist
- Different messages for different filter states

### Loading States
- Spinner with message during API calls
- Prevents multiple simultaneous requests

### Error Handling
- Toast notifications for errors
- Console logging for debugging
- Graceful fallbacks for missing data

### Interactive Elements
- Filter dropdown to switch between UNREAD, READ, ARCHIVED
- Archive button (hidden for already archived notifications)
- Action buttons for notifications requiring user action

### Expiry Handling (COURSE_INVITE)
- **Expired Badge**: Shows "Expired" label for invitations past their expiry date
- **Disabled Actions**: Accept/Reject buttons are hidden for expired invitations
- **Visual Indication**: Expired notifications have reduced opacity and gray background
- **Expiry Display**: Shows expiration date for active invitations
- **Real-time Check**: Compares `expiresAt` with current date on each render

## Future Enhancements

### Recommended Improvements

1. **Pagination**
   - Add "Load More" button or infinite scroll
   - Currently only fetches first page

2. **Real-time Updates**
   - WebSocket integration for live notifications
   - Auto-refresh on interval

3. **Bulk Actions**
   - Select multiple notifications
   - Bulk mark as read or archive

4. **Notification Preferences**
   - Allow users to configure notification types
   - Email/SMS notification settings

5. **Rich Actions**
   - Complete course invite acceptance/rejection flow
   - Direct navigation to related content
   - Inline preview of notification details

## Testing the Integration

### Manual Testing Steps

1. **View Unread Notifications:**
   - Navigate to Notifications page
   - Should see UNREAD notifications by default

2. **Filter Notifications:**
   - Change filter dropdown to READ or ARCHIVED
   - List should update accordingly

3. **Archive a Notification:**
   - Click "Archive" button on any notification
   - Should show success toast
   - Notification should disappear from list

4. **Handle Course Invite:**
   - Click Accept/Reject on course invitation
   - Should show appropriate toast
   - Notification status should update

### API Testing with Backend

Ensure backend is running and test:
```bash
# Start backend server
cd feedaq-academy-backend
npm start

# Backend should be running on configured port
# Frontend will use VITE_API_URL from .env
```

## Environment Configuration

Ensure `.env` file in frontend has:
```env
VITE_API_URL=http://localhost:3000
```

## Dependencies Used

- `axiosConn` - Axios instance with auth interceptors
- `useAuthStore` - Zustand store for user authentication
- `useToast` - Toast notification hook from shadcn/ui
- `lucide-react` - Icon components
- `@/components/ui/*` - shadcn/ui components

## File Locations

- **Backend Controller:** `src/controller/Notification.controller.js`
- **Backend Route:** `src/routes/notification.route.js`
- **Backend Service:** `src/service/Notifications.service.js`
- **Frontend Component:** `src/components-xm/AccountSettings/Notifications.jsx`
- **Axios Config:** `src/axioscon.js`

## Summary

The Notification API is now fully integrated with the frontend component. Users can:
- ✅ View their notifications filtered by status
- ✅ Archive notifications they no longer need
- ✅ Mark notifications as read automatically
- ✅ See loading and empty states
- ✅ Get feedback through toast notifications
- ✅ See notification count and pagination info

The integration follows React best practices and matches the existing codebase patterns.
