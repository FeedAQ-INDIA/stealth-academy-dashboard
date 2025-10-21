# Component Architecture Diagram

## Component Hierarchy

```
CourseRoomMembers (Main Orchestrator)
│
├── Context & Hooks
│   ├── useCourse() - Course context
│   ├── useAuthStore() - Auth state
│   └── useCourseRoomMembers() - Custom hook
│       ├── fetchMembers()
│       ├── fetchInvitedMembers()
│       ├── inviteMembers()
│       ├── updateMember()
│       └── cancelInvite()
│
├── UI Components
│   │
│   ├── Header Card
│   │   ├── Title & Icon
│   │   ├── View Mode Dropdown
│   │   │   ├── Members View
│   │   │   └── Invited Users View
│   │   └── MemberInviteSheet
│   │       ├── Email Input (Textarea)
│   │       ├── Access Level Select
│   │       ├── Course Tracking Switch
│   │       └── Submit Button
│   │
│   ├── Content Area (Conditional)
│   │   │
│   │   ├── [If viewMode === "members"]
│   │   │   │
│   │   │   ├── MembersTable
│   │   │   │   ├── Table Header
│   │   │   │   └── Table Rows
│   │   │   │       ├── Avatar
│   │   │   │       ├── Member Name
│   │   │   │       ├── Role Badge
│   │   │   │       ├── Join Date
│   │   │   │       └── Actions
│   │   │   │           ├── View Button
│   │   │   │           └── Edit Button
│   │   │   │
│   │   │   └── [Or] Empty State
│   │   │
│   │   └── [If viewMode === "invited"]
│   │       │
│   │       ├── InvitedMembersTable
│   │       │   ├── Table Header
│   │       │   └── Table Rows
│   │       │       ├── Email
│   │       │       ├── Access Level
│   │       │       ├── Status
│   │       │       ├── Expiry Date
│   │       │       ├── Invited Date
│   │       │       └── Actions
│   │       │           ├── View Button
│   │       │           └── Cancel Invite Button
│   │       │               └── AlertDialog
│   │       │
│   │       └── [Or] Empty State
│   │
│   ├── MemberDetailsSheet (Modal)
│   │   ├── Member Profile
│   │   │   ├── Avatar
│   │   │   ├── Name
│   │   │   ├── Email
│   │   │   └── Role Badge
│   │   ├── Member Information
│   │   │   ├── Email
│   │   │   ├── Phone
│   │   │   ├── Location
│   │   │   └── Organization
│   │   └── Access Information
│   │       ├── Access Level
│   │       ├── Status
│   │       ├── Join Date
│   │       └── Last Active
│   │
│   └── MemberUpdateSheet (Modal)
│       ├── Member Info Display
│       │   ├── Avatar
│       │   ├── Name
│       │   └── Email
│       ├── Access Level Select
│       ├── Course Tracking Switch
│       └── Action Buttons
│           ├── Cancel Button
│           └── Update Button
│
└── Utilities & Helpers
    └── memberHelpers.js
        ├── getMemberRoleDisplay()
        ├── getMemberStatusDisplay()
        ├── formatJoinDate()
        ├── formatLastActive()
        ├── getEmailCount()
        └── parseEmailAddresses()
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    CourseRoomMembers                     │
│                    (Main Component)                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ├─── Gets course & user data from contexts
                            │    (useCourse, useAuthStore)
                            │
                            ├─── Initializes custom hook
                            │    useCourseRoomMembers(courseId, userId, orgId)
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│               useCourseRoomMembers Hook                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  State:                                           │  │
│  │  - members                                        │  │
│  │  - invitedMembers                                 │  │
│  │  - isLoading                                      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Operations:                                      │  │
│  │  - fetchMembers() ──────► courseRoomService      │  │
│  │  - fetchInvitedMembers() ► courseRoomService      │  │
│  │  - inviteMembers() ──────► courseRoomService      │  │
│  │  - updateMember() ───────► courseRoomService      │  │
│  │  - cancelInvite() ───────► courseRoomService      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ├─── Returns data & operations
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Component State & Handlers                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  UI State:                                        │  │
│  │  - viewMode (members/invited)                     │  │
│  │  - inviteSheetOpen                                │  │
│  │  - memberDetailsSheetOpen                         │  │
│  │  - memberUpdateSheetOpen                          │  │
│  │  - selectedMember                                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Handlers:                                        │  │
│  │  - handleViewMemberDetails(member)                │  │
│  │  - handleUpdateMember(member)                     │  │
│  │  - handleInviteSubmit(data)                       │  │
│  │  - handleMemberUpdate(data, member)               │  │
│  │  - handleCancelInvite(member)                     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ├─── Passes props to child components
                            │
            ┌───────────────┼───────────────┬────────────────┐
            │               │               │                │
            ▼               ▼               ▼                ▼
    ┌──────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
    │ MemberInvite │ │   Members   │ │   Invited   │ │MemberDetails │
    │    Sheet     │ │    Table    │ │ MembersTable│ │    Sheet     │
    └──────────────┘ └─────────────┘ └─────────────┘ └──────────────┘
            │               │               │                │
            └───────────────┴───────────────┴────────────────┘
                            │
                    Triggers callbacks
                            │
                            ▼
              Updates state & refreshes data
```

