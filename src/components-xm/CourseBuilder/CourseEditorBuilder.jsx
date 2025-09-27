/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon";
import { 
  Edit, 
  Save, 
  X, 
  Plus,
  Trash2,
  Video,
  Clock,
  User,
  Globe,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Settings,
  FileText,
  HelpCircle,
  Zap,
  BookOpen,
  CheckSquare
} from "lucide-react";

export default function CourseEditorBuilder({ courseBuilderData, onSave, onCancel }) {
  // State management
  const [editedData, setEditedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingContentId, setEditingContentId] = useState(null);

  // Helper: ensure courseBuilder & courseBuilderData objects exist to prevent runtime crashes
  const normalizeDataShape = (raw) => {
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
    return {
      ...raw,
      courseBuilder: defaultBuilder,
      courseContent: raw.courseContent || defaultBuilder.courseBuilderData.courseContent || [],
    };
  };

  // Initialize data from props
  useEffect(() => {
    if (courseBuilderData) {
      const cloned = JSON.parse(JSON.stringify(courseBuilderData));
      setEditedData(normalizeDataShape(cloned));
    }
  }, [courseBuilderData]);

  // Helper functions
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

  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'CourseVideo':
        return <Video className="h-4 w-4" />;
      case 'CourseWritten':
        return <FileText className="h-4 w-4" />;
      case 'CourseQuiz':
        return <HelpCircle className="h-4 w-4" />;
      case 'CourseFlashcard':
        return <Zap className="h-4 w-4" />;
      case 'CourseAssignment':
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
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

  // Course metadata handlers
  const updateCourseMetadata = (field, value) => {
    setEditedData(prev => {
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

  const updateCourseBuilderSettings = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      courseBuilder: {
        ...prev.courseBuilder,
        [field]: value
      }
    }));
  };

  // Course content handlers
  const updateCourseContent = (contentId, field, value) => {
    setEditedData(prev => {
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

  // Content management functions
  const generateId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addNewContent = () => {
    if (!editedData) return;
    const builderUserId = editedData.courseBuilder?.userId || editedData.course?.userId || 0;
    const courseId = editedData.course?.courseId || 'temp_course';
    const newSequence = (editedData.courseContent?.length || 0) + 1;
    const contentId = generateId();
    const now = new Date().toISOString();

    // Default scaffold is CourseVideo; user can change type after creation.
    const newContent = {
      type: "youtube", // ui helper
      sequence: newSequence,
      contentType: "CourseVideo",
      courseVideo: {
        courseVideoId: generateId(),
        userId: builderUserId,
        courseId: courseId,
        courseContentId: contentId,
        courseVideoTitle: "New Video Content",
        courseVideoDescription: "",
        courseVideoUrl: "",
        duration: 0,
        thumbnailUrl: "",
        isPreview: false,
        status: "DRAFT",
        createdAt: now,
        updatedAt: now
      },
      // Optional nested shells for other kinds so UI switching can be immediate without null checks
      courseWritten: {
        courseWrittenId: generateId(),
        courseContentId: contentId,
        courseId: courseId,
        userId: builderUserId,
        courseWrittenTitle: "New Written Content",
        courseWrittenDescription: "",
        courseWrittenContent: "",
        metadata: {},
        createdAt: now,
        updatedAt: now
      },
      courseQuiz: {
        courseQuizId: generateId(),
        courseContentId: contentId,
        courseId: courseId,
        courseQuizDescription: "",
        courseQuizType: "KNOWLEDGE CHECK",
        isQuizTimed: false,
        courseQuizTimer: 0,
        courseQuizPassPercent: 70,
        createdAt: now,
        updatedAt: now
      },
      courseFlashcard: {
        courseFlashcardId: generateId(),
        courseContentId: contentId,
        courseId: courseId,
        userId: builderUserId,
        setTitle: "New Flashcard Set",
        setDescription: "",
        setDifficulty: "MEDIUM",
        setTags: [],
        setCategory: "",
        estimatedDuration: 15,
        totalFlashcards: 0,
        learningObjectives: [],
        orderIndex: 0,
        status: "DRAFT",
        visibility: "COURSE_ONLY",
        allowShuffling: true,
        requireSequentialOrder: false,
        passingScore: 70,
        maxAttemptsPerSession: 3,
        metadata: {},
        createdAt: now,
        updatedAt: now
      },
      courseContent: {
        courseContentId: contentId,
        courseId: courseId,
        courseContentTitle: "New Video Content",
        courseContentCategory: "Video Content",
        courseContentType: "CourseVideo",
        courseContentSequence: newSequence,
        courseContentDuration: 0,
        coursecontentIsLicensed: false,
        isPublished: false,
        status: "DRAFT",
        metadata: { contentType: "YOUTUBE_VIDEO", sequence: newSequence },
        createdAt: now,
        updatedAt: now
      }
    };

    setEditedData(prev => {
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

    // Auto-expand the new content for editing
    setEditingContentId(contentId);
  };

  const deleteContent = (contentId) => {
    setEditedData(prev => {
      if (!prev) return prev;
      const filteredContent = (prev.courseContent || []).filter(c => c.courseContent.courseContentId !== contentId);
      // Resequence remaining content
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

    // Close editing if this content was being edited
    if (editingContentId === contentId) {
      setEditingContentId(null);
    }
  };

  const updateContentType = (contentId, newType, newContentType) => {
    setEditedData(prev => {
      if (!prev) return prev;
      const safeBuilder = prev.courseBuilder || {};
      const safeCBD = safeBuilder.courseBuilderData || { courseContent: prev.courseContent || [] };
      const updatedList = (prev.courseContent || []).map(content =>
        content.courseContent.courseContentId === contentId
          ? {
              ...content,
              type: newType,
              contentType: newContentType,
              courseContent: {
                ...content.courseContent,
                courseContentType: newContentType,
                metadata: {
                  ...content.courseContent.metadata,
                  contentType: newType === 'youtube' ? 'YOUTUBE_VIDEO' : newType
                }
              }
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

  // Sequence management
  const moveContent = (contentId, direction) => {
    const currentContent = editedData.courseContent.find(c => c.courseContent.courseContentId === contentId);
    const currentSequence = currentContent?.sequence || 0;
    
    let newSequence;
    if (direction === 'up') {
      newSequence = Math.max(1, currentSequence - 1);
    } else {
      newSequence = Math.min(editedData.courseContent.length, currentSequence + 1);
    }

    if (newSequence === currentSequence) return;

    setEditedData(prev => ({
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

  // Save handler
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await axiosConn.put(`/courseBuilder/${editedData.courseBuilder.courseBuilderId}`, {
        courseBuilderData: editedData.courseBuilder.courseBuilderData,
        course: editedData.course,
        courseContent: editedData.courseContent,
        status: editedData.courseBuilder.status,
        orgId: editedData.courseBuilder.orgId
      });

      if (response.data.success) {
        toast({
          title: "Course updated successfully!",
          description: "Your changes have been saved.",
        });
        onSave?.(response.data.data);
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

  if (!editedData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto p-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Editor</h1>
          <p className="text-gray-600 mt-1">Edit your course structure and content</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
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
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Metadata */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <Input
                  value={editedData.course?.courseTitle || ''}
                  onChange={(e) => updateCourseMetadata('courseTitle', e.target.value)}
                  placeholder="Enter course title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description
                </label>
                <Textarea
                  value={editedData.course?.courseDescription || ''}
                  onChange={(e) => updateCourseMetadata('courseDescription', e.target.value)}
                  placeholder="Enter course description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source Channel
                  </label>
                  <Input
                    value={editedData.course?.courseSourceChannel || ''}
                    onChange={(e) => updateCourseMetadata('courseSourceChannel', e.target.value)}
                    placeholder="Enter source channel"
                    icon={<User className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Image URL
                  </label>
                  <Input
                    value={editedData.course?.courseImageUrl || ''}
                    onChange={(e) => updateCourseMetadata('courseImageUrl', e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Type
                  </label>
                  <Select
                    value={editedData.course?.courseType || 'BYOC'}
                    onValueChange={(value) => updateCourseMetadata('courseType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BYOC">Bring Your Own Course</SelectItem>
                      <SelectItem value="CURATED">Curated</SelectItem>
                      <SelectItem value="LIVE">Live Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Mode
                  </label>
                  <Select
                    value={editedData.course?.deliveryMode || 'ONLINE'}
                    onValueChange={(value) => updateCourseMetadata('deliveryMode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONLINE">Online</SelectItem>
                      <SelectItem value="OFFLINE">Offline</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select
                    value={editedData.course?.status || 'DRAFT'}
                    onValueChange={(value) => updateCourseMetadata('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedData.course?.isPublic || false}
                    onChange={(e) => updateCourseMetadata('isPublic', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Public Course</span>
                  <Globe className="h-4 w-4 text-gray-400" />
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedData.course?.isActive || false}
                    onChange={(e) => updateCourseMetadata('isActive', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Active Course</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Course Content Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Course Content ({editedData.courseContent?.length || 0} items)
                </CardTitle>
                <Button
                  onClick={addNewContent}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(!editedData.courseContent || editedData.courseContent.length === 0) ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No course content yet</h3>
                  <p className="text-gray-500 mb-4">
                    Add your first piece of content to get started building your course.
                  </p>
                  <Button
                    onClick={addNewContent}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Content
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {editedData.courseContent?.map((content, index) => (
                  <div
                    key={content.courseContent.courseContentId}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-start gap-4">
                      {/* Sequence number and controls */}
                      <div className="flex flex-col items-center gap-1 text-xs">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${getContentTypeColor(content.contentType)}`}>
                          {content.sequence}
                        </div>
                        <div className="flex flex-col items-center">
                          <div className={`p-1 rounded ${getContentTypeColor(content.contentType)}`}>
                            {getContentTypeIcon(content.contentType)}
                          </div>
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
                            disabled={index === editedData.courseContent.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        {/* Content title and type */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Title
                            </label>
                            <Input
                              value={content.courseContent.courseContentTitle || ''}
                              onChange={(e) => 
                                updateCourseContent(
                                  content.courseContent.courseContentId,
                                  'courseContentTitle',
                                  e.target.value
                                )
                              }
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Content Type
                            </label>
                            <Select
                              value={content.contentType || 'CourseVideo'}
                              onValueChange={(value) => {
                                const newType = value === 'CourseVideo' ? 'youtube' : 'written';
                                updateContentType(content.courseContent.courseContentId, newType, value);
                              }}
                            >
                              <SelectTrigger className="text-xs h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CourseVideo">Video</SelectItem>
                                <SelectItem value="CourseWritten">Written Content</SelectItem>
                                <SelectItem value="CourseQuiz">Quiz</SelectItem>
                                <SelectItem value="CourseFlashcard">Flashcard</SelectItem>
                                <SelectItem value="CourseAssignment">Assignment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Content type specific fields */}
                        {content.contentType === 'CourseVideo' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Video URL
                              </label>
                              <Input
                                value={content.courseVideo?.courseVideoUrl || ''}
                                onChange={(e) => 
                                  updateCourseContent(
                                    content.courseContent.courseContentId,
                                    'courseVideoUrl',
                                    e.target.value
                                  )
                                }
                                className="text-sm"
                                placeholder="https://www.youtube.com/watch?v=..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Duration (seconds)
                              </label>
                              <Input
                                type="number"
                                value={content.courseVideo?.duration || 0}
                                onChange={(e) => 
                                  updateCourseContent(
                                    content.courseContent.courseContentId,
                                    'duration',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {content.contentType === 'CourseWritten' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Content URL or Text
                            </label>
                            <Textarea
                              value={content.courseWritten?.courseWrittenContent || content.courseVideo?.courseVideoDescription || ''}
                              onChange={(e) => 
                                updateCourseContent(
                                  content.courseContent.courseContentId,
                                  // reuse same field path pattern: for written we store into courseWrittenContent inside metadata path fallback
                                  content.contentType === 'CourseWritten' ? 'courseWrittenContent' : 'courseVideoDescription',
                                  e.target.value
                                )
                              }
                              rows={4}
                              className="text-sm"
                              placeholder="Enter written content, article URL, or document link..."
                            />
                          </div>
                        )}

                        {(content.contentType === 'CourseQuiz' || content.contentType === 'CourseFlashcard' || content.contentType === 'CourseAssignment') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                External URL (Optional)
                              </label>
                              <Input
                                value={content.courseVideo?.courseVideoUrl || ''}
                                onChange={(e) => 
                                  updateCourseContent(
                                    content.courseContent.courseContentId,
                                    'courseVideoUrl',
                                    e.target.value
                                  )
                                }
                                className="text-sm"
                                placeholder="https://quiz-platform.com/..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Estimated Duration (minutes)
                              </label>
                              <Input
                                type="number"
                                value={Math.round((content.courseVideo?.duration || 0) / 60)}
                                onChange={(e) => 
                                  updateCourseContent(
                                    content.courseContent.courseContentId,
                                    'duration',
                                    (parseInt(e.target.value) || 0) * 60
                                  )
                                }
                                className="text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {content.contentType === 'CourseQuiz' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Quiz Type</label>
                              <Select
                                value={content.courseQuiz?.courseQuizType || 'KNOWLEDGE CHECK'}
                                onValueChange={(value) => updateCourseContent(content.courseContent.courseContentId, 'courseQuizType', value)}
                              >
                                <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="KNOWLEDGE CHECK">Knowledge Check</SelectItem>
                                  <SelectItem value="CERTIFICATION">Certification</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Pass %</label>
                              <Input
                                type="number"
                                value={content.courseQuiz?.courseQuizPassPercent || 70}
                                onChange={(e) => updateCourseContent(content.courseContent.courseContentId, 'courseQuizPassPercent', parseInt(e.target.value)||0)}
                                className="text-sm"
                              />
                            </div>
                            <div className="flex items-end">
                              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <input
                                  type="checkbox"
                                  checked={content.courseQuiz?.isQuizTimed || false}
                                  onChange={(e) => updateCourseContent(content.courseContent.courseContentId, 'isQuizTimed', e.target.checked)}
                                  className="rounded border-gray-300"
                                />Timed
                              </label>
                            </div>
                          </div>
                        )}

                        {content.contentType === 'CourseFlashcard' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Set Difficulty</label>
                              <Select
                                value={content.courseFlashcard?.setDifficulty || 'MEDIUM'}
                                onValueChange={(value) => updateCourseContent(content.courseContent.courseContentId, 'setDifficulty', value)}
                              >
                                <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="EASY">Easy</SelectItem>
                                  <SelectItem value="MEDIUM">Medium</SelectItem>
                                  <SelectItem value="HARD">Hard</SelectItem>
                                  <SelectItem value="MIXED">Mixed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Est. Duration (min)</label>
                              <Input
                                type="number"
                                value={content.courseFlashcard?.estimatedDuration || 15}
                                onChange={(e) => updateCourseContent(content.courseContent.courseContentId, 'estimatedDuration', parseInt(e.target.value)||0)}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Passing Score</label>
                              <Input
                                type="number"
                                value={content.courseFlashcard?.passingScore || 70}
                                onChange={(e) => updateCourseContent(content.courseContent.courseContentId, 'passingScore', parseInt(e.target.value)||0)}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(content.courseVideo?.duration || 0)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {content.contentType}
                            </Badge>
                            <Badge 
                              variant={content.courseContent.status === 'PUBLISHED' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {content.courseContent.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => 
                                setEditingContentId(
                                  editingContentId === content.courseContent.courseContentId 
                                    ? null 
                                    : content.courseContent.courseContentId
                                )
                              }
                              className="h-6 w-6 p-0"
                            >
                              {editingContentId === content.courseContent.courseContentId ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this content item?')) {
                                  deleteContent(content.courseContent.courseContentId);
                                }
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Expanded content details */}
                        {editingContentId === content.courseContent.courseContentId && (
                          <div className="pt-3 border-t border-gray-200 space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Description
                              </label>
                              <Textarea
                                value={content.courseVideo?.courseVideoDescription || ''}
                                onChange={(e) => 
                                  updateCourseContent(
                                    content.courseContent.courseContentId,
                                    'courseVideoDescription',
                                    e.target.value
                                  )
                                }
                                rows={3}
                                className="text-sm"
                                placeholder={`Enter ${content.contentType === 'CourseVideo' ? 'video' : 'content'} description...`}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Category
                                </label>
                                <Select
                                  value={content.courseContent.courseContentCategory || 'Video Content'}
                                  onValueChange={(value) => 
                                    updateCourseContent(
                                      content.courseContent.courseContentId,
                                      'courseContentCategory',
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="text-xs h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Video Content">Video Content</SelectItem>
                                    <SelectItem value="Written Content">Written Content</SelectItem>
                                    <SelectItem value="Interactive Content">Interactive Content</SelectItem>
                                    <SelectItem value="Assessment">Assessment</SelectItem>
                                    <SelectItem value="Practice">Practice</SelectItem>
                                    <SelectItem value="Resource">Resource</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  {content.contentType === 'CourseVideo' ? 'Thumbnail URL' : 'Cover Image URL'}
                                </label>
                                <Input
                                  value={content.courseVideo?.thumbnailUrl || ''}
                                  onChange={(e) => 
                                    updateCourseContent(
                                      content.courseContent.courseContentId,
                                      'thumbnailUrl',
                                      e.target.value
                                    )
                                  }
                                  className="text-sm"
                                  placeholder="https://example.com/image.jpg"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={content.courseContent.isPublished || false}
                                  onChange={(e) => 
                                    updateCourseContent(
                                      content.courseContent.courseContentId,
                                      'isPublished',
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300"
                                />
                                <span className="text-xs text-gray-700">Published</span>
                              </label>

                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={content.courseVideo?.isPreview || false}
                                  onChange={(e) => 
                                    updateCourseContent(
                                      content.courseContent.courseContentId,
                                      'isPreview',
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300"
                                />
                                <span className="text-xs text-gray-700">Preview Available</span>
                              </label>

                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={content.courseContent.coursecontentIsLicensed || false}
                                  onChange={(e) => 
                                    updateCourseContent(
                                      content.courseContent.courseContentId,
                                      'coursecontentIsLicensed',
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300"
                                />
                                <span className="text-xs text-gray-700">Licensed Content</span>
                              </label>
                            </div>

                            {/* Content Status */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Content Status
                                </label>
                                <Select
                                  value={content.courseContent.status || 'DRAFT'}
                                  onValueChange={(value) => 
                                    updateCourseContent(
                                      content.courseContent.courseContentId,
                                      'status',
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="text-xs h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {content.contentType === 'CourseVideo' && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Video Status
                                  </label>
                                  <Select
                                    value={content.courseVideo?.status || 'DRAFT'}
                                    onValueChange={(value) => 
                                      updateCourseContent(
                                        content.courseContent.courseContentId,
                                        'status',
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="text-xs h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="DRAFT">Draft</SelectItem>
                                      <SelectItem value="READY">Ready</SelectItem>
                                      <SelectItem value="PROCESSING">Processing</SelectItem>
                                      <SelectItem value="ERROR">Error</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </CardContent>
          </Card>
        </div>

        {/* Course Builder Settings Sidebar */}
        <div className="space-y-6">
          {/* Course Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Duration:</span>
                <span className="font-semibold">
                  {formatDuration(editedData.course?.courseDuration || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Content Items:</span>
                <span className="font-semibold">
                  {editedData.courseContentDetails?.totalItems || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Video Count:</span>
                <span className="font-semibold">
                  {editedData.courseContentDetails?.statistics?.videoCount || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="font-semibold text-xs">
                  {new Date(editedData.course?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-semibold text-xs">
                  {new Date(editedData.course?.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Course Builder Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Builder Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Builder Status
                </label>
                <Select
                  value={editedData.courseBuilder?.status || 'DRAFT'}
                  onValueChange={(value) => updateCourseBuilderSettings('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization
                </label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  {editedData.courseBuilder?.orgId ? (
                    `Org ID: ${editedData.courseBuilder.orgId}`
                  ) : (
                    'General Profile'
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Builder ID
                </label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  {editedData.courseBuilder?.courseBuilderId}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  {editedData.courseBuilder?.userId}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Status:</span>
                <Badge variant="default" className="ml-2">
                  {editedData.courseBuilder?.courseBuilderData?.processingStatus || 'COMPLETED'}
                </Badge>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">URLs Processed:</span>
                <span className="ml-2 font-semibold">
                  {editedData.processing?.totalUrlsProcessed || 1}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Content URLs:</span>
                <div className="mt-2 space-y-1">
                  {editedData.courseBuilder?.courseBuilderData?.contentUrlsList?.map((url, index) => (
                    <div key={index} className="text-xs text-blue-600 bg-blue-50 p-2 rounded truncate">
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}