import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.jsx";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Check,
  CircleArrowLeft,
  CircleArrowRight,
  Clock,
  FileText,
  CheckCircle2,
  Undo2,
  Zap,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import NotesModule from "@/components-xm/Notes/NotesModule.jsx";
import { toast } from "@/components/hooks/use-toast.js";
import CreateNotesModule from "@/components-xm/Notes/CreateNotesModule.jsx";
import { useAuthStore } from "@/zustland/store.js";

function CourseEmbedder() {
  const { userDetail } = useAuthStore();

  const { CourseId, CourseDocId } = useParams();
  const {
    userCourseEnrollment,
    userCourseContentProgress,
    fetchUserCourseContentProgress,
    fetchUserCourseEnrollment,
    courseList,
  } = useCourse();

  const [courseVideoDetail, setCourseVideoDetail] = useState({});
  const [courseTopicContent, setCourseTopicContent] = useState({});
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseList && CourseDocId) {
      // Reset iframe states when content changes
      setIframeLoading(true);
      setIframeError(false);
      fetchCourseVideo();
    }
  }, [courseList, userCourseEnrollment, CourseDocId]);

  const fetchCourseVideo = () => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 10,
        offset: 0,
        getThisData: {
          datasource: "CourseWritten",
          attributes: [],
          where: { courseContentId: CourseDocId },
        },
      })
      .then((res) => {
        console.log(res.data);
        const written = res.data.data?.results?.[0];
        setCourseVideoDetail(written);

        // Find the content from the new courseContent structure
        const content = courseList?.courseContent?.find(
          (a) => a.courseContentId === written.courseContentId
        );
        setCourseTopicContent(content || {});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveUserEnrollmentData = () => {
    if (!courseList?.courseId || !courseVideoDetail?.courseContentId) return;

    axiosConn
      .post(import.meta.env.VITE_API_URL + "/saveUserCourseContentProgress", {
        courseId: courseList.courseId,
        courseContentId: courseVideoDetail.courseContentId,
        logStatus: "COMPLETED",
      })
      .then((res) => {
        console.log(res.data);
        toast({
          title: "Progress saved!",
          description: "Content marked as completed successfully.",
        });
        fetchUserCourseContentProgress(userDetail.userId);
        fetchUserCourseEnrollment(userDetail.userId);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to update progress. Please try again.",
          variant: "destructive",
        });
      });
  };

  const deleteUserEnrollmentData = () => {
    if (!courseList?.courseId || !courseVideoDetail?.courseContentId) return;

    axiosConn
      .post(import.meta.env.VITE_API_URL + "/deleteUserCourseContentProgress", {
        courseId: courseList.courseId,
        courseContentId: courseVideoDetail.courseContentId,
      })
      .then((res) => {
        console.log(res.data);
        toast({
          title: "Progress updated",
          description: "Content completion status removed.",
        });
        fetchUserCourseContentProgress(userDetail.userId);
        fetchUserCourseEnrollment(userDetail.userId);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to update progress. Please try again.",
          variant: "destructive",
        });
      });
  };

  const [prevContent, setPrevContent] = useState(null);
  const [nextContent, setNextContent] = useState(null);

  useEffect(() => {
    if (!courseList?.courseContent || !courseVideoDetail?.courseContentId) {
      setPrevContent(null);
      setNextContent(null);
      return;
    }

    // Find current content index by matching the courseContentId from the written content details
    const currentIndex = courseList.courseContent.findIndex(
      (content) => content.courseContentId === courseVideoDetail.courseContentId
    );

    if (currentIndex === -1) {
      setPrevContent(null);
      setNextContent(null);
      return;
    }

    setPrevContent(
      currentIndex > 0 ? courseList.courseContent[currentIndex - 1] : null
    );
    setNextContent(
      currentIndex < courseList.courseContent.length - 1
        ? courseList.courseContent[currentIndex + 1]
        : null
    );
  }, [courseList, courseVideoDetail?.courseContentId]);

  const navigateToNextModule = (content) => {
    if (!content) return;

    console.log("Navigating to content:", content);
    console.log("Course list:", courseList);

    const routes = {
      CourseVideo: `/course/${courseList?.courseId}/video/${content.courseContentId}`,
      CourseWritten: `/course/${courseList?.courseId}/doc/${content.courseContentId}`,
      CourseQuiz: `/course/${courseList?.courseId}/quiz/${content.courseContentId}`,
      CourseFlashcard: `/course/${courseList?.courseId}/flashcard/${content.courseContentId}`,
    };

    const route = routes[content.courseContentType];
    console.log("Generated route:", route);

    if (route) {
      navigate(route);
    }
  };

  const [triggerNotesRefresh, setTriggerNotesRefresh] = useState(false);

  const handleNotesSave = () => {
    setTriggerNotesRefresh((prev) => !prev);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const isCompleted = userCourseContentProgress?.some(
    (log) =>
      log.courseId == CourseId &&
      log.courseContentId === courseVideoDetail?.courseContentId &&
      log.progressStatus === "COMPLETED"
  );

  const formatDuration = (totalMinutes) => {
    const minutes = +totalMinutes || 0;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  // Check enrollment access
  const isUserEnrolled =
    userCourseEnrollment && userCourseEnrollment.length > 0;
  const enrollmentStatus = userCourseEnrollment?.[0]?.enrollmentStatus;
  const hasContentAccess =
    isUserEnrolled &&
    ["ENROLLED", "IN_PROGRESS", "COMPLETED", "CERTIFIED"].includes(
      enrollmentStatus
    );

  // If not enrolled, show access denied
  if (!hasContentAccess) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Content Locked
            </h2>
            <p className="text-gray-600">
              You need to be enrolled in this course to access this content.
            </p>
          </div>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[30ch] font-medium text-muted-foreground">
                {courseVideoDetail?.courseWrittenTitle || "Loading..."}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto sm:flex-initial">
          <div className="flex gap-2">
            
            <Button
              variant="outline"
              size="sm"
              disabled={prevContent == null}
              onClick={() => navigateToNextModule(prevContent)}
              className="hover:bg-muted/50 transition-colors"
            >
              <CircleArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={nextContent == null}
              onClick={() => navigateToNextModule(nextContent)}
              className="hover:bg-muted/50 transition-colors"
            >
              <CircleArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Content */}
      <div className={isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}>
        <div className={`space-y-4 ${isFullscreen ? "h-full p-0" : "p-4"}`}>
          {/* Enhanced Header Card */}
          <Card className={`border-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm shadow-md overflow-hidden relative ${
            isFullscreen ? "hidden" : ""
          }`}>
            <CardHeader className="">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                    {courseVideoDetail?.courseWrittenTitle || "Written Lesson"}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deleteUserEnrollmentData}
                      className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      <Undo2 size={16} />
                      <span className="hidden sm:inline">
                        Mark as Incomplete
                      </span>
                      <span className="sm:hidden">Incomplete</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={saveUserEnrollmentData}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 size={16} />
                      <span className="hidden sm:inline">Mark as Complete</span>
                      <span className="sm:hidden">Complete</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className={`grid grid-cols-1 lg:grid-cols-4 h-full gap-4 `}>
            <div className={"lg:col-span-3 space-y-4 h-full"}>
              {/* Enhanced Content Section */}
              <Card className={`shadow-lg bg-white/70 backdrop-blur-sm ${
                isFullscreen ? "h-full border-0 rounded-none" : "border-0"
              }`}>
                <CardContent className={`${isFullscreen ? "h-full p-0" : "px-0"}`}>
                  <div className={`w-full relative ${isFullscreen ? "h-full" : ""}`}>
                    {/* Fullscreen Toggle Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white shadow-sm"
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize className="h-4 w-4 mr-1" />
                          Exit Fullscreen
                        </>
                      ) : (
                        <>
                          <Maximize className="h-4 w-4 mr-1" />
                          Fullscreen
                        </>
                      )}
                    </Button>
                    
                    {iframeLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span>Loading content...</span>
                        </div>
                      </div>
                    )}
                    {iframeError ? (
                      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-red-200">
                        <div className="text-center text-red-600">
                          <p className="mb-2">Failed to load content</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIframeError(false);
                              setIframeLoading(true);
                            }}
                          >
                            Retry
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        src={"https://ocpj21.javastudyguide.com"}
                        title={
                          courseVideoDetail?.courseWrittenTitle ||
                          "Course Content"
                        }
                        className={`w-full border-0 rounded-lg shadow-inner ${
                          isFullscreen ? "h-full" : "h-[600px]"
                        }`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        onLoad={() => setIframeLoading(false)}
                        onError={() => {
                          setIframeLoading(false);
                          setIframeError(true);
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

 
            </div>
            <div className={"lg:col-span-1 overflow-y-auto   my-4 space-y-4"}>
              {/* Enhanced Notes Creation Section */}
              <CreateNotesModule
                handleNotesSave={handleNotesSave}
                courseId={courseList.courseId}
                courseContentId={courseVideoDetail?.courseContentId}
              />

              {/* Enhanced Notes Module */}
              <NotesModule
                refreshTrigger={triggerNotesRefresh}
                courseId={courseList.courseId}
                userId={userDetail.userId}
                courseContentId={courseVideoDetail?.courseContentId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseEmbedder;
