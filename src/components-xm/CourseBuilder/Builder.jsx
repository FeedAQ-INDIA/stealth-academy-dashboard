/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon";
import byoc1 from "@/assets/byoc_1.png";
import { useOrganizationStore } from "@/zustland/store";

export default function Builder() {
  const [urls, setUrls] = useState([""]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Course preview state
  const [courseStructure, setCourseStructure] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // selectedOrganization: null means general profile, object means organization selected
  const { selectedOrganization } = useOrganizationStore();

  useEffect(() => {
    console.log("Builder Debug - selectedOrganization:", selectedOrganization);
  }, [selectedOrganization]);

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
  };

  const addUrlField = () => setUrls([...urls, ""]);
  const removeUrlField = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  // Helper function to reset form
  const resetForm = () => {
    setUrls([""]);
    setCourseTitle("");
    setCourseDescription("");
    setCourseStructure(null);
    setShowPreview(false);
    setIsLoading(false); // Ensure loading state is also reset
  };

  // Course preview component
  const CoursePreview = ({ courseData, onEdit }) => {
    if (!courseData) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No course data available</p>
          <Button onClick={onEdit} variant="outline" className="mt-4">
            Go Back to Editor
          </Button>
        </div>
      );
    }

    const { course, videoProcessed, contentCreated, aiGeneratedContent } = courseData;
    
    // Safety checks for required data
    if (!course) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">Error: Course data is incomplete</p>
          <Button onClick={onEdit} variant="outline" className="mt-4">
            Go Back to Editor
          </Button>
        </div>
      );
    }
    
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
            <div className="text-2xl font-bold text-blue-600">
              {contentCreated?.videoContent || 0}
            </div>
            <div className="text-sm text-blue-800">Videos</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {contentCreated?.writtenContent || 0}
            </div>
            <div className="text-sm text-green-800">Written Content</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {contentCreated?.flashcardSets || 0}
            </div>
            <div className="text-sm text-purple-800">Flashcard Sets</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {contentCreated?.quizSets || 0}
            </div>
            <div className="text-sm text-orange-800">Quiz Sets</div>
          </div>
        </div>

        {/* Video Content Preview */}
        {videoProcessed?.videos?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">📹 Video Content</h3>
            <div className="space-y-2">
              {videoProcessed.videos.map((video, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{video.videoTitle || 'Untitled Video'}</h4>
                    <div className="text-sm text-gray-500">
                      Duration: {video.duration ? Math.round(video.duration / 60) : 0} min
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
                  <div>📝 Total Video Contents: {aiGeneratedContent.totalVideoContents || 0}</div>
                  <div>🃏 Total Flashcards: {contentCreated?.totalFlashcards || 0}</div>
                  <div>❓ Total Quiz Questions: {contentCreated?.totalQuizQuestions || 0}</div>
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const deduped = Array.from(
      new Set(urls.map((u) => u.trim()).filter((u) => u !== ""))
    );
    const validUrls = deduped;
    
    // Check for minimum requirements
    if (validUrls.length === 0) {
      toast({
        title: "Please enter at least one URL",
        description: "You need to provide at least one content URL to create a course.",
        variant: "destructive",
      });
      return;
    }

    if (!courseTitle.trim()) {
      toast({
        title: "Please enter a course title",
        description: "Course title is required to create your course.",
        variant: "destructive",
      });
      return;
    }

    if (courseTitle.trim().length < 3) {
      toast({
        title: "Course title too short",
        description: "Please provide a course title with at least 3 characters.",
        variant: "destructive",
      });
      return;
    }

    // Enhanced URL validation with better error messaging
    const invalidUrls = validUrls.filter((url) => !isValidHttpUrl(url));
    if (invalidUrls.length > 0) {
      toast({
        title: "Invalid URLs detected",
        description: `Please check: ${invalidUrls.slice(0, 2).join(", ")}${
          invalidUrls.length > 2 ? ` and ${invalidUrls.length - 2} more` : ""
        }`,
        variant: "destructive",
      });
      return;
    }

    // Check for organization context if needed
    // If an organization-specific context is required but none selected (edge case)
    if (selectedOrganization === undefined) {
      toast({
        title: "Organization context missing",
        description: "Please select a valid organization or switch to General profile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        orgId: localStorage.getItem("fa_selected_org_v1") || null,
        status: "DRAFT",
        urls: validUrls, // Include the validated URLs
        courseBuilderData: {
          courseTitle: courseTitle.trim(),
          courseDescription: courseDescription.trim(),
          sourceUrls: validUrls, // Also include in courseBuilderData for redundancy
        }
      };

      const response = await axiosConn.post("/createOrUpdateCourseBuilder", payload);

      if (response.data) {
        toast({
          title: "Course created successfully!",
          description: "Your course structure has been generated and is ready for preview.",
        });
        
        // Set course structure for preview
        setCourseStructure(response.data.data);
        setShowPreview(true);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      
      // Enhanced error handling with specific messages
      let errorTitle = "Failed to create course";
      let errorDescription = "Please try again later.";
      
      if (error.response?.status === 400) {
        errorTitle = "Invalid course data";
        errorDescription = error.response.data?.message || "Please check your input and try again.";
      } else if (error.response?.status === 401) {
        errorTitle = "Authentication required";
        errorDescription = "Please sign in again to create a course.";
      } else if (error.response?.status === 403) {
        errorTitle = "Permission denied";
        errorDescription = "You don't have permission to create courses in this organization.";
      } else if (error.response?.status === 429) {
        errorTitle = "Too many requests";
        errorDescription = "Please wait a moment before creating another course.";
      } else if (error.response?.status >= 500) {
        errorTitle = "Server error";
        errorDescription = "Our servers are experiencing issues. Please try again later.";
      } else if (error.message.includes('Network')) {
        errorTitle = "Connection error";
        errorDescription = "Please check your internet connection and try again.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2">Course Title *</label>
              <Input
                type="text"
                placeholder="Enter your course title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="mb-4"
                disabled={isLoading}
                required
                minLength={3}
                maxLength={100}
              />
              {courseTitle.trim().length > 0 && courseTitle.trim().length < 3 && (
                <p className="text-sm text-yellow-600 mt-1">
                  Course title should be at least 3 characters long
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-2">
                Course Description
              </label>
              <Textarea
                placeholder="Enter a brief description of your course (optional)"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="mb-4 min-h-[100px]"
                disabled={isLoading}
                rows={4}
                maxLength={500}
              />
              {courseDescription.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {courseDescription.length}/500 characters
                </p>
              )}
            </div>
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
                    className={`flex-1 ${
                      url.trim() && !isValidHttpUrl(url.trim()) 
                        ? 'border-red-300 focus:border-red-500' 
                        : ''
                    }`}
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
            <Button type="submit" className="w-full" disabled={isLoading || !courseTitle.trim() || urls.filter(u => u.trim()).length === 0}>
              {isLoading
                ? "Analyzing & Building Course..."
                : "Analyze & Build Course"}
            </Button>
            {isLoading && (
              <div className="text-center text-sm text-gray-600 mt-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  This may take a few moments...
                </div>
              </div>
            )}
          </form>
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
