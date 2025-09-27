# Course Editor Builder

A comprehensive React component for editing course builder data structures in the FeedAQ Academy Dashboard.

## Overview

The CourseEditorBuilder component provides a full-featured interface for editing course metadata, content sequencing, video details, and builder settings. It's designed to work with the specific API response structure from the course builder API.

## Components

### 1. CourseEditorBuilder.jsx
The main editor component with comprehensive editing capabilities.

**Features:**
- ✅ Course metadata editing (title, description, type, status, etc.)
- ✅ Course content management with drag-and-drop sequencing
- ✅ **NEW: Add new course content items with different types**
- ✅ **NEW: Edit content types (Video, Written Content, Quiz, Flashcard, Assignment)**
- ✅ **NEW: Delete course content items with confirmation**
- ✅ Video details editing (URL, duration, thumbnails, descriptions)
- ✅ Course builder settings management
- ✅ Real-time form validation
- ✅ Auto-save functionality
- ✅ Status management (Draft/Published/Archived)
- ✅ Organization and user context handling
- ✅ Processing information display

### 2. PreviewBuilder.jsx
A preview component that displays course data in a read-only format with edit actions.

**Features:**
- ✅ Clean course information display
- ✅ Course content listing with thumbnails
- ✅ Statistics and metrics display
- ✅ Builder information sidebar
- ✅ Quick action buttons
- ✅ Integration with CourseEditorBuilder

<!-- CourseEditorExample.jsx removed: example component was redundant in production build. -->

## API Response Structure

The component expects data in this structure:

```json
{
  "success": true,
  "message": "Course builder created and course data prepared successfully",
  "operation": "create_with_course_data",
  "data": {
    "courseBuilder": {
      "v_created_date": "27-Sep-2025",
      "v_created_time": "14:31:53",
      "v_updated_date": "27-Sep-2025", 
      "v_updated_time": "14:31:53",
      "courseBuilderId": 19,
      "userId": 1,
      "orgId": null,
      "status": "PUBLISHED",
      "courseBuilderData": {
        "courseTitle": "Course Title",
        "processedAt": "2025-09-27T09:01:53.186Z",
        "courseDetail": { /* course details */ },
        "courseContent": [ /* content array */ ],
        "contentUrlsList": ["https://..."],
        "processingStatus": "COMPLETED"
      }
    },
    "course": {
      "courseId": "temp_course_id",
      "userId": 1,
      "courseTitle": "Course Title",
      "courseDescription": "Course Description",
      "courseDuration": 12232,
      "courseType": "BYOC",
      "status": "PUBLISHED",
      /* ... other course fields */
    },
    "courseContent": [
      {
        "courseContent": {
          "courseContentId": "temp_content_1",
          "courseContentTitle": "Content Title",
          "courseContentSequence": 1,
          /* ... other content fields */
        },
        "courseVideo": {
          "courseVideoId": "temp_video_1",
          "courseVideoTitle": "Video Title",
          "courseVideoUrl": "https://youtube.com/...",
          "duration": 586,
          "thumbnailUrl": "https://...",
          /* ... other video fields */
        },
        "type": "youtube",
        "sequence": 1,
        "contentType": "CourseVideo"
      }
    ],
    "courseContentDetails": {
      "totalItems": 12,
      "totalDuration": 12232,
      "statistics": {
        "videoCount": 12,
        "writtenCount": 0
      }
    }
  }
}
```

## Usage

### Basic Implementation

```jsx
import CourseEditorBuilder from '@/components-xm/CourseBuilder/CourseEditorBuilder';
import PreviewBuilder from '@/components-xm/CourseBuilder/PreviewBuilder';

function CourseManager() {
  const [courseData, setCourseData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      const response = await axiosConn.get(`/courseBuilder/${courseId}`);
      setCourseData(response.data);
    };
    fetchCourse();
  }, [courseId]);

  const handleSave = (updatedData) => {
    setCourseData(updatedData);
    setShowEditor(false);
    toast({ title: "Course updated successfully!" });
  };

  return (
    <div>
      {showEditor ? (
        <CourseEditorBuilder
          courseBuilderData={courseData}
          onSave={handleSave}
          onCancel={() => setShowEditor(false)}
        />
      ) : (
        <PreviewBuilder
          courseBuilderData={courseData}
          onEdit={() => setShowEditor(true)}
        />
      )}
    </div>
  );
}
```

### Props

#### CourseEditorBuilder Props
- `courseBuilderData` (object, required): The course builder data structure
- `onSave` (function, required): Callback when save is successful `(updatedData) => void`
- `onCancel` (function, required): Callback when user cancels editing `() => void`

#### PreviewBuilder Props
- `courseBuilderData` (object, required): The course builder data structure
- `onBack` (function, optional): Callback for back navigation `() => void`
  (Internal edit toggle handled inside component; external onEdit removed during simplification.)

## Features in Detail

