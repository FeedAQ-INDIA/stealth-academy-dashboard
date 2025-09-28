import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, X, Save } from "lucide-react";

export default function WrittenContentCreator({ onAdd, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    estimatedReadTime: 5,
    category: "Written Content"
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
      contentType: "CourseWritten",
      courseContent: {
        courseContentId: `temp_${Date.now()}`, // Temporary ID
        courseContentTitle: formData.title,
        courseContentCategory: formData.category,
        courseContentDuration: formData.estimatedReadTime * 60, // Convert minutes to seconds
        isActive: true,
        coursecontentIsLicensed: false
      },
      courseWritten: {
        courseWrittenContent: formData.content,
        courseWrittenSummary: formData.summary,
        estimatedReadTime: formData.estimatedReadTime
      }
    };

    await onAdd?.(newContent);
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="written-title">Title *</Label>
            <Input
              id="written-title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter article title"
              required
            />
          </div>

          <div>
            <Label htmlFor="written-summary">Summary</Label>
            <Textarea
              id="written-summary"
              value={formData.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              placeholder="Brief summary of the content"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="written-content">Content *</Label>
            <Textarea
              id="written-content"
              value={formData.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Write your content here... (supports Markdown)"
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can use Markdown formatting (# headers, **bold**, *italic*, etc.)
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="written-readtime">Estimated Read Time (minutes)</Label>
              <Input
                id="written-readtime"
                type="number"
                min="1"
                value={formData.estimatedReadTime}
                onChange={(e) => updateField("estimatedReadTime", parseInt(e.target.value) || 5)}
                placeholder="5"
              />
            </div>

            <div>
              <Label htmlFor="written-category">Category</Label>
              <select
                id="written-category"
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Written Content">Written Content</option>
                <option value="Resource">Resource</option>
                <option value="Interactive Content">Interactive Content</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Add Written Content
          </Button>
        </div>
      </form>
    </div>
  );
}
