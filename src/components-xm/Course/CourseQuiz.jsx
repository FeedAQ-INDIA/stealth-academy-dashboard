import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {Check, CircleArrowLeft, CircleArrowRight, Clock, PlayCircle, BookOpen, FileText, Trophy} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import QuizRender from "@/components-xm/Course/QuizRender.jsx";
import {useAuthStore} from "@/zustland/store.js";
import {Progress} from "@/components/ui/progress.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";

function CourseQuiz() {
    const {CourseId, CourseQuizId} = useParams();
    const {
        userEnrollmentObj,
        userEnrollmentCourseLog,
        fetchUserEnrollmentData,
        isUserEnrolledAlready,
        courseList,
        enroll,
        disroll,
        enrollStatus
    } = useCourse();
    const { userDetail } = useAuthStore();

    const [courseQuizDetail, setCourseQuizDetail] = useState({});
    const [courseTopicContent, setCourseTopicContent] = useState({});
    const [prevContent, setPrevContent] = useState({});
    const [nextContent, setNextContent] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (courseList && CourseQuizId) {
            fetchCourseVideo();
        }
    }, [courseList, userEnrollmentObj, CourseQuizId]);

    const fetchCourseVideo = async () => {
        setIsLoading(true);
        try {
            const res = await axiosConn.post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: 10,
                offset: 0,
                getThisData: {
                    datasource: "CourseQuiz",
                    attributes: [],
                    where: {courseQuizId: CourseQuizId}
                },
            });

            const video = res.data.data?.results?.[0];
            setCourseQuizDetail(video);
            setCourseTopicContent(courseList?.courseTopic?.find(a => a.courseTopicId == video.courseTopicId)?.courseTopicContent?.find(a => a.contentId == video.courseQuizId && a.courseTopicContentType == 'CourseQuiz'));
        } catch (err) {
            console.error(err);
            toast({
                title: "Error loading quiz",
                description: "Failed to load quiz content. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const saveUserEnrollmentData = async () => {
        try {
            await axiosConn.post(import.meta.env.VITE_API_URL + "/saveUserEnrollmentData", {
                userEnrollmentId: userEnrollmentObj?.userEnrollmentId,
                courseId: courseList.courseId,
                courseTopicContentId: courseTopicContent.courseTopicContentId,
                courseTopicId: courseQuizDetail.courseTopicId,
                enrollmentStatus: 'COMPLETED'
            });

            toast({
                title: "Progress saved!",
                description: "Quiz marked as completed successfully."
            });

            fetchUserEnrollmentData();
            enrollStatus();
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "Failed to update progress. Please try again.",
                variant: "destructive"
            });
        }
    };

    const deleteUserEnrollmentData = async () => {
        try {
            await axiosConn.post(import.meta.env.VITE_API_URL + "/deleteUserEnrollmentData", {
                userEnrollmentId: userEnrollmentObj?.userEnrollmentId,
                courseId: courseList.courseId,
                courseTopicContentId: courseTopicContent.courseTopicContentId,
                courseTopicId: courseQuizDetail.courseTopicId
            });

            toast({
                title: "Progress updated",
                description: "Quiz completion status removed."
            });

            fetchUserEnrollmentData();
            enrollStatus();
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "Failed to update progress. Please try again.",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        const allContents = courseList?.courseTopic?.flatMap(topic =>
            topic?.courseTopicContent?.map(content => ({
                ...content,
                courseTopicTitle: topic.courseTopicTitle
            })) || []
        );

        const currentIndex = allContents.findIndex(
            content => content.courseTopicContentId === courseTopicContent?.courseTopicContentId
        );

        setPrevContent(currentIndex > 0 ? allContents[currentIndex - 1] : null);
        setNextContent(currentIndex < allContents.length - 1 ? allContents[currentIndex + 1] : null);
    }, [courseList, courseTopicContent]);

    const navigateToNextModule = (context) => {
        if (context.courseTopicContentType == 'CourseVideo') {
            navigate(`/course/${context?.courseId}/video/${context?.contentId}`);
        } else if (context.courseTopicContentType == 'CourseWritten') {
            navigate(`/course/${context?.courseId}/doc/${context?.contentId}`);
        } else if (context.courseTopicContentType == 'CourseQuiz') {
            navigate(`/course/${context?.courseId}/quiz/${context?.contentId}`);
        }
    };

    const getContentIcon = (contentType) => {
        switch (contentType) {
            case 'CourseVideo':
                return <PlayCircle className="w-4 h-4" />;
            case 'CourseWritten':
                return <FileText className="w-4 h-4" />;
            case 'CourseQuiz':
                return <Trophy className="w-4 h-4" />;
            default:
                return <BookOpen className="w-4 h-4" />;
        }
    };

    const formatDuration = (minutes) => {
        const totalMinutes = +minutes || 0;
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    const isCompleted = userEnrollmentCourseLog?.filter(b =>
        (b.courseId == CourseId &&
            b?.courseTopicContentId == courseTopicContent?.courseTopicContentId &&
            b.enrollmentStatus == 'COMPLETED')
    )?.length > 0;

    // Calculate progress
    const totalContent = courseList?.courseTopic?.flatMap(topic => topic?.courseTopicContent || []).length || 0;
    const completedContent = userEnrollmentCourseLog?.filter(b =>
        b.courseId == CourseId && b.enrollmentStatus == 'COMPLETED'
    )?.length || 0;
    const progressPercentage = totalContent > 0 ? (completedContent / totalContent) * 100 : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Skeleton className="h-4 w-32" />
                </header>
                <div className="p-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="space-y-4">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <Skeleton className="h-8 w-3/4" />
                        </CardHeader>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch] font-medium">
                                {courseTopicContent?.courseTopicContentTitle}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="ml-auto flex items-center gap-3">


                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={prevContent == null}
                            onClick={() => navigateToNextModule(prevContent)}
                            className="gap-1"
                        >
                            <CircleArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={nextContent == null}
                            onClick={() => navigateToNextModule(nextContent)}
                            className="gap-1"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <CircleArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-4  mx-auto">
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="gap-1">
                                <Trophy className="w-3 h-3" />
                                Quiz
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDuration(courseTopicContent?.courseTopicContentDuration)}
                            </Badge>
                            {isCompleted && (
                                <Badge variant="default" className="gap-1 bg-green-100 text-green-800 border-green-200">
                                    <Check className="w-3 h-3" />
                                    Completed
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                                    {courseTopicContent?.courseTopicContentTitle}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Test your knowledge with this interactive quiz
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                {isCompleted ? (
                                    <div className="text-right">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                            <Check className="w-4 h-4" />
                                            Completed
                                        </div>
                                        {/*<button*/}
                                        {/*    onClick={deleteUserEnrollmentData}*/}
                                        {/*    className="block text-xs text-muted-foreground hover:text-blue-600 hover:underline mt-1 transition-colors"*/}
                                        {/*>*/}
                                        {/*    Mark as incomplete*/}
                                        {/*</button>*/}
                                    </div>
                                ) : (<></>
                                    // <Button
                                    //     onClick={saveUserEnrollmentData}
                                    //     className="gap-2"
                                    //     variant="outline"
                                    // >
                                    //     <Check className="w-4 h-4" />
                                    //     Mark Complete
                                    // </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Navigation hints */}
                <div className="flex justify-between items-center mt-4 px-4">
                    {/*<div className="flex items-center gap-2 text-sm text-muted-foreground">*/}
                    {/*    {prevContent && (*/}
                    {/*        <div className="flex items-center gap-1">*/}
                    {/*            <span>Previous:</span>*/}
                    {/*            {getContentIcon(prevContent.courseTopicContentType)}*/}
                    {/*            <span className="truncate max-w-[200px]">*/}
                    {/*                {prevContent.courseTopicContentTitle}*/}
                    {/*            </span>*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</div>*/}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {nextContent && (
                            <div className="flex items-center gap-1">
                                <span>Next:</span>
                                {getContentIcon(nextContent.courseTopicContentType)}
                                <span className="truncate max-w-[200px]">
                                    {nextContent.courseTopicContentTitle}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <section className="mt-6">
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <QuizRender
                                saveUserEnrollmentData={saveUserEnrollmentData}
                                fetchCourseVideo={fetchCourseVideo}
                                deleteUserEnrollmentData={deleteUserEnrollmentData}
                            />
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}

export default CourseQuiz;