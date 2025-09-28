
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";
import ContentForm from "./ContentForm";
import {
  Edit,
  ArrowLeft,
  Clock,
  Video,
  Eye,
  Save,
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown
} from "lucide-react";
 

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
  
  // State management - unified from CourseEditorBuilder
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourseInfo, setEditingCourseInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sheet state management
  const [addContentSheetOpen, setAddContentSheetOpen] = useState(false);
  const [editContentSheetOpen, setEditContentSheetOpen] = useState(false);
  const [currentEditingContent, setCurrentEditingContent] = useState(null);

  // Helper functions from CourseEditorBuilder
  const normalizeDataShape = useCallback((raw) => {
    if (!raw) return null;
    const defaultBuilder = {
      courseBuilderId: raw.courseBuilder?.courseBuilderId || null,
      userId: raw.courseBuilder?.userId || raw.course?.userId || 0,
      orgId: raw.courseBuilder?.orgId || raw.course?.orgId || null,
      status: raw.courseBuilder?.status || 'DRAFT',
      courseBuilderData: {
        contentUrlsList: raw.courseBuilder?.courseBuilderData?.contentUrlsList || [],
        courseContent: raw.courseBuilder?.courseBuilderData?.courseContent || raw.courseContent || [],
        courseDetail: raw.courseBuilder?.courseBuilderData?.courseDetail || {},
        processingStatus: raw.courseBuilder?.courseBuilderData?.processingStatus || 'COMPLETED',
        ...(raw.courseBuilder?.courseBuilderData || {})
      }
    };
    const mergedContent = raw.courseContent || defaultBuilder.courseBuilderData.courseContent || [];
    const derived = computeContentStats(mergedContent);
    const courseDuration = raw.course?.courseDuration || derived.totalDuration || 0;
    return {
      ...raw,
      courseBuilder: defaultBuilder,
      courseContent: mergedContent,
      courseContentDetails: raw.courseContentDetails || derived,
      course: {
        ...raw.course,
        courseDuration
      }
    };
  }, []);

  const computeContentStats = (contentList = []) => {
    const stats = contentList.reduce((acc, item) => {
      const type = item.contentType || item.courseContent?.courseContentType;
      if (type === 'CourseVideo') acc.videoCount += 1;
      else if (type === 'CourseWritten') acc.writtenCount += 1;
      else if (type === 'CourseQuiz') acc.quizCount += 1;
      else if (type === 'CourseFlashcard') acc.flashcardCount += 1;
      else if (type === 'CourseAssignment') acc.assignmentCount += 1;
      return acc;
    }, { videoCount: 0, writtenCount: 0, quizCount: 0, flashcardCount: 0, assignmentCount: 0 });

    const totalDuration = contentList.reduce((sum, item) => {
      if (item.courseVideo?.duration) return sum + (item.courseVideo.duration || 0);
      if (item.courseFlashcard?.estimatedDuration) return sum + ((item.courseFlashcard.estimatedDuration || 0) * 60);
      if (item.courseContent?.courseContentDuration) return sum + (item.courseContent.courseContentDuration || 0);
      return sum;
    }, 0);

    return {
      totalItems: contentList.length,
      statistics: stats,
      totalDuration
    };
  };

  const getContentTypeColor = (contentType) => {
    switch (contentType) {
      case 'CourseVideo':
        return 'text-blue-600 bg-blue-50';
      case 'CourseWritten':
        return 'text-green-600 bg-green-50';
      case 'CourseQuiz':
        return 'text-purple-600 bg-purple-50';
      case 'CourseFlashcard':
        return 'text-yellow-600 bg-yellow-50';
      case 'CourseAssignment':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
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
    setCourseData(prev => {
      if (!prev) return prev;
      const safeBuilder = prev.courseBuilder || {};
      const safeCBD = safeBuilder.courseBuilderData || {};
      return {
        ...prev,
        course: {
          ...prev.course,
          [field]: value
        },
        courseBuilder: {
          ...safeBuilder,
          courseBuilderData: {
            ...safeCBD,
            courseDetail: {
              ...(safeCBD.courseDetail || {}),
              [field]: value
            }
          }
        }
      };
    });
  };

  const updateCourseContent = (contentId, field, value) => {
    setCourseData(prev => {
      if (!prev) return prev;
      const safeBuilder = prev.courseBuilder || {};
      const safeCBD = safeBuilder.courseBuilderData || { courseContent: prev.courseContent || [] };
      const updatedList = (prev.courseContent || []).map(content => 
        content.courseContent.courseContentId === contentId
          ? {
              ...content,
              courseContent: { ...content.courseContent, [field]: value },
              ...(content.courseVideo && field.startsWith('courseVideo') ? { courseVideo: { ...content.courseVideo, [field]: value } } : {}),
              ...(content.courseWritten && field.startsWith('courseWritten') ? { courseWritten: { ...content.courseWritten, [field]: value } } : {}),
              ...(content.courseQuiz && field.startsWith('courseQuiz') ? { courseQuiz: { ...content.courseQuiz, [field]: value } } : {}),
              ...(content.courseFlashcard && (field in (content.courseFlashcard || {})) ? { courseFlashcard: { ...content.courseFlashcard, [field]: value } } : {})
            }
          : content
      );
      return {
        ...prev,
        courseContent: updatedList,
        courseBuilder: {
          ...safeBuilder,
          courseBuilderData: {
            ...safeCBD,
            courseContent: updatedList
          }
        }
      };
    });
  };

  const addNewContent = () => {
    setAddContentSheetOpen(true);
  };

  const handleAddContent = (newContent) => {
    if (!courseData) return;
    
    setCourseData(prev => {
      if (!prev) return prev;
      const safeBuilder = prev.courseBuilder || {};
      const safeCBD = safeBuilder.courseBuilderData || {};
      const existing = prev.courseContent || [];
      const updated = [...existing, newContent];
      return {
        ...prev,
        courseContent: updated,
        courseBuilder: {
          ...safeBuilder,
          courseBuilderData: {
            ...safeCBD,
            courseContent: [...(safeCBD.courseContent || existing), newContent]
          }
        }
      };
    });

    setAddContentSheetOpen(false);
    handleSave();
  };

  const openEditSheet = (content) => {
    setCurrentEditingContent(content);
    setEditContentSheetOpen(true);
  };

  const handleEditContent = (updatedContent) => {
    updateCourseContent(updatedContent.courseContent.courseContentId, 'courseContentTitle', updatedContent.courseContent.courseContentTitle);
    updateCourseContent(updatedContent.courseContent.courseContentId, 'courseContentType', updatedContent.courseContent.courseContentType);
    updateCourseContent(updatedContent.courseContent.courseContentId, 'courseContentDuration', updatedContent.courseContent.courseContentDuration);
    updateCourseContent(updatedContent.courseContent.courseContentId, 'isPublished', updatedContent.courseContent.isPublished);
    
    if (updatedContent.courseVideo) {
      updateCourseContent(updatedContent.courseContent.courseContentId, 'courseVideoTitle', updatedContent.courseVideo.courseVideoTitle);
      updateCourseContent(updatedContent.courseContent.courseContentId, 'courseVideoDescription', updatedContent.courseVideo.courseVideoDescription);
      updateCourseContent(updatedContent.courseContent.courseContentId, 'courseVideoUrl', updatedContent.courseVideo.courseVideoUrl);
      updateCourseContent(updatedContent.courseContent.courseContentId, 'duration', updatedContent.courseVideo.duration);
      updateCourseContent(updatedContent.courseContent.courseContentId, 'isPreview', updatedContent.courseVideo.isPreview);
    }
    
    setEditContentSheetOpen(false);
    setCurrentEditingContent(null);
    handleSave();
  };

  const handleDeleteContent = (contentId) => {
    deleteContent(contentId);
    setEditContentSheetOpen(false);
    setCurrentEditingContent(null);
  };

  const deleteContent = (contentId) => {
    setCourseData(prev => {
      if (!prev) return prev;
      const filteredContent = (prev.courseContent || []).filter(c => c.courseContent.courseContentId !== contentId);
      const resequencedContent = filteredContent.map((content, index) => ({
        ...content,
        sequence: index + 1,
        courseContent: {
          ...content.courseContent,
          courseContentSequence: index + 1
        }
      }));

      const safeBuilder = prev.courseBuilder || {};
      const safeCBD = safeBuilder.courseBuilderData || {};
      return {
        ...prev,
        courseContent: resequencedContent,
        courseBuilder: {
          ...safeBuilder,
          courseBuilderData: {
            ...safeCBD,
            courseContent: resequencedContent
          }
        }
      };
    });
  };

  const moveContent = (contentId, direction) => {
    const currentContent = courseData.courseContent.find(c => c.courseContent.courseContentId === contentId);
    const currentSequence = currentContent?.sequence || 0;
    
    let newSequence;
    if (direction === 'up') {
      newSequence = Math.max(1, currentSequence - 1);
    } else {
      newSequence = Math.min(courseData.courseContent.length, currentSequence + 1);
    }

    if (newSequence === currentSequence) return;

    setCourseData(prev => ({
      ...prev,
      courseContent: prev.courseContent.map(content => {
        if (content.courseContent.courseContentId === contentId) {
          return {
            ...content,
            sequence: newSequence,
            courseContent: {
              ...content.courseContent,
              courseContentSequence: newSequence
            }
          };
        }
        if (content.sequence === newSequence) {
          return {
            ...content,
            sequence: currentSequence,
            courseContent: {
              ...content.courseContent,
              courseContentSequence: currentSequence
            }
          };
        }
        return content;
      }).sort((a, b) => a.sequence - b.sequence)
    }));
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
          setCourseData(normalizeDataShape(response.data.data));
        }
      } else {
        // Fallback - just show toast for demo
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

  // Recompute statistics whenever courseContent changes
  useEffect(() => {
    if (!courseData) return;
    const contentList = courseData.courseContent || [];
    const newStats = computeContentStats(contentList);
    const prevStats = courseData.courseContentDetails || {};
    const changed = !prevStats || prevStats.totalItems !== newStats.totalItems ||
      prevStats.totalDuration !== newStats.totalDuration;
    if (changed) {
      setCourseData(prev => ({
        ...prev,
        courseContentDetails: newStats,
        course: {
          ...prev.course,
          courseDuration: newStats.totalDuration
        }
      }));
    }
  }, [courseData?.courseContent, courseData]);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!CourseBuilderId) {
        if (__DEV__) {
          const sample = normalizeDataShape({ ...DEV_SAMPLE_DATA });
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
        const raw = res?.data?.data?.courseBuilderData;
        const normalized = normalizeDataShape(raw);
        if (!cancelled) {
          setCourseData(normalized);
        }
        console.log(normalized)
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e.message || 'Failed to load course');
          if (__DEV__) {
            const sample = normalizeDataShape({ ...DEV_SAMPLE_DATA });
            setCourseData(sample);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [CourseBuilderId, normalizeDataShape]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
    return null;
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
                value={course?.courseTitle || courseData?.courseDetail?.courseTitle || ''}
                onChange={(e) => updateCourseMetadata('courseTitle', e.target.value)}
                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                placeholder="Course title..."
              />
              <Textarea
                value={course?.courseDescription || courseData?.courseDetail?.courseDescription || ''}
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
                    {course?.courseTitle || courseData?.courseDetail?.courseTitle || 'Untitled Course'}
                  </h1>
                  <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors">
                    {course?.courseDescription || courseData?.courseDetail?.courseDescription || 'No description'}
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Course Content ({courseContent?.length || 0} items)
            </CardTitle>
            <Button onClick={addNewContent} size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(!courseContent || courseContent.length === 0) ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No course content yet</h3>
              <p className="text-gray-500 mb-4">Add your first piece of content to get started.</p>
              <Button onClick={addNewContent} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Content
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {courseContent?.map((content, index) => (
                <div key={content.courseContent.courseContentId} className="border rounded-lg bg-gray-50">
                  {/* View mode for this content */}
                  <div className="flex items-start gap-4 p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${getContentTypeColor(content.contentType)}`}>
                        {content.sequence}
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
                            deleteContent(content.courseContent.courseContentId);
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
        </CardContent>
      </Card>

      {/* Add Content Sheet */}
      <Sheet open={addContentSheetOpen} onOpenChange={setAddContentSheetOpen}>
        <SheetContent 
          side="bottom" 
          className="w-screen h-screen max-w-none p-8 inset-0 border-0"
        >
          <ContentForm 
            mode="add"
            courseData={courseData}
            onSave={handleAddContent}
            onCancel={() => setAddContentSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Edit Content Sheet */}
      <Sheet open={editContentSheetOpen} onOpenChange={setEditContentSheetOpen}>
        <SheetContent 
          side="bottom" 
          className="w-screen h-screen max-w-none p-8 inset-0 border-0"
        >
          <ContentForm 
            mode="edit"
            content={currentEditingContent}
            onSave={handleEditContent}
            onDelete={handleDeleteContent}
            onCancel={() => {
              setEditContentSheetOpen(false);
              setCurrentEditingContent(null);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
