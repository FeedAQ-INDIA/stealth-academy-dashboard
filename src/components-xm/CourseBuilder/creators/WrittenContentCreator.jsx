import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { FileText, Save, Clock, Edit3, Link, BookOpen } from "lucide-react";

// Zod schema for written content validation (aligned with backend entity)
const writtenContentSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must be less than or equal to 200 characters"), // entity allows 200
    content: z
      .string()
      .max(50000, "Content must be less than 50000 characters")
      .optional()
      .or(z.literal("")), // backend TEXT; generous limit client-side
    contentSource: z.enum(["text", "embed"]).default("text"),
    embedUrl: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    estimatedReadTime: z.coerce
      .number()
      .min(1, "Read time must be at least 1 minute")
      .max(120, "Read time must be less than 2 hours")
  })
  .superRefine((data, ctx) => {
    if (data.contentSource === "embed") {
      if (!data.embedUrl || !data.embedUrl.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["embedUrl"],
          message: "Embed URL is required when content source is embed",
        });
      }
    } else {
      const content = data.content || "";
      if (!content.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["content"],
          message: "Content is required when content source is text",
        });
      } else if (content.trim().length < 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["content"],
          message: "Content must be at least 50 characters",
        });
      }
    }
  });

export default function WrittenContentCreator({
  onAdd,
  onUpdate,
  onCancel,
  isLoading = false,
  courseContentSequence = 1,
  mode = "create",
  existingContent = null,
}) {
  const form = useForm({
    resolver: zodResolver(writtenContentSchema),
    defaultValues: {
      title:
        existingContent?.courseContentTitle ||
        existingContent?.courseContentTypeDetail?.courseWrittenTitle ||
        "",
      content:
        existingContent?.courseContentTypeDetail?.courseWrittenContent || "",
      contentSource: existingContent?.courseContentTypeDetail?.courseWrittenEmbedUrl
        ? "embed"
        : "text",
      embedUrl:
        existingContent?.courseContentTypeDetail?.courseWrittenEmbedUrl || "",
      estimatedReadTime:
        existingContent?.courseContentTypeDetail?.estimatedReadTime ||
        (existingContent?.courseContentDuration
          ? Math.max(1, Math.round(existingContent.courseContentDuration / 60))
          : 5),
    },
  });

  const handleSubmit = async (data) => {
    try {
      // Create the content structure expected by the parent
      const newContent = {
        contentType: "CourseWritten",
        courseContentId:
          existingContent?.courseContentId || `temp_${Date.now()}`, // Keep original ID if editing
        courseContentTitle: data.title,
        courseContentCategory: "Written Content",
        courseContentType: "CourseWritten",
        courseContentSequence:
          existingContent?.courseContentSequence || courseContentSequence,
        courseContentDuration: data.estimatedReadTime * 60, // Convert minutes to seconds
        isActive: true,
        coursecontentIsLicensed: false,
        metadata: existingContent?.metadata || {},
        courseContentTypeDetail: {
          courseWrittenTitle: data.title, // Matches CourseWritten.courseWrittenTitle field
          courseWrittenContent:
            data.contentSource === "embed" ? "" : data.content,
          courseWrittenEmbedUrl:
            data.contentSource === "embed" && data.embedUrl?.trim()
              ? data.embedUrl.trim()
              : null,
          courseWrittenUrlIsEmbeddable:
            data.contentSource === "embed" && !!data.embedUrl?.trim(),
          estimatedReadTime: data.estimatedReadTime,
          metadata: {
            ...(existingContent?.courseContentTypeDetail?.metadata || {}),
            contentMode: data.contentSource === "embed" ? "embed" : "text",
            wordCount:
              data.contentSource === "embed"
                ? 0
                : data.content.split(/\s+/).filter(Boolean).length,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
      if (mode === "edit") {
        await onUpdate?.(newContent);
      } else {
        await onAdd?.(newContent);
      }
    } catch (error) {
      console.error("Error submitting written content:", error);
    }
  };

  return (
    <div className="mx-auto p-4 space-y-8">
      {/* Enhanced Header Section */}
      <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {mode === "edit" ? "Edit Written Content" : "Create Written Content"}
                </CardTitle>
                <p className="text-gray-600">
                  {mode === "edit"
                    ? "Update the written lesson"
                    : "Create engaging written content for your learners"}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Clock className="h-3 w-3 mr-1" />
              {form.watch('estimatedReadTime')} min read
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Enhanced Content Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                Content Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Understanding React Hooks, Introduction to Machine Learning" 
                          className="h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content Source Selection */}
                <FormField
                  control={form.control}
                  name="contentSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Content Type</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val === "text") {
                            form.setValue("embedUrl", "");
                          }
                        }}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">
                            <div className="flex items-center gap-2">
                              <Edit3 className="h-4 w-4 text-green-500" />
                              <div>
                                <div className="font-medium">Written Text</div>
                                <div className="text-xs text-gray-600">Create text content directly</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="embed">
                            <div className="flex items-center gap-2">
                              <Link className="h-4 w-4 text-blue-500" />
                              <div>
                                <div className="font-medium">External Link</div>
                                <div className="text-xs text-gray-600">Link to external content</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose whether to write content directly or link to external resources
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Estimated Read Time */}
                <div className="max-w-xs">
                  <FormField
                    control={form.control}
                    name="estimatedReadTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Estimated Read Time (minutes)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="1"
                              max="120"
                              placeholder="5"
                              className="h-11 pr-16"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 5)
                              }
                            />
                            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Reading time in minutes (1-120)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Content Creation Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  {form.watch("contentSource") === "embed" ? (
                    <Link className="h-4 w-4 text-purple-600" />
                  ) : (
                    <Edit3 className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                {form.watch("contentSource") === "embed" ? "External Content" : "Written Content"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Embed URL Field (conditional) */}
              {form.watch("contentSource") === "embed" && (
                <FormField
                  control={form.control}
                  name="embedUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Link className="h-4 w-4 text-blue-500" />
                        External Resource URL *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://docs.google.com/document/... or https://medium.com/..."
                          className="h-11"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to external documents, articles, presentations, or other learning resources
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Content Field (conditional) */}
              {form.watch("contentSource") === "text" && (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-green-500" />
                        Article Content *
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Write your content here...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet points
- Support full
- Markdown syntax

[Links](https://example.com) and more!"
                            rows={15}
                            className="font-mono text-sm resize-none border-green-200 focus:border-green-500"
                            {...field}
                          />
                          <div className="bg-gray-50 border rounded-lg p-4">
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <Edit3 className="h-3 w-3" />
                              Markdown Formatting Guide
                            </h4>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div className="grid grid-cols-2 gap-2">
                                <code># Heading 1</code>
                                <code>**Bold Text**</code>
                                <code>## Heading 2</code>
                                <code>*Italic Text*</code>
                                <code>- Bullet List</code>
                                <code>[Link](url)</code>
                                <code>1. Numbered List</code>
                                <code>`Code`</code>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Create rich content using Markdown formatting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Enhanced Form Actions */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {form.watch('contentSource') === 'embed' ? 'External Link' : 'Written Article'} •
                  ~{form.watch('estimatedReadTime')} minute{form.watch('estimatedReadTime') !== 1 ? 's' : ''} read
                  {form.watch('contentSource') === 'text' && form.watch('content') && (
                    <span> • {form.watch('content').split(/\s+/).filter(Boolean).length} words</span>
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
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white min-w-[140px] h-11"
                  >
                    {isLoading || form.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        <span>{mode === "edit" ? "Save Changes" : "Create Content"}</span>
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
