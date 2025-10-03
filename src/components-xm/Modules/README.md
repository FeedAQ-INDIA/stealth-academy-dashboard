# Course Card Components Documentation

This directory contains a comprehensive collection of course card components designed for the FeedAQ Academy platform. Each component serves different use cases and provides varying levels of functionality.

## 📦 Available Components

### 1. **CourseCard** (Original)
The foundational course card component with essential features.

**Features:**
- Clean, minimal design
- Grid and list view support
- Basic course information display
- Enrollment status indicators
- Responsive design

**Use Cases:**
- General course listings
- Basic catalog pages
- Simple course displays

**Props:**
```jsx
<CourseCard 
  course={courseObject}
  viewMode="grid|list"
/>
```

### 2. **EnhancedCourseCard**
A feature-rich course card with advanced functionality.

**Features:**
- Rich metadata display (ratings, student count, lessons)
- Instructor information with avatars
- Wishlist toggle functionality
- Progress tracking for enrolled courses
- Share functionality
- Price display with discounts
- Certificate indicators
- Featured course variants
- Hover animations and effects

**Use Cases:**
- Main course catalog
- Featured course sections
- Detailed course browsing
- Marketing pages

**Props:**
```jsx
<EnhancedCourseCard 
  course={courseObject}
  viewMode="grid|list"
  showActions={true}
  variant="default|featured"
/>
```

### 3. **CompactCourseCard**
A space-efficient course card for constrained layouts.

**Features:**
- Minimal footprint
- Multiple size variants (xs, sm, md)
- Essential information only
- Mobile-optimized
- Quick overview display

**Use Cases:**
- Sidebar recommendations
- Mobile course lists
- Related courses section
- Quick course previews

**Props:**
```jsx
<CompactCourseCard 
  course={courseObject}
  showProgress={true}
  size="xs|sm|md"
/>
```

### 4. **WishlistCourseCard**
Specialized card for wishlist management.

**Features:**
- Bulk selection with checkboxes
- Quick action buttons (remove, add to cart)
- Price tracking and updates
- Discount indicators
- Share functionality
- Grid and list view support

**Use Cases:**
- Wishlist page
- Saved courses management
- Bulk operations
- Shopping cart integration

**Props:**
```jsx
<WishlistCourseCard 
  course={courseObject}
  viewMode="grid|list"
  isSelected={false}
  onToggleSelect={function}
  onRemoveFromWishlist={function}
  onAddToCart={function}
  showBulkSelect={true}
/>
```

## 🎨 Design Features

### Visual Enhancements
- **Gradient Overlays**: Beautiful background gradients on images
- **Hover Effects**: Smooth animations and elevation changes
- **Rating Display**: Star ratings with review counts
- **Progress Bars**: Visual progress indicators for enrolled courses
- **Badge System**: Course level, mode, and status indicators
- **Price Display**: Clear pricing with discount calculations

### Interactive Elements
- **Wishlist Toggle**: Heart icon to save/unsave courses
- **Share Functionality**: Native sharing or clipboard copy
- **Dropdown Menus**: Additional actions and options
- **Bulk Selection**: Checkbox-based selection for management
- **Quick Actions**: One-click actions for common tasks

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Flexible Layouts**: Adapts to different screen sizes
- **Touch-Friendly**: Appropriate touch targets
- **Grid Systems**: Responsive grid layouts

## 🚀 Usage Examples

### Basic Course Grid
```jsx
import { CourseCard } from '@/components-xm/Modules';

<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {courses.map(course => (
    <CourseCard key={course.id} course={course} />
  ))}
</div>
```

### Enhanced Course Catalog
```jsx
import { EnhancedCourseCard } from '@/components-xm/Modules';

<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
  {courses.map((course, index) => (
    <EnhancedCourseCard 
      key={course.id} 
      course={course}
      variant={index === 0 ? 'featured' : 'default'}
    />
  ))}
</div>
```

### Wishlist Management
```jsx
import { WishlistCourseCard } from '@/components-xm/Modules';

<div className="space-y-4">
  {wishlistCourses.map(course => (
    <WishlistCourseCard
      key={course.id}
      course={course}
      viewMode="list"
      isSelected={selectedCourses.has(course.id)}
      onToggleSelect={() => toggleCourseSelection(course.id)}
      onRemoveFromWishlist={() => removeFromWishlist(course.id)}
      onAddToCart={() => addToCart(course.id)}
    />
  ))}
</div>
```

### Sidebar Recommendations
```jsx
import { CompactCourseCard } from '@/components-xm/Modules';

<div className="space-y-4">
  <h3>Recommended for You</h3>
  {recommendations.map(course => (
    <CompactCourseCard 
      key={course.id} 
      course={course} 
      size="sm" 
    />
  ))}
</div>
```

## 📋 Course Data Structure

All course cards expect a course object with the following structure:

```typescript
interface Course {
  courseId: string;
  courseTitle: string;
  courseImageUrl: string;
  courseLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  courseMode?: string;
  courseDuration?: number; // in minutes
  coursePrice?: number;
  originalPrice?: number;
  enrollmentStatus?: 'ENROLLED' | 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  courseSource?: string;
  courseIsLocked?: boolean;
  
  // Optional enhanced data
  progress?: number;
  rating?: number;
  studentCount?: number;
  lessonCount?: number;
  instructor?: {
    name: string;
    avatar?: string;
  };
  isWishlisted?: boolean;
  isTrending?: boolean;
  certificateAvailable?: boolean;
  lastUpdated?: string;
  reviewCount?: number;
}
```

## 🎯 Best Practices

### Performance
- Use appropriate card type for the context
- Implement lazy loading for images
- Optimize for mobile performance
- Use proper key props in lists

### Accessibility
- Include proper alt text for images
- Use semantic HTML elements
- Ensure keyboard navigation works
- Provide screen reader support

### User Experience
- Consistent interaction patterns
- Clear visual feedback
- Appropriate loading states
- Error handling for failed actions

### Responsive Design
- Test on various screen sizes
- Use appropriate breakpoints
- Ensure touch targets are adequate
- Consider content prioritization on mobile

## 🔧 Customization

### Styling
All components use Tailwind CSS classes and can be customized by:
- Modifying the component files directly
- Using CSS custom properties
- Extending Tailwind configuration
- Adding custom CSS classes

### Functionality
Components can be extended by:
- Adding new props
- Implementing additional event handlers
- Creating new variants
- Adding custom hooks for data management

## 📱 Mobile Considerations

- **Touch Targets**: Minimum 44px for interactive elements
- **Content Hierarchy**: Important information prioritized
- **Loading Performance**: Optimized images and lazy loading
- **Gesture Support**: Swipe actions where appropriate
- **Viewport Optimization**: Proper responsive breakpoints

## 🧪 Testing

### Manual Testing
- Test all interactive elements
- Verify responsive behavior
- Check accessibility features
- Validate data handling

### Automated Testing
- Unit tests for component props
- Integration tests for user interactions
- Visual regression tests
- Performance benchmarks

---

## 📄 Component Files

- `CourseCard.jsx` - Original course card
- `EnhancedCourseCard.jsx` - Feature-rich course card
- `CompactCourseCard.jsx` - Minimal course card
- `WishlistCourseCard.jsx` - Wishlist management card
- `CourseCardShowcase.jsx` - Demo component
- `index.js` - Component exports

For implementation examples and interactive demos, see the `CourseCardShowcase` component.
