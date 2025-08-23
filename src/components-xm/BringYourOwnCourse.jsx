import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon";

export default function BringYourOwnCourse() {
    const [urls, setUrls] = useState([""]);
    const [file, setFile] = useState(null);
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
        const validUrls = urls.filter(url => url.trim() !== "");
        if (validUrls.length === 0) {
            toast({
                title: "Please enter at least one YouTube URL",
                variant: "destructive"
            });
            return;
        }

        if (!courseTitle.trim()) {
            toast({
                title: "Please enter a course title",
                variant: "destructive"
            });
            return;
        }

        // Validate YouTube URLs
        const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        const invalidUrls = validUrls.filter(url => !youtubeUrlRegex.test(url));
        
        if (invalidUrls.length > 0) {
            toast({
                title: "Please enter valid YouTube URLs",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                contentUrlsList: validUrls,
                courseTitle: courseTitle.trim(),
                courseDescription: courseDescription.trim()
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
                title: error.response?.data?.message || "Failed to import course. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-xl mx-auto my-10 shadow-lg">
            <CardHeader>
                <h2 className="text-2xl font-bold">Bring Your Own Course</h2>
                <p className="text-muted-foreground mt-2">
                    Enter YouTube video or playlist URLs. We'll analyze and build a structured course with quizzes for each topic, subtopic, and the entire course.
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
                        <label className="block font-medium mb-2">Course Description</label>
                        <Textarea
                            placeholder="Enter a brief description of your course (optional)"
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            className="mb-4 min-h-[100px]"
                            rows={4}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">YouTube URLs (Videos or Playlists) *</label>
                        {urls.map((url, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-2">
                                <Input
                                    type="url"
                                    placeholder={`Enter YouTube video or playlist URL #${idx + 1}`}
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
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                    >
                        {isLoading ? "Analyzing & Building Course..." : "Analyze & Build Course"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}