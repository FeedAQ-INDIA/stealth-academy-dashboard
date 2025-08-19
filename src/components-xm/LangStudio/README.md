# Comprehension Skills Session Component

## Overview
An enhanced, fully responsive React component for conducting reading comprehension sessions with multiple question types. The component displays all questions on a single screen and provides an intuitive, modern UI/UX experience.

## Features

### 🎯 Question Types Support
- **Multiple Choice Questions (MCQ)**: Radio button selection with visual feedback
- **Written Answers**: Rich textarea with character counter
- **Audio Recording**: Built-in microphone recording with playback functionality

### 📱 Responsive Design
- **Mobile-First Approach**: Optimized for all screen sizes
- **Grid Layout**: Desktop shows passage and questions side-by-side, mobile stacks vertically
- **Touch-Friendly**: Large touch targets and smooth interactions
- **Sticky Navigation**: Reading passage stays visible on desktop while scrolling

### 🎨 Enhanced UX/UI
- **Modern Design**: Clean cards with subtle shadows and hover effects
- **Visual Progress**: Real-time progress tracking with animated progress bar
- **Color-Coded Questions**: Different colored badges for question types
- **Smooth Animations**: Fade-in effects and smooth transitions
- **Interactive Elements**: Hover states and visual feedback

### ♿ Accessibility Features
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML
- **High Contrast Support**: Adapts to system preferences
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Clear focus indicators

## File Structure
```
ComprehensionSkillsSession/
├── ComprehensionSkillsSession.jsx     # Main React component
└── ComprehensionSkillsSession.css     # Custom styles and animations
```

## Usage

### Basic Implementation
```jsx
import ComprehensionSkillsSession from './components-xm/LangStudio/ComprehensionSkillsSession';

function App() {
  return (
    <div className="App">
      <ComprehensionSkillsSession />
    </div>
  );
}
```

### Data Structure
The component expects data in the following format:

```javascript
const comprehensionData = {
  title: "Reading Comprehension: Climate Change",
  passage: "Your reading passage text here...",
  questions: [
    {
      id: 1,
      type: 'mcq',
      question: 'What has been the main driver of climate change since the 1800s?',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 1
    },
    {
      id: 2,
      type: 'written',
      question: 'Explain how greenhouse gases affect Earth\'s temperature.'
    },
    {
      id: 3,
      type: 'audio',
      question: 'Record yourself explaining three consequences of climate change.'
    }
  ]
};
```

## Component Features

### State Management
- `answers`: Stores all user responses indexed by question
- `recordingStates`: Tracks recording status for each audio question
- `audioBlobs`: Stores audio recordings for each audio question

### Answer Validation
- Real-time progress tracking
- Submission validation ensures all questions are answered
- Visual feedback for completed questions

### Audio Recording
- Browser-based microphone access
- Real-time recording indicators
- Audio playback with native controls
- Automatic cleanup of media streams

## Responsive Breakpoints

### Desktop (1280px+)
- Two-column layout: passage (1/3) + questions (2/3)
- Sticky passage panel
- Side-by-side progress and submit button

### Tablet (768px - 1279px)
- Single column layout
- Passage appears above questions
- Adjusted spacing and typography

### Mobile (< 768px)
- Fully stacked layout
- Larger touch targets (min 44px)
- Simplified navigation
- Optimized text sizes to prevent zoom

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Dependencies
- React 16.8+ (for hooks)
- Tailwind CSS (for styling)
- Modern browser with MediaRecorder API support

## Performance Optimizations
- Efficient state updates
- Minimal re-renders
- Lazy loading for audio elements
- Optimized animations with CSS transforms

## Customization

### Styling
The component uses Tailwind CSS classes with custom CSS animations. You can customize:
- Color schemes by modifying Tailwind classes
- Animations by editing the CSS file
- Layout by adjusting grid classes

### Functionality
- Add new question types by extending the `renderQuestion` function
- Modify validation rules in the `submitAnswers` function
- Customize audio recording settings in recording functions

## Future Enhancements
- [ ] Drag and drop file upload for questions
- [ ] Timer functionality
- [ ] Auto-save draft answers
- [ ] Export answers to PDF
- [ ] Integration with backend APIs
- [ ] Offline support
- [ ] Voice-to-text for written answers

## Support
For questions or issues, please refer to the component documentation or contact the development team.
