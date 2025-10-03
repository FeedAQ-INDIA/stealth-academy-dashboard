/* eslint-disable react/prop-types */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon";
import byoc1 from "@/assets/byoc_1.png";

// Zod validation schema for bring your own course
const byocSchema = z.object({
  courseTitle: z
    .string()
    .min(1, "Course title is required")
    .min(3, "Course title must be at least 3 characters")
    .max(100, "Course title must not exceed 100 characters"),
  courseDescription: z
    .string()
    .max(500, "Course description must not exceed 500 characters")
    .optional(),
  urls: z
    .array(z.string().url("Please enter a valid URL"))
    .min(1, "At least one URL is required"),
});

export default function BringYourOwnCourse() {
  const [urls, setUrls] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Course preview state
  const [courseStructure, setCourseStructure] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Initialize form with Zod validation
  const form = useForm({
    resolver: zodResolver(byocSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      urls: [""],
    },
  });

  // Helpers
  const isValidHttpUrl = (value) => {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
    // Update form state
    form.setValue('urls', newUrls.filter(url => url.trim() !== ""));
  };

  const addUrlField = () => {
    const newUrls = [...urls, ""];
    setUrls(newUrls);
  };

  const removeUrlField = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    // Update form state
    form.setValue('urls', newUrls.filter(url => url.trim() !== ""));
  };

  // Helper function to reset form
  const resetForm = () => {
    setUrls([""]);
    form.reset({
      courseTitle: "",
      courseDescription: "",
      urls: [""],
    });
    setCourseStructure(null);
    setShowPreview(false);
  };

  // Course preview component
  const CoursePreview = ({ courseData, onEdit }) => {
    const { course, videoProcessed, contentCreated, aiGeneratedContent } = courseData;
    
    return (
      <div className="space-y-6">
        {/* Course Header */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">{course.courseTitle}</h2>
          <p className="text-gray-600 mt-2">{course.courseDescription}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>📅 Created: {new Date(course.createdAt).toLocaleDateString()}</span>
            <span>⏱️ Duration: {Math.round(course.courseDuration / 60)} min</span>
            <span>🏷️ Status: {course.status}</span>
          </div>
        </div>

        {/* Content Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{contentCreated.videoContent}</div>
            <div className="text-sm text-blue-800">Videos</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{contentCreated.writtenContent}</div>
            <div className="text-sm text-green-800">Written Content</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{contentCreated.flashcardSets}</div>
            <div className="text-sm text-purple-800">Flashcard Sets</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{contentCreated.quizSets}</div>
            <div className="text-sm text-orange-800">Quiz Sets</div>
          </div>
        </div>

        {/* Video Content Preview */}
        {videoProcessed.videos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">📹 Video Content</h3>
            <div className="space-y-2">
              {videoProcessed.videos.map((video, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{video.videoTitle}</h4>
                    <div className="text-sm text-gray-500">
                      Duration: {Math.round(video.duration / 60)} min
                    </div>
                  </div>
                  <div className="text-blue-600 text-sm">▶️ Video</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Generated Content Status */}
        {aiGeneratedContent && (
          <div className={`p-4 rounded-lg ${aiGeneratedContent.generationSuccessful ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <h3 className="text-lg font-semibold mb-2">
              🤖 AI-Generated Educational Content
            </h3>
            {aiGeneratedContent.generationSuccessful ? (
              <div className="text-green-800">
                <p>✅ AI content generation was successful!</p>
                <div className="mt-2 text-sm">
                  <div>📝 Total Video Contents: {aiGeneratedContent.totalVideoContents}</div>
                  <div>🃏 Total Flashcards: {contentCreated.totalFlashcards}</div>
                  <div>❓ Total Quiz Questions: {contentCreated.totalQuizQuestions}</div>
                </div>
              </div>
            ) : (
              <div className="text-yellow-800">
                <p>⚠️ AI content generation failed, but your course was still created successfully with the original content.</p>
                <p className="text-sm mt-1">Error: {aiGeneratedContent.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onEdit} variant="outline">
            ✏️ Edit Course Details
          </Button>
          <Button onClick={resetForm} variant="outline">
            🔄 Create Another Course
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            🚀 Go to Course
          </Button>
        </div>
      </div>
    );
  };

  const onSubmit = async (data) => {
    // Validate inputs
    const deduped = Array.from(
      new Set(data.urls.map((u) => u.trim()).filter((u) => u !== ""))
    );
    const validUrls = deduped;

    setIsLoading(true);

    try {
      const payload = {
        contentUrlsList: validUrls,
        courseTitle: data.courseTitle.trim(),
        courseDescription: data.courseDescription.trim(),
      };

      const response = await axiosConn.post("/createCourseFromUrls", payload);

      if (response.data) {
        toast({
          title: "Course created successfully!",
          description: "Your course structure has been generated and is ready for preview.",
        });
        
        // Set course structure for preview
        setCourseStructure(response.data.data);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Error importing course:", error);
      toast({
        title:
          error.response?.data?.message ||
          "Failed to import course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 md:p-4 gap-4">
      <Card className="bg-white md:col-span-3 mb-0 shadow-lg rounded-lg h-[calc(100svh-4em)] md:h-[calc(100svh-6em)] overflow-y-scroll">
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {showPreview ? "Course Preview" : "Bring Your Own Course"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {showPreview ? 
              "Your course has been successfully created! Review the structure below." :
              "Enter YouTube video/playlist URLs or any other embeddable URLs. We'll analyze and build a structured course."
            }
          </p>
        </CardHeader>
        <CardContent>
          {showPreview && courseStructure ? (
            <CoursePreview 
              courseData={courseStructure} 
              onEdit={() => setShowPreview(false)}
            />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="courseTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your course title"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courseDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter a brief description of your course (optional)"
                          className="min-h-[100px]"
                          rows={4}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <label className="block font-medium mb-2">
                    Content URLs (YouTube Videos/Playlists or Other Embeddable URLs) *
                  </label>
                  {urls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <Input
                        type="url"
                        placeholder={`Enter YouTube or embeddable URL #${idx + 1}`}
                        value={url}
                        onChange={(e) => handleUrlChange(idx, e.target.value)}
                        className="flex-1"
                        disabled={isLoading}
                      />
                      {urls.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeUrlField(idx)}
                          disabled={isLoading}
                        >
                          &times;
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addUrlField}
                    disabled={isLoading}
                    className="mt-2"
                  >
                    Add another URL
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading
                    ? "Analyzing & Building Course..."
                    : "Analyze & Build Course"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <div className="hidden md:block bg-white md:col-span-2 mb-0 md:h-[calc(100svh-6em)] ">
        <img
          src={byoc1}
          alt="Bring Your Own Course"
          className="w-full md:h-[calc(100svh-6em)] rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
