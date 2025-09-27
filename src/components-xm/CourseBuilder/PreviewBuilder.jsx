/* eslint-disable react/prop-types */
/**
 * Unified Course Builder Component
 * --------------------------------
 * This component MERGES the old `CourseEditorExample` (demo wrapper) and `PreviewBuilder` (preview + inline editor toggle).
 * It now serves as a single smart container that can:
 *  - Display a course in preview mode (read-only summary & content list)
 *  - Switch to edit mode and render `CourseEditorBuilder`
 *  - Provide optional external save callback
 *  - Start directly in either 'preview' or 'edit' mode via `initialMode` prop
 *  - (Dev only) fallback to an embedded sample dataset when no `courseBuilderData` is supplied
 *
 * Props:
 *  - courseBuilderData: object | null (raw structure that contains courseBuilder, course, courseContent, courseContentDetails)
 *  - initialMode: 'preview' | 'edit' (default 'preview')
 *  - onSave(updatedData): optional callback fired after successful save from editor
 *  - onCancel(): optional callback fired when editing is cancelled
 *  - onBack(): optional handler for back navigation button in empty-state
 *  - showDevSampleFallback: boolean (default true in dev) — if true & no data provided, renders sample data for easier local development
 *
 * Backwards Compatibility:
 *  - Still accepts previous `courseBuilderData` prop name and internal toggle (Edit Course button) remains.
 *
 * Removal / Merge Notes:
 *  - `CourseEditorExample.jsx` has been removed; its sample dataset migrated here as `DEV_SAMPLE_DATA`.
 *  - If you prefer NOT to ship sample data to production bundles, consider tree-shaking via a dynamic import or guard this constant.
 */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/hooks/use-toast.js";
import {
  Edit,
  ArrowLeft,
  Clock,
  Calendar,
  Video,
  User,
  Globe,
  Eye,
  BookOpen,
} from "lucide-react";
import CourseEditorBuilder from "./CourseEditorBuilder";

// Dev sample data (extracted from former CourseEditorExample). Used only when no data is provided.
// Intentionally concise: kept the original structure's `data` inner object already unwrapped for direct use.
const DEV_SAMPLE_DATA = {
  course: {
    courseId: "temp_course_id",
    userId: 1,
    orgId: null,
    courseTitle: "Designing data intensive applications chapter summary playlist",
    courseDescription: "Designing data intensive applications chapter summary playlist",
    courseDuration: 1181,
    courseImageUrl: "https://i.ytimg.com/vi/PdtlXdse7pw/hqdefault.jpg",
    courseSourceChannel: "Kunal Cholera",
    courseType: "BYOC",
    deliveryMode: "ONLINE",
    status: "PUBLISHED",
    isActive: true,
    isPublic: false,
    createdAt: "2025-09-27T09:01:53.183Z",
    updatedAt: "2025-09-27T09:01:53.183Z",
  },
  courseContent: [
    {
      courseContent: {
        courseContentId: "temp_content_1",
        courseId: "temp_course_id",
        courseContentTitle:
          "Chapter 1 - Reliable, Scalable and Maintainable - Designing Data Intensive applications book review",
        courseContentCategory: "Video Content",
        courseContentType: "CourseVideo",
        courseContentSequence: 1,
        coursecontentIsLicensed: false,
        courseContentDuration: 586,
        isPublished: true,
        status: "PUBLISHED",
        metadata: { videoId: "PdtlXdse7pw", contentType: "YOUTUBE_VIDEO", sequence: 1 },
        createdAt: "2025-09-27T09:01:53.183Z",
        updatedAt: "2025-09-27T09:01:53.183Z",
      },
      courseVideo: {
        courseVideoId: "temp_video_1",
        userId: 1,
        courseId: "temp_course_id",
        courseContentId: "temp_content_1",
        courseVideoTitle:
          "Chapter 1 - Reliable, Scalable and Maintainable - Designing Data Intensive applications book review",
        courseVideoDescription:
          "Slides: https://www.kunalcholera.com/slides/\n\nChapter 1 - Reliable, Scalable and Maintainable - Designing Data Intensive applications book review\nHow to build reliable, scalable and maintainable distributed system (foundations) \nDesigning Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems by Martin Kleppmann",
        courseVideoUrl: "https://www.youtube.com/watch?v=PdtlXdse7pw",
        duration: 586,
        thumbnailUrl: "https://i.ytimg.com/vi/PdtlXdse7pw/hqdefault.jpg",
        isPreview: false,
        status: "READY",
        createdAt: "2025-09-27T09:01:53.183Z",
        updatedAt: "2025-09-27T09:01:53.183Z",
      },
      type: "youtube",
      sequence: 1,
      contentType: "CourseVideo",
    },
    {
      courseContent: {
        courseContentId: "temp_content_2",
        courseId: "temp_course_id",
        courseContentTitle:
          "Chapter 2 - Data Models - Designing Data Intensive applications book review",
        courseContentCategory: "Video Content",
        courseContentType: "CourseVideo",
        courseContentSequence: 2,
        coursecontentIsLicensed: false,
        courseContentDuration: 595,
        isPublished: true,
        status: "PUBLISHED",
        metadata: { videoId: "X-9R-DdDFrI", contentType: "YOUTUBE_VIDEO", sequence: 2 },
        createdAt: "2025-09-27T09:01:53.184Z",
        updatedAt: "2025-09-27T09:01:53.184Z",
      },
      courseVideo: {
        courseVideoId: "temp_video_2",
        userId: 1,
        courseId: "temp_course_id",
        courseContentId: "temp_content_2",
        courseVideoTitle:
          "Chapter 2 - Data Models - Designing Data Intensive applications book review",
        courseVideoDescription:
          "Slides: https://www.kunalcholera.com/slides/\n\nChapter 2 - Data Models - Designing Data Intensive applications book review\nData models and query languages\nDesigning Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems by Martin Kleppmann",
        courseVideoUrl: "https://www.youtube.com/watch?v=X-9R-DdDFrI",
        duration: 595,
        thumbnailUrl: "https://i.ytimg.com/vi/X-9R-DdDFrI/hqdefault.jpg",
        isPreview: false,
        status: "READY",
        createdAt: "2025-09-27T09:01:53.184Z",
        updatedAt: "2025-09-27T09:01:53.184Z",
      },
      type: "youtube",
      sequence: 2,
      contentType: "CourseVideo",
    },
  ],
};

