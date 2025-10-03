import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";
import {
  Edit,
  Clock,
  Video,
  Save,
  X,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import ContentTypeSelector from "./ContentTypeSelector";
import ContentCreator from "./creators/ContentCreator";

export default function PreviewBuilder() {
  const { CourseBuilderId } = useParams();
  const navigate = useNavigate();

  // Simplified state management
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourseInfo, setEditingCourseInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addContentSheetOpen, setAddContentSheetOpen] = useState(false);
  const [editContentSheetOpen, setEditContentSheetOpen] = useState(false);
  const [currentEditingContent, setCurrentEditingContent] = useState(null);
  const [selectedContentType, setSelectedContentType] = useState(null);

  // Helper functions
  const getContentTypeColor = (contentType) => {
    const colors = {
      CourseVideo: "text-blue-600 bg-blue-50",
      CourseWritten: "text-green-600 bg-green-50",
      CourseQuiz: "text-purple-600 bg-purple-50",
      CourseFlashcard: "text-yellow-600 bg-yellow-50",
      CourseAssignment: "text-red-600 bg-red-50",
    };
    return colors[contentType] || "text-gray-600 bg-gray-50";
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const prepareContentForApi = (content) => {
    return (content || []).map((item, idx) => {
      // eslint-disable-next-line no-unused-vars
      const { _local, ...cleanItem } = item;
      return {
        ...cleanItem,
        courseContentSequence: item.courseContentSequence || idx + 1,
        updatedAt: new Date().toISOString()
      };
    });
  };

  // Event handlers
  const handleSelectContentType = (contentType) => {
    setSelectedContentType(contentType);
    setAddContentSheetOpen(true);
  };

  const handleAddContent = (newContent) => {
    console.log(newContent)
    const seq = (courseData?.courseContent?.length || 0) + 1;
    if (newContent?.courseContentSequence !== undefined) {
      newContent.courseContentSequence = seq;
    }
    setCourseData((prev) => ({
      ...prev,
      courseContent: [...(prev.courseContent || []), newContent],
    }));
    setAddContentSheetOpen(false);
    setSelectedContentType(null);
    // handleSave({ silent: true });
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
    console.log(updatedContent)
    setCourseData((prev) => {
      const updatedCourseContent = prev.courseContent.map((content) =>
        content?.courseContentId === updatedContent?.courseContentId
          ? updatedContent
          : content
      );
      return { ...prev, courseContent: updatedCourseContent };
    });
    setEditContentSheetOpen(false);
    setCurrentEditingContent(null);
    // handleSave({ silent: true });
  };

  const handleDeleteContent = (contentId) => {
    setCourseData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.filter(
        (c) => c.courseContentId !== contentId
      ),
    }));
    setEditContentSheetOpen(false);
    setCurrentEditingContent(null);
    // handleSave({ silent: true });
  };

  const moveContent = (contentId, direction) => {
    const currentIndex = courseData.courseContent.findIndex(
      (c) => c.courseContentId === contentId
    );
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= courseData.courseContent.length) return;

    setCourseData((prev) => {
      const newContent = [...prev.courseContent];
      [newContent[currentIndex], newContent[newIndex]] = [
        newContent[newIndex],
        newContent[currentIndex],
      ];
      const resequenced = newContent.map((c, idx) => ({
        ...c,
        courseContentSequence: idx + 1,
      }));
      return { ...prev, courseContent: resequenced };
    });
    // setTimeout(() => handleSave({ silent: true }), 500);
  };

  const handleSave = async (options = {}) => {
    const { statusOverride, silent } = options;
    
    if (!CourseBuilderId || !courseData?.courseBuilder?.courseBuilderId) {
      if (!silent) {
        toast({
          title: "Changes saved locally",
          description: "Create the course first to persist changes.",
        });
      }
      return;
    }

    setIsLoading(true);
    try {
      const originalBuilderData = courseData.courseBuilder.courseBuilderData || {};
      const cleanedContent = prepareContentForApi(courseData.courseContent);
      
      const payload = {
        courseBuilderId: courseData.courseBuilder.courseBuilderId,
        status: statusOverride || courseData.courseBuilder.status || "DRAFT",
        orgId: courseData.courseBuilder.orgId,
        courseBuilderData: {
          ...originalBuilderData,
          courseTitle: courseData.course.courseTitle,
          courseDescription: courseData.course.courseDescription,
          courseId: courseData.course.courseId,
          status: courseData.course.status,
          deliveryMode: courseData.course.deliveryMode,
          courseType: courseData.course.courseType,
          courseDuration: courseData.course.courseDuration,
          courseImageUrl: courseData.course.courseImageUrl,
          courseSourceChannel: courseData.course.courseSourceChannel,
          metadata: courseData.course.metadata,
          courseContent: cleanedContent,
        },
      };

      const response = await axiosConn.post("/createOrUpdateCourseBuilder", payload);

      if (response.data.success) {
        const updatedData = response.data.data;
        if (statusOverride && statusOverride !== courseData.courseBuilder.status) {
          setCourseData((prev) => ({
            ...prev,
            courseBuilder: { ...prev.courseBuilder, ...updatedData },
          }));
        }
        if (!silent) {
          const isPublish = statusOverride === "PUBLISHED";
          toast({
            title: isPublish ? "Course published!" : "Course updated successfully!",
            description: isPublish ? "Your course is now live." : "Your changes have been saved.",
          });
        }
      }
    } catch (error) {
      console.error("Error updating course:", error);
      if (!silent) {
        toast({
          title: "Failed to update course",
          description: error.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => handleSave({ statusOverride: "DRAFT" });

  const handlePublish = async () => {
    if (isLoading) return;
    
    const validations = [
      { condition: !courseData?.course?.courseTitle, title: "Add a course title", description: "A title is required before publishing." },
      { condition: !courseData?.courseContent?.length, title: "Add content", description: "At least one content item is required to publish." },
      { condition: !courseData?.courseBuilder?.courseBuilderId, title: "Create a draft first", description: "Save the course at least once before publishing." }
    ];

    for (const validation of validations) {
      if (validation.condition) {
        toast({
          title: validation.title,
          description: validation.description,
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      const cleanedContent = prepareContentForApi(courseData.courseContent);
      const payload = {
        data: {
          courseBuilderId: courseData.courseBuilder.courseBuilderId,
          userId: courseData.courseBuilder.userId,
          orgId: courseData.courseBuilder.orgId || null,
          status: "PUBLISHED",
          courseBuilderData: {
            ...courseData.courseBuilder.courseBuilderData,
            courseTitle: courseData.course.courseTitle,
            courseDescription: courseData.course.courseDescription,
            status: "PUBLISHED",
            courseContent: cleanedContent,
          },
        },
      };
      
      const res = await axiosConn.post("/publishCourse", payload);
      if (res.data?.success) {
        setCourseData((prev) => ({
          ...prev,
          courseBuilder: { ...prev.courseBuilder, status: "PUBLISHED" },
        }));
        toast({
          title: "Course published!",
          description: "Your course is now live.",
        });
      } else {
        throw new Error(res.data?.message || "Publish failed");
      }
    } catch (e) {
      console.error("Publish error", e);
      toast({
        title: "Publish failed",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
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
        const apiData = res?.data?.data;

        if (!apiData?.courseBuilderId) {
          setError("Invalid course builder response");
          setCourseData(null);
          return;
        }

        const courseBuilderData = apiData.courseBuilderData || {};
        const rawContent = Array.isArray(courseBuilderData.courseContent)
          ? courseBuilderData.courseContent
          : [];
        const normalizedContent = rawContent.sort(
          (a, b) => (a.courseContentSequence || 0) - (b.courseContentSequence || 0)
        );

        const normalizedCourseData = {
          course: {
            courseId: courseBuilderData.courseId,
            courseTitle: courseBuilderData.courseTitle,
            courseDescription: courseBuilderData.courseDescription,
            courseType: courseBuilderData.courseType,
            deliveryMode: courseBuilderData.deliveryMode,
            courseDuration: courseBuilderData.courseDuration,
            courseImageUrl: courseBuilderData.courseImageUrl,
            courseSourceChannel: courseBuilderData.courseSourceChannel,
            status: courseBuilderData.status,
            metadata: courseBuilderData.metadata,
          },
          courseContent: normalizedContent,
          courseBuilder: {
            courseBuilderId: apiData.courseBuilderId,
            userId: apiData.userId,
            orgId: apiData.orgId,
            status: apiData.status,
            courseBuilderData: courseBuilderData,
          },
        };

        setCourseData(normalizedCourseData);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to load course");
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

  const totalDurationSeconds = (courseData?.courseContent || []).reduce(
    (sum, c) => sum + (c?.courseContentDuration || 0),
    0
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header with save functionality */}
      <div className="mb-6">
        <div className="flex-1">
          {editingCourseInfo ? (
            <div className="space-y-3">
              <Input
                value={courseData?.course?.courseTitle || ""}
                onChange={(e) => setCourseData(prev => ({
                  ...prev,
                  course: { ...prev.course, courseTitle: e.target.value }
                }))}
                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                placeholder="Course title..."
              />
              <Textarea
                value={courseData?.course?.courseDescription || ""}
                onChange={(e) => setCourseData(prev => ({
                  ...prev,
                  course: { ...prev.course, courseDescription: e.target.value }
                }))}
                className="text-gray-600 border-0 px-0 resize-none focus-visible:ring-0"
                placeholder="Course description..."
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingCourseInfo(false);
                    handleSave();
                  }}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingCourseInfo(false)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
              onClick={() => setEditingCourseInfo(true)}
            >
              <div className="flex items-center gap-2 group-hover:bg-gray-50 rounded w-full">
                <div className="flex-1 text-left">
                  <div className="flex items-start gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {courseData?.course?.courseTitle || "Untitled Course"}
                    </h1>
                    {courseData?.courseBuilder?.status && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${
                          courseData.courseBuilder.status === "PUBLISHED"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {courseData.courseBuilder.status}
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      {courseData?.courseContent?.length || 0} items · {formatDuration(totalDurationSeconds)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors max-w-3xl">
                    {courseData?.course?.courseDescription || "No description"}
                  </p>
                </div>
                <Edit className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </Button>
          )}
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="text-xs text-gray-500 order-2 sm:order-1">
            {isLoading && (
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></span>
                <span>Saving…</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2 justify-end">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="min-w-[110px]"
            >
              {isLoading ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isLoading || courseData?.courseBuilder?.status === "PUBLISHED"}
              className={`min-w-[150px] ${
                courseData?.courseBuilder?.status === "PUBLISHED"
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isLoading ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {courseData?.courseBuilder?.status === "PUBLISHED"
                ? "Published"
                : "Publish Course"}
            </Button>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <Video className="h-5 w-5" />
            Course Content ({courseData?.courseContent?.length || 0} items)
          </h3>
          <ContentTypeSelector
            onSelectType={handleSelectContentType}
            disabled={isLoading}
          />
        </div>
        
        <div className="mt-4">
          {!courseData?.courseContent?.length ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No course content yet
              </h3>
              <p className="text-gray-500 mb-4">
                Add your first piece of content to get started.
              </p>
              <ContentTypeSelector
                onSelectType={handleSelectContentType}
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {courseData.courseContent.map((content, index) => (
                <div
                  key={content?.courseContentId}
                  className="border rounded-lg bg-white"
                >
                  <div className="flex items-start gap-4 p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${getContentTypeColor(
                          content.contentType
                        )}`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveContent(content?.courseContentId, "up")}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveContent(content?.courseContentId, "down")}
                          disabled={index === courseData.courseContent.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {content?.courseContentTitle}
                      </h4>

                      {content.courseContentTypeDetail?.courseVideoDescription && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {content.courseContentTypeDetail.courseVideoDescription.length > 300
                            ? content.courseContentTypeDetail.courseVideoDescription.slice(0, 300) + "…"
                            : content.courseContentTypeDetail.courseVideoDescription}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(content?.courseContentDuration)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {content.courseContentType}
                        </Badge>

                        {content.courseContentTypeDetail?.channelTitle && (
                          <span
                            className="max-w-[140px] truncate"
                            title={content.courseContentTypeDetail.channelTitle}
                          >
                            {content.courseContentTypeDetail.channelTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {content.courseContentTypeDetail?.thumbnailUrl && (
                      <img
                        src={content.courseContentTypeDetail.thumbnailUrl}
                        alt={content?.courseContentTitle}
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
                          if (window.confirm("Are you sure you want to delete this content?")) {
                            handleDeleteContent(content?.courseContentId);
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

      {/* Sheets */}
      <Sheet open={addContentSheetOpen} onOpenChange={setAddContentSheetOpen}>
        <SheetContent side="bottom" className="w-screen h-screen max-w-none py-8 inset-0 border-0">
          {selectedContentType && (
            <ContentCreator
              contentType={selectedContentType}
              onAdd={handleAddContent}
              onCancel={handleCancelAddContent}
              isLoading={isLoading}
              courseContentSequence={(courseData?.courseContent?.length || 0) + 1}
            />
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={editContentSheetOpen} onOpenChange={setEditContentSheetOpen}>
        <SheetContent side="bottom" className="w-screen h-screen max-w-none p-8 inset-0 border-0">
          {currentEditingContent && (
            <ContentCreator
              contentType={currentEditingContent.courseContentType}
              mode="edit"
              existingContent={currentEditingContent}
              onUpdate={handleEditContent}
              onCancel={() => {
                setEditContentSheetOpen(false);
                setCurrentEditingContent(null);
              }}
              isLoading={isLoading}
              courseContentSequence={currentEditingContent.courseContentSequence}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}