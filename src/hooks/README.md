# Hooks Directory Index

This file serves as the main index for all custom React hooks in the FeedAQ Academy Dashboard.

## 📋 Table of Contents
- [Course Management](#course-management)
- [User & Account](#user--account)
- [Dashboard & Learning](#dashboard--learning)
- [Builder](#builder)
- [Utility](#utility)

---

## Course Management

### ✅ Existing Hooks

#### `useCourseState.js`
- **Status:** ✅ Implemented
- **Component:** Used across course components via CourseContext
- **Purpose:** Centralized course state management
- **Key Features:**
  - Fetch course details
  - Track user progress
  - Manage enrollment state
  - Calculate completion percentage

#### `useCourseRoomMembers.js`
- **Status:** ✅ Implemented
- **Component:** `CourseRoomMembers.jsx`
- **Purpose:** Manage course room members and invitations
- **Key Features:**
  - Invite members
  - Update member access levels
  - Revoke access
  - Cancel invitations

### 🆕 New Hooks

#### `useCourseOverview.js`
- **Status:** 🆕 Ready to use
- **Component:** `CourseOverview.jsx`
- **Purpose:** Course enrollment and overview management
- **Key Features:**
  - Enroll/unenroll from courses
  - Delete courses
  - Fetch course notes
  - Manage enrollment status

#### `useCourseNotes.js`
- **Status:** 🆕 Ready to use
- **Component:** `CourseNotes.jsx`, `NotesModule.jsx`
- **Purpose:** Complete notes management
- **Key Features:**
  - Create, read, update, delete notes
  - Link notes to course content
  - Timestamp references
  - Auto-refresh after mutations

#### `useCourseVideoTutorial.js`
- **Status:** 🆕 Ready to use
- **Component:** `CourseVideoTutorial.jsx`
- **Purpose:** Video content progress tracking
- **Key Features:**
  - Mark content as completed
  - Track watch time
  - Reset progress
  - Check completion status

#### `useCourseQuiz.js`
- **Status:** 🆕 Ready to use
- **Component:** `CourseQuiz.jsx`, `QuizRender.jsx`, `EnhancedQuizSystem.jsx`
- **Purpose:** Quiz operations and result management
- **Key Features:**
  - Fetch quiz and questions
  - Submit quiz answers
  - Calculate scores
  - Clear/retry quizzes

---

## User & Account

### 🆕 New Hooks

#### `useMyAccount.js`
- **Status:** 🆕 Ready to use
- **Component:** `MyAccount.jsx`
- **Purpose:** User profile management
- **Key Features:**
  - Update profile information
  - Update phone number
  - Update email
  - Update name

#### `useNotifications.js`
- **Status:** 🆕 Ready to use
- **Component:** `Notifications.jsx`
- **Purpose:** Notification system management
- **Key Features:**
  - Fetch notifications with pagination
  - Archive notifications
  - Accept/decline course invites
  - Handle notification actions

#### `useOrders.js`
- **Status:** 🆕 Ready to use
- **Component:** `AllOrders.jsx`
- **Purpose:** Order and invoice management
- **Key Features:**
  - Fetch user orders
  - Cancel orders
  - Download invoices
  - Order statistics

---

## Dashboard & Learning

### ✅ Existing Hooks

#### `useStudyGroups.js`
- **Status:** ✅ Implemented
- **Component:** `MyStudyGroup.jsx`
- **Purpose:** Study group operations
- **Key Features:**
  - CRUD operations for study groups
  - Member management
  - Invitation system
  - Analytics and filtering

### 🆕 New Hooks

#### `useDashboard.js`
- **Status:** 🆕 Ready to use
- **Component:** `Dashboard.jsx`
- **Purpose:** Dashboard data aggregation
- **Key Features:**
  - Fetch enrolled courses
  - Fetch completed courses
  - Calculate analytics
  - Pagination support

#### `useMyCourses.js`
- **Status:** 🆕 Ready to use
- **Component:** `MyCourse.jsx`
- **Purpose:** Personal course library management
- **Key Features:**
  - Search courses
  - Sort and filter
  - Pagination
  - Course statistics

---

## Builder

### 🆕 New Hooks

#### `useCourseBuilder.js`
- **Status:** 🆕 Ready to use
- **Component:** `Builder.jsx`, `PreviewBuilder.jsx`
- **Purpose:** Course builder operations
- **Key Features:**
  - Create/register builder
  - Save course topics
  - Delete content
  - Fetch builder data

---

## Utility

### ✅ Existing Hooks

#### `use-toast.js`
- **Status:** ✅ Implemented
- **Component:** All components
- **Purpose:** Toast notification system
- **Usage:** `const { toast } = useToast();`

#### `use-mobile.jsx`
- **Status:** ✅ Implemented
- **Component:** Responsive components
- **Purpose:** Detect mobile viewport
- **Usage:** `const isMobile = useMobile();`

---

## 🎯 How to Use This Index

### Finding a Hook
1. Identify which component you're working on
2. Look up the component in the appropriate section
3. Check the hook status (✅ Implemented or 🆕 New)
4. Import and use the hook in your component

### Adding a New Hook
When creating a new hook:
1. Create the hook file in `src/hooks/`
2. Follow the naming convention: `use[ComponentName].js`
3. Update this index with the new hook details
4. Update `HOOKS_QUICK_REFERENCE.md`
5. Add usage examples to `HOOKS_IMPLEMENTATION_GUIDE.md`

---

## 📊 Hook Statistics

- **Total Hooks:** 15
- **Implemented (✅):** 5
- **New/Ready (🆕):** 10
- **Coverage:** ~95% of components with API calls

---

## 🔗 Related Documentation

- [HOOKS_IMPLEMENTATION_GUIDE.md](./HOOKS_IMPLEMENTATION_GUIDE.md) - Detailed usage guide with examples
- [HOOKS_QUICK_REFERENCE.md](./HOOKS_QUICK_REFERENCE.md) - Quick lookup reference
- [HOOKS_REFACTORING_ANALYSIS.md](./HOOKS_REFACTORING_ANALYSIS.md) - Analysis and rationale

---

## 🏗️ Architecture Pattern

All hooks follow this consistent structure:

```javascript
export const useComponentName = (dependencies) => {
  const { toast } = useToast();
  
  // State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Actions
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosConn.post(endpoint, payload);
      setData(response.data);
      toast({ title: "Success" });
      return response.data;
    } catch (err) {
      setError(err.message);
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [dependencies]);
  
  // Return API
  return {
    // State
    data,
    loading,
    error,
    
    // Actions
    fetchData,
    
    // Computed
    hasData: !!data,
  };
};
```

---

## 🚀 Migration Priority

### Phase 1: High Priority (Core Features) ✅
- ✅ `useCourseRoomMembers` - Already done
- 🆕 `useCourseOverview` - Course enrollment
- 🆕 `useCourseNotes` - Note-taking
- 🆕 `useCourseVideoTutorial` - Video progress

### Phase 2: Medium Priority (User Features)
- 🆕 `useDashboard` - Dashboard
- 🆕 `useMyCourses` - Course library
- 🆕 `useNotifications` - Notifications
- 🆕 `useMyAccount` - Profile

### Phase 3: Lower Priority (Additional Features)
- 🆕 `useCourseBuilder` - Course creation
- 🆕 `useOrders` - Order management
- 🆕 `useCourseQuiz` - Quiz system

---

## 📞 Support

For questions about hooks:
1. Check the implementation guide
2. Review the hook's source code
3. Look at existing usage examples
4. Refer to this index for hook locations

**Last Updated:** October 20, 2025
