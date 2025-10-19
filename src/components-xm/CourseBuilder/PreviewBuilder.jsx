import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Youtube,
  RotateCcw,
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
  const [isDirty, setIsDirty] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [addContentSheetOpen, setAddContentSheetOpen] = useState(false);
  const [editContentSheetOpen, setEditContentSheetOpen] = useState(false);
  const [currentEditingContent, setCurrentEditingContent] = useState(null);
  const [selectedContentType, setSelectedContentType] = useState(null);
  const [youtubeImportDialogOpen, setYoutubeImportDialogOpen] = useState(false);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState("");
  const [importingFromYoutube, setImportingFromYoutube] = useState(false);
  const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);
  const [unpublishConfirmation, setUnpublishConfirmation] = useState("");
  const [selectedCourseForUnpublish, setSelectedCourseForUnpublish] = useState(null);
  const [unpublishLoading, setUnpublishLoading] = useState(false);


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
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Event handlers
  const handleSelectContentType = (contentType) => {
    setSelectedContentType(contentType);
    setAddContentSheetOpen(true);
  };

  const handleImportYoutube = () => {
    setYoutubeImportDialogOpen(true);
  };

  const handleYoutubeImport = async () => {
    if (!youtubePlaylistUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a YouTube playlist URL",
        variant: "destructive",
      });
      return;
    }

    setImportingFromYoutube(true);
    try {
      const response = await axiosConn.post("/importFromYoutube", {
        playlistUrl: youtubePlaylistUrl.trim(),
      });

      if (response.data.success) {
        const importedContent = response.data.data.courseContent || [];

        // Add imported content to existing course content
        setCourseData((prev) => {
          const existingContent = prev.courseContent || [];
          const startSequence = existingContent.length + 1;

          // Update sequence numbers for imported content
          const resequencedImported = importedContent.map((content, index) => ({
            ...content,
            courseContentSequence: startSequence + index,
            courseContentId: `imported_${Date.now()}_${index + 1}`,
          }));

          return {
            ...prev,
            courseContent: [...existingContent, ...resequencedImported],
          };
        });
        setIsDirty(true);

        toast({
          title: "Import Successful!",
          description: `Imported ${importedContent.length} videos from YouTube playlist`,
        });

        setYoutubeImportDialogOpen(false);
        setYoutubePlaylistUrl("");

        // Mark dirty; user can save or publish later
      }
    } catch (error) {
      console.error("YouTube import error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to import YouTube playlist";
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setImportingFromYoutube(false);
    }
  };

  const handleCancelYoutubeImport = () => {
    setYoutubeImportDialogOpen(false);
    setYoutubePlaylistUrl("");
  };

  const handleAddContent = (newContent) => {
    console.log(newContent);
    const seq = (courseData?.courseContent?.length || 0) + 1;
    if (newContent?.courseContentSequence !== undefined) {
      newContent.courseContentSequence = seq;
    }
    setCourseData((prev) => ({
      ...prev,
      courseContent: [...(prev.courseContent || []), newContent],
    }));
    setIsDirty(true);
    setAddContentSheetOpen(false);
    setSelectedContentType(null);
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
    console.log(updatedContent);
    setCourseData((prev) => {
      const updatedCourseContent = prev.courseContent.map((content) =>
        content?.courseContentId === updatedContent?.courseContentId
          ? updatedContent
          : content
      );
      return { ...prev, courseContent: updatedCourseContent };
    });
    setIsDirty(true);
    setEditContentSheetOpen(false);
    setCurrentEditingContent(null);
  };

  const handleDeleteContent = (contentId) => {
    setCourseData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.filter(
        (c) => c.courseContentId !== contentId
      ),
    }));
    setIsDirty(true);
    setEditContentSheetOpen(false);
    setCurrentEditingContent(null);
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
    setIsDirty(true);
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
      return false;
    }

    setIsLoading(true);
    let didSucceed = false;
    try {
      const originalBuilderData =
        courseData.courseBuilder.courseBuilderData || {};
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

      const response = await axiosConn.post(
        "/createOrUpdateCourseBuilder",
        payload
      );

      if (response.data.success) {
        const updatedData = response.data.data;
        let newStateAfterSave = null;
        if (
          statusOverride &&
          statusOverride !== courseData.courseBuilder.status
        ) {
          newStateAfterSave = {
            ...courseData,
            courseBuilder: { ...courseData.courseBuilder, ...updatedData },
          };
          setCourseData(newStateAfterSave);
        }
        setIsDirty(false);
        didSucceed = true;
        // Capture a snapshot of the last saved state
        const snapshot = JSON.parse(
          JSON.stringify(newStateAfterSave || courseData)
        );
        setSavedSnapshot(snapshot);
        if (!silent) {
          const isPublish = statusOverride === "PUBLISHED";
          toast({
            title: isPublish
              ? "Course published!"
              : "Course updated successfully!",
            description: isPublish
              ? "Your course is now live."
              : "Your changes have been saved.",
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
    return didSucceed;
  };

  const handleSaveDraft = () => handleSave({ statusOverride: "DRAFT" });

  const handlePublish = async () => {
    if (isLoading) return;

    try {
      // Save unsaved changes silently before publishing
      if (isDirty) {
        const saved = await handleSave({ silent: true });
        if (!saved) {
          toast({
            title: "Couldn't save changes",
            description: "Fix the errors and try publishing again.",
            variant: "destructive",
          });
          return;
        }
      }
      const res = await axiosConn.post("/publishCourse", {
        courseBuilderId: courseData.courseBuilder.courseBuilderId,
      });
      if (res.data?.success) {
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
          (a, b) =>
            (a.courseContentSequence || 0) - (b.courseContentSequence || 0)
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
        setIsDirty(false);
        setSavedSnapshot(JSON.parse(JSON.stringify(normalizedCourseData)));
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
    (sum, c) => sum + (c?.courseContentDuration || 0),
    0
  );




  const handleConfirmUnpublish = async () => {
    if (!selectedCourseForUnpublish) return;

    setUnpublishLoading(true);
    try {
      const response = await axiosConn.post(
        `${import.meta.env.VITE_API_URL}/deleteCourse`,
        {
          courseId: selectedCourseForUnpublish.publishedCourseId,
        }
      );

      if (response.data.status === 200) {
        fetchCourses();
        setUnpublishDialogOpen(false);
        setUnpublishConfirmation("");
        setSelectedCourseForUnpublish(null);
        toast({
          title: "Course deleted successfully",
          description: "The course has been permanently removed.",
        });
      } else {
        throw new Error(response.data.message || "Course deletion failed");
      }
    } catch (error) {
      console.error("Delete course error:", error);
      toast({
        title: "Delete failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete course.",
        variant: "destructive",
      });
    } finally {
      setUnpublishLoading(false);
    }
  };

  const handleOpenUnpublishDialog = (course) => {
    setSelectedCourseForUnpublish(course);
    setUnpublishDialogOpen(true);
    setUnpublishConfirmation("");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with save functionality */}
      <div className="mb-6">
        <div className="flex-1">
          {editingCourseInfo ? (
            <div className="space-y-3">
              <Input
                value={courseData?.course?.courseTitle || ""}
                onChange={(e) => {
                  setCourseData((prev) => ({
                    ...prev,
                    course: { ...prev.course, courseTitle: e.target.value },
                  }));
                  setIsDirty(true);
                }}
                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                placeholder="Course title..."
              />
              <Textarea
                value={courseData?.course?.courseDescription || ""}
                onChange={(e) => {
                  setCourseData((prev) => ({
                    ...prev,
                    course: {
                      ...prev.course,
                      courseDescription: e.target.value,
                    },
                  }));
                  setIsDirty(true);
                }}
                className="text-gray-600 border-0 px-0 resize-none focus-visible:ring-0"
                placeholder="Course description..."
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingCourseInfo(false);
                  }}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Done
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
                      {courseData?.courseContent?.length || 0} items ·{" "}
                      {formatDuration(totalDurationSeconds)}
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
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></span>
                <span>Saving…</span>
              </span>
            ) : isDirty ? (
              <span className="flex items-center gap-1 text-yellow-700">
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                <span>Unsaved changes</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>All changes saved</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2 justify-end">
        {courseData?.courseBuilder?.status === "PUBLISHED"  &&  <Button
              variant="outline"
              onClick={() => handleOpenUnpublishDialog(courseData?.course)}
              className="flex-1"
            >
              Unpublish
            </Button>}   
            <Button
              variant="outline"
              onClick={() => {
                if (!savedSnapshot) return;
                setCourseData(JSON.parse(JSON.stringify(savedSnapshot)));
                setIsDirty(false);
                setEditingCourseInfo(false);
                setAddContentSheetOpen(false);
                setEditContentSheetOpen(false);
                setCurrentEditingContent(null);
                toast({
                  title: "Changes discarded",
                  description: "Restored last saved version.",
                });
              }}
              disabled={isLoading || !isDirty}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading || !isDirty}
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
              disabled={
                isLoading || courseData?.courseBuilder?.status === "PUBLISHED"
              }
              className={` ${
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
            onImportYoutube={handleImportYoutube}
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
                onImportYoutube={handleImportYoutube}
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
                          disabled={
                            index === courseData.courseContent.length - 1
                          }
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

                      {content.courseContentTypeDetail
                        ?.courseVideoDescription && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {content.courseContentTypeDetail
                            .courseVideoDescription.length > 300
                            ? content.courseContentTypeDetail.courseVideoDescription.slice(
                                0,
                                300
                              ) + "…"
                            : content.courseContentTypeDetail
                                .courseVideoDescription}
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

      {/* Sheets */}
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
              courseContentSequence={
                (courseData?.courseContent?.length || 0) + 1
              }
            />
          )}
        </SheetContent>
      </Sheet>

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

      {/* YouTube Import Dialog */}
      <Dialog
        open={youtubeImportDialogOpen}
        onOpenChange={setYoutubeImportDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              Import from YouTube Playlist
            </DialogTitle>
            <DialogDescription>
              Enter a YouTube playlist URL to import all videos as course
              content.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="playlist-url" className="text-sm font-medium">
                YouTube Playlist URL
              </label>
              <Input
                id="playlist-url"
                placeholder="https://www.youtube.com/playlist?list=..."
                value={youtubePlaylistUrl}
                onChange={(e) => {
                  setYoutubePlaylistUrl(e.target.value);
                  // Changing the URL itself doesn't alter course content,
                  // so we don't mark dirty here.
                }}
                disabled={importingFromYoutube}
              />
              <p className="text-xs text-gray-500">
                Example:
                https://www.youtube.com/playlist?list=PL9ooVrP1hQOFrNo8jK9Yb2g2eMDP7De7j
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelYoutubeImport}
              disabled={importingFromYoutube}
            >
              Cancel
            </Button>
            <Button
              onClick={handleYoutubeImport}
              disabled={importingFromYoutube || !youtubePlaylistUrl.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {importingFromYoutube ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Importing...
                </>
              ) : (
                <>
                  <Youtube className="h-4 w-4 mr-2" />
                  Import Playlist
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unpublish Confirmation Dialog */}
      <Dialog open={unpublishDialogOpen} onOpenChange={setUnpublishDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Are You Sure You Want To Delete This Course?
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              This action cannot be undone. Type in{" "}
              <span className="font-semibold text-red-600 italic">
                &ldquo;
                {selectedCourseForUnpublish?.courseBuilderData?.courseTitle}
                &rdquo;
              </span>{" "}
              in the input field below and click confirm to permanently delete
              the course.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-y-2">
            <Input
              placeholder="Type course title to confirm deletion..."
              value={unpublishConfirmation}
              onChange={(e) => setUnpublishConfirmation(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <DialogFooter className="sm:justify-start gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleConfirmUnpublish}
              disabled={
                unpublishLoading ||
                selectedCourseForUnpublish?.courseBuilderData?.courseTitle?.trim() !==
                  unpublishConfirmation?.trim()
              }
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {unpublishLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting Course...
                </>
              ) : (
                "Delete Course"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
