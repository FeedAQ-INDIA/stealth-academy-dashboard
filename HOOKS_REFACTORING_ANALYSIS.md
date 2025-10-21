# Hooks Refactoring Analysis

## Current State Analysis

### Existing Hooks (Properly Structured)
1. ✅ **useCourseRoomMembers.js** - Well-structured, handles all CourseRoomMembers operations
2. ✅ **useCourseState.js** - Handles course detail and enrollment state
3. ✅ **useStudyGroups.js** - Comprehensive study group management
4. ✅ **use-toast.js** - UI notifications
5. ✅ **use-mobile.jsx** - Responsive design helper

### Components with Direct API Calls (Need Refactoring)

#### Course Components (`components-xm/Course/`)
1. **CourseOverview.jsx**
   - API Calls:
     - `/searchCourse` - Fetch notes
     - `/userCourseEnrollment` - Enroll user
     - `/userCourseDisrollment` - Unenroll user
     - `/deleteCourse` - Delete course
   - **New Hook**: `useCourseOverview.js`

2. **CourseNotes.jsx**
   - API Calls:
     - `/searchCourse` - Fetch notes with course content
     - `/deleteNote` - Delete a note
     - `/saveNote` - Update a note
   - **New Hook**: `useCourseNotes.js`

3. **CourseFlashcard.jsx**
   - API Calls:
     - `/searchCourse` - Fetch flashcard sets
   - **New Hook**: `useCourseFlashcard.js`

4. **CourseVideoTutorial.jsx**
   - API Calls:
     - `/searchCourse` - Fetch user progress
     - `/saveUserCourseContentProgress` - Save progress
     - `/deleteUserCourseContentProgress` - Reset progress
   - **New Hook**: `useCourseVideoTutorial.js`

5. **CourseQuiz/CourseQuiz.jsx**
   - API Calls:
     - `/searchCourse` - Fetch quiz data
     - `/saveUserCourseContentProgress` - Mark as completed
     - `/deleteUserCourseContentProgress` - Reset progress
   - **New Hook**: `useCourseQuiz.js`

6. **CourseQuiz/QuizRender.jsx**
   - API Calls:
     - `/searchCourse` - Fetch quiz questions
     - `/submitQuiz` - Submit quiz answers
     - `/clearQuizResult` - Clear quiz results
   - **New Hook**: `useQuizRender.js`

7. **CourseQuiz/enhanced/EnhancedQuizSystem.jsx**
   - API Calls:
     - `/searchCourse` - Fetch quiz and questions
     - `/submitQuiz` - Submit quiz
     - `/clearQuizResult` - Reset quiz
   - **New Hook**: `useEnhancedQuiz.js`

#### CourseBuilder Components (`components-xm/CourseBuilder/`)
1. **Builder.jsx**
   - API Calls:
     - `DELETE /courseBuilder` - Delete content
     - `/saveCourseTopic` - Save topic
     - `/registerBuilder` - Register builder
   - **New Hook**: `useCourseBuilder.js`

2. **PreviewBuilder.jsx**
   - API Calls:
     - `/importFromYoutube` - Import YouTube content
     - `/saveCourseTopic` - Save topic
     - `/publishCourse` - Publish course
     - `GET /courseBuilder/:id` - Fetch builder data
     - `/saveCourseTag` - Save tags
   - **New Hook**: `usePreviewBuilder.js`

#### Account Settings Components (`components-xm/AccountSettings/`)
1. **Notifications.jsx**
   - API Calls:
     - `/notifications/getNotifications` - Fetch notifications
     - `/notifications/archiveNotifications` - Archive notifications
     - `/course-access/acceptInvite` - Accept course invite
     - `/course-access/declineInvite` - Decline course invite
   - **New Hook**: `useNotifications.js`

2. **MyAccount.jsx**
   - API Calls:
     - `/saveUserDetail` - Update user profile
   - **New Hook**: `useMyAccount.js`

3. **Organization/OrgProfile.jsx**
   - API Calls:
     - `PUT /updateOrg` - Update organization
   - **New Hook**: `useOrgProfile.js`

4. **Organization/RegisterAsOrg.jsx**
   - API Calls:
     - `/registerOrg` - Register organization
   - **New Hook**: `useRegisterOrg.js`

5. **Orders/AllOrders.jsx**
   - API Calls:
     - `/getUserOrders` - Fetch orders
     - `/cancelOrder` - Cancel order
     - `/downloadInvoice` - Download invoice
   - **New Hook**: `useOrders.js`

