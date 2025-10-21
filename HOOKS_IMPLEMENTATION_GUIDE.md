# Hooks Implementation Guide

## Overview

This document provides detailed instructions on how to use the file-specific hooks that have been created for the FeedAQ Academy Dashboard. Each hook encapsulates all API calls and state management for its corresponding component, following React best practices.

## Table of Contents

1. [Available Hooks](#available-hooks)
2. [Hook Usage Patterns](#hook-usage-patterns)
3. [Migration Guide](#migration-guide)
4. [Best Practices](#best-practices)
5. [Hook Reference](#hook-reference)

---

## Available Hooks

### ✅ Course Management Hooks
- `useCourseState` - Course detail and enrollment state
- `useCourseOverview` - Course enrollment, unenrollment, deletion, notes
- `useCourseNotes` - Note CRUD operations
- `useCourseVideoTutorial` - Progress tracking for video content
- `useCourseQuiz` - Quiz operations (fetch, submit, clear results)
- `useCourseRoomMembers` - Member management for course rooms
- `useCourseBuilder` - Course builder operations

### ✅ User & Account Hooks
- `useMyAccount` - User profile updates
- `useNotifications` - Notification management
- `useOrders` - Order management and invoices

### ✅ Dashboard & Learning Hooks
- `useDashboard` - Dashboard data (enrolled & completed courses)
- `useMyCourses` - User's enrolled courses with search/filter
- `useStudyGroups` - Study group management

### ✅ Utility Hooks
- `use-toast` - Toast notifications
- `use-mobile` - Responsive design helper

---

## Hook Usage Patterns

### Basic Pattern

```javascript
import { useCourseOverview } from '@/hooks/useCourseOverview';

function MyComponent() {
  const { courseId } = useParams();
  const { userDetail } = useAuthStore();
  
  const {
    // State
    notes,
    loading,
    enrollmentLoading,
    error,
    
    // Actions
    fetchNotes,
    enrollInCourse,
    unenrollFromCourse,
    deleteCourse,
    
    // Computed
    hasNotes,
    isLoading,
  } = useCourseOverview(courseId, userDetail?.userId);
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  return (
    <div>
      {loading ? <Spinner /> : <NotesList notes={notes} />}
      <Button onClick={enrollInCourse} disabled={enrollmentLoading}>
        Enroll
      </Button>
    </div>
  );
}
```

### Advanced Pattern with Multiple Hooks

```javascript
import { useCourseState } from '@/hooks/useCourseState';
import { useCourseNotes } from '@/hooks/useCourseNotes';
import { useCourseVideoTutorial } from '@/hooks/useCourseVideoTutorial';

function CourseDetail() {
  const { courseId } = useParams();
  const { userDetail } = useAuthStore();
  
  // Multiple hooks for different concerns
  const courseState = useCourseState(courseId);
  const courseNotes = useCourseNotes(courseId, userDetail?.userId);
  const videoProgress = useCourseVideoTutorial(courseId, userDetail?.userId);
  
  useEffect(() => {
    courseState.actions.fetchCourseDetail();
    courseNotes.fetchCourseNotes();
    videoProgress.fetchUserProgress();
  }, [courseId]);
  
  const handleMarkComplete = async (contentId) => {
    await videoProgress.markAsCompleted(contentId);
    await courseState.actions.fetchUserCourseContentProgress(userDetail.userId);
  };
  
  return (
    <div>
      <CourseHeader course={courseState.course} />
      <ProgressBar progress={courseState.progress} />
      <VideoPlayer onComplete={handleMarkComplete} />
      <NotesSection notes={courseNotes.courseNotes} />
    </div>
  );
}
```

---

## Migration Guide

### Step-by-Step Migration Process

#### Step 1: Identify Direct API Calls

Before:
```javascript
// Old component with direct API calls
function CourseOverview() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchNotes = () => {
    setLoading(true);
    axiosConn.post(API_URL + "/searchCourse", { ... })
      .then(res => {
        setNotes(res.data.data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };
  
  // More API calls...
}
```

#### Step 2: Import and Use Hook

After:
```javascript
import { useCourseOverview } from '@/hooks/useCourseOverview';

function CourseOverview() {
  const { courseId } = useParams();
  const { userDetail } = useAuthStore();
  
  const {
    notes,
    loading,
    fetchNotes,
  } = useCourseOverview(courseId, userDetail?.userId);
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  // Component logic...
}
```

#### Step 3: Update Event Handlers

Before:
```javascript
const handleEnroll = async () => {
  setEnrollmentLoading(true);
  try {
    const response = await axiosConn.post(API_URL + "/userCourseEnrollment", {
      courseId: CourseId
    });
    if (response.data.status === 200) {
      toast({ title: "Success", description: "Enrolled successfully" });
      window.location.reload();
    }
  } catch (error) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  } finally {
    setEnrollmentLoading(false);
  }
};
```

After:
```javascript
const { enrollInCourse, enrollmentLoading } = useCourseOverview(courseId, userId);

const handleEnroll = async () => {
  const result = await enrollInCourse();
  if (result.success) {
    // Optionally refresh or navigate
    navigate('/my-courses');
  }
};
```

#### Step 4: Remove Redundant State

Remove these lines:
```javascript
// ❌ Remove - now handled by hook
const [notes, setNotes] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

---

## Best Practices

### 1. **Always Handle Loading States**

```javascript
const { loading, data, fetchData } = useMyHook();

if (loading) return <Spinner />;
if (!data) return <EmptyState />;
return <DataView data={data} />;
```

### 2. **Handle Errors Gracefully**

```javascript
const { error, fetchData } = useMyHook();

useEffect(() => {
  fetchData();
}, [fetchData]);

if (error) {
  return <ErrorMessage message={error} onRetry={fetchData} />;
}
```

### 3. **Use Computed Values**

```javascript
const { 
  hasNotes,      // ✅ Use computed boolean
  notesCount,    // ✅ Use computed count
  courseNotes    // Raw data
} = useCourseNotes(courseId, userId);

// Don't: courseNotes.length > 0
// Do: hasNotes
```

### 4. **Avoid Unnecessary Re-renders**

```javascript
// ✅ Good: Destructure only what you need
const { fetchNotes, loading } = useCourseNotes(courseId, userId);

// ❌ Bad: Taking the entire hook object
const notesHook = useCourseNotes(courseId, userId);
```

### 5. **Combine Related Operations**

```javascript
const handleSaveAndRefresh = async (noteData) => {
  const result = await saveNote(noteData);
  if (result.success) {
    await refreshNotes(); // Hook provides this
  }
};
```

### 6. **Use Optional Chaining**

```javascript
const { userDetail } = useAuthStore();
const hook = useCourseOverview(courseId, userDetail?.userId); // ✅
```

---

## Hook Reference

### useCourseOverview

**Purpose**: Manage course enrollment, deletion, and notes overview

**Parameters:**
- `courseId` (string) - The course ID
- `userId` (string) - The current user ID

**Returns:**
```typescript
{
  // State
  notes: Array,
  notesLoading: boolean,
  enrollmentLoading: boolean,
  unenrollLoading: boolean,
  deleteCourseLoading: boolean,
  error: string | null,
  
  // Actions
  fetchNotes: () => Promise<Array>,
  enrollInCourse: () => Promise<{success: boolean, data?: any, error?: string}>,
  unenrollFromCourse: () => Promise<{success: boolean}>,
  deleteCourse: () => Promise<{success: boolean}>,
  refreshNotes: () => Promise<Array>,
  
  // Computed
  hasNotes: boolean,
  isLoading: boolean
}
```

**Example:**
```javascript
const {
  enrollInCourse,
  enrollmentLoading,
  unenrollFromCourse,
} = useCourseOverview(courseId, userId);

const handleEnroll = async () => {
  const result = await enrollInCourse();
  if (result.success) {
    navigate(`/course/${courseId}`);
  }
};
```

---

### useCourseNotes

**Purpose**: CRUD operations for course notes

**Parameters:**
- `courseId` (string) - The course ID
- `userId` (string) - The current user ID

**Returns:**
```typescript
{
  // State
  courseNotes: Array,
  loading: boolean,
  savingNote: boolean,
  deletingNote: boolean,
  error: string | null,
  
  // Actions
  fetchCourseNotes: () => Promise<Array>,
  saveNote: (noteData) => Promise<{success: boolean}>,
  deleteNote: (notesId) => Promise<{success: boolean}>,
  updateNote: (notesId, noteContent) => Promise<{success: boolean}>,
  createNote: (noteData) => Promise<{success: boolean}>,
  refreshNotes: () => Promise<Array>,
  
  // Computed
  hasNotes: boolean,
  notesCount: number,
  isProcessing: boolean
}
```

**Example:**
```javascript
const {
  courseNotes,
  createNote,
  deleteNote,
  updateNote,
  loading,
} = useCourseNotes(courseId, userId);

const handleCreateNote = async (content) => {
  const result = await createNote({
    courseContentId: contentId,
    noteContent: content,
    noteRefTimestamp: currentTime,
  });
  
  if (result.success) {
    // Note created and list refreshed automatically
  }
};
```

---

### useCourseVideoTutorial

**Purpose**: Track user progress for video content

**Parameters:**
- `courseId` (string) - The course ID
- `userId` (string) - The current user ID

**Returns:**
```typescript
{
  // State
  userProgress: Array,
  loading: boolean,
  savingProgress: boolean,
  deletingProgress: boolean,
  error: string | null,
  
  // Actions
  fetchUserProgress: (courseContentId?) => Promise<Array>,
  saveProgress: (progressData) => Promise<{success: boolean}>,
  markAsCompleted: (courseContentId, watchTime?) => Promise<{success: boolean}>,
  markAsInProgress: (courseContentId, watchTime?) => Promise<{success: boolean}>,
  resetProgress: (courseContentId) => Promise<{success: boolean}>,
  refreshProgress: () => Promise<Array>,
  
  // Utilities
  isContentCompleted: (courseContentId) => boolean,
  getContentProgress: (courseContentId) => Object | null,
  calculateProgressPercentage: (totalContent) => number,
  
  // Computed
  hasProgress: boolean,
  completedCount: number,
  isProcessing: boolean
}
```

**Example:**
```javascript
const {
  markAsCompleted,
  isContentCompleted,
  calculateProgressPercentage,
  fetchUserProgress,
} = useCourseVideoTutorial(courseId, userId);

useEffect(() => {
  fetchUserProgress();
}, [fetchUserProgress]);

const handleVideoComplete = async (contentId, watchTime) => {
  await markAsCompleted(contentId, watchTime);
};

const progress = calculateProgressPercentage(totalContentCount);
```

---

### useCourseQuiz

**Purpose**: Quiz operations including submission and result management

**Parameters:**
- `courseId` (string) - The course ID
- `userId` (string) - The current user ID

**Returns:**
```typescript
{
  // State
  quiz: Object | null,
  questions: Array,
  quizResults: Object | null,
  loading: boolean,
  submitting: boolean,
  clearing: boolean,
  error: string | null,
  
  // Actions
  fetchQuiz: (quizId) => Promise<Object>,
  fetchQuizQuestions: (quizId) => Promise<Array>,
  fetchQuizResults: (quizId) => Promise<Object>,
  submitQuiz: (submissionData) => Promise<{success: boolean}>,
  clearQuizResults: (quizId) => Promise<{success: boolean}>,
  loadCompleteQuiz: (quizId) => Promise<Object>,
  
  // Utilities
  calculateScorePercentage: (score, total) => number,
  isQuizPassed: (score, total, passingScore?) => boolean,
  
  // Computed
  hasResults: boolean,
  hasQuestions: boolean,
  questionCount: number,
  isProcessing: boolean
}
```

**Example:**
```javascript
const {
  quiz,
  questions,
  submitQuiz,
  loadCompleteQuiz,
  isQuizPassed,
} = useCourseQuiz(courseId, userId);

useEffect(() => {
  loadCompleteQuiz(quizId);
}, [quizId]);

const handleSubmit = async (answers) => {
  const result = await submitQuiz({
    quizId,
    courseContentId,
    answers,
    timeTaken: elapsed,
  });
  
  if (result.success) {
    const passed = isQuizPassed(result.data.score, result.data.totalQuestions);
    if (passed) {
      toast({ title: "Congratulations!", description: "You passed!" });
    }
  }
};
```

---

### useNotifications

**Purpose**: Notification management and course invite handling

**Parameters:**
- `userId` (string) - The current user ID

**Returns:**
```typescript
{
  // State
  notifications: Array,
  totalCount: number,
  limit: number,
  offset: number,
  loading: boolean,
  archiving: boolean,
  processing: boolean,
  error: string | null,
  
  // Actions
  fetchNotifications: (options?) => Promise<Object>,
  archiveNotification: (notificationId) => Promise<{success: boolean}>,
  archiveMultipleNotifications: (notificationIds) => Promise<{success: boolean}>,
  acceptCourseInvite: (inviteId) => Promise<{success: boolean}>,
  declineCourseInvite: (inviteId) => Promise<{success: boolean}>,
  nextPage: () => void,
  previousPage: () => void,
  refreshNotifications: () => Promise<Object>,
  archiveAll: () => Promise<{success: boolean}>,
  
  // Computed
  hasNotifications: boolean,
  notificationCount: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  currentPage: number,
  totalPages: number,
  isProcessing: boolean
}
```

**Example:**
```javascript
const {
  notifications,
  acceptCourseInvite,
  archiveNotification,
  fetchNotifications,
  nextPage,
  previousPage,
} = useNotifications(userId);

useEffect(() => {
  fetchNotifications();
}, [fetchNotifications]);

const handleAcceptInvite = async (notif) => {
  const result = await acceptCourseInvite(notif.inviteId);
  if (result.success) {
    navigate(`/course/${notif.courseId}`);
  }
};
```

---

### useDashboard

**Purpose**: Dashboard data management for enrolled and completed courses

**Parameters:**
- `userId` (string) - The current user ID

**Returns:**
```typescript
{
  // State
  enrolledCourses: Array,
  completedCourses: Array,
  totalCount: number,
  completedTotalCount: number,
  limit: number,
  offset: number,
  loadingEnrolled: boolean,
  loadingCompleted: boolean,
  error: string | null,
  
  // Actions
  fetchEnrolledCourses: (options?) => Promise<Array>,
  fetchCompletedCourses: (options?) => Promise<Array>,
  fetchDashboardData: () => Promise<void>,
  nextPage: () => void,
  previousPage: () => void,
  refreshDashboard: () => Promise<void>,
  calculateProgress: (course) => number,
  
  // Computed
  getAnalytics: () => Object,
  hasEnrolledCourses: boolean,
  hasCompletedCourses: boolean,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  isLoading: boolean
}
```

**Example:**
```javascript
const {
  enrolledCourses,
  completedCourses,
  fetchDashboardData,
  getAnalytics,
  isLoading,
} = useDashboard(userId);

useEffect(() => {
  fetchDashboardData();
}, [fetchDashboardData]);

const analytics = getAnalytics();
// { totalEnrolled, totalCompleted, inProgress, notStarted, totalCourses }
```

---

### useMyCourses

**Purpose**: Manage user's enrolled courses with search, filter, and pagination

**Parameters:**
- `userId` (string) - The current user ID

**Returns:**
```typescript
{
  // State
  courses: Array,
  totalCount: number,
  limit: number,
  offset: number,
  loading: boolean,
  error: string | null,
  searchQuery: string,
  sortBy: string,
  filterBy: string,
  
  // Actions
  fetchCourses: (options?) => Promise<Array>,
  searchCourses: (query) => void,
  changeSortOrder: (sortOption) => void,
  applyFilter: (filterOption) => void,
  nextPage: () => void,
  previousPage: () => void,
  refreshCourses: () => Promise<Array>,
  
  // Computed
  filteredCourses: Array,
  stats: Object,
  hasCourses: boolean,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  currentPage: number,
  totalPages: number
}
```

**Example:**
```javascript
const {
  courses,
  searchCourses,
  changeSortOrder,
  applyFilter,
  stats,
  loading,
} = useMyCourses(userId);

const handleSearch = (query) => {
  searchCourses(query);
};

const handleSort = (option) => {
  changeSortOrder(option); // 'recent', 'title', 'progress'
};
```

---

## Common Patterns

### 1. Form Submission

```javascript
const { createNote, savingNote } = useCourseNotes(courseId, userId);
const [formData, setFormData] = useState({ content: '' });

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await createNote({
    noteContent: formData.content,
    courseContentId: currentContentId,
  });
  
  if (result.success) {
    setFormData({ content: '' }); // Reset form
  }
};

return (
  <form onSubmit={handleSubmit}>
    <textarea 
      value={formData.content}
      onChange={(e) => setFormData({ content: e.target.value })}
    />
    <button disabled={savingNote}>
      {savingNote ? 'Saving...' : 'Save Note'}
    </button>
  </form>
);
```

### 2. Confirmation Dialogs

```javascript
const { deleteCourse, deleteCourseLoading } = useCourseOverview(courseId, userId);
const [confirmText, setConfirmText] = useState('');

const handleDelete = async () => {
  if (confirmText !== courseTitle) return;
  
  const result = await deleteCourse();
  if (result.success) {
    navigate('/my-courses');
  }
};
```

### 3. Pagination

```javascript
const {
  courses,
  nextPage,
  previousPage,
  hasNextPage,
  hasPreviousPage,
  currentPage,
  totalPages,
} = useMyCourses(userId);

return (
  <div>
    <CourseList courses={courses} />
    <Pagination>
      <Button onClick={previousPage} disabled={!hasPreviousPage}>
        Previous
      </Button>
      <span>Page {currentPage} of {totalPages}</span>
      <Button onClick={nextPage} disabled={!hasNextPage}>
        Next
      </Button>
    </Pagination>
  </div>
);
```

### 4. Real-time Updates

```javascript
const { refreshNotes } = useCourseNotes(courseId, userId);

// Refresh every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    refreshNotes();
  }, 30000);
  
  return () => clearInterval(interval);
}, [refreshNotes]);
```

### 5. Conditional Rendering

```javascript
const {
  courseNotes,
  loading,
  error,
  hasNotes,
} = useCourseNotes(courseId, userId);

