import { useState, useEffect, useRef } from "react";
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
  Eye,
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

  // State management
  const [courseData, setCourseData] = useState(null);
  const [courseBuilderData, setCourseBuilderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourseInfo, setEditingCourseInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Sheet state management
  const [addContentSheetOpen, setAddContentSheetOpen] = useState(false);
  const [editContentSheetOpen, setEditContentSheetOpen] = useState(false);
  const [currentEditingContent, setCurrentEditingContent] = useState(null);
  const [selectedContentType, setSelectedContentType] = useState(null);
  const reorderSaveTimer = useRef(null);

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

  const internalItemToApi = (item, idx) => {
    if (!item) return item;
    const seq = item.courseContentSequence || idx + 1;
    const apiItem = {
      status: item.status || "DRAFT",
      courseId:
        courseData?.course?.courseId ||
        item.courseId ||
        "temp_course_id",
      metadata: {
        ...(item.metadata || {}),
        sequence: seq,
        contentType:
          item.courseContentTypeDetail?.metadata?.sourcePlatform === "YOUTUBE"
            ? "YOUTUBE_VIDEO"
            : item.metadata?.contentType || item.courseContentType,
      },
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished:
        (item.status || "").toUpperCase() === "PUBLISHED",
      courseContentId: item.courseContentId,
      courseContentType: item.courseContentType,
      courseContentTitle: item.courseContentTitle,
      courseContentCategory:
        item.courseContentCategory ||
        (item.courseContentType === "CourseVideo" ? "Video Content" : "Content"),
      courseContentDuration:
        item.courseContentTypeDetail?.duration ||
        item.courseContentDuration ||
        0,
      courseContentSequence: seq,
      coursecontentIsLicensed: false,
    };
    if (item.courseContentType === "CourseVideo") {
      apiItem.courseContentTypeDetail = {
        status: item.status || "READY",
        userId: courseData?.courseBuilder?.userId,
        courseId: courseData?.course?.courseId || "temp_course_id",
        duration: item.courseContentTypeDetail?.duration || 0,
        metadata: {
          videoId: item.courseContentTypeDetail?.metadata?.videoId,
          sourcePlatform: item.courseContentTypeDetail?.metadata?.sourcePlatform,
          channelTitle: item.courseContentTypeDetail?.metadata?.channelTitle,
          ...(item.courseContentTypeDetail?.metadata || {}),
        },
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPreview: item.courseContentTypeDetail?.isPreview || false,
        thumbnailUrl: item.courseContentTypeDetail?.thumbnailUrl,
        courseVideoId: item.courseContentTypeDetail?.courseVideoId,
        courseVideoUrl: item.courseContentTypeDetail?.courseVideoUrl,
        courseContentId: item.courseContentId,
        courseVideoTitle:
          item.courseContentTypeDetail?.courseVideoTitle ||
          item.courseContentTitle,
        courseVideoDescription: item.courseContentTypeDetail?.courseVideoDescription,
      };
    } else if (item.courseContentType === "CourseWritten") {
      apiItem.courseContentTypeDetail = {
        userId: courseData?.courseBuilder?.userId,
        courseId: courseData?.course?.courseId || "temp_course_id",
        metadata: item.metadata || {},
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseContentId: item.courseContentId,
        courseWrittenId: item.courseContentTypeDetail?.courseWrittenId,
        courseWrittenTitle: item.courseContentTitle,
        courseWrittenContent: item.courseContentTypeDetail?.courseWrittenContent,
        courseWrittenEmbedUrl: item.courseContentTypeDetail?.courseWrittenEmbedUrl,
        courseWrittenUrlIsEmbeddable:
          item.courseContentTypeDetail?.courseWrittenUrlIsEmbeddable,
      };
    }
    return apiItem;
  };

  // Helper to build payload for publishCourse API
  const buildPublishPayload = () => {
    if (!courseData?.courseBuilder?.courseBuilderId) return null;
    const originalBuilderData =
      courseData.courseBuilder.courseBuilderData || {};
    const existingCourseDetail = originalBuilderData || {};
    const cleanedContent = (courseData.courseContent || []).map((item) => {
      const { _local: _, ...rest } = item; // strip transient
      return rest;
    });
    const apiContent = cleanedContent.map(internalItemToApi);
    const updatedCourseDetail = {
      ...existingCourseDetail,
      courseTitle: courseData.course.courseTitle,
      courseDescription: courseData.course.courseDescription,
      courseId:
        courseData.course.courseId ||
        existingCourseDetail.courseId ||
        "temp_course_id",
      status: "PUBLISHED",
      deliveryMode:
        courseData.course.deliveryMode ||
        existingCourseDetail.deliveryMode ||
        "ONLINE",
      courseType:
        courseData.course.courseType ||
        existingCourseDetail.courseType ||
        "BYOC",
      courseDuration:
        courseData.course.courseDuration ||
        existingCourseDetail.courseDuration ||
        0,
      courseImageUrl:
        courseData.course.courseImageUrl ||
        existingCourseDetail.courseImageUrl ||
        null,
      courseSourceChannel:
        courseData.course.courseSourceChannel ||
        existingCourseDetail.courseSourceChannel ||
        null,
      metadata:
        courseData.course.metadata || existingCourseDetail.metadata || {},
      courseContent: apiContent,
    };
    const courseBuilderData = {
      ...originalBuilderData,
      ...updatedCourseDetail,
    };
    return {
      data: {
        courseBuilderId: courseData.courseBuilder.courseBuilderId,
        userId: existingCourseDetail.userId || courseData.courseBuilder.userId, // optional
        orgId: courseData.courseBuilder.orgId || null,
        status: "PUBLISHED",
        courseBuilderData,
      },
    };
  };

  // Data update handlers
  const updateCourseMetadata = (field, value) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectContentType = (contentType) => {
    setSelectedContentType(contentType);
    setAddContentSheetOpen(true);
  };

  const handleAddContent = (newContent) => {
    const seq = (courseData?.courseContent?.length || 0) + 1;
    if (newContent?.courseContentSequence !== undefined) {
      newContent.courseContentSequence = seq;
    }
    setCourseData((prev) => {
      const updated = {
        ...prev,
        courseContent: [...(prev.courseContent || []), newContent],
      };

      try {
        const previewJson = {
          course: updated.course,
          courseContent: updated.courseContent,
          courseBuilder: {
            courseBuilderId: updated.courseBuilder?.courseBuilderId,
            status: updated.courseBuilder?.status,
          },
        };
        // Only log for add action
        console.log(
          "[CourseBuilder] Content Added -> Updated JSON:",
          previewJson
        );
      } catch (e) {
        console.warn("Failed to log updated course JSON after add", e);
      }
      return updated;
    });
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
    console.log("Updated content from editor:", updatedContent);
    setCourseData((prev) => {
      const updatedCourseContent = prev.courseContent.map((content) =>
        content?.courseContentId === updatedContent?.courseContentId
          ? updatedContent
          : content
      );
      const updated = { ...prev, courseContent: updatedCourseContent };
      // Log updated JSON after editing existing content
      try {
 
        console.log(
          "[CourseBuilder] Content Edited -> Updated JSON:",
          updated
        );
      } catch (e) {
        console.warn("Failed to log updated course JSON after edit", e);
      }
      return updated;
    });
    setEditContentSheetOpen(false);
    setCurrentEditingContent(null);
    handleSave();
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
    handleSave();
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
    if (reorderSaveTimer.current) clearTimeout(reorderSaveTimer.current);
    reorderSaveTimer.current = setTimeout(() => {
      handleSave();
    }, 800);
  };

  const handleSave = async (options = {}) => {
    const { statusOverride, silent } = options;
    setIsLoading(true);
    try {
      if (CourseBuilderId && courseData?.courseBuilder?.courseBuilderId) {
        // Build updated courseBuilderData merging existing builder data with current edited state
        const originalBuilderData =
          courseData.courseBuilder.courseBuilderData || {};
        const existingCourseDetail = originalBuilderData.courseDetail || {};

        // Keep JSON format SAME as currently used in UI & provided sample:
        // Each item: { courseContentType, courseContentId, courseContentTitle, courseContentTypeDetail, ... }
        // Remove transient helper fields like _local before persisting.
        const cleanedContent = (courseData.courseContent || []).map((item) => {
          // eslint-disable-next-line no-unused-vars
          const { _local, ...rest } = item; // strip transient
          return rest;
        });

        const updatedCourseDetail = {
          ...existingCourseDetail,
          // Overwrite editable fields from current course state
          courseTitle: courseData.course.courseTitle,
          // description etc
          courseDescription: courseData.course.courseDescription,
          courseId: courseData.course.courseId,
          status: courseData.course.status,
          deliveryMode: courseData.course.deliveryMode,
          courseType: courseData.course.courseType,
          courseDuration: courseData.course.courseDuration,
          courseImageUrl: courseData.course.courseImageUrl,
          courseSourceChannel: courseData.course.courseSourceChannel,
          metadata: courseData.course.metadata,
          // Convert internal unified items -> API items
          courseContent: cleanedContent.map(internalItemToApi),
        };

        const updatedCourseBuilderData = {
          ...originalBuilderData,
          ...updatedCourseDetail,
        };

        const statusToSend =
          statusOverride || courseData.courseBuilder.status || "DRAFT";

        const payload = {
          courseBuilderId: courseData.courseBuilder.courseBuilderId,
          status: statusToSend,
          orgId: courseData.courseBuilder.orgId,
          courseBuilderData: updatedCourseBuilderData,
        };

        const response = await axiosConn.post(
          "/createOrUpdateCourseBuilder",
          payload
        );

        if (response.data.success) {
          // Update local courseBuilder data with the response data
          const updatedCourseBuilderData = response.data.data;
          
          // Update local status if changed
          if (
            statusOverride &&
            statusOverride !== courseData.courseBuilder.status
          ) {
            setCourseData((prev) => ({
              ...prev,
              courseBuilder: {
                ...prev.courseBuilder,
                courseBuilderId: updatedCourseBuilderData.courseBuilderId,
                status: updatedCourseBuilderData.status,
                orgId: updatedCourseBuilderData.orgId,
                userId: updatedCourseBuilderData.userId,
                courseBuilderData: updatedCourseBuilderData.courseBuilderData,
              },
            }));
          }
          if (!silent) {
            toast({
              title:
                statusOverride === "PUBLISHED"
                  ? "Course published!"
                  : "Course updated successfully!",
              description:
                statusOverride === "PUBLISHED"
                  ? "Your course is now live."
                  : "Your changes have been saved.",
            });
          }
        }
      } else {
        // No persisted courseBuilder yet: keep local state only
        toast({
          title: "Changes saved locally",
          description: "Create the course first to persist changes.",
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
      setIsPublishing(false);
      setIsSavingDraft(false);
    }
  };

  const handleSaveDraft = async () => {
    if (isLoading) return;
    setIsSavingDraft(true);
    await handleSave({ statusOverride: "DRAFT" });
  };

  const handlePublish = async () => {
    if (isLoading || isPublishing) return;
    if (!courseData?.course?.courseTitle) {
      toast({
        title: "Add a course title",
        description: "A title is required before publishing.",
        variant: "destructive",
      });
      return;
    }
    if (!courseData?.courseContent?.length) {
      toast({
        title: "Add content",
        description: "At least one content item is required to publish.",
        variant: "destructive",
      });
      return;
    }
    if (!courseData?.courseBuilder?.courseBuilderId) {
      toast({
        title: "Create a draft first",
        description: "Save the course at least once before publishing.",
        variant: "destructive",
      });
      return;
    }
    setIsPublishing(true);
    try {
      const payload = buildPublishPayload();
      if (!payload) throw new Error("Failed to build publish payload");
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
    } finally {
      setIsPublishing(false);
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
        const apiData = res?.data?.data; // full object as shown in new API response

        // Guard if structure missing
        if (!apiData || !apiData.courseBuilderId) {
          setError("Invalid course builder response");
          setCourseData(null);
          return;
        }

        const courseBuilderData = apiData.courseBuilderData || {};
        const courseDetail = courseBuilderData; // courseBuilderData now contains the course details directly
        const rawContent = Array.isArray(courseDetail.courseContent)
          ? courseDetail.courseContent
          : [];
        const normalizedContent = rawContent.sort(
          (a, b) =>
            (a.courseContentSequence || 0) -
            (b.courseContentSequence || 0)
        );

        // Build the course data structure to match component expectations
        const normalizedCourseData = {
          course: {
            courseId: courseDetail.courseId,
            courseTitle: courseDetail.courseTitle,
            courseDescription: courseDetail.courseDescription,
            courseType: courseDetail.courseType,
            deliveryMode: courseDetail.deliveryMode,
            courseDuration: courseDetail.courseDuration,
            courseImageUrl: courseDetail.courseImageUrl,
            courseSourceChannel: courseDetail.courseSourceChannel,
            status: courseDetail.status,
            metadata: courseDetail.metadata,
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

        console.log("Normalized course data:", normalizedCourseData);

        setCourseData(normalizedCourseData);
        setCourseBuilderData(courseBuilderData);
      } catch (e) {
        setError(
          e?.response?.data?.message || e.message || "Failed to load course"
        );
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
    (sum, c) =>
      sum +
      (c?.courseContentDuration || 0),
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
                value={courseData?.courseTitle || ""}
                onChange={(e) =>
                  updateCourseMetadata("courseTitle", e.target.value)
                }
                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                placeholder="Course title..."
              />
              <Textarea
                value={courseData?.courseDescription || ""}
                onChange={(e) =>
                  updateCourseMetadata("courseDescription", e.target.value)
                }
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
            <div
              className="cursor-pointer group"
              onClick={() => setEditingCourseInfo(true)}
            >
              <div className="flex items-center gap-2 group-hover:bg-gray-50 p-2 rounded">
                <div className="flex-1">
                  <div className="flex items-start gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {courseData?.courseTitle || "Untitled Course"}
                    </h1>
                    {courseBuilderData?.status && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${
                          courseBuilderData.status === "PUBLISHED"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {courseBuilderData.status}
                      </span>
                    )}

                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      {courseData?.courseContent?.length || 0} items ·{" "}
                      {formatDuration(totalDurationSeconds)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors max-w-3xl">
                    {courseData?.courseDescription || "No description"}
                  </p>
 
                </div>
                <Edit className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="text-xs text-gray-500 order-2 sm:order-1">
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                Saving…
              </span>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2 justify-end">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading || isSavingDraft}
              className="min-w-[110px]"
            >
              {isSavingDraft ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isLoading || courseBuilderData?.status === "PUBLISHED"}
              className={`min-w-[150px] ${
                courseBuilderData?.status === "PUBLISHED"
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isPublishing ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {courseBuilderData?.status === "PUBLISHED"
                ? "Published"
                : "Publish Course"}
            </Button>
          </div>
        </div>
      </div>

      {/* Course Content with inline editing */}
      <div>
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
        </div>
        <div className="mt-4">
          {!courseData?.courseContent || courseData?.courseContent.length === 0 ? (
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
              {courseData?.courseContent?.map((content, index) => (
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
                          onClick={() =>
                            moveContent(content?.courseContentId, "up")
                          }
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            moveContent(content?.courseContentId, "down")
                          }
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

                      {(() => {
                        const rawDesc =
                          content.courseContentTypeDetail
                            ?.courseVideoDescription ||
                          content.courseContentTypeDetail
                            ?.courseWrittenContent ||
                          content.courseContentTypeDetail
                            ?.courseQuizDescription ||
                          content.courseContentTypeDetail?.courseFlashcardDescription;
                        const desc =
                          rawDesc && rawDesc.length > 300
                            ? rawDesc.slice(0, 300) + "…"
                            : rawDesc;
                        return desc ? (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {desc}
                          </p>
                        ) : null;
                      })()}

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(
                            content?.courseContentDuration
                          )}
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
                          if (
                            window.confirm(
                              "Are you sure you want to delete this content?"
                            )
                          ) {
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
              courseContentSequence={(courseData?.courseContent?.length || 0) + 1}
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
              courseContentSequence={
                currentEditingContent.courseContentSequence
              }
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
