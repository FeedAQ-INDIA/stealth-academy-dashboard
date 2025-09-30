import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Video, Save } from "lucide-react";

// Zod schema for video content validation
const videoContentSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  videoUrl: z.string()
    .url("Please enter a valid URL")
    .refine((url) => {
      // Basic validation for common video platforms
      const videoPatterns = [
        /youtube\.com\/watch\?v=/,
        /youtu\.be\//,
        /vimeo\.com\//,
        /\.mp4$/,
        /\.webm$/,
        /\.ogg$/
      ];
      return videoPatterns.some(pattern => pattern.test(url));
    }, "Please enter a valid video URL (YouTube, Vimeo, or direct video file)")
    .optional()
    .or(z.literal("")),
  duration: z.coerce.number()
    .min(0, "Duration must be 0 or greater")
    .max(86400, "Duration must be less than 24 hours"), // 24 hours in seconds
  thumbnailUrl: z.string()
    .url("Please enter a valid thumbnail URL")
    .optional()
    .or(z.literal("")),
  category: z.enum(["Video Content", "Interactive Content", "Resource"], {
    required_error: "Please select a category"
  }),
  isPreview: z.boolean().default(false)
});

export default function VideoContentCreator({ 
  onAdd, 
  onUpdate,
  onCancel, 
  isLoading = false,
  courseContentSequence = 1,
  mode = "create",
  existingContent = null
}) {
  const form = useForm({
    resolver: zodResolver(videoContentSchema),
    defaultValues: {
      title: existingContent?.courseContent?.courseContentTitle || existingContent?.courseVideo?.courseVideoTitle || "",
      description: existingContent?.courseVideo?.courseVideoDescription || "",
      videoUrl: existingContent?.courseVideo?.courseVideoUrl || "",
      duration: existingContent?.courseVideo?.duration || existingContent?.courseContent?.courseContentDuration || 0,
      thumbnailUrl: existingContent?.courseVideo?.thumbnailUrl || "",
      isPreview: existingContent?.courseVideo?.isPreview || false,
      category: existingContent?.courseContent?.courseContentCategory || "Video Content"
    }
  });

  const handleSubmit = async (data) => {
    try {
      // Create the content structure expected by the parent
      const newContent = {
        contentType: "CourseVideo",
        courseContent: {
          courseContentId: existingContent?.courseContent?.courseContentId || `temp_${Date.now()}`, // Keep original ID if editing
          courseContentTitle: data.title,
          courseContentCategory: data.category,
          courseContentType: "CourseVideo",
          courseContentSequence: existingContent?.courseContent?.courseContentSequence || courseContentSequence,
          courseContentDuration: data.duration, // keep duration sync
          isActive: true,
          coursecontentIsLicensed: false,
          metadata: existingContent?.courseContent?.metadata || {}
        },
        courseVideo: {
          courseVideoTitle: data.title, // Matches CourseVideo.courseVideoTitle field
          courseVideoUrl: data.videoUrl,
          courseVideoDescription: data.description,
          duration: data.duration,
          thumbnailUrl: data.thumbnailUrl,
          isPreview: data.isPreview,
          metadata: existingContent?.courseVideo?.metadata || {}
        }
      };
      if (mode === 'edit') {
        await onUpdate?.(newContent);
      } else {
        await onAdd?.(newContent);
      }
    } catch (error) {
      console.error("Error submitting video content:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Video className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{mode === 'edit' ? 'Edit Video Content' : 'Add Video Content'}</h2>
            <p className="text-sm text-gray-600">{mode === 'edit' ? 'Update the video lesson' : 'Create a new video lesson'}</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Title Field */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter video title" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Field */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter video description"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description for the video content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Video URL Field */}
            <div>
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      YouTube, Vimeo, or direct video file URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thumbnail URL Field */}
            <div>
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://example.com/thumbnail.jpg"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration Field */}
            <div>
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (seconds)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        max="86400"
                        placeholder="300"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Duration in seconds (max 24 hours)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category Field */}
            <div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Video Content">Video Content</SelectItem>
                        <SelectItem value="Interactive Content">Interactive Content</SelectItem>
                        <SelectItem value="Resource">Resource</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

        
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading || form.formState.isSubmitting ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {mode === 'edit' ? 'Save Changes' : 'Add Video Content'}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading || form.formState.isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