6. **Billing/BillingOverview.jsx**
   - API Calls:
     - External payment gateway calls
   - **New Hook**: `useBilling.js`

#### Dashboard & MyJourney Components
1. **Dashboard.jsx**
   - API Calls:
     - `/searchCourse` - Multiple queries for courses
   - **New Hook**: `useDashboard.js`

2. **MyJourney/MyCourse.jsx**
   - API Calls:
     - `/searchCourse` - Fetch enrolled courses
   - **New Hook**: `useMyCourses.js`

3. **MyJourney/MyStudyGroup.jsx**
   - Uses: `useStudyGroups` ✅ (already implemented)

#### Notes Components
1. **Notes/CreateNotesModule.jsx**
   - API Calls:
     - `/saveNote` - Create note
   - **New Hook**: `useCreateNotes.js`

2. **Notes/NotesModule.jsx**
   - Likely uses similar patterns
   - **New Hook**: Can reuse `useCreateNotes.js`

#### Modules Components
1. **Modules/EventCard.jsx**
   - API Calls:
     - `/schedule/update` - Update schedule
     - `/schedule/delete` - Delete schedule
   - **New Hook**: `useEventCard.js`

## Proposed Hook Structure

### Standard Hook Pattern
```javascript
// src/hooks/use[ComponentName].js
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

export const use[ComponentName] = (dependencies) => {
  const { toast } = useToast();
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Functions
  const fetchData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosConn.post(endpoint, params);
      setState(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dependencies]);

  // More API functions...

  return {
    // State
    ...state,
    loading,
    error,
    
    // Actions
    fetchData,
    // More actions...
  };
};
```

## Implementation Priority

### Phase 1: Critical Course Components (High Usage)
1. ✅ useCourseRoomMembers - Already done
2. useCourseOverview
3. useCourseNotes  
4. useCourseVideoTutorial
5. useCourseQuiz

### Phase 2: Builder & Dashboard
1. useCourseBuilder
2. usePreviewBuilder
3. useDashboard
4. useMyCourses

### Phase 3: Account Settings
1. useNotifications
2. useMyAccount
3. useOrgProfile
4. useOrders

### Phase 4: Remaining Components
1. useEventCard
2. useCreateNotes
3. useBilling
4. useRegisterOrg

## Benefits of This Refactoring

1. **Separation of Concerns**: UI logic separated from API/business logic
2. **Reusability**: Hooks can be reused across multiple components
3. **Testability**: Easier to unit test hooks independently
4. **Maintainability**: Centralized API calls, easier to update endpoints
5. **Type Safety**: Better TypeScript support potential
6. **Error Handling**: Consistent error handling across the app
7. **Loading States**: Unified loading state management
8. **Code Organization**: Clear structure, easier onboarding for new developers

## Migration Strategy

1. Create new hook file in `src/hooks/`
2. Move API calls and related state from component to hook
3. Test hook independently
4. Update component to use the new hook
5. Verify functionality
6. Remove old API call code from component
7. Document the hook usage

## Naming Conventions

- Hook files: `use[ComponentName].js` (camelCase)
- Hook function: `export const use[ComponentName]`
- Example: `useCourseOverview.js` exports `useCourseOverview`

## File Structure
```
src/
├── hooks/
│   ├── use-mobile.jsx ✅
│   ├── use-toast.js ✅
│   ├── useCourseState.js ✅
│   ├── useCourseRoomMembers.js ✅
│   ├── useStudyGroups.js ✅
│   ├── useCourseOverview.js (NEW)
│   ├── useCourseNotes.js (NEW)
│   ├── useCourseFlashcard.js (NEW)
│   ├── useCourseVideoTutorial.js (NEW)
│   ├── useCourseQuiz.js (NEW)
│   ├── useQuizRender.js (NEW)
│   ├── useEnhancedQuiz.js (NEW)
│   ├── useCourseBuilder.js (NEW)
│   ├── usePreviewBuilder.js (NEW)
│   ├── useNotifications.js (NEW)
│   ├── useMyAccount.js (NEW)
│   ├── useOrgProfile.js (NEW)
│   ├── useRegisterOrg.js (NEW)
│   ├── useOrders.js (NEW)
│   ├── useBilling.js (NEW)
│   ├── useDashboard.js (NEW)
│   ├── useMyCourses.js (NEW)
│   ├── useEventCard.js (NEW)
│   └── useCreateNotes.js (NEW)
```

## Next Steps

1. Review and approve this analysis
2. Begin Phase 1 implementation
3. Create hooks one by one with thorough testing
4. Update components to use new hooks
5. Document each hook's API and usage
