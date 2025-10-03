import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
// If RadioGroup isn't available in your UI library, replace with a Select.
// Assuming shadcn/ui style components exist:
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// Removed category select imports (category field removed)
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

// Zod schema for video content validation (aligned with backend entity)
const videoContentSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must be less than or equal to 200 characters"), // entity allows 200
    description: z
      .string()
      .max(5000, "Description must be less than 5000 characters")
      .optional()
      .or(z.literal("")), // backend TEXT; generous limit client-side
    videoSourceType: z.enum(["url", "upload"]).default("url"),
    videoUrl: z
      .string()
      .url("Please enter a valid URL")
      .refine((url) => {
        const videoPatterns = [
          /youtube\.com\/watch\?v=/,
          /youtu\.be\//,
          /vimeo\.com\//,
          /\.mp4$/,
          /\.webm$/,
          /\.ogg$/,
        ];
        return videoPatterns.some((pattern) => pattern.test(url));
      }, "Please enter a valid video URL (YouTube, Vimeo, or direct video file)")
      .optional()
      .or(z.literal("")),
    // File object when uploading; validated conditionally
    videoFile: z.any().optional(),
    duration: z.coerce
      .number()
      .min(0, "Duration must be 0 or greater")
      .max(86400, "Duration must be less than 24 hours"),
    thumbnailUrl: z
      .string()
      .url("Please enter a valid thumbnail URL")
      .optional()
      .or(z.literal("")),
    isPreview: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.videoSourceType === "url" && !data.videoUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["videoUrl"],
        message: "Video URL is required when source type is URL",
      });
    }
    if (data.videoSourceType === "upload" && !data.videoFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["videoFile"],
        message: "Please select a video file to upload",
      });
    }
  });

export default function VideoContentCreator({
  onAdd,
  onUpdate,
  onCancel,
  isLoading = false,
  courseContentSequence = 1,
  mode = "create",
  existingContent = null,
  onUpload, // optional callback: async (file) => returns { url, duration? }
}) {
  const form = useForm({
    resolver: zodResolver(videoContentSchema),
    defaultValues: {
      title:
        existingContent?.courseContentTitle ||
        existingContent?.courseContentTypeDetail?.courseVideoTitle ||
        "",
      description:
        existingContent?.courseContentTypeDetail?.courseVideoDescription || "",
      videoSourceType: existingContent?.courseContentTypeDetail?.courseVideoUrl
        ? "url"
        : "upload",
      videoUrl: existingContent?.courseContentTypeDetail?.courseVideoUrl || "",
      videoFile: null,
      duration:
        existingContent?.courseContentTypeDetail?.duration ||
        existingContent?.courseContentDuration ||
        0,
      thumbnailUrl:
        existingContent?.courseContentTypeDetail?.thumbnailUrl || "",
      isPreview: existingContent?.courseContentTypeDetail?.isPreview || false,
    },
  });

  const processVideoUpload = async (data) => {
    if (data.videoSourceType !== "upload" || !data.videoFile)
      return { url: data.videoUrl, duration: data.duration };
    if (!onUpload) {
      // Parent must handle actual upload; we pass raw file upward for deferred handling
      return { url: "", duration: data.duration };
    }
    try {
      const result = await onUpload(data.videoFile); // Expect { url, duration? }
      return {
        url: result?.url || "",
        duration: result?.duration ?? data.duration,
      };
    } catch (e) {
      console.error("Video upload failed:", e);
      throw e;
    }
  };

  const handleSubmit = async (data) => {
    try {
      // Determine final URL / duration
      const uploadResult = await processVideoUpload(data);

      // Create the content structure expected by the parent
      const newContent = {
        contentType: "CourseVideo",
        courseContentId:
          existingContent?.courseContentId || `temp_${Date.now()}`, // Keep original ID if editing
        courseContentTitle: data.title,
        // Category removed; enforce constant for backend if required
        courseContentCategory: "Video Content",
        courseContentType: "CourseVideo",
        courseContentSequence:
          existingContent?.courseContentSequence || courseContentSequence,
        courseContentDuration: uploadResult.duration, // keep duration sync
        isActive: true,
        coursecontentIsLicensed: false,
        metadata: existingContent?.metadata || {},
        courseContentTypeDetail: {
          courseVideoTitle: data.title, // Matches CourseVideo.courseVideoTitle field
          courseVideoUrl: uploadResult.url || data.videoUrl || "",
          courseVideoDescription: data.description,
          duration: uploadResult.duration,
          thumbnailUrl: data.thumbnailUrl,
          isPreview: data.isPreview,
          metadata: existingContent?.courseContentTypeDetail?.metadata || {},
        },
      };
      if (mode === "edit") {
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
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === "edit" ? "Edit Video Content" : "Add Video Content"}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === "edit"
                ? "Update the video lesson"
                : "Create a new video lesson"}
            </p>
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
                      <Input placeholder="Enter video title" {...field} />
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

            {/* Source Type Toggle */}
            <div>
              <FormField
                control={form.control}
                name="videoSourceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Source</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="url" id="src-url" />
                          <label
                            htmlFor="src-url"
                            className="text-sm cursor-pointer"
                          >
                            URL
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="upload" id="src-upload" />
                          <label
                            htmlFor="src-upload"
                            className="text-sm cursor-pointer"
                          >
                            Upload
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Choose to embed via URL or upload a video file.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Video URL Field (conditional) */}
            {form.watch("videoSourceType") === "url" && (
              <div>
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL *</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://youtube.com/watch?v=..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        YouTube, Vimeo, or direct .mp4/.webm/.ogg file URL
                        (publicly accessible)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Video Upload Field (conditional) */}
            {form.watch("videoSourceType") === "upload" && (
              <div>
                <FormField
                  control={form.control}
                  name="videoFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Video *</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Basic client-side size limit (e.g., 1GB)
                              const maxBytes = 1024 * 1024 * 1024; // 1GB
                              if (file.size > maxBytes) {
                                form.setError("videoFile", {
                                  message: "File exceeds 1GB limit",
                                });
                              } else {
                                form.clearErrors("videoFile");
                              }
                            }
                            field.onChange(file || null);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Supported: common video formats. Max 1GB (adjust as
                        needed).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
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

            {/* Category Field removed */}
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
              {mode === "edit" ? "Save Changes" : "Add Video Content"}
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
