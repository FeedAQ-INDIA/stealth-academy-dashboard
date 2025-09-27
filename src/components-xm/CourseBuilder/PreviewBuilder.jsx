
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";
import {
  Edit,
  ArrowLeft,
  Clock,
  Calendar,
  Video,
  User,
  Globe,
  Eye,
} from "lucide-react";
import CourseEditorBuilder from "./CourseEditorBuilder";
 

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

 
const __DEV__ = import.meta.env.MODE !== 'production';

export default function PreviewBuilder() {
  const { CourseBuilderId } = useParams();
  const navigate = useNavigate();
  const [showEditor, setShowEditor] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deriveDetails = useCallback((data) => {
    if (!data) return data;
    const cc = data.courseContent || [];
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
      if (item.courseVideo?.duration) return sum + (item.courseVideo.duration || 0);
      if (item.courseFlashcard?.estimatedDuration) return sum + (item.courseFlashcard.estimatedDuration * 60);
      if (item.courseContent?.courseContentDuration) return sum + (item.courseContent.courseContentDuration || 0);
      return sum;
    }, 0);
    return {
      ...data,
      courseContentDetails: data.courseContentDetails || {
        totalItems: cc.length,
        statistics: stats,
        totalDuration,
      },
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!CourseBuilderId) {
        // if no id and dev, use sample
        if (__DEV__) {
          const sample = deriveDetails({ ...DEV_SAMPLE_DATA });
          if (!cancelled) {
            setCourseData(sample);
            setLoading(false);
          }
        } else {
          setCourseData(null);
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await axiosConn.get(`/courseBuilder/${CourseBuilderId}`);
        // Expecting res.data.data structure; adjust if API differs
        const raw = res?.data?.data?.courseBuilderData;
        const normalized = deriveDetails(raw);
        if (!cancelled) {
          setCourseData(raw);
        }
        console.log(raw)
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e.message || 'Failed to load course');
          if (__DEV__) {
            const sample = deriveDetails({ ...DEV_SAMPLE_DATA });
            setCourseData(sample);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [CourseBuilderId, deriveDetails]);

  const handleEditSave = (updatedData) => {
    setCourseData(deriveDetails(updatedData));
    setShowEditor(false);
    toast({
      title: "Course updated successfully!",
      description: "Your changes have been saved.",
    });
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
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
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading course...</p>
      </div>
    );
  }

  if (error && !courseData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  if (!courseData) {
    return null; // nothing to show
  }

  const { course, courseContent } = courseData;

  return (
    <div className="space-y-6 p-6  ">
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {courseData?.courseDetail?.courseTitle}{" "}
        </h1>
        <p className="text-gray-600 mt-2">{courseData?.courseDetail?.courseDescription} </p>
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
 
        </div>
      </div>

     
      {/* Course Overview */}
      <div className="  gap-6">
        {/* Main Content */}
        <div className="  space-y-6">
          {/* Course Information */}
       

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

 
      </div>
    </div>
  );
}
