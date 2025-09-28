
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";
 import {
  Edit,
  Clock,
  Video,
  Eye,
  Save,
  X,
  Trash2,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import AddContentSheet from "./AddContentSheet";
import ContentTypeSelector from "./ContentTypeSelector";
import ContentCreator from "./creators/ContentCreator";
 
export default function PreviewBuilder() {
  const { CourseBuilderId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourseInfo, setEditingCourseInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sheet state management
  const [addContentSheetOpen, setAddContentSheetOpen] = useState(false);
  const [editContentSheetOpen, setEditContentSheetOpen] = useState(false);
  const [currentEditingContent, setCurrentEditingContent] = useState(null);
  const [selectedContentType, setSelectedContentType] = useState(null);

  // Helper functions
  const getContentTypeColor = (contentType) => {
    const colors = {
      'CourseVideo': 'text-blue-600 bg-blue-50',
      'CourseWritten': 'text-green-600 bg-green-50',
      'CourseQuiz': 'text-purple-600 bg-purple-50',
      'CourseFlashcard': 'text-yellow-600 bg-yellow-50',
      'CourseAssignment': 'text-red-600 bg-red-50'
    };
    return colors[contentType] || 'text-gray-600 bg-gray-50';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Data update handlers
  const updateCourseMetadata = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      course: {
        ...prev.course,
        [field]: value
      }
    }));
  };

  const addNewContent = () => {
    // Don't open sheet directly, let ContentTypeSelector handle it
  };

  const handleSelectContentType = (contentType) => {
    setSelectedContentType(contentType);
    setAddContentSheetOpen(true);
  };

  const handleAddContent = (newContent) => {
    setCourseData(prev => ({
      ...prev,
      courseContent: [...(prev.courseContent || []), newContent]
    }));
    setAddContentSheetOpen(false);
    setSelectedContentType(null);
    handleSave();
  };

  const handleCancelAddContent = () => {
    setAddContentSheetOpen(false);
    setSelectedContentType(null);
  };

  const openEditSheet = (content) => {
    setCurrentEditingContent(content);
    setEditContentSheetOpen(true);
  };

  const handleEditContent = (updatedContent) => {
    setCourseData(prev => ({
      ...prev,
      courseContent: prev.courseContent.map(content =>
        content.courseContent.courseContentId === updatedContent.courseContent.courseContentId
          ? updatedContent
          : content
      )
    }));
    setEditContentSheetOpen(false);
    setCurrentEditingContent(null);
    handleSave();
  };

  const handleDeleteContent = (contentId) => {
    setCourseData(prev => ({
      ...prev,
      courseContent: prev.courseContent.filter(c => c.courseContent.courseContentId !== contentId)
    }));
    setEditContentSheetOpen(false);
    setCurrentEditingContent(null);
    handleSave();
  };

  const moveContent = (contentId, direction) => {
    const currentIndex = courseData.courseContent.findIndex(c => c.courseContent.courseContentId === contentId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= courseData.courseContent.length) return;

    setCourseData(prev => {
      const newContent = [...prev.courseContent];
      [newContent[currentIndex], newContent[newIndex]] = [newContent[newIndex], newContent[currentIndex]];
      return { ...prev, courseContent: newContent };
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (CourseBuilderId && courseData?.courseBuilder?.courseBuilderId) {
        const response = await axiosConn.put(`/courseBuilder/${courseData.courseBuilder.courseBuilderId}`, {
          courseBuilderData: courseData.courseBuilder.courseBuilderData,
          course: courseData.course,
          courseContent: courseData.courseContent,
          status: courseData.courseBuilder.status,
          orgId: courseData.courseBuilder.orgId
        });

        if (response.data.success) {
          toast({
            title: "Course updated successfully!",
            description: "Your changes have been saved.",
          });
        }
      } else {
        toast({
          title: "Changes saved locally",
          description: "Your changes are preserved in the current session.",
        });
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Failed to update course",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch course data
  useEffect(() => {
    async function fetchData() {
      if (!CourseBuilderId) {
        setCourseData(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const res = await axiosConn.get(`/courseBuilder/${CourseBuilderId}`);
        const data = res?.data?.data?.courseBuilderData;
        setCourseData(data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [CourseBuilderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }

  if (!courseData) {
    return <div className="text-center py-8">No course data available</div>;
  }

  const { course, courseContent } = courseData;

  return (
    <div className="space-y-6 p-6">
      {/* Header with save functionality */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          {editingCourseInfo ? (
            <div className="space-y-3">
              <Input
                value={course?.courseTitle || ''}
                onChange={(e) => updateCourseMetadata('courseTitle', e.target.value)}
                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                placeholder="Course title..."
              />
              <Textarea
                value={course?.courseDescription || ''}
                onChange={(e) => updateCourseMetadata('courseDescription', e.target.value)}
                className="text-gray-600 border-0 px-0 resize-none focus-visible:ring-0"
                placeholder="Course description..."
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => {setEditingCourseInfo(false); handleSave();}}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingCourseInfo(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="cursor-pointer group" onClick={() => setEditingCourseInfo(true)}>
              <div className="flex items-center gap-2 group-hover:bg-gray-50 p-2 rounded">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {course?.courseTitle || 'Untitled Course'}
                  </h1>
                  <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors">
                    {course?.courseDescription || 'No description'}
                  </p>
                </div>
                <Edit className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 ml-6">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Course Content with inline editing */}
      <div>
        <div>
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Video className="h-5 w-5" />
              Course Content ({courseContent?.length || 0} items)
            </h3>
            <ContentTypeSelector onSelectType={handleSelectContentType} disabled={isLoading} />
          </div>
        </div>
        <div className="mt-4">
          {(!courseContent || courseContent.length === 0) ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No course content yet</h3>
              <p className="text-gray-500 mb-4">Add your first piece of content to get started.</p>
              <ContentTypeSelector onSelectType={handleSelectContentType} disabled={isLoading} />
            </div>
          ) : (
            <div className="space-y-3">
              {courseContent?.map((content, index) => (
                <div key={content.courseContent.courseContentId} className="border rounded-lg bg-white">
                  <div className="flex items-start gap-4 p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${getContentTypeColor(content.contentType)}`}>
                        {index + 1}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveContent(content.courseContent.courseContentId, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveContent(content.courseContent.courseContentId, 'down')}
                          disabled={index === courseContent.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {content.courseContent.courseContentTitle}
                      </h4>
                      
                      {content.courseVideo?.courseVideoDescription && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {content.courseVideo.courseVideoDescription}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(content.courseVideo?.duration)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {content.contentType}
                        </Badge>
                        {content.courseVideo?.isPreview && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Badge>
                        )}
                      </div>
                    </div>

                    {content.courseVideo?.thumbnailUrl && (
                      <img
                        src={content.courseVideo.thumbnailUrl}
                        alt={content.courseContent.courseContentTitle}
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditSheet(content)}
                        className="h-8 px-2"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this content?')) {
                            handleDeleteContent(content.courseContent.courseContentId);
                          }
                        }}
                        className="h-8 px-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Content Sheet */}
      <Sheet open={addContentSheetOpen} onOpenChange={setAddContentSheetOpen}>
        <SheetContent 
          side="bottom" 
          className="w-screen h-screen max-w-none py-8 inset-0 border-0"
        >
          {selectedContentType && (
            <ContentCreator
              contentType={selectedContentType}
              onAdd={handleAddContent}
              onCancel={handleCancelAddContent}
              isLoading={isLoading}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Content Sheet */}
      <Sheet open={editContentSheetOpen} onOpenChange={setEditContentSheetOpen}>
        <SheetContent 
          side="bottom" 
          className="w-screen h-screen max-w-none p-8 inset-0 border-0"
        >
         
        </SheetContent>
      </Sheet>
    </div>
  );
}
