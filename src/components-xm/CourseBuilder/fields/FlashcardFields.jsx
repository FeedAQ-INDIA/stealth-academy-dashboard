import PropTypes from 'prop-types';
import { useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Zod validation schema for flashcard fields
const flashcardSchema = z.object({
  setTitle: z.string().min(1, 'Set title is required').min(3, 'Set title must be at least 3 characters'),
  setCategory: z.string().optional(),
  setDifficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'MIXED'], {
    required_error: 'Please select a difficulty level',
  }).default('MEDIUM'),
  estimatedDuration: z.coerce.number().min(1, 'Duration must be at least 1 minute').default(15),
  passingScore: z.coerce.number().min(0, 'Score must be 0 or higher').max(100, 'Score cannot exceed 100').default(70),
  allowShuffling: z.boolean().default(true),
  requireSequentialOrder: z.boolean().default(false),
  maxAttemptsPerSession: z.coerce.number().min(1, 'Must allow at least 1 attempt').default(3),
  visibility: z.enum(['COURSE_ONLY', 'PUBLIC', 'PRIVATE'], {
    required_error: 'Please select visibility',
  }).default('COURSE_ONLY'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
    required_error: 'Please select status',
  }).default('DRAFT'),
  setDescription: z.string().optional(),
  learningObjectives: z.string().optional(),
  setTags: z.string().optional(),
});

export default function FlashcardFields({ content, update, onManageFlashcards }) {
  // Memoize the set object to prevent unnecessary re-renders
  const set = useMemo(() => content.courseFlashcard || {}, [content.courseFlashcard]);
  const contentId = content.courseContent.courseContentId;
  const flashcards = content.flashcards || [];

  // Memoize default values to prevent form from resetting unnecessarily
  const defaultValues = useMemo(() => ({
    setTitle: set.setTitle || '',
    setCategory: set.setCategory || '',
    setDifficulty: set.setDifficulty || 'MEDIUM',
    estimatedDuration: set.estimatedDuration || 15,
    passingScore: set.passingScore ?? 70,
    allowShuffling: set.allowShuffling ?? true,
    requireSequentialOrder: set.requireSequentialOrder || false,
    maxAttemptsPerSession: set.maxAttemptsPerSession || 3,
    visibility: set.visibility || 'COURSE_ONLY',
    status: set.status || 'DRAFT',
    setDescription: set.setDescription || '',
    learningObjectives: (set.learningObjectives || []).join(', '),
    setTags: (set.setTags || []).join(', '),
  }), [set]);

  // Initialize form with Zod validation
  const form = useForm({
    resolver: zodResolver(flashcardSchema),
    defaultValues,
  });

  // Watch form values to sync with parent component
  const watchedValues = form.watch();

  // Memoize the update function to prevent unnecessary re-renders
  const updateCallback = useCallback((field, value) => {
    if (set[field] !== value) {
      update(contentId, field, value);
    }
  }, [contentId, update, set]);

  // Update parent component when form values change
  useEffect(() => {
    const values = form.getValues();
    
    // Convert comma-separated strings back to arrays
    const processedValues = {
      ...values,
      learningObjectives: values.learningObjectives
        ? values.learningObjectives.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      setTags: values.setTags
        ? values.setTags.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    };

    // Update each field in the parent component
    Object.entries(processedValues).forEach(([field, value]) => {
      updateCallback(field, value);
    });
  }, [watchedValues, updateCallback, form]);

  // Reset form when content changes from outside
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="setTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Set Title *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="E.g. Key Terms" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="setCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Topic / Module" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="setDifficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                    <SelectItem value="MIXED">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Duration (min)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passingScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passing Score (%)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={100} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="allowShuffling"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 pt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mb-0">Allow Shuffle</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requireSequentialOrder"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 pt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mb-0">Require Order</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxAttemptsPerSession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Attempts/Session</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="COURSE_ONLY">Course Only</SelectItem>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="setDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  {...field}
                  placeholder="What learners will practice..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="learningObjectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Objectives (comma separated)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Recall terms, Understand concepts, ..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="setTags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="tag1, tag2, tag3"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onManageFlashcards}
            className="text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Manage Flashcards ({flashcards.length})
          </button>
          <p className="text-[10px] text-gray-500">Add at least one flashcard before publishing.</p>
        </div>
      </div>
    </Form>
  );
}

FlashcardFields.propTypes = {
  content: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  onManageFlashcards: PropTypes.func
};