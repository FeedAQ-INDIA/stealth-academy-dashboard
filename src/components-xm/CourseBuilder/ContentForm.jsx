import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, Trash2 } from "lucide-react";

const ContentForm = ({ 
  content = null, 
  courseData, 
  onSave, 
  onDelete, 
  onCancel,
  mode = 'add' // 'add' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "CourseVideo",
    videoUrl: "",
    duration: 0,
    isPublished: false,
    isPreview: false,
  });

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && content) {
      setFormData({
        title: content.courseContent?.courseContentTitle || "",
        description: content.courseVideo?.courseVideoDescription || content.courseWritten?.courseWrittenDescription || "",
        contentType: content.contentType || content.courseContent?.courseContentType || "CourseVideo",
        videoUrl: content.courseVideo?.courseVideoUrl || "",
        duration: content.courseVideo?.duration || content.courseContent?.courseContentDuration || 0,
        isPublished: content.courseContent?.isPublished || false,
        isPreview: content.courseVideo?.isPreview || false,
      });
    }
  }, [content, mode]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (mode === 'edit' && content) {
      // Edit mode - update existing content
      const updatedContent = {
        ...content,
        contentType: formData.contentType,
        courseContent: {
          ...content.courseContent,
          courseContentTitle: formData.title,
          courseContentType: formData.contentType,
          courseContentDuration: formData.duration,
          isPublished: formData.isPublished,
          status: formData.isPublished ? "PUBLISHED" : "DRAFT",
          updatedAt: new Date().toISOString()
        }
      };

      if (formData.contentType === 'CourseVideo' && content.courseVideo) {
        updatedContent.courseVideo = {
          ...content.courseVideo,
          courseVideoTitle: formData.title,
          courseVideoDescription: formData.description,
          courseVideoUrl: formData.videoUrl,
          duration: formData.duration,
          isPreview: formData.isPreview,
          updatedAt: new Date().toISOString()
        };
      }

      onSave(updatedContent);
    } else {
      // Add mode - create new content
      const builderUserId = courseData?.courseBuilder?.userId || courseData?.course?.userId || 0;
      const courseid = courseData?.course?.courseId || 'temp_course';
      const newSequence = (courseData?.courseContent?.length || 0) + 1;
      const contentId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const now = new Date().toISOString();

      const newContent = {
        type: formData.contentType === 'CourseVideo' ? "youtube" : "written",
        sequence: newSequence,
        contentType: formData.contentType,
        courseContent: {
          courseContentId: contentId,
          courseId: courseid,
          courseContentTitle: formData.title,
          courseContentCategory: formData.contentType === 'CourseVideo' ? "Video Content" : "Written Content",
          courseContentType: formData.contentType,
          courseContentSequence: newSequence,
          courseContentDuration: formData.duration,
          coursecontentIsLicensed: false,
          isPublished: formData.isPublished,
          status: formData.isPublished ? "PUBLISHED" : "DRAFT",
          metadata: { 
            contentType: formData.contentType === 'CourseVideo' ? "YOUTUBE_VIDEO" : "WRITTEN",
            sequence: newSequence 
          },
          createdAt: now,
          updatedAt: now
        }
      };

      if (formData.contentType === 'CourseVideo') {
        newContent.courseVideo = {
          courseVideoId: `${contentId}_video`,
          userId: builderUserId,
          courseId: courseid,
          courseContentId: contentId,
          courseVideoTitle: formData.title,
          courseVideoDescription: formData.description,
          courseVideoUrl: formData.videoUrl,
          duration: formData.duration,
          thumbnailUrl: "",
          isPreview: formData.isPreview,
          status: "READY",
          createdAt: now,
          updatedAt: now
        };
      }

      onSave(newContent);
    }
  }, [formData, content, courseData, mode, onSave]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      onDelete?.(content?.courseContent?.courseContentId);
    }
  }, [content, onDelete]);

  const contentTypeOptions = useMemo(() => [
    { value: "CourseVideo", label: "Video" },
    { value: "CourseWritten", label: "Written" },
    { value: "CourseQuiz", label: "Quiz" },
    { value: "CourseFlashcard", label: "Flashcard" },
    { value: "CourseAssignment", label: "Assignment" }
  ], []);

  const title = mode === 'edit' ? 'Edit Content' : 'Add New Content';

  return (
    <div className="h-full flex flex-col">
      <div className="pb-6 border-b">
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter content title..."
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <Select
              value={formData.contentType}
              onValueChange={(value) => handleInputChange('contentType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.contentType === 'CourseVideo' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (seconds)
                </label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  type="url"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            placeholder="Enter content description..."
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => handleInputChange('isPublished', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
          
          {formData.contentType === 'CourseVideo' && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPreview}
                onChange={(e) => handleInputChange('isPreview', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Preview</span>
            </label>
          )}
        </div>
      </form>

      <div className={`flex items-center ${mode === 'edit' ? 'justify-between' : 'justify-end'} pt-6 border-t`}>
        {mode === 'edit' && onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Content
          </Button>
        )}
        
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {mode === 'edit' ? 'Save Changes' : 'Add Content'}
          </Button>
        </div>
      </div>
    </div>
  );
};

ContentForm.propTypes = {
  content: PropTypes.object,
  courseData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit'])
};

export default ContentForm;