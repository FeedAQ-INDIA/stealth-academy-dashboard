import { z } from 'zod';

// Common validation schemas for course builder components

export const videoSchema = z.object({
  courseVideoUrl: z
    .string()
    .min(1, 'Video URL is required')
    .url('Please enter a valid URL')
    .refine(
      (url) => {
        // Check for common video platforms and direct video files
        const videoPatterns = [
          /youtube\.com\/watch\?v=/,
          /youtu\.be\//,
          /vimeo\.com\//,
          /dailymotion\.com\//,
          /wistia\.com\//,
          /.*\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i,
        ];
        return videoPatterns.some(pattern => pattern.test(url));
      },
      'Please enter a valid video URL (YouTube, Vimeo, or direct video file)'
    ),
  duration: z
    .number()
    .min(1, 'Duration must be greater than 0')
    .int('Duration must be a whole number'),
  thumbnailUrl: z
    .string()
    .optional()
    .refine(
      (url) => !url || z.string().url().safeParse(url).success,
      'Please enter a valid thumbnail URL'
    ),
  isPreview: z.boolean().optional().default(false),
  courseVideoDescription: z
    .string()
    .optional()
    .refine(
      (desc) => !desc || desc.length <= 1000,
      'Description must be 1000 characters or less'
    ),
});

export const documentSchema = z.object({
  documentUrl: z
    .string()
    .min(1, 'Document URL is required')
    .url('Please enter a valid URL'),
  documentTitle: z
    .string()
    .min(1, 'Document title is required')
    .max(100, 'Title must be 100 characters or less'),
  documentDescription: z
    .string()
    .optional()
    .refine(
      (desc) => !desc || desc.length <= 500,
      'Description must be 500 characters or less'
    ),
});

export const quizSchema = z.object({
  quizTitle: z
    .string()
    .min(1, 'Quiz title is required')
    .max(100, 'Title must be 100 characters or less'),
  passingScore: z
    .number()
    .min(0, 'Passing score must be at least 0')
    .max(100, 'Passing score cannot exceed 100'),
  timeLimit: z
    .number()
    .min(1, 'Time limit must be at least 1 minute')
    .optional(),
  shuffleQuestions: z.boolean().optional().default(false),
  showCorrectAnswers: z.boolean().optional().default(true),
});

// Helper function to create form defaults from schema
export const createFormDefaults = (schema) => {
  const defaults = {};
  
  Object.entries(schema.shape).forEach(([key, field]) => {
    if (field._def.defaultValue !== undefined) {
      defaults[key] = field._def.defaultValue();
    } else if (field instanceof z.ZodString) {
      defaults[key] = '';
    } else if (field instanceof z.ZodNumber) {
      defaults[key] = 0;
    } else if (field instanceof z.ZodBoolean) {
      defaults[key] = false;
    } else if (field instanceof z.ZodOptional) {
      const innerType = field._def.innerType;
      if (innerType instanceof z.ZodString) {
        defaults[key] = '';
      } else if (innerType instanceof z.ZodNumber) {
        defaults[key] = 0;
      } else if (innerType instanceof z.ZodBoolean) {
        defaults[key] = false;
      }
    }
  });
  
  return defaults;
};
