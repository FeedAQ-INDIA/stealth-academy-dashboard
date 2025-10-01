# Unified Loading Component Documentation

This document describes the unified loading component system implemented across the FeedAQ Academy Dashboard.

## Single Loading Component

### Spinner Component (`/src/components/ui/spinner.jsx`)

A unified, accessible spinner component that handles ALL loading states across the application.

**Features:**
- Multiple sizes: `xs`, `sm`, `md`, `lg`, `xl`
- Accessibility support with ARIA labels
- Consistent design following the provided sample
- Dark mode support
- Single source of truth for all loading UI

**Usage:**
```jsx
import { Spinner } from "@/components/ui/spinner";

// Basic usage
<Spinner />

// With custom size
<Spinner size="lg" />

// With custom label for screen readers
<Spinner label="Loading user data" />

// Decorative (no accessibility features)
<Spinner decorative />
```

## Loading Patterns

### 1. Button Loading States
```jsx
<Button disabled={isLoading}>
  {isLoading ? (
    <div className="flex items-center gap-2">
      <Spinner size="sm" decorative />
      Loading...
    </div>
  ) : (
    "Submit"
  )}
</Button>
```

### 2. Page-Level Loading
```jsx
if (isLoading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground">Loading content...</p>
    </div>
  );
}
```

### 3. Section Loading
```jsx
{isLoading ? (
  <div className="flex flex-col items-center justify-center py-8 space-y-4">
    <Spinner size="md" />
    <p className="text-sm text-muted-foreground">Loading data...</p>
  </div>
) : (
  <ContentComponent />
)}
```

### 4. Inline Loading
```jsx
{isLoading ? <Spinner size="sm" /> : <DataComponent />}
```

## Updated Legacy Components

### Legacy Loaders (`/src/components/ui/loader.jsx`)
Legacy `LoaderOne`, `LoaderTwo`, `LoaderThree`, and `LoaderFour` components have been refactored to use the unified Spinner internally.

**Deprecation Notice:** These components are deprecated. Use `<Spinner />` directly.

### LoadingScreen (`/src/components-xm/Modules/LoadingScreen.jsx`)
**Deprecated:** This component is now deprecated in favor of using Spinner directly with the page-level loading pattern above.

## Implementation Summary

### Components Updated

1. **Dashboard.jsx** - Uses Spinner with custom message for course loading
2. **CourseBuilder/Builder.jsx** - Uses Spinner in buttons and form states
3. **Course/CourseQuiz/CourseQuiz.jsx** - Uses Spinner for quiz content loading
4. **MyJourney/MyCourse.jsx** - Uses Spinner for course list loading
5. **Explore/Marketplace.jsx** - Uses Spinner for marketplace content loading

### Key Benefits

- **Single Component**: One unified loading component for all scenarios
- **Consistency**: Same visual design across the entire application
- **Flexibility**: Easily customizable for different contexts
- **Accessibility**: Built-in ARIA support
- **Performance**: Lightweight without heavy dependencies
- **Maintainability**: Single source of truth reduces code duplication

## Design Specifications

The unified spinner follows the sample design:
```jsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
```

**Visual Details:**
- Circular border with smooth rotation animation
- Primary color accent on bottom border
- Neutral colors for the rest of the border
- Size variants from 16px to 48px

## Migration Guide

### From LoadingScreen
```jsx
// Old
import LoadingScreen from "@/components-xm/Modules/LoadingScreen";
<LoadingScreen message="Loading..." />

// New
import { Spinner } from "@/components/ui/spinner";
<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
  <Spinner size="lg" />
  <p className="text-sm text-muted-foreground">Loading...</p>
</div>
```

### From Legacy Loaders
```jsx
// Old
import { LoaderOne } from "@/components/ui/loader";
<LoaderOne />

// New
import { Spinner } from "@/components/ui/spinner";
<Spinner size="sm" />
```

### From Ad-hoc Spinners
```jsx
// Old
<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>

// New
import { Spinner } from "@/components/ui/spinner";
<Spinner size="sm" />
```

## Best Practices

1. **Consistent Sizing**: Use appropriate sizes for context
   - `xs` (16px): Small inline elements
   - `sm` (24px): Buttons, small sections
   - `md` (32px): Medium content areas
   - `lg` (40px): Page-level loading
   - `xl` (48px): Full-screen loading

2. **Helpful Messages**: Always provide context-specific loading messages

3. **Proper Spacing**: Use consistent spacing patterns for loading states

4. **Accessibility**: Use the `label` prop for screen readers, or `decorative` for purely visual spinners

## Future Considerations

- Add progress indicators for long operations
- Consider adding loading animations for specific content types
- Implement loading state transitions for better UX
