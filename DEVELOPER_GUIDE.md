# CourseRoomMembers - Developer Quick Reference

## 📁 File Locations

```
Main Component:
  src/components-xm/Course/CourseRoomMembers.jsx

Sub-Components:
  src/components-xm/Course/components/
    ├── MemberInviteSheet.jsx
    ├── MemberDetailsSheet.jsx
    ├── MemberUpdateSheet.jsx
    ├── MembersTable.jsx
    ├── InvitedMembersTable.jsx
    └── index.js (barrel export)

Custom Hook:
  src/hooks/useCourseRoomMembers.js

Utilities:
  src/utils/memberHelpers.js

Validation:
  src/utils/validationSchemas.js (inviteMembersSchema)

Service:
  src/services/courseRoomService.js
```

## 🔧 How to Use

### Basic Usage
```jsx
import CourseRoomMembers from '@/components-xm/Course/CourseRoomMembers';

<CourseRoomMembers />
```

### Using Individual Components
```jsx
import { 
  MemberInviteSheet, 
  MembersTable 
} from '@/components-xm/Course/components';

// Or
import { MemberInviteSheet } from '@/components-xm/Course/components/MemberInviteSheet';
```

### Using the Custom Hook
```jsx
import { useCourseRoomMembers } from '@/hooks/useCourseRoomMembers';

const {
  members,
  invitedMembers,
  isLoading,
  inviteMembers,
  updateMember,
  cancelInvite,
  refreshMembers,
  refreshInvitedMembers
} = useCourseRoomMembers(courseId, userId, organizationId);
```

### Using Helper Functions
```jsx
import {
  getMemberRoleDisplay,
  getMemberStatusDisplay,
  formatJoinDate,
  formatLastActive,
  getEmailCount,
  parseEmailAddresses
} from '@/utils/memberHelpers';

// Example
const roleInfo = getMemberRoleDisplay(member, courseOwnerId);
// Returns: { role, icon, color, priority }

const emails = parseEmailAddresses("user1@test.com; user2@test.com");
// Returns: ["user1@test.com", "user2@test.com"]
```

## 🎨 Component Props

### MemberInviteSheet
```jsx
<MemberInviteSheet
  open={boolean}
  onOpenChange={(open) => void}
  onInviteSubmit={async (data) => void}
  isCourseOwner={boolean}
/>
```

### MemberDetailsSheet
```jsx
<MemberDetailsSheet
  open={boolean}
  onOpenChange={(open) => void}
  member={object}
  courseOwnerId={string}
/>
```

### MemberUpdateSheet
```jsx
<MemberUpdateSheet
  open={boolean}
  onOpenChange={(open) => void}
  member={object}
  onUpdateSubmit={async (data, member) => void}
  isCourseOwner={boolean}
/>
```

### MembersTable
```jsx
<MembersTable
  members={array}
  courseOwnerId={string}
  isCourseOwner={boolean}
  isAdmin={boolean}
  onViewDetails={(member) => void}
  onUpdateMember={(member) => void}
/>
```

### InvitedMembersTable
```jsx
<InvitedMembersTable
  invitedMembers={array}
  isCourseOwner={boolean}
  isAdmin={boolean}
  onViewDetails={(member) => void}
  onCancelInvite={(member) => void}
/>
```

## 📊 Data Structures

### Member Object
```javascript
{
  user: {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string,
    nameInitial: string,
    phone?: string,
    location?: string,
    organization?: string
  },
  accessLevel: "SHARED" | "ADMIN",
  status: "ACTIVE" | "PENDING" | "INACTIVE",
  enableCourseTracking: boolean,
  v_created_date: string,
  lastActiveDate?: string,
  isOnline?: boolean
}
```

### Invited Member Object
```javascript
{
  inviteeEmail: string,
  accessLevel: "SHARED" | "ADMIN",
  inviteStatus: "PENDING" | "ACCEPTED" | "EXPIRED",
  expiredAt: string,
  v_created_date: string
}
```

### Invite Form Data
```javascript
{
  emailAddresses: string, // semicolon-separated
  accessType: "SHARED" | "ADMIN",
  enableCourseTracking: boolean
}
```

## 🔍 Common Tasks

### Add a New Field to Member Details
1. Update the backend API response
2. Add field to member object type
3. Update `MemberDetailsSheet.jsx` to display the field
4. Update `MembersTable.jsx` if needed for table display

