import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {CircleArrowLeft, CircleArrowRight, Clock, Play, FileText, BookOpen} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import NotesModule from "@/components-xm/Notes/NotesModule.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {Label} from "@/components/ui/label.jsx";
import CreateNotesModule from "@/components-xm/Notes/CreateNotesModule.jsx";
import {useAuthStore} from "@/zustland/store.js";
import YouTubePlayer from "@/components-xm/Modules/YoutubePlayer.jsx";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card.jsx"
import "./CourseVideoTutorial.css"


function CourseVideoTutorial() {
    const {userDetail} = useAuthStore();
    const {CourseId, CourseVideoId} = useParams();
    const {
        userEnrollmentLog,
        userEnrollmentCourseLog,
        userEnrollmentObj,
        fetchUserEnrollmentData,
        isUserEnrolledAlready,
        courseList,
        enroll,
        disroll,
        enrollStatus
    } = useCourse();

    const [courseVideoDetail, setCourseVideoDetail] = useState({});
    const [courseTopicContent, setCourseTopicContent] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        if (courseList && CourseVideoId) {
            fetchCourseVideo();
        }
    }, [courseList, userEnrollmentObj, CourseVideoId]);
    const [playerRefresh, setPlayerRefresh] = useState(false);

    const fetchCourseVideo = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "CourseVideo", attributes: [], where: {courseVideoId: CourseVideoId},
                },
            })
            .then((res) => {
                console.log(res.data);
                const video = res.data.data?.results?.[0]
                setCourseVideoDetail(video);
                setCourseTopicContent(courseList?.courseTopic?.find(a => a.courseTopicId == video.courseTopicId)?.courseTopicContent?.find(a => a.contentId == video.courseVideoId && a.courseTopicContentType == 'CourseVideo'))
                setPlayerRefresh(!playerRefresh)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const saveUserEnrollmentData = () => {

        axiosConn
            .post(import.meta.env.VITE_API_URL + "/saveUserEnrollmentData", {
                userEnrollmentId: userEnrollmentObj?.userEnrollmentId,
                courseId: courseList.courseId,
                courseTopicContentId: courseTopicContent.courseTopicContentId,
                courseTopicId: courseVideoDetail.courseTopicId,
                enrollmentStatus: 'COMPLETED'
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: "status is updated"
                });
                fetchUserEnrollmentData();
                enrollStatus()
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "status updation failed"
                })
            });
    }


    const deleteUserEnrollmentData = () => {

        axiosConn
            .post(import.meta.env.VITE_API_URL + "/deleteUserEnrollmentData", {
                userEnrollmentId: userEnrollmentObj?.userEnrollmentId,
                courseId: courseList.courseId,
                courseTopicContentId: courseTopicContent.courseTopicContentId,
                courseTopicId: courseVideoDetail.courseTopicId
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: "status is updated"
                });
                fetchUserEnrollmentData();
                enrollStatus()
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "status updation failed"
                })
            });
    }


    const [prevContent, setPrevContent] = useState({});

    const [nextContent, setNextContent] = useState({});


    useEffect(() => {
        const allContents = courseList?.courseTopic?.flatMap(topic =>
            topic?.courseTopicContent?.map(content => ({
                ...content,
                courseTopicTitle: topic.courseTopicTitle // optional, helpful for display
            })) || []
        );

        const currentIndex = allContents.findIndex(
            content => content.courseTopicContentId === courseTopicContent?.courseTopicContentId
        );

        setPrevContent(currentIndex > 0 ? allContents[currentIndex - 1] : null);
        setNextContent(currentIndex < allContents.length - 1 ? allContents[currentIndex + 1] : null);

    }, [courseList, courseTopicContent]);

    const navigateToNextModule = (context) => {
        console.log(context);
        if (context.courseTopicContentType == 'CourseVideo') {
            navigate(`/course/${context?.courseId}/video/${context?.contentId}`);
        } else if (context.courseTopicContentType == 'CourseWritten') {
            navigate(`/course/${context?.courseId}/doc/${context?.contentId}`);
        } else if (context.courseTopicContentType == 'CourseQuiz') {
            navigate(`/course/${context?.courseId}/quiz/${context?.contentId}`);
        }
    }

    const [triggerNotesRefresh, setTriggerNotesRefresh] = useState(false);

    const handleNotesSave = () => {
        setTriggerNotesRefresh(prev => !prev);
    };
    const [isOpen, setIsOpen] = useState(false);

    const isCompleted = userEnrollmentCourseLog?.filter(b => (b.courseId == CourseId && b?.courseTopicContentId == courseTopicContent?.courseTopicContentId && b.enrollmentStatus == 'COMPLETED'))?.length > 0;

    return (
        <>
            <div className="min-h-screen bg-gray-50/30">
                {/* Enhanced Header */}
                <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-white/95 backdrop-blur-sm px-4 shadow-sm">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="truncate max-w-[40ch] font-medium">
                                    {courseTopicContent?.courseTopicContentTitle}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Enhanced Navigation */}
                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={prevContent == null}
                            onClick={() => navigateToNextModule(prevContent)}
                            className="flex items-center gap-2"
                        >
                            <CircleArrowLeft className="h-4 w-4"/>
                            <span className="hidden sm:inline">Previous</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={nextContent == null}
                            onClick={() => navigateToNextModule(nextContent)}
                            className="flex items-center gap-2"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <CircleArrowRight className="h-4 w-4"/>
                        </Button>
                    </div>
                </header>

                <div className=" mx-auto p-4 lg:p-6 space-y-6">
                    {/* Enhanced Video Header Card */}
                    <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardHeader className="pb-4">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Play className="h-3 w-3"/>
                                    Video
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3"/>
                                    {(() => {
                                        const totalMinutes = +courseTopicContent?.courseTopicContentDuration || 0;
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;
                                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                    })()}
                                </Badge>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                    <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                                        {courseTopicContent?.courseTopicContentTitle}
                                    </CardTitle>
                                </div>

                                {/* Enhanced Completion Status */}
                                <div className="flex flex-col items-start md:items-end gap-2">
                                    {isCompleted ? (
                                        <div className="flex flex-col items-start md:items-end gap-1">
                                            <span className="completed-stamp text-sm font-medium">
                                                ✓ Completed
                                            </span>
                                            <button
                                                onClick={deleteUserEnrollmentData}
                                                className="text-xs text-muted-foreground hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                                            >
                                                Undo completion
                                            </button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={saveUserEnrollmentData}
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

                    {/* Enhanced Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Video Section */}
                        <div className="lg:col-span-3 space-y-6">
                            <Card className="border-0 shadow-md overflow-hidden">
                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                    <YouTubePlayer
                                        saveUserEnrollmentData={saveUserEnrollmentData}
                                        playerRefresh={playerRefresh}
                                        videoId={courseVideoDetail?.courseVideoUrl}
                                        playerId={`player-${courseVideoDetail?.courseVideoId}`}
                                    />
                                </div>
                            </Card>

                            {/* Video Description */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <BookOpen className="h-5 w-5 text-blue-600"/>
                                        Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap break-words text-gray-700 leading-relaxed">
                                            {courseVideoDetail?.courseVideoDescription || "No description available for this video."}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Notes Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5 text-green-600"/>
                                        Create Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <CreateNotesModule
                                        handleNotesSave={handleNotesSave}
                                        courseId={courseList.courseId}
                                        courseTopicContentId={courseList?.courseTopic?.find(a => a.courseTopicId == courseVideoDetail.courseTopicId)?.courseTopicContent?.find(a => a.contentId == courseVideoDetail.courseVideoId && a.courseTopicContentType == 'CourseVideo')?.courseTopicContentId}
                                        courseTopicId={courseVideoDetail.courseTopicId}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Enhanced Notes Section */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-purple-600"/>
                                Your Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <NotesModule
                                refreshTrigger={triggerNotesRefresh}
                                courseId={courseList.courseId}
                                userId={userDetail.userId}
                                courseTopicContentId={courseList?.courseTopic?.find(a => a.courseTopicId == courseVideoDetail.courseTopicId)?.courseTopicContent?.find(a => a.contentId == courseVideoDetail.courseVideoId && a.courseTopicContentType == 'CourseVideo')?.courseTopicContentId}
                                courseTopicId={courseVideoDetail.courseTopicId}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default CourseVideoTutorial;