## Event Flow Examples

### 1. Inviting Members

```
User fills form ──► MemberInviteSheet
                           │
                           │ onInviteSubmit(data)
                           ▼
                  handleInviteSubmit()
                           │
                           │ inviteMembers(data)
                           ▼
              useCourseRoomMembers.inviteMembers()
                           │
                           │ API call
                           ▼
                   courseRoomService
                           │
                           │ Success/Error
                           ▼
                    Toast notification
                           │
                           ▼
              Refresh members & invites
                           │
                           ▼
                  Update UI with new data
```

### 2. Updating Member

```
User clicks Edit ──► MembersTable
                           │
                           │ onUpdateMember(member)
                           ▼
                 handleUpdateMember(member)
                           │
                           │ Set selectedMember
                           │ Open update sheet
                           ▼
               MemberUpdateSheet displays
                           │
                           │ User submits form
                           │ onUpdateSubmit(data, member)
                           ▼
              handleMemberUpdate(data, member)
                           │
                           │ updateMember(data, member)
                           ▼
            useCourseRoomMembers.updateMember()
                           │
                           │ API call
                           ▼
                   courseRoomService
                           │
                           │ Success/Error
                           ▼
                    Toast notification
                           │
                           ▼
                   Refresh members
                           │
                           ▼
          Update UI & close sheet
```

### 3. Viewing Member Details

```
User clicks View ──► MembersTable/InvitedMembersTable
                           │
                           │ onViewDetails(member)
                           ▼
              handleViewMemberDetails(member)
                           │
                           │ Set selectedMember
                           │ Open details sheet
                           ▼
            MemberDetailsSheet displays
                           │
                           │ Shows member info using
                           │ utility functions from
                           │ memberHelpers.js
                           ▼
                  User views information
```

## Component Communication

```
┌─────────────────────────────────────────────────┐
│           Props Down, Events Up Pattern          │
└─────────────────────────────────────────────────┘

Parent (CourseRoomMembers)
    │
    ├─── Props Down ──────────────────┐
    │    - data                        │
    │    - callbacks                   │
    │    - permissions                 │
    │                                  ▼
    │                          Child Components
    │                                  │
    │◄─── Events Up ───────────────────┘
         - onInviteSubmit
         - onUpdateSubmit
         - onViewDetails
         - onCancelInvite
```

## Permissions Flow

```
┌─────────────────────────────────────────────────┐
│              Permission Checks                   │
└─────────────────────────────────────────────────┘

useAuthStore ──► userDetail ──► userId
                                   │
                                   ▼
useCourse ───► courseList ──► courseOwnerId
                                   │
                                   ▼
                       Compare & Calculate
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
  isCourseOwner              isAdmin                  isRegularMember
        │                          │                          │
        ▼                          ▼                          ▼
  All permissions          Limited permissions       View-only access
  - Invite members        - View members            - View own details
  - Update members        - View details            - No edit rights
  - Remove members
  - Change roles
```
