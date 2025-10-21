# Hooks Quick Reference

Quick reference guide for all custom hooks in the FeedAQ Academy Dashboard.

## 📚 Course Hooks

### `useCourseOverview(courseId, userId)`
**Purpose:** Course enrollment, deletion, notes overview  
**Key Actions:** `enrollInCourse()`, `unenrollFromCourse()`, `deleteCourse()`, `fetchNotes()`  
**Used In:** `CourseOverview.jsx`

### `useCourseNotes(courseId, userId)`
**Purpose:** CRUD operations for course notes  
**Key Actions:** `createNote()`, `updateNote()`, `deleteNote()`, `fetchCourseNotes()`  
**Used In:** `CourseNotes.jsx`, `NotesModule.jsx`

### `useCourseVideoTutorial(courseId, userId)`
**Purpose:** Track video progress  
**Key Actions:** `markAsCompleted()`, `markAsInProgress()`, `resetProgress()`  
**Used In:** `CourseVideoTutorial.jsx`

### `useCourseQuiz(courseId, userId)`
**Purpose:** Quiz operations  
**Key Actions:** `submitQuiz()`, `fetchQuizQuestions()`, `clearQuizResults()`  
**Used In:** `CourseQuiz.jsx`, `QuizRender.jsx`, `EnhancedQuizSystem.jsx`

### `useCourseRoomMembers(courseId, userId, organizationId)` ✅
**Purpose:** Member management  
**Key Actions:** `inviteMembers()`, `updateMember()`, `revokeAccess()`, `cancelInvite()`  
**Used In:** `CourseRoomMembers.jsx`

### `useCourseState(courseId)` ✅
**Purpose:** Course detail and enrollment state  
**Key Actions:** `fetchCourseDetail()`, `fetchUserCourseContentProgress()`, `fetchUserCourseEnrollment()`  
**Used In:** Multiple course components via `CourseContext`

## 🏗️ Builder Hooks

### `useCourseBuilder(courseBuilderId)`
**Purpose:** Course builder operations  
**Key Actions:** `registerBuilder()`, `saveTopic()`, `deleteContent()`, `fetchBuilder()`  
**Used In:** `Builder.jsx`, `PreviewBuilder.jsx`

## 👤 User & Account Hooks

### `useMyAccount(userDetail)`
**Purpose:** User profile updates  
**Key Actions:** `updateProfile()`, `updatePhoneNumber()`, `updateEmail()`, `updateName()`  
**Used In:** `MyAccount.jsx`

### `useNotifications(userId)`
**Purpose:** Notification management  
**Key Actions:** `fetchNotifications()`, `acceptCourseInvite()`, `declineCourseInvite()`, `archiveNotification()`  
**Used In:** `Notifications.jsx`

### `useOrders(userId)`
**Purpose:** Order management  
**Key Actions:** `fetchOrders()`, `cancelOrder()`, `downloadInvoice()`  
**Used In:** `AllOrders.jsx`

## 📊 Dashboard Hooks

### `useDashboard(userId)`
**Purpose:** Dashboard data (enrolled & completed courses)  
**Key Actions:** `fetchEnrolledCourses()`, `fetchCompletedCourses()`, `fetchDashboardData()`  
**Computed:** `getAnalytics()`  
**Used In:** `Dashboard.jsx`

### `useMyCourses(userId)`
**Purpose:** Enrolled courses with search/filter  
**Key Actions:** `searchCourses()`, `changeSortOrder()`, `applyFilter()`, `fetchCourses()`  
**Computed:** `filteredCourses`, `stats`  
**Used In:** `MyCourse.jsx`

### `useStudyGroups()` ✅
**Purpose:** Study group management  
**Key Actions:** `fetchStudyGroups()`, `createStudyGroup()`, `updateStudyGroup()`, `deleteStudyGroup()`  
**Used In:** `MyStudyGroup.jsx`

## 🛠️ Utility Hooks

### `use-toast()` ✅
**Purpose:** Toast notifications  
**Key:** `toast({ title, description, variant })`  
**Used In:** All components

### `use-mobile()` ✅
**Purpose:** Responsive design  
**Returns:** `isMobile: boolean`  
**Used In:** Multiple components

---

## 🎯 Common Patterns

### 1. Basic Usage
```javascript
const { data, loading, fetchData } = useMyHook(id);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

### 2. Form Submission
```javascript
const { saveData, saving } = useMyHook(id);

const handleSubmit = async (formData) => {
  const result = await saveData(formData);
  if (result.success) {
    // Handle success
  }
};
```

### 3. Conditional Rendering
```javascript
const { data, loading, error, hasData } = useMyHook(id);

if (loading) return <Spinner />;
if (error) return <Error message={error} />;
if (!hasData) return <EmptyState />;
return <DataView data={data} />;
```

### 4. Pagination
```javascript
const { 
  data,
  nextPage,
  previousPage,
  hasNextPage,
  hasPreviousPage,
  currentPage,
  totalPages
} = useMyHook(id);
```

---

## ✅ Hook Status Legend

- ✅ **Implemented and In Use** - Already integrated in codebase
- 🆕 **Newly Created** - Ready to use, needs migration
- 📝 **To Be Created** - Not yet implemented

## 📁 File Locations

All hooks are located in: `src/hooks/`

```
src/hooks/
├── use-mobile.jsx ✅
├── use-toast.js ✅
├── useCourseState.js ✅
├── useCourseRoomMembers.js ✅
├── useStudyGroups.js ✅
├── useCourseOverview.js 🆕
├── useCourseNotes.js 🆕
├── useCourseVideoTutorial.js 🆕
├── useCourseQuiz.js 🆕
├── useCourseBuilder.js 🆕
├── useNotifications.js 🆕
├── useMyAccount.js 🆕
├── useOrders.js 🆕
├── useDashboard.js 🆕
└── useMyCourses.js 🆕
```

## 🔍 Finding the Right Hook

| Component | Hook to Use |
|-----------|-------------|
| CourseOverview | `useCourseOverview` |
| CourseNotes | `useCourseNotes` |
| CourseVideoTutorial | `useCourseVideoTutorial` |
| CourseQuiz | `useCourseQuiz` |
| CourseRoomMembers | `useCourseRoomMembers` |
| Builder | `useCourseBuilder` |
| Dashboard | `useDashboard` |
| MyCourse | `useMyCourses` |
| MyAccount | `useMyAccount` |
| Notifications | `useNotifications` |
| AllOrders | `useOrders` |
| MyStudyGroup | `useStudyGroups` |

## 🚀 Quick Start

1. **Import the hook:**
   ```javascript
   import { useCourseNotes } from '@/hooks/useCourseNotes';
   ```

2. **Use in component:**
   ```javascript
   const { courseNotes, fetchCourseNotes, loading } = useCourseNotes(courseId, userId);
   ```

3. **Fetch data:**
   ```javascript
   useEffect(() => {
     fetchCourseNotes();
   }, [fetchCourseNotes]);
   ```

4. **Render:**
   ```javascript
   if (loading) return <Spinner />;
   return <NotesList notes={courseNotes} />;
   ```

## 📖 Full Documentation

For complete documentation, examples, and migration guide, see:
- [HOOKS_IMPLEMENTATION_GUIDE.md](./HOOKS_IMPLEMENTATION_GUIDE.md)
- [HOOKS_REFACTORING_ANALYSIS.md](./HOOKS_REFACTORING_ANALYSIS.md)