if (loading) return <LoadingSkeleton />;
if (error) return <ErrorState error={error} />;
if (!hasNotes) return <EmptyState />;
return <NotesList notes={courseNotes} />;
```

---

## Testing Hooks

### Unit Testing Example

```javascript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCourseNotes } from '@/hooks/useCourseNotes';

describe('useCourseNotes', () => {
  it('should fetch notes successfully', async () => {
    const { result } = renderHook(() => 
      useCourseNotes('course-123', 'user-456')
    );
    
    expect(result.current.loading).toBe(false);
    
    await act(async () => {
      await result.current.fetchCourseNotes();
    });
    
    await waitFor(() => {
      expect(result.current.courseNotes).toBeDefined();
      expect(result.current.loading).toBe(false);
    });
  });
});
```

---

## Troubleshooting

### Hook returns stale data
```javascript
// ✅ Ensure dependencies are correct
const hook = useCourseOverview(courseId, userId);

useEffect(() => {
  hook.fetchNotes();
}, [courseId, userId]); // Add dependencies
```

### Infinite re-render loop
```javascript
// ❌ Don't call hook actions directly in render
return <div>{fetchNotes()}</div>; // Bad!

// ✅ Use useEffect
useEffect(() => {
  fetchNotes();
}, [fetchNotes]);
```

### Hook not updating after action
```javascript
// Most hooks auto-refresh after mutations
const result = await deleteNote(noteId);
// Notes list automatically refreshed!
```

---

## Summary

**Key Takeaways:**

1. ✅ **One Hook per Component** - Each major component has its own dedicated hook
2. ✅ **Consistent API** - All hooks follow the same pattern: state, actions, computed
3. ✅ **Error Handling** - Built-in error handling with toast notifications
4. ✅ **Loading States** - Granular loading states for better UX
5. ✅ **Auto-refresh** - Most mutations automatically refresh data
6. ✅ **Type-safe** - Ready for TypeScript migration
7. ✅ **Testable** - Hooks can be tested independently

**Next Steps:**

1. Start migrating components one by one
2. Test each migration thoroughly
3. Remove old API call code
4. Update documentation as needed
5. Consider adding TypeScript types

For questions or issues, refer to the specific hook implementation or create an issue in the repository.
