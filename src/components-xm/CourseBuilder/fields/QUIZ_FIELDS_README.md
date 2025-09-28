# Enhanced QuizFields Component

## Overview
The QuizFields component provides a comprehensive interface for creating and managing quiz content in the Course Builder. It includes advanced configuration options, question management, and real-time form validation.

## Features

### 🎯 Quiz Configuration
- **Quiz Type**: Choose between Knowledge Check and Certification
- **Timing**: Set global quiz timer or individual question timers
- **Scoring**: Configure pass percentage and point distribution
- **Difficulty**: Set overall quiz difficulty level
- **Advanced Settings**: Retry options, question randomization, result display preferences

### 📝 Question Management
- **Multiple Question Types**: Single choice, multiple choice, true/false, fill-in-blank, essay
- **Rich Question Editor**: Full-featured editor with options, correct answers, and explanations
- **Question Reordering**: Drag and drop functionality for question sequence
- **Individual Question Settings**: Points, difficulty, timing per question
- **Question Preview**: Visual preview of each question with metadata

### 📊 Quiz Analytics
- **Real-time Statistics**: Total questions, points, estimated time, average difficulty
- **Question Type Distribution**: Visual overview of question variety
- **Validation Warnings**: Immediate feedback on missing requirements

### 🎨 UI/UX Features
- **Form Validation**: Real-time validation with Zod schema
- **Responsive Design**: Mobile-friendly interface
- **Visual Feedback**: Color-coded difficulty levels, status badges
- **Progressive Disclosure**: Advanced settings shown on demand

## Entity Relationships

### CourseQuiz Entity
```javascript
{
  courseQuizId: number,
  courseQuizType: 'CERTIFICATION' | 'KNOWLEDGE CHECK',
  courseQuizDescription: string,
  isQuizTimed: boolean,
  courseQuizTimer: number, // seconds
  courseQuizPassPercent: number, // 0-100
  // Extended properties for advanced features
  allowRetry: boolean,
  maxRetries: number,
  randomizeQuestions: boolean,
  showResultsImmediately: boolean,
  showCorrectAnswers: boolean,
  quizDifficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED'
}
```

### QuizQuestion Entity
```javascript
{
  quizQuestionId: number,
  quizQuestionTitle: string,
  quizQuestionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'ESSAY',
  quizQuestionNote: string,
  quizQuestionOption: string[], // JSONB array
  quizQuestionCorrectAnswer: string[], // JSONB array
  quizQuestionPosPoint: number,
  quizQuestionNegPoint: number,
  isQuestionTimed: boolean,
  quizQuestionTimer: number,
  questionSequence: number,
  difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD',
  explanation: string,
  metadata: object // JSONB
}
```

## Usage

```jsx
import QuizFields from './fields/QuizFields';

<QuizFields
  content={content} // Content object with courseQuiz and quizQuestions
  update={updateFunction} // Function to update quiz data
  onManageQuestions={manageQuestionsCallback} // Optional callback
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `content` | Object | Yes | Content object containing courseContent, courseQuiz, and quizQuestions |
| `update` | Function | Yes | Callback function to update quiz data: `(contentId, field, value) => void` |
| `onManageQuestions` | Function | No | Optional callback for external question management |

## Components Architecture

### Main Components
- **QuizFields**: Main container component with form management
- **QuestionManager**: Modal interface for managing questions
- **QuestionEditor**: Full-featured question editing dialog
- **QuestionPreview**: Compact preview of individual questions

### Key Features
- **Form Validation**: Uses react-hook-form with Zod for robust validation
- **State Management**: Local state with parent sync for real-time updates
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Memoized components to prevent unnecessary re-renders

## Validation Rules

### Quiz Level
- Quiz type is required
- Pass percentage: 0-100
- Timer: minimum 10 seconds if enabled
- Max retries: 0-10 if retries allowed

### Question Level  
- Question text is required (minimum 1 character)
- At least one answer option required
- At least one correct answer must be selected
- Positive points: minimum 1
- Negative points: minimum 0
- Question timer: minimum 5 seconds if enabled

## Styling
- Uses Tailwind CSS for styling
- Follows shadcn/ui design system
- Color-coded difficulty levels and status indicators
- Responsive grid layouts for different screen sizes

## Best Practices

1. **Always validate**: Ensure questions have correct answers before saving
2. **Clear instructions**: Use the description field to provide clear quiz instructions
3. **Balanced difficulty**: Mix question difficulties for better learning outcomes
4. **Reasonable timing**: Set appropriate timers that don't pressure students unnecessarily
5. **Meaningful feedback**: Use explanations to help students learn from mistakes

## Future Enhancements

- Question bank integration
- Bulk question import/export
- Question categorization and tagging
- Advanced analytics and reporting
- Template-based question creation
