import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Video, X, Save } from "lucide-react";

export default function VideoContentCreator({ onAdd, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    thumbnailUrl: "",
    isPreview: false,
    category: "Video Content"
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }
    
    // Create the content structure expected by the parent
    const newContent = {
      contentType: "CourseVideo",
      courseContent: {
        courseContentId: `temp_${Date.now()}`, // Temporary ID
        courseContentTitle: formData.title,
        courseContentCategory: formData.category,
        courseContentDuration: formData.duration,
        isActive: true,
        coursecontentIsLicensed: false
      },
      courseVideo: {
        courseVideoUrl: formData.videoUrl,
        courseVideoDescription: formData.description,
        duration: formData.duration,
        thumbnailUrl: formData.thumbnailUrl,
        isPreview: formData.isPreview
      }
    };

    await onAdd?.(newContent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Video className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Video Content</h2>
            <p className="text-sm text-gray-600">Create a new video lesson</p>
          </div>
        </div>
 
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="video-title">Title *</Label>
            <Input
              id="video-title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="video-description">Description</Label>
            <Textarea
              id="video-description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Enter video description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              type="url"
              value={formData.videoUrl}
              onChange={(e) => updateField("videoUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <Label htmlFor="video-thumbnail">Thumbnail URL</Label>
            <Input
              id="video-thumbnail"
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => updateField("thumbnailUrl", e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div>
            <Label htmlFor="video-duration">Duration (seconds)</Label>
            <Input
              id="video-duration"
              type="number"
              min="0"
              value={formData.duration}
              onChange={(e) => updateField("duration", parseInt(e.target.value) || 0)}
              placeholder="300"
            />
          </div>

          <div>
            <Label htmlFor="video-category">Category</Label>
            <select
              id="video-category"
              value={formData.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Video Content">Video Content</option>
              <option value="Interactive Content">Interactive Content</option>
              <option value="Resource">Resource</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isPreview}
                onChange={(e) => updateField("isPreview", e.target.checked)}
                className="rounded"
              />
              Make this video available as preview
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Add Video Content
          </Button>
        </div>
      </form>
    </div>
  );
}