### Add a New Permission Level
1. Update backend constants
2. Add to validation schema in `validationSchemas.js`
3. Update `getMemberRoleDisplay()` in `memberHelpers.js`
4. Update select options in `MemberInviteSheet.jsx` and `MemberUpdateSheet.jsx`

### Change Table Columns
1. Edit `MembersTable.jsx` or `InvitedMembersTable.jsx`
2. Update `TableHeader` and `TableRow` components
3. Ensure responsive classes are maintained

### Add Toast Notification
```javascript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success",
  description: "Operation completed successfully",
});

// Error toast
toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});
```

## 🐛 Debugging Tips

### Enable Debug Logging
The `useCourseRoomMembers` hook includes console.log statements:
```javascript
console.log("=== INVITE DEBUG INFO ===");
console.log("Form data:", data);
console.log("Course ID:", courseId);
```

### Check Props Flow
Use React DevTools to inspect:
- Component hierarchy
- Props being passed
- State updates

### Common Issues

**Issue**: Members not loading
```javascript
// Check:
1. courseId is valid
2. User is authenticated (userId exists)
3. API endpoint is responding
4. Check browser console for errors
```

**Issue**: Form validation not working
```javascript
// Check:
1. Zod schema is imported correctly
2. Form resolver is set up properly
3. Field names match schema
```

**Issue**: Permissions not working
```javascript
// Check:
1. isCourseOwner calculation
2. isAdmin calculation
3. User data from useAuthStore
4. Course data from useCourse
```

## 🧪 Testing

### Unit Test Example (Helper Function)
```javascript
import { parseEmailAddresses } from '@/utils/memberHelpers';

describe('parseEmailAddresses', () => {
  it('should parse semicolon-separated emails', () => {
    const input = 'user1@test.com; user2@test.com';
    const result = parseEmailAddresses(input);
    expect(result).toEqual(['user1@test.com', 'user2@test.com']);
  });
});
```

### Component Test Example
```javascript
import { render, screen } from '@testing-library/react';
import { MembersTable } from './MembersTable';

describe('MembersTable', () => {
  it('should render member rows', () => {
    const members = [/* mock data */];
    render(
      <MembersTable
        members={members}
        courseOwnerId="123"
        isCourseOwner={true}
        isAdmin={false}
        onViewDetails={jest.fn()}
        onUpdateMember={jest.fn()}
      />
    );
    expect(screen.getByText('Member')).toBeInTheDocument();
  });
});
```

## 🚀 Performance Tips

### Memoize Components
```javascript
import { memo } from 'react';

export const MembersTable = memo(function MembersTable(props) {
  // component code
});
```

### Optimize Re-renders
```javascript
// Use useCallback for event handlers
const handleViewDetails = useCallback((member) => {
  setSelectedMember(member);
  setDetailsOpen(true);
}, []);

// Use useMemo for computed values
const sortedMembers = useMemo(() => {
  return members.sort((a, b) => /* sorting logic */);
}, [members]);
```

### Lazy Load Sheets
```javascript
import { lazy, Suspense } from 'react';

const MemberDetailsSheet = lazy(() => 
  import('./components/MemberDetailsSheet')
);

// Usage
<Suspense fallback={<div>Loading...</div>}>
  <MemberDetailsSheet {...props} />
</Suspense>
```

## 📝 Code Style

### Naming Conventions
- Components: PascalCase (`MemberInviteSheet`)
- Functions: camelCase (`handleInviteSubmit`)
- Constants: UPPER_SNAKE_CASE (`MEMBER_STATUS`)
- Props: camelCase (`onViewDetails`)

### File Organization
```javascript
// 1. Imports (external libraries first)
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Imports (internal modules)
import { useCourseRoomMembers } from '@/hooks/useCourseRoomMembers';

// 3. Component definition
export function ComponentName() {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Event handlers
  const handleEvent = () => {};
  
  // 3.3 Render
  return (/* JSX */);
}
```

### JSX Style
- Use fragment `<>` when no wrapper needed
- Spread props when passing many props
- Use ternary for simple conditionals
- Use && for conditional rendering
- Keep JSX expressions simple

## 🔗 Related Files

When modifying this component, you may also need to update:
- Backend API: `src/controller/Organization.controller.js`
- Entity definitions: `src/entity/CourseUserInvites.entity.js`
- Service layer: `src/services/courseRoomService.js`
- Routes: `src/routes/...`

## 📚 Additional Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
