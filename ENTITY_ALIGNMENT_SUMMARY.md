# Entity Alignment Summary

## Overview
After analyzing the backend entity files and their associations, I've refined the JSX content creator files to properly align with the database schema.

## Key Entity Structure Analysis

### CourseContent (Main Content Container)
- **Primary Key**: `courseContentId`
- **Foreign Key**: `courseId` (references Course)
- **Content Type**: ENUM('CourseVideo', 'CourseWritten', 'CourseQuiz', 'CourseFlashcard', 'CourseCertificate')
- **Required Fields**: 
  - `courseContentTitle` (String 200)
  - `courseContentSequence` (Integer) - **Critical for ordering**
  - `courseContentDuration` (Integer in seconds)
  - `courseContentCategory` (String 200)
  - `isActive` (Boolean, default true)
  - `coursecontentIsLicensed` (Boolean, default false)

### Content-Specific Entities

#### CourseVideo
- **Key Fields**: `courseVideoTitle`, `courseVideoDescription`, `courseVideoUrl`, `duration`, `thumbnailUrl`
- **Additional**: `metadata` (JSONB), user and course references

#### CourseWritten  
- **Key Fields**: `courseWrittenTitle`, `courseWrittenDescription`, `courseWrittenContent`
- **Additional**: `courseWrittenEmbedUrl`, `courseWrittenUrlIsEmbeddable`, `metadata` (JSONB)

#### CourseFlashcard
- **Key Fields**: `setTitle`, `setDescription` (NOT courseFlashcardDescription)
- **Additional**: `setDifficulty`, `setTags`, `estimatedDuration`
- **Related Entity**: Flashcard with `question`, `answer`, `explanation`, `hints`, `orderIndex`

#### CourseQuiz
- **Key Fields**: `courseQuizDescription`, `courseQuizType` ('CERTIFICATION'|'QUIZ')
- **Timing**: `isQuizTimed` (Boolean), `courseQuizTimer` (Integer)
- **Scoring**: `courseQuizPassPercent` (Integer)
- **Related Entity**: QuizQuestion with complex structure

## Refinements Made

### 1. FlashcardContentCreator.jsx
**Fixed Issues**:
- ❌ Used `courseFlashcardDescription` → ✅ Changed to `setDescription`
- ❌ Used `front`/`back` terminology → ✅ Changed to `question`/`answer` 
- ❌ Used `hint` → ✅ Changed to `explanation`
- ❌ Missing entity field mappings → ✅ Added proper Flashcard entity fields

**Key Changes**:
```jsx
// Before
courseFlashcard: {
  courseFlashcardDescription: data.description,
  cardCount: data.cards.length,
  cards: data.cards.map((card) => ({
    front: card.front,
    back: card.back,
    hint: card.hint,
  })),
}

// After  
courseFlashcard: {
  setTitle: data.title,
  setDescription: data.description,
  setDifficulty: "MEDIUM",
  setTags: [],
  estimatedDuration: Math.ceil(data.cards.length * 2),
  cards: data.cards.map((card, index) => ({
    question: card.front,
    answer: card.back,
    explanation: card.hint,
    difficulty: "MEDIUM",
    cardType: "BASIC",
    hints: card.hint ? [card.hint] : [],
    orderIndex: index + 1,
  })),
}
```

### 2. VideoContentCreator.jsx
**Fixed Issues**:
- ❌ Missing `courseVideoTitle` field → ✅ Added proper title mapping
- ❌ Missing `metadata` field → ✅ Added empty metadata object

**Key Changes**:
```jsx
courseVideo: {
  courseVideoTitle: data.title, // Added this field
  courseVideoUrl: data.videoUrl,
  courseVideoDescription: data.description,
  duration: data.duration,
  thumbnailUrl: data.thumbnailUrl,
  isPreview: data.isPreview,
  metadata: {} // Added metadata field
}
```

### 3. WrittenContentCreator.jsx  
**Fixed Issues**:
- ❌ Missing `courseWrittenTitle` field → ✅ Added title mapping
- ❌ Used `courseWrittenSummary` → ✅ Changed to `courseWrittenDescription`
- ❌ Used `estimatedReadTime` directly → ✅ Moved to metadata (field doesn't exist in entity)

**Key Changes**:
```jsx
courseWritten: {
  courseWrittenTitle: data.title, // Added this field
  courseWrittenContent: data.content,
  courseWrittenDescription: data.summary, // Fixed field name
  metadata: {
    estimatedReadTime: data.estimatedReadTime, // Moved to metadata
    wordCount: data.content.split(' ').length,
    lastUpdated: new Date().toISOString()
  }
}
```

### 4. QuizContentCreator.jsx
**Fixed Issues**:
- ❌ Missing proper QuizQuestion entity mapping → ✅ Added complete question structure
- ❌ Incorrect enum values → ✅ Mapped to proper ENUM values
- ❌ Missing timing structure → ✅ Added proper CourseQuiz fields

**Key Changes**:
```jsx
courseQuiz: {
  courseQuizDescription: data.description,
  courseQuizType: data.category === "Assessment" ? "CERTIFICATION" : "QUIZ",
  isQuizTimed: data.timeLimit > 0,
  courseQuizTimer: data.timeLimit * 60,
  courseQuizPassPercent: data.passingScore,
  metadata: {
    instructions: data.instructions,
    maxAttempts: data.maxAttempts
  }
},
questions: data.questions.map((q, index) => ({
  quizQuestionTitle: q.question,
  quizQuestionNote: q.explanation,
  quizQuestionType: "SINGLE_CHOICE", // Proper enum value
  quizQuestionOption: q.options, // JSONB field
  quizQuestionCorrectAnswer: [q.correctAnswer], // JSONB array
  quizQuestionPosPoint: 1,
  quizQuestionNegPoint: 0,
  questionSequence: index + 1,
  difficultyLevel: "MEDIUM",
  explanation: q.explanation
}))
```

### 5. Common Improvements Across All Files

#### Added courseContentSequence Support
- All creators now accept `courseContentSequence` parameter
- Essential for proper content ordering in the database

#### Added courseContentType Field
- Properly maps to entity ENUM values
- Ensures consistency with database constraints

#### Enhanced Metadata Usage
- Utilizes JSONB metadata fields for extensible data storage
- Stores additional information that doesn't have dedicated columns

#### Improved Error Handling
- Better validation alignment with entity constraints
- Proper field length limits matching database schema

## Database Associations Verified

The entity relationships are properly structured:
- `Course` → `CourseContent` (1:many)
- `CourseContent` → `CourseVideo|CourseWritten|CourseQuiz|CourseFlashcard` (1:1)
- `CourseFlashcard` → `Flashcard` (1:many)  
- `CourseQuiz` → `QuizQuestion` (1:many)

## Next Steps

1. **API Integration**: Ensure backend APIs handle the refined data structures
2. **Migration Scripts**: Update any existing data to match new structure
3. **Validation**: Test content creation flow end-to-end
4. **Documentation**: Update API documentation to reflect entity field mappings

## Files Modified

✅ `FlashcardContentCreator.jsx` - Complete entity alignment
✅ `VideoContentCreator.jsx` - Added missing fields  
✅ `WrittenContentCreator.jsx` - Fixed field mappings
✅ `QuizContentCreator.jsx` - Complete question structure alignment

All creators now properly map to their respective entity structures and include proper sequence handling for content ordering.