### Course Metadata Editing
- Course title and description
- Course type (BYOC, Curated, Live)
- Delivery mode (Online, Offline, Hybrid)
- Status (Draft, Published, Archived)
- Public/Private toggle
- Active/Inactive toggle
- Source channel information
- Course image URL

### Course Content Management
- Reorderable content list with sequence numbers
- **Add new content items** with the "Add Content" button
- **Multiple content types supported:**
  - **CourseVideo**: YouTube videos or video content
  - **CourseWritten**: Articles, documents, written material
  - **CourseQuiz**: Interactive quizzes and assessments
  - **CourseFlashcard**: Flashcard sets for memorization
  - **CourseAssignment**: Homework and assignment tasks
- Individual content item editing:
  - Title and description
  - Content type selection with dynamic fields
  - Video URL and duration (for video content)
  - External URLs (for quizzes, assignments)
  - Thumbnail/cover image URL
  - Category and metadata
  - Published/Preview/Licensed flags
  - Content and video status management
- **Delete content items** with confirmation dialog
- Move items up/down in sequence
- Expandable detail view for each item
- Visual content type indicators with color coding

### Course Builder Settings
- Builder status management
- Organization context display
- Processing information
- Statistics and metrics
- Creation and update timestamps

### Validation & Error Handling
- Required field validation
- URL format validation
- Duration format validation
- API error handling with user-friendly messages
- Loading states during save operations

## API Integration

The component makes a PUT request to update course data:

```javascript
// API endpoint
PUT /courseBuilder/${courseBuilderId}

// Request payload
{
  courseBuilderData: { /* updated builder data */ },
  course: { /* updated course metadata */ },
  courseContent: [ /* updated content array */ ],
  status: "PUBLISHED",
  orgId: null
}

// Expected response
{
  success: true,
  data: { /* updated course builder data */ }
}
```

### New Content Types Support

The component now supports multiple content types with appropriate fields:

```javascript
// Content types and their specific fields
const contentTypes = {
  "CourseVideo": {
    // Video-specific fields
    courseVideoUrl: "https://youtube.com/...",
    duration: 586, // in seconds
    thumbnailUrl: "https://...",
    isPreview: true/false
  },
  "CourseWritten": {
    // Written content fields
    courseVideoDescription: "Article content or URL",
    // duration represents reading time in seconds
  },
  "CourseQuiz": {
    // Quiz-specific fields
    courseVideoUrl: "https://quiz-platform.com/...", // external quiz URL
    duration: 1200, // estimated completion time in seconds
  },
  "CourseFlashcard": {
    // Flashcard-specific fields
    courseVideoDescription: "Flashcard set description",
    duration: 900, // study time in seconds
  },
  "CourseAssignment": {
    // Assignment-specific fields
    courseVideoUrl: "https://assignment-platform.com/...",
    courseVideoDescription: "Assignment instructions",
    duration: 3600, // estimated completion time
  }
};
```

## Styling & UI

The component uses:
- **Tailwind CSS** for styling
- **Shadcn/UI** components (Button, Card, Input, Select, etc.)
- **Lucide React** icons
- **Toast notifications** for user feedback
- **Responsive design** with grid layouts

## Dependencies

```json
{
  "react": "^18.0.0",
  "lucide-react": "^0.x.x",
  "@/components/ui/*": "shadcn/ui components",
  "@/lib/utils": "utility functions"
}
```

## File Structure

```
src/components-xm/CourseBuilder/
├── CourseEditorBuilder.jsx     # Main editor component
├── PreviewBuilder.jsx          # Preview/display component  
└── README.md                   # This documentation
```

## Customization

### Adding New Fields
To add new editable fields:

1. Add the field to the `updateCourseMetadata` function
2. Add form inputs in the render method
3. Update the API payload structure
4. Add validation if needed

### Custom Styling
Override Tailwind classes or add custom CSS:

```jsx
<CourseEditorBuilder
  courseBuilderData={data}
  className="custom-editor-styles"
  // ... other props
/>
```

### Custom Validation
Add validation logic in the component:

```javascript
const validateCourseData = (data) => {
  const errors = {};
  if (!data.course?.courseTitle?.trim()) {
    errors.title = "Course title is required";
  }
  // Add more validation rules
  return errors;
};
```

## Error Handling

The component handles various error scenarios:
- Network errors during save
- Validation errors
- API response errors
- Missing or invalid data structures

All errors are displayed via toast notifications with user-friendly messages.

## Performance Considerations

- **State management**: Uses local state for real-time editing
- **API calls**: Only saves when user clicks save button
- **Re-rendering**: Optimized with proper key props and state structure
- **Memory usage**: Cleans up event listeners and state on unmount

## Browser Compatibility

Supports all modern browsers:
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Contributing

When contributing to this component:
1. Follow the existing code style
2. Add proper TypeScript types if converting
3. Update documentation for new features
4. Add unit tests for new functionality
5. Test with various data structures