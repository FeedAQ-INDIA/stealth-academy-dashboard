import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { CircleArrowLeft, CircleArrowRight, Clock, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import { useAuthStore } from "@/zustland/store.js";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";
import YouTubePlayer from "@/components-xm/Modules/YoutubePlayer.jsx";
import NotesModule from "@/components-xm/Notes/NotesModule.jsx";
import CreateNotesModule from "@/components-xm/Notes/CreateNotesModule.jsx";
import "./CourseVideoTutorial.css";

// Constants
const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENROLLMENT_STATUS = {
    COMPLETED: 'COMPLETED'
};

const CONTENT_TYPES = {
    COURSE_VIDEO: 'CourseVideo',
    COURSE_WRITTEN: 'CourseWritten',
    COURSE_QUIZ: 'CourseQuiz'
};

// Custom hooks
const useVideoData = (CourseVideoId, courseList) => {
    const [courseVideoDetail, setCourseVideoDetail] = useState({});
    const [courseContent, setCourseContent] = useState({});
    const [playerRefresh, setPlayerRefresh] = useState(false);

    const fetchCourseVideo = useCallback(async () => {
        if (!CourseVideoId) return;

        try {
            const response = await axiosConn.post(`${API_BASE_URL}/searchCourse`, {
                limit: 10,
                offset: 0,
                getThisData: {
                    datasource: "CourseVideo",
                    attributes: [],
                    where: { courseVideoId: CourseVideoId },
                },
            });

            const video = response.data?.data?.results?.[0];
            if (video) {
                setCourseVideoDetail(video);

                const content = courseList?.courseContent
                    ?.find(a => a.courseContentId === video.courseContentId)
                    ?.courseContent
                    ?.find(a => a.courseContentId === video.courseVideoId && a.courseContentType === CONTENT_TYPES.COURSE_VIDEO);

                setCourseContent(content || {});
                setPlayerRefresh(prev => !prev);
            }
        } catch (error) {
            console.error('Error fetching course video:', error);
            toast({
                title: "Failed to load video",
                variant: "destructive"
            });
        }
    }, [CourseVideoId, courseList]);

    useEffect(() => {
        if (courseList && CourseVideoId) {
            fetchCourseVideo();
        }
    }, [courseList, CourseVideoId, fetchCourseVideo]);

    return {
        courseVideoDetail,
        courseContent,
        playerRefresh,
        refetchVideo: fetchCourseVideo
    };
};

const useEnrollmentActions = (courseList, courseVideoDetail, fetchUserCourseContentProgress, userDetail) => {
    const saveUserEnrollmentData = useCallback(async () => {
        if (!courseList?.courseId || !courseVideoDetail?.courseContentId) return;

        try {
            await axiosConn.post(`${API_BASE_URL}/saveUserCourseContentProgress`, {
  
          courseId : courseList.courseId,
        courseContentId : courseVideoDetail.courseContentId,
        logStatus : ENROLLMENT_STATUS.COMPLETED
            });

            toast({ title: "Progress saved successfully" });
            fetchUserCourseContentProgress(userDetail?.userId);
        } catch (error) {
            console.error('Error saving enrollment data:', error);
            toast({
                title: "Failed to save progress",
                variant: "destructive"
            });
        }
    }, [courseList?.courseId, courseVideoDetail?.courseContentId, fetchUserCourseContentProgress, userDetail?.userId]);

    const deleteUserEnrollmentData = useCallback(async () => {
        if (!courseList?.courseId || !courseVideoDetail?.courseContentId) return;

        try {
            await axiosConn.post(`${API_BASE_URL}/deleteUserCourseContentProgress`, {
                courseId: courseList.courseId,
                courseContentId: courseVideoDetail.courseContentId
            });

            toast({ title: "Progress updated successfully" });
            fetchUserCourseContentProgress(userDetail?.userId);
        } catch (error) {
            console.error('Error deleting enrollment data:', error);
            toast({
                title: "Failed to update progress",
                variant: "destructive"
            });
        }
    }, [courseList?.courseId, courseVideoDetail?.courseContentId, fetchUserCourseContentProgress, userDetail?.userId]);

    return { saveUserEnrollmentData, deleteUserEnrollmentData };
};

const useNavigation = (courseList, CourseVideoId) => {
    const navigate = useNavigate();

    const { prevContent, nextContent } = useMemo(() => {
        if (!courseList?.courseContent || !CourseVideoId) {
            return { prevContent: null, nextContent: null };
        }

        const currentIndex = courseList.courseContent.findIndex(
            content => content.courseContentId === CourseVideoId
        );

        return {
            prevContent: currentIndex > 0 ? courseList.courseContent[currentIndex - 1] : null,
            nextContent: currentIndex < courseList.courseContent.length - 1
                ? courseList.courseContent[currentIndex + 1]
                : null
        };
    }, [courseList, CourseVideoId]);

    const navigateToContent = useCallback((content) => {
        if (!content) return;

        const routes = {
            [CONTENT_TYPES.COURSE_VIDEO]: `/course/${content.courseId}/video/${content.courseContentId}`,
            [CONTENT_TYPES.COURSE_WRITTEN]: `/course/${content.courseId}/doc/${content.courseContentId}`,
            [CONTENT_TYPES.COURSE_QUIZ]: `/course/${content.courseId}/quiz/${content.courseContentId}`
        };

        const route = routes[content.courseContentType];
        if (route) {
            navigate(route);
        }
    }, [navigate]);

    return {
        prevContent,
        nextContent,
        navigateToContent
    };
};

// Utility functions
const formatDuration = (totalMinutes) => {
    const minutes = Math.floor(totalMinutes || 0);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
};

// Components
const VideoHeader = React.memo(({
                                    courseContent,
                                    courseVideoDetail,
                                    isCompleted,
                                    onMarkComplete,
                                    onUndoComplete
                                }) => (
    <Card className="border-0  bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm  shadow-md  overflow-hidden relative">
        <CardHeader className=" ">
            {/*<div className="flex flex-wrap items-center gap-2 mb-3">*/}
            {/*    <Badge variant="secondary" className="flex items-center gap-1">*/}
            {/*        <Play className="h-3 w-3" />*/}
            {/*        Video*/}
            {/*    </Badge>*/}
            {/*    <Badge variant="outline" className="flex items-center gap-1">*/}
            {/*        <Clock className="h-3 w-3" />*/}
            {/*        {formatDuration(courseContent?.courseContentDuration)}*/}
            {/*    </Badge>*/}
            {/*</div>*/}

            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                    <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 leading-tight line-clamp-1">
                        {courseVideoDetail?.courseVideoTitle || 'Loading...'}
                    </CardTitle>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                    {isCompleted ? (
                        <div className="flex flex-col items-start md:items-end gap-1">
              <span className="completed-stamp text-sm font-medium">
                ✓ Completed
              </span>
                            <button
                                onClick={onUndoComplete}
                                className="text-xs text-muted-foreground hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                            >
                                Undo completion
                            </button>
                        </div>
                    ) : (
                        <Button
                            onClick={onMarkComplete}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                        >
                            Mark as Complete
                        </Button>
                    )}
                </div>
            </div>
        </CardHeader>
    </Card>
));

const NavigationHeader = React.memo(({courseVideoDetail,
                                         courseContent,
                                         prevContent,
                                         nextContent,
                                         onNavigate
                                     }) => (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-white/95 backdrop-blur-sm px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage className="truncate max-w-[40ch] font-medium">
                        {courseVideoDetail?.courseVideoTitle  || 'Loading...'}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                disabled={!prevContent}
                onClick={() => onNavigate(prevContent)}
                className="flex items-center gap-2"
            >
                <CircleArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={!nextContent}
                onClick={() => onNavigate(nextContent)}
                className="flex items-center gap-2"
            >
                <span className="hidden sm:inline">Next</span>
                <CircleArrowRight className="h-4 w-4" />
            </Button>
        </div>
    </header>
));

const VideoDescription = React.memo(({ description }) => (
    <Card className="border-0  rounded-sm  shadow-md  overflow-hidden relative">
        <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Overview
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="prose prose-sm max-w-none max-h-[80svh] overflow-y-auto">
                <div className="whitespace-pre-wrap break-words text-gray-700 leading-relaxed">
                    {description || "No description available for this video."}
                </div>
            </div>
        </CardContent>
    </Card>
));

// Main component
function CourseVideoTutorial() {
    const { userDetail } = useAuthStore();
    const { CourseId, CourseVideoId } = useParams();
    const { userCourseContentProgress, fetchUserCourseContentProgress, courseList } = useCourse();

    const [triggerNotesRefresh, setTriggerNotesRefresh] = useState(false);

    // Custom hooks
    const { courseVideoDetail, courseContent, playerRefresh } = useVideoData(CourseVideoId, courseList);
    const { saveUserEnrollmentData, deleteUserEnrollmentData } = useEnrollmentActions(
        courseList,
        courseVideoDetail,
        fetchUserCourseContentProgress,
        userDetail
    );
    const { prevContent, nextContent, navigateToContent } = useNavigation(courseList, CourseVideoId);


    // useEffect(() => {
    //     if(courseVideoDetail){
    //         loadYoutubePlayerComponent(courseVideoDetail);
    //     }
    // }, [courseVideoDetail]);



    // Memoized values
    const isCompleted = useMemo(() => {
        if (!userCourseContentProgress || !CourseId || !courseVideoDetail?.courseContentId) {
            console.log('isCompleted check failed - missing data:', {
                hasProgress: !!userCourseContentProgress,
                CourseId,
                courseContentId: courseVideoDetail?.courseContentId
            });
            return false;
        }

        console.log('Checking completion status:', {
            CourseId,
            courseContentId: courseVideoDetail.courseContentId,
            userProgress: userCourseContentProgress,
            progressLogs: userCourseContentProgress.map(log => ({
                courseId: log.courseId,
                courseContentId: log.courseContentId,
                status: log.progressStatus
            }))
        });

        const completed = userCourseContentProgress.some(
            log => {
                const courseIdMatch = log.courseId == CourseId; // Using == for type-flexible comparison
                const contentIdMatch = log.courseContentId === courseVideoDetail.courseContentId;
                const statusMatch = log.progressStatus === ENROLLMENT_STATUS.COMPLETED;
                
                console.log('Checking log:', {
                    logCourseId: log.courseId,
                    logContentId: log.courseContentId,
                    logStatus: log.progressStatus,
                    courseIdMatch,
                    contentIdMatch,
                    statusMatch
                });
                
                return courseIdMatch && contentIdMatch && statusMatch;
            }
        );
        
        console.log('Final completion status:', completed);
        return completed;
    }, [userCourseContentProgress, CourseId, courseVideoDetail?.courseContentId]);

    const notesProps = useMemo(() => {
        const contentData = courseList?.courseContent
            ?.find(a => a.courseContentId === courseVideoDetail.courseContentId)
        console.log("Content Data", contentData)
        return {
            courseId: courseList?.courseId,
            userId: userDetail?.userId,
            courseContentId: contentData?.courseContentId,
         };
    }, [courseList, courseVideoDetail, userDetail]);

    // Callbacks
    const handleNotesSave = useCallback(() => {
        setTriggerNotesRefresh(prev => !prev);
    }, []);

    const handleMarkComplete = useCallback(() => {
        saveUserEnrollmentData();
    }, [saveUserEnrollmentData]);

    const handleUndoComplete = useCallback(() => {
        deleteUserEnrollmentData();
    }, [deleteUserEnrollmentData]);

    // Loading state
    if (!courseList || !courseVideoDetail?.courseVideoId) {
        return (
            <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading video...</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gray-50/30">
            <NavigationHeader
                courseVideoDetail={courseVideoDetail}
                courseContent={courseContent}
                prevContent={prevContent}
                nextContent={nextContent}
                onNavigate={navigateToContent}
            />

            <div className="mx-auto p-4  space-y-4">
                <VideoHeader
                    courseContent={courseContent}
                    courseVideoDetail={courseVideoDetail}
                    isCompleted={isCompleted}
                    onMarkComplete={handleMarkComplete}
                    onUndoComplete={handleUndoComplete}
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-4">
                        <Card className="border-0 shadow-md overflow-hidden">
                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <YouTubePlayer
                                    saveUserEnrollmentData={saveUserEnrollmentData}
                                    playerRefresh={playerRefresh}
                                    videoUrl={courseVideoDetail?.courseVideoUrl}
                                    playerId={`player-${courseVideoDetail?.courseVideoId}`}
                                />
                            </div>
                        </Card>

                        <VideoDescription description={courseVideoDetail?.courseVideoDescription}  />
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {notesProps.courseId && (
                            <CreateNotesModule
                                handleNotesSave={handleNotesSave}
                                courseId={notesProps.courseId}
                                courseContentId={notesProps.courseContentId}
                            />
                        )}

                        {notesProps.courseId && notesProps.userId && (
                            <NotesModule
                                refreshTrigger={triggerNotesRefresh}
                                courseId={notesProps.courseId}
                                userId={notesProps.userId}
                                courseContentId={notesProps.courseContentId}
                            />
                        )}
                    </div>
                </div>

                {/*{notesProps.courseId && notesProps.userId && (*/}
                {/*    <NotesModule*/}
                {/*        refreshTrigger={triggerNotesRefresh}*/}
                {/*        courseId={notesProps.courseId}*/}
                {/*        userId={notesProps.userId}*/}
                {/*        courseTopicContentId={notesProps.courseTopicContentId}*/}
                {/*        courseTopicId={notesProps.courseTopicId}*/}
                {/*    />*/}
                {/*)}*/}
            </div>
        </div>
    );
}

export default React.memo(CourseVideoTutorial);