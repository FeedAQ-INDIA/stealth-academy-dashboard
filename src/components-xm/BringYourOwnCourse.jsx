import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon";
import byoc1 from "@/assets/byoc_1.png";

export default function BringYourOwnCourse() {
  const [urls, setUrls] = useState([""]);
  const [file, setFile] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const deduped = Array.from(
      new Set(urls.map((u) => u.trim()).filter((u) => u !== ""))
    );
    const validUrls = deduped;
    if (validUrls.length === 0) {
      toast({
        title: "Please enter at least one URL",
        variant: "destructive",
      });
      return;
    }

    if (!courseTitle.trim()) {
      toast({
        title: "Please enter a course title",
        variant: "destructive",
      });
      return;
    }

    // Generic URL validation (allow both YouTube and non-YouTube http/https links)
    const invalidUrls = validUrls.filter((url) => !isValidHttpUrl(url));
    if (invalidUrls.length > 0) {
      toast({
        title: "Please enter valid http(s) URLs",
        description: `Invalid: ${invalidUrls.slice(0, 3).join(", ")}${
          invalidUrls.length > 3 ? " …" : ""
        }`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        contentUrlsList: validUrls,
        courseTitle: courseTitle.trim(),
        courseDescription: courseDescription.trim(),
      };

      const response = await axiosConn.post("/createCourseFromUrls", payload);

      if (response.data) {
        toast({
          title: "Course imported successfully!",
        });
        // Reset form
        setUrls([""]);
        setCourseTitle("");
        setCourseDescription("");
        setFile(null);
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
          <h2 className="text-2xl font-bold">Bring Your Own Course</h2>
          <p className="text-muted-foreground mt-2">
            Enter YouTube video/playlist URLs or any other embeddable URLs. We'll analyze and build a
            structured course.
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
                required
              />
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
                rows={4}
              />
            </div>
            <div>
              <label className="block font-medium mb-2">
        Content URLs (YouTube Videos/Playlists or Other Embeddable URLs) *
              </label>
              {urls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input
                    type="url"
          placeholder={`Enter YouTube or embeddable URL #${
                      idx + 1
                    }`}
                    value={url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    className="flex-1"
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
            {/* <div>
                        <label className="block font-medium mb-2">Or upload a file</label>
                        <Input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
                        {file && (
                            <div className="mt-2 text-sm text-muted-foreground">
                                Selected file: {file.name}
                            </div>
                        )}
                    </div> */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Analyzing & Building Course..."
                : "Analyze & Build Course"}
            </Button>
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
