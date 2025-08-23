# Flashcard Quiz Implementation

This document outlines the implementation of flashcard support in the FeedAQ Academy Dashboard.

## What was implemented

### 1. **CourseFlashcard Component** (`src/components-xm/Course/CourseFlashcard.jsx`)
A comprehensive flashcard learning component with the following features:

#### Key Features:
- **Interactive Flashcards**: Click to flip between questions and answers
- **Study Modes**: Linear and shuffle modes for varied learning experiences
- **Progress Tracking**: Visual progress indicators and completion tracking
- **Study Statistics**: Shows cards completed, remaining, and percentage progress
- **Card Management**: Navigation between cards with previous/next controls
- **Knowledge Assessment**: "I Know This" and "Need Practice" buttons for self-assessment
- **Multi-card Types**: Support for different flashcard types (BASIC, MULTIPLE_CHOICE, TRUE_FALSE, FILL_BLANK)
- **Difficulty Levels**: Support for EASY, MEDIUM, HARD difficulty levels
- **Study Session Management**: Start/stop study sessions with overview screens
- **Course Integration**: Full integration with course progress and enrollment systems

#### Study Interface:
- **Overview Screen**: Displays flashcard set details, statistics, and study options
- **Study Screen**: Interactive flashcard interface with flip animation
- **Progress Indicators**: Real-time progress tracking with visual feedback
- **Navigation Controls**: Seamless navigation between flashcards
- **Completion Tracking**: Marks individual cards and overall set completion

### 2. **Updated CourseSidebar** (`src/components-xm/Course/CourseSidebar.jsx`)
Enhanced the sidebar to support CourseFlashcard content type:

- Added `CourseFlashcard: "flashcard"` to contentUrlMap
- Updated URL parameter handling to include `CourseFlashcardId`
- Enhanced `isContentActive` function to detect active flashcard content
- Updated useEffect dependencies to track flashcard content changes

### 3. **Updated CourseDetail** (`src/components-xm/Course/CourseDetail.jsx`)
Enhanced the course context provider:

- Added Zap icon import for flashcards
- Updated `identifyContentTypeIcons` function to return `<Zap />` for CourseFlashcard content
- Enhanced context provider to support flashcard content identification

### 4. **Updated Router Configuration** (`src/main.jsx`)
Added routing support for flashcard content:

- Imported CourseFlashcard component
- Added route: `/course/:CourseId/flashcard/:CourseFlashcardId`
- Integrated with existing course routing structure

### 5. **Enhanced Navigation Support**
Updated all course components to support flashcard navigation:

#### CourseQuiz.jsx:
- Added CourseFlashcard route mapping
- Added Zap icon for flashcard content
- Enhanced `getContentIcon` function

#### CourseWritten.jsx:
- Added CourseFlashcard route mapping
- Added Zap icon import
- Enhanced navigation to flashcard content

#### CourseVideoTutorial.jsx:
- Added COURSE_FLASHCARD to CONTENT_TYPES
- Updated routes object to include flashcard mapping
- Enhanced navigation consistency

## Database Integration

The implementation leverages existing backend entities:

### CourseFlashcard Entity:
- `courseFlashcardId`: Primary key
- `courseId`: Course association
- `courseContentId`: Content association
- `setTitle`: Flashcard set title
- `setDescription`: Set description
- `setDifficulty`: EASY, MEDIUM, HARD, MIXED
- `setTags`: JSON array of tags
- `setCategory`: Category classification

### Flashcard Entity:
- `flashcardId`: Primary key
- `courseFlashcardId`: Foreign key to flashcard set
- `question`: Flashcard question
- `answer`: Flashcard answer
- `explanation`: Additional explanation
- `difficulty`: Individual card difficulty
- `cardType`: BASIC, MULTIPLE_CHOICE, TRUE_FALSE, FILL_BLANK
- `tags`: JSON array of tags
- `hints`: Additional hints

## API Integration

The component uses the existing `/searchCourse` endpoint with:

### For Flashcard Sets:
```javascript
{
  datasource: "CourseFlashcard",
  where: { courseFlashcardId: CourseFlashcardId }
}
```

### For Individual Flashcards:
```javascript
{
  datasource: "Flashcard", 
  where: { courseFlashcardId: CourseFlashcardId }
}
```

## User Experience Features

### Study Flow:
1. **Course Overview**: Flashcards appear in sidebar alongside other content
2. **Content Access**: Click flashcard item to enter study mode
3. **Study Intro**: Overview screen with set statistics and study options
4. **Interactive Study**: Flip cards, track progress, mark knowledge
5. **Progress Tracking**: Automatic progress saving and completion tracking
6. **Course Navigation**: Seamless navigation to next/previous content

### Visual Design:
- **Gradient Backgrounds**: Beautiful blue-to-indigo gradients
- **Card Animations**: Smooth hover and interaction effects
- **Progress Indicators**: Visual progress bars and completion badges
- **Responsive Design**: Works across desktop and mobile devices
- **Accessibility**: Keyboard shortcuts (Ctrl+G for navigation)

## Content Integration

Flashcards are fully integrated into the course content flow:

- **Sidebar Navigation**: Appears alongside videos, documents, and quizzes
- **Progress Tracking**: Integrates with existing course progress system
- **Enrollment Verification**: Respects course enrollment and access controls
- **Sequential Learning**: Maintains course content sequence and navigation

## Technical Highlights

- **State Management**: Comprehensive state management for study sessions
- **Error Handling**: Robust error handling with user-friendly messages
- **Performance**: Optimized rendering and efficient data loading
- **Modularity**: Clean, reusable component architecture
- **Consistency**: Maintains design and interaction patterns with existing components

This implementation provides a complete, production-ready flashcard learning system that seamlessly integrates with the existing course infrastructure.
