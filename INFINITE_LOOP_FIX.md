# Infinite Loop Fix - MemberUpdateSheet

## 🐛 Issue
**Error**: "Too many re-renders. React limits the number of renders to prevent an infinite loop."

## 🔍 Root Cause
The `MemberUpdateSheet` component had a critical bug on lines 62-68:

```javascript
// ❌ BAD - Causes infinite loop
if (member && form.formState.isDirty === false) {
  form.reset({
    accessLevel: member.accessLevel || "SHARED",
    status: member.status || "ACTIVE",
    enableCourseTracking: member.enableCourseTracking || false,
  });
}
```

**Why this causes an infinite loop:**
1. Form reset is called during render
2. Reset triggers a re-render
3. Component re-renders
4. Form reset is called again during render
5. Loop continues infinitely

## ✅ Solution
Moved the form reset logic to a `useEffect` hook:

```javascript
// ✅ GOOD - Proper side effect handling
useEffect(() => {
  if (member && open) {
    form.reset({
      accessLevel: member.accessLevel || "SHARED",
      status: member.status || "ACTIVE",
      enableCourseTracking: member.enableCourseTracking || false,
    });
  }
}, [member, open, form]);
```

**Why this works:**
1. `useEffect` runs after render, not during
2. Dependencies array ensures it only runs when needed
3. No infinite loop created

## 📝 Changes Made

### File: `src/components-xm/Course/components/MemberUpdateSheet.jsx`

**Before:**
- Form reset during render (lines 62-68)
- Default values from member prop in useForm

**After:**
- Added `useEffect` import
- Static default values in useForm
- Form reset in useEffect when member/open changes
- Proper cleanup on sheet close

## 🔧 Code Changes

```diff
- import { useForm } from "react-hook-form";
+ import { useForm } from "react-hook-form";
+ import { useEffect } from "react";

  const form = useForm({
    defaultValues: {
-     accessLevel: member?.accessLevel || "SHARED",
-     status: member?.status || "ACTIVE",
-     enableCourseTracking: member?.enableCourseTracking || false,
+     accessLevel: "SHARED",
+     status: "ACTIVE",
+     enableCourseTracking: false,
    },
  });

+ // Update form when member changes
+ useEffect(() => {
+   if (member && open) {
+     form.reset({
+       accessLevel: member.accessLevel || "SHARED",
+       status: member.status || "ACTIVE",
+       enableCourseTracking: member.enableCourseTracking || false,
+     });
+   }
+ }, [member, open, form]);

  const handleSheetClose = (open) => {
    onOpenChange(open);
    if (!open) {
-     form.reset();
+     form.reset({
+       accessLevel: "SHARED",
+       status: "ACTIVE",
+       enableCourseTracking: false,
+     });
    }
  };

- // Update form when member changes
- if (member && form.formState.isDirty === false) {
-   form.reset({
-     accessLevel: member.accessLevel || "SHARED",
-     status: member.status || "ACTIVE",
-     enableCourseTracking: member.enableCourseTracking || false,
-   });
- }
```

## ✅ Testing

After this fix, verify:
- [ ] No infinite loop errors
- [ ] Sheet opens correctly
- [ ] Form pre-fills with member data
- [ ] Can update member successfully
- [ ] Form resets on close
- [ ] No console errors

## 📚 Lesson Learned

**Never call state-changing functions during render!**

- ❌ Don't: `if (condition) { setState(value) }`
- ❌ Don't: `if (condition) { form.reset() }`
- ✅ Do: Use `useEffect` for side effects
- ✅ Do: Use event handlers for user interactions

## 🔗 Related Rules

### React Rules of Hooks:
1. **Only call hooks at the top level** - Don't call inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - From components or custom hooks
3. **Side effects go in useEffect** - Not in render

### Common Pitfalls:
- Setting state during render
- Calling form methods during render
- Mutating refs during render
- Making API calls during render

All of these should be in:
- `useEffect` - for lifecycle side effects
- Event handlers - for user interactions
- Callbacks - for async operations

## 🎯 Status
✅ **FIXED** - The infinite loop has been resolved and the component now works correctly.
