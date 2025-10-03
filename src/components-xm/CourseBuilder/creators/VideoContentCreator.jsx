import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Video, Save, Upload, Globe, Clock, Play } from "lucide-react";

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
    <div className="mx-auto p-4 space-y-8">
      {/* Enhanced Header Section */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {mode === "edit" ? "Edit Video Content" : "Create Video Content"}
                </CardTitle>
                <p className="text-gray-600">
                  {mode === "edit"
                    ? "Update the video lesson"
                    : "Add an engaging video lesson to your course"}
                </p>
              </div>
            </div>
            {form.watch('duration') > 0 && (
              <Badge variant="secondary" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                {Math.floor(form.watch('duration') / 60)}:{String(form.watch('duration') % 60).padStart(2, '0')}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Enhanced Video Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Play className="h-4 w-4 text-purple-600" />
                </div>
                Video Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-1">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Introduction to JavaScript Variables" 
                          className="h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what learners will gain from this video..."
                          rows={4}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Help learners understand the video content and objectives
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Video Source Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Upload className="h-4 w-4 text-green-600" />
                </div>
                Video Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Source Type Toggle */}
              <FormField
                control={form.control}
                name="videoSourceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Source Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value="url" id="src-url" />
                          <label
                            htmlFor="src-url"
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <Globe className="h-4 w-4 text-blue-500" />
                            <div>
                              <div className="font-medium">URL/Embed</div>
                              <div className="text-xs text-gray-600">YouTube, Vimeo, etc.</div>
                            </div>
                          </label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value="upload" id="src-upload" />
                          <label
                            htmlFor="src-upload"
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <Upload className="h-4 w-4 text-green-500" />
                            <div>
                              <div className="font-medium">Upload File</div>
                              <div className="text-xs text-gray-600">MP4, WebM, etc.</div>
                            </div>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Choose how you want to add your video content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Video URL Field (conditional) */}
              {form.watch("videoSourceType") === "url" && (
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        Video URL *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Supports YouTube, Vimeo, or direct video file URLs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Video Upload Field (conditional) */}
              {form.watch("videoSourceType") === "upload" && (
                <FormField
                  control={form.control}
                  name="videoFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Upload className="h-4 w-4 text-green-500" />
                        Upload Video File *
                      </FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <Input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            id="video-upload"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
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
                          <label htmlFor="video-upload" className="cursor-pointer">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              MP4, WebM, MOV up to 1GB
                            </div>
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Choose a video file from your computer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Enhanced Video Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                Video Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Duration Field */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Duration (seconds)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="86400"
                            placeholder="300"
                            className="h-11 pr-16"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                            {Math.floor((field.value || 0) / 60)}:{String((field.value || 0) % 60).padStart(2, '0')}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Video length in seconds (max 24 hours)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Thumbnail URL Field */}
                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Thumbnail URL (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/thumbnail.jpg"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Custom thumbnail image for the video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Form Actions */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {form.watch('videoSourceType') === 'url' ? 'Video URL' : 'File Upload'} •
                  {form.watch('duration') > 0 && (
                    <span> {Math.floor(form.watch('duration') / 60)}:{String(form.watch('duration') % 60).padStart(2, '0')}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      disabled={isLoading || form.formState.isSubmitting}
                      className="min-w-[100px]"
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || form.formState.isSubmitting}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white min-w-[140px] h-11"
                  >
                    {isLoading || form.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        <span>{mode === "edit" ? "Save Changes" : "Add Video"}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
