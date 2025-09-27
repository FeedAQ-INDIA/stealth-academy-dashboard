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
import { useNavigate } from "react-router-dom";

export default function Builder() {
  const [urls, setUrls] = useState([""]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
    console.log(localStorage.getItem("fa_selected_org_v1"))
    try {
      const payload = {
        orgId: localStorage.getItem("fa_selected_org_v1") || null,
        status: "DRAFT",
        urls: validUrls, // Include the validated URLs
        courseBuilderData: {
          courseTitle: courseTitle.trim(),
          courseDescription: courseDescription.trim(),
          contentUrlsList: validUrls, // Also include in courseBuilderData for redundancy
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
        navigate(`/course-builder/${response.data.data.courseBuilder.courseBuilderId}`);
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
