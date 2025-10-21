/**
 * YouTube Import Feature Documentation
 * 
 * This document describes the newly added YouTube import functionality
 * in the Course Builder PreviewBuilder component.
 */

## 🎯 **Feature Overview**

The YouTube import feature allows users to:
- Import entire YouTube playlists into their course
- Convert YouTube videos to course content automatically
- Maintain proper sequencing and metadata

## 🔧 **Implementation Details**

### **Files Modified:**

1. **ContentTypeSelector.jsx**
   - Added "Import Videos" submenu with YouTube option
   - Added `onImportYoutube` prop for handling import action

2. **PreviewBuilder.jsx**
   - Added YouTube import dialog with URL input
   - Integrated with `/importFromYoutube` API endpoint
   - Added state management for import process
   - Added automatic content integration and sequencing

### **New UI Components:**

1. **Import Videos Submenu**
   ```
   Add Content → Import Videos → YouTube Playlist
   ```

2. **YouTube Import Dialog**
   - URL input field with validation
   - Loading states during import
   - Error handling and user feedback

### **Workflow:**

1. User clicks "Add Content" button
2. Selects "Import Videos" → "YouTube Playlist"
3. Dialog opens with URL input field
4. User enters YouTube playlist URL
5. System calls `/importFromYoutube` API
6. Videos are imported and added to course content
7. Content is automatically sequenced and saved

### **API Integration:**

- **Endpoint:** `POST /importFromYoutube`
- **Payload:** `{ playlistUrl: "https://youtube.com/playlist?list=..." }`
- **Response:** Course content array with video details
- **Auto-save:** Changes are automatically saved after successful import

### **Error Handling:**

- URL validation
- API error responses
- Network failures
- Empty playlist handling
- User-friendly error messages

## 🎬 **Expected Response Structure**

The imported content follows this structure:
```json
{
  "courseContentCategory": "Video Content",
  "courseContentDuration": 4939,
  "courseContentId": "imported_1234567890_1",
  "coursecontentIsLicensed": false,
  "courseContentSequence": 1,
  "courseContentTitle": "Video Title",
  "courseContentType": "CourseVideo",
  "courseContentTypeDetail": {
    "courseVideoId": "temp_video_1",
    "courseVideoTitle": "Video Title",
    "courseVideoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
    "courseVideoDescription": "Video description...",
    "duration": 4939,
    "thumbnailUrl": "https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg",
    "metadata": {
      "channelTitle": "Channel Name",
      "publishedAt": "2024-01-26T15:31:21Z",
      "sourcePlatform": "YOUTUBE",
      "videoId": "VIDEO_ID"
    }
  }
}
```

## ✅ **Features Implemented:**

- ✅ YouTube playlist URL input dialog
- ✅ API integration with error handling
- ✅ Automatic content sequencing
- ✅ Loading states and user feedback
- ✅ Toast notifications for success/error
- ✅ Auto-save after import
- ✅ Proper state management
- ✅ Submenu navigation in ContentTypeSelector

## 🚀 **Usage Instructions:**

1. Navigate to Course Builder Preview
2. Click "Add Content" button
3. Hover over "Import Videos" 
4. Click "YouTube Playlist"
5. Enter playlist URL in the dialog
6. Click "Import Playlist"
7. Wait for import to complete
8. Videos will appear in course content list

## 🔗 **Example URLs:**

- `https://www.youtube.com/playlist?list=PL9ooVrP1hQOFrNo8jK9Yb2g2eMDP7De7j`
- `https://youtube.com/playlist?list=PLrAXtmRdnEQy6nuLvvS6TFJcNrVQFe8gE`

The feature seamlessly integrates with the existing course builder workflow and maintains all existing functionality while adding powerful import capabilities!