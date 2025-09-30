import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { FileText, Save } from "lucide-react";

// Zod schema with conditional validation depending on content source (text vs embed)
const writtenContentSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  // content can be optional when using embed mode; validated in superRefine
  content: z.string().optional().default(""),
  contentSource: z.enum(["text", "embed"]).default("text"),
  embedUrl: z.union([
    z.literal(""),
    z.string()
      .trim()
      .max(100, "Embed URL must be at most 100 characters")
      .url("Must be a valid URL")
  ]).optional(),
  estimatedReadTime: z.coerce.number()
    .min(1, "Read time must be at least 1 minute")
    .max(60, "Read time must be less than 60 minutes")
}).superRefine((data, ctx) => {
  if (data.contentSource === 'embed') {
    if (!data.embedUrl || !data.embedUrl.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Embed URL is required in embed mode", path: ["embedUrl"] });
    }
  } else {
    const content = data.content || "";
    if (!content.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Content is required when not using embed mode", path: ["content"] });
    } else if (content.trim().length < 50) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Content must be at least 50 characters", path: ["content"] });
    }
  }
});

export default function WrittenContentCreator({ 
  onAdd, 
  onUpdate,
  onCancel, 
  isLoading = false,
  courseContentSequence = 1,
  mode = 'create',
  existingContent = null
}) {
  const form = useForm({
    resolver: zodResolver(writtenContentSchema),
    defaultValues: {
  title: existingContent?.courseContent?.courseContentTitle || existingContent?.courseWritten?.courseWrittenTitle || "",
  content: existingContent?.courseWritten?.courseWrittenContent || "",
  contentSource: existingContent?.courseWritten?.courseWrittenEmbedUrl ? 'embed' : 'text',
  embedUrl: existingContent?.courseWritten?.courseWrittenEmbedUrl || "",
  estimatedReadTime: existingContent?.courseContent?.courseContentDuration ? Math.max(1, Math.round(existingContent.courseContent.courseContentDuration / 60)) : 5
    }
  });

  const handleSubmit = async (data) => {
    try {
      // Create the content structure expected by the parent
      const newContent = {
        contentType: "CourseWritten",
        courseContent: {
          courseContentId: existingContent?.courseContent?.courseContentId || `temp_${Date.now()}`,
          courseContentTitle: data.title,
          courseContentCategory: existingContent?.courseContent?.courseContentCategory || "Written Content",
          courseContentType: "CourseWritten",
          courseContentSequence: existingContent?.courseContent?.courseContentSequence || courseContentSequence,
          courseContentDuration: data.estimatedReadTime * 60, // Convert minutes to seconds
          isActive: true,
          coursecontentIsLicensed: false,
          metadata: existingContent?.courseContent?.metadata || {}
        },
        courseWritten: {
          courseWrittenTitle: data.title, // Matches CourseWritten.courseWrittenTitle field
          courseWrittenContent: data.contentSource === 'embed' ? "" : data.content,
          courseWrittenEmbedUrl: data.contentSource === 'embed' && data.embedUrl?.trim() ? data.embedUrl.trim() : null,
          courseWrittenUrlIsEmbeddable: data.contentSource === 'embed' && !!data.embedUrl?.trim(),
          metadata: {
            ...(existingContent?.courseWritten?.metadata || {}),
            estimatedReadTime: data.estimatedReadTime,
            contentMode: data.contentSource === 'embed' ? 'embed' : 'text',
            wordCount: data.contentSource === 'embed' ? 0 : data.content.split(/\s+/).filter(Boolean).length,
            lastUpdated: new Date().toISOString()
          }
        }
      };
      if (mode === 'edit') {
        await onUpdate?.(newContent);
      } else {
        await onAdd?.(newContent);
      }
    } catch (error) {
      console.error("Error submitting written content:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{mode === 'edit' ? 'Edit Written Content' : 'Add Written Content'}</h2>
            <p className="text-sm text-gray-600">{mode === 'edit' ? 'Update the written lesson' : 'Create a new article or written lesson'}</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4">
            {/* Title Field */}
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter article title" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Source & Conditional Fields */}
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="contentSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Source</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        if (val === 'text') {
                          form.setValue('embedUrl', "");
                        }
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="embed">Embedded URL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose whether content is written text or an external embed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch('contentSource') === 'embed' && (
                <FormField
                  control={form.control}
                  name="embedUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Embed URL *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://..." 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        External resource URL (YouTube, Loom, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {form.watch('contentSource') === 'text' && (
              <div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your content here... (supports Markdown)"
                          rows={10}
                          className="font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can use Markdown formatting (# headers, **bold**, *italic*, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Read Time */}
            <div>
              <FormField
                control={form.control}
                name="estimatedReadTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Read Time (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="1"
                        max="60"
                        placeholder="5"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                      />
                    </FormControl>
                    <FormDescription>
                      Time in minutes (1-60)
                    </FormDescription>
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
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading || form.formState.isSubmitting ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {mode === 'edit' ? 'Save Changes' : 'Add Written Content'}
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
