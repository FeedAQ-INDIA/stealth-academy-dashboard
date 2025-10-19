# Cancel Invite Implementation

## Overview
Implemented the `cancelInvite` API functionality to allow course instructors/admins to cancel pending invitations before they are accepted or declined by invitees.

## Changes Made

### 1. Frontend Service Layer (`src/services/courseRoomService.js`)

Added new `cancelInvite` method to the courseRoomService:

```javascript
/**
 * Cancel a pending course invitation
 * @param {number} inviteId - Invite ID to cancel
 * @returns {Promise<Object>} - Operation result
 */
cancelInvite: async (inviteId) => {
  if (!inviteId) {
    throw new Error("Invite ID is required");
  }

  try {
    const response = await axiosConn.post("/course-access/cancelInvite", {
      inviteId,
    });
    
    return validateResponse(response, "invitation cancellation");
  } catch (error) {
    throw handleApiError(error, "Failed to cancel invitation");
  }
}
```

**Features:**
- Validates inviteId parameter
- Makes POST request to `/course-access/cancelInvite` endpoint
- Handles errors with user-friendly messages
- Returns validated response

### 2. Custom Hook (`src/hooks/useCourseRoomMembers.js`)

Updated the `cancelInvite` callback to call the actual API:

```javascript
const cancelInvite = useCallback(
  async (member) => {
    try {
      if (!member?.inviteId) {
        throw new Error("Invalid invitation data");
      }

      console.log("Canceling invite for:", member);

      await courseRoomService.cancelInvite(member.inviteId);

      toast({
        title: "Invitation Cancelled",
        description: `Invitation for ${member.inviteeEmail} has been cancelled.`,
      });

      // Refresh invited members list
      await fetchInvitedMembers();
    } catch (error) {
      console.error("Cancel invite error:", error);
      toast({
        title: "Cancel Failed",
        description: error.message || "Failed to cancel invitation",
        variant: "destructive",
      });
    }
  },
  [toast, fetchInvitedMembers]
);
```

**Features:**
- Validates member data and inviteId
- Calls the cancelInvite service
- Shows success toast notification
- Refreshes the invited members list automatically
- Comprehensive error handling with user feedback

### 3. UI Component (Already Exists)

The `InvitedMembersTable.jsx` component already has the UI implementation:
- "Cancel Invite" button for each pending invitation
- Confirmation dialog before canceling
- Only visible to course owner or admin
- Passes member data to the `onCancelInvite` handler

## Flow Diagram

```
User clicks "Cancel Invite" button
         ↓
Confirmation dialog appears
         ↓
User confirms cancellation
         ↓
onCancelInvite(member) called
         ↓
useCourseRoomMembers.cancelInvite(member)
         ↓
courseRoomService.cancelInvite(member.inviteId)
         ↓
POST /course-access/cancelInvite
         ↓
Backend validates and cancels invite
         ↓
Success response
         ↓
Toast notification shown
         ↓
Invited members list refreshed
```

## API Endpoint

**Endpoint:** `POST /api/courseAccess/cancelInvite`

**Request Body:**
```json
{
  "inviteId": 123
}
```

**Success Response (200):**
```json
{
  "status": 200,
  "message": "Invitation cancelled successfully",
  "data": {
    "inviteId": 123,
    "courseId": 456,
    "courseName": "Introduction to Programming",
    "inviteeEmail": "user@example.com",
    "status": "CANCELLED"
  }
}
```

**Error Responses:**
- `400` - Missing inviteId
- `403` - User trying to cancel someone else's invite
- `404` - Invalid or already processed invitation
- `500` - Server error

## Security & Validation

### Frontend Validation:
- ✅ Validates inviteId exists in member object
- ✅ Confirmation dialog prevents accidental cancellations
- ✅ Only visible to course owner or admin

### Backend Validation:
- ✅ Verifies the user cancelling is the one who sent the invite
- ✅ Only pending invitations can be cancelled
- ✅ Authentication required via middleware

## User Experience

1. **Visual Feedback:**
   - Alert dialog confirms user's intention
   - Toast notifications for success/failure
   - Automatic list refresh after cancellation

2. **Permissions:**
   - Only course owner or admin can see "Cancel Invite" button
   - Backend verifies the user is the inviter

3. **Error Handling:**
   - Clear error messages for all failure scenarios
   - Graceful handling of network errors
   - Console logging for debugging

## Testing Checklist

- [ ] Course owner can cancel their own invites
- [ ] Admin can cancel invites
- [ ] Non-owner/admin cannot see cancel button
- [ ] Cannot cancel already accepted invites
- [ ] Cannot cancel already declined invites
- [ ] Cannot cancel expired invites
- [ ] Success toast appears on cancellation
- [ ] Error toast appears on failure
- [ ] Invited members list refreshes automatically
- [ ] Confirmation dialog works correctly

## Related Files

### Frontend:
- `src/services/courseRoomService.js` - API service
- `src/hooks/useCourseRoomMembers.js` - Business logic hook
- `src/components-xm/Course/components/InvitedMembersTable.jsx` - UI component
- `src/components-xm/Course/CourseRoomMembers.jsx` - Parent component

### Backend:
- `src/routes/courseAccess.route.js` - Route definition
- `src/controller/CourseAccess.controller.js` - Request handler
- `src/service/CourseAccess.service.js` - Business logic

## Notes

- The implementation follows the existing patterns for `acceptInvite` and `declineInvite`
- Notifications are sent to the invitee if they have an account
- The invite status is updated to 'CANCELLED' in the database
- The invitation cannot be accepted or declined after cancellation

## Future Enhancements

- [ ] Bulk cancel invitations
- [ ] Email notification to invitee about cancellation
- [ ] Audit log for invitation cancellations
- [ ] Ability to resend cancelled invitations
- [ ] Analytics on cancellation reasons
