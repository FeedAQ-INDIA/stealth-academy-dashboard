// Central registry for course content subtype configurations
// Aligns frontend forms with backend enums in CourseContent.courseContentType
// Extend this when adding new content types (e.g., CourseCertificate)

export const CONTENT_TYPES = {
  CourseVideo: {
    label: 'Video',
    description: 'Video lesson with URL and duration',
  },
  CourseWritten: {
    label: 'Written',
    description: 'Markdown / article style content',
  },
  CourseQuiz: {
    label: 'Quiz',
    description: 'Assessment with graded questions',
  },
  CourseFlashcard: {
    label: 'Flashcard',
    description: 'Interactive flashcard study set',
  },
  // Backend also supports CourseCertificate (not yet exposed in UI)
};

export function getContentTypeOptions() {
  return Object.entries(CONTENT_TYPES).map(([value, cfg]) => ({ value, label: cfg.label }));
}
