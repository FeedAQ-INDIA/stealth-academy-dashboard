import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { videoSchema } from '@/utils/validationSchemas';

// Video subtype specific fields with Zod validation and React Hook Form
export default function VideoFields({ content, update }) {
  const video = content.courseVideo || {};
  const contentId = content.courseContent.courseContentId;

  // Initialize form with current values
  const form = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      courseVideoUrl: video.courseVideoUrl || '',
      duration: video.duration || 0,
      thumbnailUrl: video.thumbnailUrl || '',
      isPreview: video.isPreview || false,
      courseVideoDescription: video.courseVideoDescription || '',
    },
    mode: 'onChange', // Validate on change for better UX
  });

  // Watch form values and update parent component
  const watchedValues = form.watch();
  
  useEffect(() => {
    // Only update if form is valid and values have changed
    if (form.formState.isValid) {
      Object.entries(watchedValues).forEach(([field, value]) => {
        const currentValue = video[field];
        if (currentValue !== value) {
          update(contentId, field, value);
        }
      });
    }
  }, [watchedValues, form.formState.isValid, contentId, update, video]);

  // Reset form when content changes
  useEffect(() => {
    form.reset({
      courseVideoUrl: video.courseVideoUrl || '',
      duration: video.duration || 0,
      thumbnailUrl: video.thumbnailUrl || '',
      isPreview: video.isPreview || false,
      courseVideoDescription: video.courseVideoDescription || '',
    });
  }, [content, form]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="courseVideoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://youtube.com/watch?v=... or direct video URL"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (seconds) *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="thumbnailUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://.../thumb.jpg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isPreview"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 pt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mb-0">Preview Available</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="courseVideoDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Describe this video lesson..."
                  maxLength={1000}
                />
              </FormControl>
              <FormMessage />
              {field.value && (
                <p className="text-xs text-gray-500">
                  {field.value.length}/1000 characters
                </p>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

VideoFields.propTypes = {
  content: PropTypes.shape({
    courseContent: PropTypes.shape({
      courseContentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    courseVideo: PropTypes.shape({
      courseVideoUrl: PropTypes.string,
      duration: PropTypes.number,
      thumbnailUrl: PropTypes.string,
      isPreview: PropTypes.bool,
      courseVideoDescription: PropTypes.string,
    }),
  }).isRequired,
  update: PropTypes.func.isRequired,
};
