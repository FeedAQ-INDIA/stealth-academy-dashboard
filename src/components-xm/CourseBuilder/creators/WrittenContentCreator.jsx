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

// Zod schema for written content validation
const writtenContentSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string()
    .min(1, "Content is required")
    .min(50, "Content must be at least 50 characters")
    .max(10000, "Content must be less than 10,000 characters"),
  summary: z.string()
    .max(300, "Summary must be less than 300 characters")
    .optional(),
  estimatedReadTime: z.coerce.number()
    .min(1, "Read time must be at least 1 minute")
    .max(60, "Read time must be less than 60 minutes"),
  category: z.enum(["Written Content", "Resource", "Interactive Content"], {
    required_error: "Please select a category"
  })
});

export default function WrittenContentCreator({ 
  onAdd, 
  onCancel, 
  isLoading = false,
  courseContentSequence = 1 // Add sequence parameter
}) {
  const form = useForm({
    resolver: zodResolver(writtenContentSchema),
    defaultValues: {
      title: "",
      content: "",
      summary: "",
      estimatedReadTime: 5,
      category: "Written Content"
    }
  });

  const handleSubmit = async (data) => {
    try {
      // Create the content structure expected by the parent
      const newContent = {
        contentType: "CourseWritten",
        courseContent: {
          courseContentId: `temp_${Date.now()}`, // Temporary ID
          courseContentTitle: data.title,
          courseContentCategory: data.category,
          courseContentType: "CourseWritten",
          courseContentSequence: courseContentSequence, // Use passed sequence
          courseContentDuration: data.estimatedReadTime * 60, // Convert minutes to seconds
          isActive: true,
          coursecontentIsLicensed: false,
          metadata: {}
        },
        courseWritten: {
          courseWrittenTitle: data.title, // Matches CourseWritten.courseWrittenTitle field
          courseWrittenContent: data.content,
          courseWrittenDescription: data.summary, // Use summary as description
          metadata: {
            estimatedReadTime: data.estimatedReadTime,
            wordCount: data.content.split(' ').length,
            lastUpdated: new Date().toISOString()
          }
        }
      };

      await onAdd?.(newContent);
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
            <h2 className="text-xl font-semibold text-gray-900">Add Written Content</h2>
            <p className="text-sm text-gray-600">Create a new article or written lesson</p>
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

            {/* Summary Field */}
            <div>
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of the content"
                        rows={2}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional brief summary for the written content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Field */}
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

            {/* Read Time and Category */}
            <div className="grid gap-4 md:grid-cols-2">
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
                          <SelectItem value="Written Content">Written Content</SelectItem>
                          <SelectItem value="Resource">Resource</SelectItem>
                          <SelectItem value="Interactive Content">Interactive Content</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              Add Written Content
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
