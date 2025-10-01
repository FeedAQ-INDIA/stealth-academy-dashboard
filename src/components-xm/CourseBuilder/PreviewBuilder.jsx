
import { useState, useEffect, useRef } from "react";
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
  const reorderSaveTimer = useRef(null);

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

  // -----------------------------------------------
  // API <-> Internal content item transformation
  // Internal unified shape: { contentType, courseContent: {..}, courseVideo|courseWritten|... }
  const apiItemToInternal = (item) => {
    if (!item) return item;
    if (item.contentType && item.courseContent) return item; // already unified
    if (!item.courseContentType) return item; // unknown shape

    const detail = item.courseContentTypeDetail || item.courseContentTypeDetails || {};
    const base = {
      contentType: item.courseContentType,
      courseContent: {
        courseContentId: item.courseContentId,
        courseContentTitle: item.courseContentTitle,
        courseContentSequence: item.courseContentSequence,
        status: item.status || detail.status,
        metadata: item.metadata || detail.metadata || {},
        courseContentDuration: item.courseContentDuration || detail.duration || 0,
        createdAt: item.createdAt || detail.createdAt,
        updatedAt: item.updatedAt || detail.updatedAt,
        isPublished: item.isPublished || false,
        courseContentCategory: item.courseContentCategory,
      }
    };
    if (item.courseContentType === 'CourseVideo') {
      base.courseVideo = {
        duration: detail.duration || item.courseContentDuration || 0,
        courseVideoDescription: detail.courseVideoDescription,
        thumbnailUrl: detail.thumbnailUrl,
        isPreview: detail.isPreview,
        courseVideoUrl: detail.courseVideoUrl,
        courseVideoTitle: detail.courseVideoTitle || item.courseContentTitle,
        sourcePlatform: detail?.metadata?.sourcePlatform || item?.metadata?.sourcePlatform,
        videoId: detail?.metadata?.videoId || item?.metadata?.videoId,
        channelTitle: detail?.metadata?.channelTitle,
      };
    } else if (item.courseContentType === 'CourseWritten') {
      base.courseWritten = {
        courseWrittenContent: detail.courseWrittenContent,
        courseWrittenEmbedUrl: detail.courseWrittenEmbedUrl,
        courseWrittenUrlIsEmbeddable: detail.courseWrittenUrlIsEmbeddable,
      };
    } else if (item.courseContentType === 'CourseQuiz') {
      base.courseQuiz = {
        courseQuizDescription: detail.courseQuizDescription,
        questions: detail.questions || []
      };
    } else if (item.courseContentType === 'CourseFlashcard') {
      base.courseFlashcard = {
        setDescription: detail.setDescription,
        cards: detail.cards || []
      };
    } else if (item.courseContentType === 'CourseAssignment') {
      base.courseAssignment = {
        assignmentDescription: detail.assignmentDescription,
        dueDate: detail.dueDate
      };
    }
    return base;
  };

  const internalItemToApi = (item, idx) => {
    if (!item) return item;
    const seq = item.courseContent?.courseContentSequence || idx + 1;
    const apiItem = {
      status: item.courseContent?.status || 'DRAFT',
      courseId: courseData?.course?.courseId || item.courseContent?.courseId || 'temp_course_id',
      metadata: {
        ...(item.courseContent?.metadata || {}),
        sequence: seq,
        contentType: item.courseVideo?.sourcePlatform === 'YOUTUBE' ? 'YOUTUBE_VIDEO' : (item.courseContent?.metadata?.contentType || item.contentType)
      },
      createdAt: item.courseContent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: (item.courseContent?.status || '').toUpperCase() === 'PUBLISHED',
      courseContentId: item.courseContent?.courseContentId,
      courseContentType: item.contentType,
      courseContentTitle: item.courseContent?.courseContentTitle,
      courseContentCategory: item.courseContent?.courseContentCategory || (item.contentType === 'CourseVideo' ? 'Video Content' : 'Content'),
      courseContentDuration: item.courseVideo?.duration || item.courseContent?.courseContentDuration || 0,
      courseContentSequence: seq,
      coursecontentIsLicensed: false,
    };
    if (item.contentType === 'CourseVideo') {
      apiItem.courseContentTypeDetail = {
        status: item.courseContent?.status || 'READY',
        userId: courseData?.courseBuilder?.userId,
        courseId: courseData?.course?.courseId || 'temp_course_id',
        duration: item.courseVideo?.duration || 0,
        metadata: {
          videoId: item.courseVideo?.videoId,
          sourcePlatform: item.courseVideo?.sourcePlatform,
          channelTitle: item.courseVideo?.channelTitle,
          ...(item.courseVideo?.metadata || {})
        },
        createdAt: item.courseContent?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPreview: item.courseVideo?.isPreview || false,
        thumbnailUrl: item.courseVideo?.thumbnailUrl,
        courseVideoId: item.courseVideo?.courseVideoId,
        courseVideoUrl: item.courseVideo?.courseVideoUrl,
        courseContentId: item.courseContent?.courseContentId,
        courseVideoTitle: item.courseVideo?.courseVideoTitle || item.courseContent?.courseContentTitle,
        courseVideoDescription: item.courseVideo?.courseVideoDescription,
      };
    } else if (item.contentType === 'CourseWritten') {
      apiItem.courseContentTypeDetail = {
        userId: courseData?.courseBuilder?.userId,
        courseId: courseData?.course?.courseId || 'temp_course_id',
        metadata: item.courseContent?.metadata || {},
        createdAt: item.courseContent?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseContentId: item.courseContent?.courseContentId,
        courseWrittenId: item.courseWritten?.courseWrittenId,
        courseWrittenTitle: item.courseContent?.courseContentTitle,
        courseWrittenContent: item.courseWritten?.courseWrittenContent,
        courseWrittenEmbedUrl: item.courseWritten?.courseWrittenEmbedUrl,
        courseWrittenUrlIsEmbeddable: item.courseWritten?.courseWrittenUrlIsEmbeddable,
      };
    }
    return apiItem;
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
    const seq = (courseData?.courseContent?.length || 0) + 1;
    if (newContent?.courseContent) {
      newContent.courseContent.courseContentSequence = seq;
    }
    setCourseData(prev => {
      const updated = {
        ...prev,
        courseContent: [...(prev.courseContent || []), newContent]
      };
      // Log updated JSON after adding new content
      try {
        const previewJson = {
          course: updated.course,
          courseContent: updated.courseContent,
          courseBuilder: {
            courseBuilderId: updated.courseBuilder?.courseBuilderId,
            status: updated.courseBuilder?.status
          }
        };
        // Only log for add action
        console.log('[CourseBuilder] Content Added -> Updated JSON:', previewJson);
      } catch (e) {
        console.warn('Failed to log updated course JSON after add', e);
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
    setCourseData(prev => {
      const updatedCourseContent = prev.courseContent.map(content =>
        content.courseContent.courseContentId === updatedContent.courseContent.courseContentId
          ? updatedContent
          : content
      );
      const updated = { ...prev, courseContent: updatedCourseContent };
      // Log updated JSON after editing existing content
      try {
        const previewJson = {
          course: updated.course,
          courseContent: updated.courseContent,
          courseBuilder: {
            courseBuilderId: updated.courseBuilder?.courseBuilderId,
            status: updated.courseBuilder?.status
          }
        };
        console.log('[CourseBuilder] Content Edited -> Updated JSON:', previewJson);
      } catch (e) {
        console.warn('Failed to log updated course JSON after edit', e);
      }
      return updated;
    });
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
      const resequenced = newContent.map((c, idx) => ({
        ...c,
        courseContent: {
          ...c.courseContent,
          courseContentSequence: idx + 1
        }
      }));
      return { ...prev, courseContent: resequenced };
    });
    if (reorderSaveTimer.current) clearTimeout(reorderSaveTimer.current);
    reorderSaveTimer.current = setTimeout(() => { handleSave(); }, 800);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (CourseBuilderId && courseData?.courseBuilder?.courseBuilderId) {
        // Build updated courseBuilderData merging existing builder data with current edited state
        const originalBuilderData = courseData.courseBuilder.courseBuilderData || {};
        const existingCourseDetail = originalBuilderData.courseDetail || {};

        // Keep JSON format SAME as currently used in UI & provided sample:
        // Each item: { contentType, courseContent: {...}, courseVideo|courseWritten|... }
        // Remove transient helper fields like _local before persisting.
        const cleanedContent = (courseData.courseContent || []).map(item => {
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
          courseContent: cleanedContent.map(internalItemToApi)
        };

        const updatedCourseBuilderData = {
          ...originalBuilderData,
          courseDetail: updatedCourseDetail
        };

        const payload = {
          courseBuilderId: courseData.courseBuilder.courseBuilderId,
            // Keep current status or fallback
          status: courseData.courseBuilder.status || 'DRAFT',
          orgId: courseData.courseBuilder.orgId,
          courseBuilderData: updatedCourseBuilderData
        };

        const response = await axiosConn.post('/createOrUpdateCourseBuilder', payload);

        if (response.data.success) {
          toast({
            title: 'Course updated successfully!',
            description: 'Your changes have been saved.'
          });
        }
      } else {
        // No persisted courseBuilder yet: keep local state only
        toast({
          title: 'Changes saved locally',
          description: 'Create the course first to persist changes.'
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
        const apiData = res?.data?.data; // full object as shown in new API response

        // Guard if structure missing
        if (!apiData || !apiData.courseBuilderId) {
          setError('Invalid course builder response');
          setCourseData(null);
          return;
        }

  const courseBuilderData = apiData.courseBuilderData || {};
        const courseDetail = courseBuilderData.courseDetail || {};
        const rawContent = Array.isArray(courseDetail.courseContent) ? courseDetail.courseContent : [];
  const normalizedContent = rawContent.map(apiItemToInternal)
          .sort((a,b) => (a.courseContent?.courseContentSequence||0) - (b.courseContent?.courseContentSequence||0));

        const internalData = {
          course: {
            courseTitle: courseDetail.courseTitle || courseBuilderData.courseTitle,
            courseDescription: courseDetail.courseDescription || courseBuilderData.courseDescription,
            courseId: courseDetail.courseId,
            status: courseDetail.status,
            deliveryMode: courseDetail.deliveryMode,
            courseType: courseDetail.courseType,
            courseDuration: courseDetail.courseDuration,
            courseImageUrl: courseDetail.courseImageUrl,
            courseSourceChannel: courseDetail.courseSourceChannel,
            metadata: courseDetail.metadata,
          },
            // list of normalized content
          courseContent: normalizedContent,
          courseBuilder: {
            courseBuilderId: apiData.courseBuilderId,
            status: apiData.status,
            orgId: apiData.orgId,
            // keep the original builder data so we can send it back on save
            courseBuilderData: courseBuilderData,
            timestamps: {
              createdAt: apiData.course_builder_created_at,
              updatedAt: apiData.course_builder_updated_at,
            }
          }
        };

        setCourseData(internalData);
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

  const { course, courseContent, courseBuilder } = courseData;
  const processingStatus = courseBuilder?.courseBuilderData?.processingStatus;
  const totalDurationSeconds = (courseContent || []).reduce((sum, c) => sum + (c.courseVideo?.duration || c.courseContent?.courseContentDuration || 0), 0);
  const courseDifficulty = course?.metadata?.courseDifficulty;
  const sourceChannel = course?.courseSourceChannel;

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
                  <div className="flex items-start gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {course?.courseTitle || 'Untitled Course'}
                    </h1>
                    {courseBuilder?.status && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${courseBuilder.status === 'PUBLISHED' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{courseBuilder.status}</span>
                    )}
                    {processingStatus && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">{processingStatus}</span>
                    )}
                    {courseDifficulty && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 border border-blue-200">{courseDifficulty}</span>
                    )}
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">{courseContent?.length || 0} items · {formatDuration(totalDurationSeconds)}</span>
                  </div>
                  <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors max-w-3xl">
                    {course?.courseDescription || 'No description'}
                  </p>
                  {sourceChannel && <p className="text-xs text-gray-500 mt-1">Source: {sourceChannel}</p>}
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
                      
                      {(() => {
                        const rawDesc = content.courseVideo?.courseVideoDescription || content.courseWritten?.courseWrittenContent || content.courseQuiz?.courseQuizDescription || content.courseFlashcard?.setDescription;
                        const desc = rawDesc && rawDesc.length > 300 ? rawDesc.slice(0, 300) + '…' : rawDesc;
                        return desc ? (<p className="text-sm text-gray-600 mb-2 line-clamp-2">{desc}</p>) : null;
                      })()}

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(content.courseVideo?.duration || content.courseContent?.courseContentDuration)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {content.contentType}
                        </Badge>
                        {content.courseVideo?.sourcePlatform && (
                          <Badge variant="outline" className="text-xs">
                            {content.courseVideo.sourcePlatform}
                          </Badge>
                        )}
                        {content.courseVideo?.channelTitle && (
                          <span className="max-w-[140px] truncate" title={content.courseVideo.channelTitle}>{content.courseVideo.channelTitle}</span>
                        )}
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
              courseContentSequence={(courseContent?.length || 0) + 1}
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
              contentType={currentEditingContent.contentType}
              mode="edit"
              existingContent={currentEditingContent}
              onUpdate={handleEditContent}
              onCancel={() => { setEditContentSheetOpen(false); setCurrentEditingContent(null); }}
              isLoading={isLoading}
              courseContentSequence={currentEditingContent.courseContent?.courseContentSequence}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
