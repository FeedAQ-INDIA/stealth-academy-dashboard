import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function BringYourOwnCourse() {
    const [urls, setUrls] = useState([""]);
    const [file, setFile] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here
    };

    return (
        <Card className="max-w-xl mx-auto my-10 shadow-lg">
            <CardHeader>
                <h2 className="text-2xl font-bold">Bring Your Own Course</h2>
                <p className="text-muted-foreground mt-2">
                    Enter URLs or upload a file. We'll analyze and build a structured course with quizzes for each topic, subtopic, and the entire course.
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-medium mb-2">Course URLs</label>
                        {urls.map((url, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-2">
                                <Input
                                    type="url"
                                    placeholder={`Enter course URL #${idx + 1}`}
                                    value={url}
                                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                                    className="flex-1"
                                />
                                {/* {urls.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeUrlField(idx)}
                                    >
                                        &times;
                                    </Button>
                                )} */}
                            </div>
                        ))}
                        {/* <Button type="button" variant="outline" onClick={addUrlField}>
                            Add another URL
                        </Button> */}
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
                    <Button type="submit" className="w-full">
                        Analyze & Build Course
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}