// PreviewBuilder: Displays a read-only view of the course with an inline option to switch to the editor.
// Simplified: removed unused onEdit prop (editor toggling handled internally) & unused Play icon import.
// Derive a dev mode flag in a bundler-agnostic way (Vite exposes import.meta.env.MODE)
// Safe checks so we don't reference undefined globals in browser builds.
// Priority: process.env (if available) else import.meta.env
const __DEV__ = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE !== 'production');

export default function PreviewBuilder({
  courseBuilderData,
  initialMode = "preview",
  onSave,
  onCancel,
  onBack,
  showDevSampleFallback = __DEV__,
}) {
  const [showEditor, setShowEditor] = useState(initialMode === "edit");
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    if (courseBuilderData) {
      // Normalize inbound data to ensure courseContentDetails always present
      const normalized = (() => {
        if (!courseBuilderData) return null;
        const cc = courseBuilderData.courseContent || [];
        const stats = cc.reduce(
          (acc, item) => {
            const type = item.contentType || item.courseContent?.courseContentType;
            if (type === 'CourseVideo') acc.videoCount += 1;
            else if (type === 'CourseWritten') acc.writtenCount += 1;
            else if (type === 'CourseQuiz') acc.quizCount += 1;
            else if (type === 'CourseFlashcard') acc.flashcardCount += 1;
            return acc;
          },
          { videoCount: 0, writtenCount: 0, quizCount: 0, flashcardCount: 0 }
        );
        const totalDuration = cc.reduce((sum, item) => {
          // Prefer nested specific record duration else fallback
          if (item.courseVideo?.duration) return sum + (item.courseVideo.duration || 0);
          if (item.courseFlashcard?.estimatedDuration)
            return sum + (item.courseFlashcard.estimatedDuration * 60); // minutes -> seconds
          if (item.courseContent?.courseContentDuration)
            return sum + (item.courseContent.courseContentDuration || 0);
          return sum;
        }, 0);
        const details = {
          totalItems: cc.length,
            statistics: stats,
            totalDuration,
        };
        return {
          ...courseBuilderData,
          courseContentDetails: courseBuilderData.courseContentDetails || details,
        };
      })();
      setCourseData(normalized);
    } else if (showDevSampleFallback) {
      // Dev fallback sample
      // Enrich sample with derived details
      const sample = { ...DEV_SAMPLE_DATA };
      const totalDuration = sample.courseContent.reduce((s, c) => s + (c.courseVideo?.duration || c.courseContent?.courseContentDuration || 0), 0);
      sample.courseContentDetails = {
        totalItems: sample.courseContent.length,
        statistics: {
          videoCount: sample.courseContent.filter(c => c.contentType === 'CourseVideo').length,
          writtenCount: sample.courseContent.filter(c => c.contentType === 'CourseWritten').length,
          quizCount: sample.courseContent.filter(c => c.contentType === 'CourseQuiz').length,
          flashcardCount: sample.courseContent.filter(c => c.contentType === 'CourseFlashcard').length,
        },
        totalDuration,
      };
      setCourseData(sample);
    } else {
      setCourseData(null);
    }
  }, [courseBuilderData, showDevSampleFallback]);

  const handleEditSave = (updatedData) => {
    setCourseData(updatedData);
    setShowEditor(false);
    if (onSave) onSave(updatedData);
    toast({
      title: "Course updated successfully!",
      description: "Your changes have been saved.",
    });
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    if (onCancel) onCancel();
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

  if (showEditor) {
    return (
      <CourseEditorBuilder
        courseBuilderData={courseData}
        onSave={handleEditSave}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No course data available</p>
          {onBack && (
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  const { courseBuilder, course, courseContent, courseContentDetails } = courseData;

  return (
    <div className="space-y-6 p-6  ">
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {course?.courseTitle}{" "}
        </h1>
        <p className="text-gray-600 mt-2">{course?.courseDescription} </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>New Features:</strong> ✨ Add new content items ✨ Edit
                content types (Video, Written, Quiz, Flashcard, Assignment) ✨
                Delete content ✨ Reorder content ✨ Advanced content editing
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => setShowEditor(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Course
          </Button>
          {__DEV__ && !courseBuilderData && (
            <Badge variant="outline" className="ml-2">DEV SAMPLE</Badge>
          )}
        </div>
      </div>

     
      {/* Course Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Information */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        course?.status === "PUBLISHED" ? "default" : "secondary"
                      }
                    >
                      {course?.status}
                    </Badge>
                    <Badge variant="outline">{course?.courseType}</Badge>
                    {course?.isPublic && (
                      <Badge variant="outline" className="text-green-600">
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created:{" "}
                      {new Date(course?.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(course?.courseDuration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {course?.courseSourceChannel}
                    </span>
                  </div>
                </div>
                {course?.courseImageUrl && (
                  <img
                    src={course.courseImageUrl}
                    alt={course.courseTitle}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Course Content ({courseContent?.length || 0} items)
                </h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courseContent?.map((content) => (
                  <div
                    key={content.courseContent.courseContentId}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Sequence Number */}
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {content.sequence}
                    </div>

                    {/* Content Details */}
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
                        <Badge
                          variant={
                            content.courseContent.status === "PUBLISHED"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {content.courseContent.status}
                        </Badge>
                        {content.courseVideo?.isPreview && (
                          <Badge
                            variant="outline"
                            className="text-xs text-green-600"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Thumbnail */}
                    {content.courseVideo?.thumbnailUrl && (
                      <img
                        src={content.courseVideo.thumbnailUrl}
                        alt={content.courseContent.courseContentTitle}
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Course Statistics</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {courseContentDetails?.statistics?.videoCount || 0}
                    </div>
                    <div className="text-sm text-blue-800">Videos</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {courseContentDetails?.statistics?.writtenCount || 0}
                    </div>
                    <div className="text-sm text-green-800">Written</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Duration:</span>
                    <span className="font-semibold">
                      {formatDuration(courseContentDetails?.totalDuration)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content Items:</span>
                    <span className="font-semibold">
                      {courseContentDetails?.totalItems || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-semibold">
                      {course?.metadata?.coursePlatform || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Builder Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Builder Information</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Builder ID:</span>
                  <span className="font-semibold">
                    {courseBuilder?.courseBuilderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge
                    variant={
                      courseBuilder?.status === "PUBLISHED"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {courseBuilder?.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organization:</span>
                  <span className="font-semibold">
                    {courseBuilder?.orgId
                      ? `Org ${courseBuilder.orgId}`
                      : "General"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-semibold">
                    {courseBuilder?.v_created_date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-semibold">
                    {courseBuilder?.v_updated_date}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Processing Status</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <Badge variant="default" className="mb-2">
                    {courseBuilder?.courseBuilderData?.processingStatus ||
                      "COMPLETED"}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Processed{" "}
                    {courseBuilder?.courseBuilderData?.processedUrls
                      ?.totalUrlsProcessed || 1}{" "}
                    URL(s)
                  </p>
                </div>

                {courseBuilder?.courseBuilderData?.contentUrlsList && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Source URLs:
                    </h4>
                    <div className="space-y-1">
                      {courseBuilder.courseBuilderData.contentUrlsList.map(
                        (url, index) => (
                          <div
                            key={index}
                            className="text-xs text-blue-600 bg-blue-50 p-2 rounded truncate"
                          >
                            {url}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => setShowEditor(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Course Details
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Add logic to view course
                    toast({
                      title: "Opening course...",
                      description: "This would navigate to the course view.",
                    });
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
