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
import {Check, CircleArrowLeft, CircleArrowRight, Clock, FileText, CheckCircle2, Undo2, Zap} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import NotesModule from "@/components-xm/Notes/NotesModule.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import CreateNotesModule from "@/components-xm/Notes/CreateNotesModule.jsx";
import {useAuthStore} from "@/zustland/store.js";

function CourseWritten() {
    const { userDetail } = useAuthStore();

    const {CourseId, CourseDocId} = useParams();
    const {userCourseEnrollment, userCourseContentProgress, fetchUserCourseContentProgress, fetchUserCourseEnrollment, courseList} = useCourse();

    const [courseVideoDetail, setCourseVideoDetail] = useState({});
    const [courseTopicContent, setCourseTopicContent] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (courseList && CourseDocId) {
            fetchCourseVideo();
        }
    }, [courseList, userCourseEnrollment, CourseDocId]);

    const fetchCourseVideo = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "CourseWritten", attributes: [], where: {courseWrittenId: CourseDocId},
                },
            })
            .then((res) => {
                console.log(res.data);
                const written = res.data.data?.results?.[0]
                setCourseVideoDetail(written);
                
                // Find the content from the new courseContent structure
                const content = courseList?.courseContent
                    ?.find(a => a.courseContentId === written.courseContentId);
                setCourseTopicContent(content || {});
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const saveUserEnrollmentData = () => {
        if (!courseList?.courseId || !courseVideoDetail?.courseContentId) return;

        axiosConn
            .post(import.meta.env.VITE_API_URL + "/saveUserCourseContentProgress", {
                courseId: courseList.courseId,
                courseContentId: courseVideoDetail.courseContentId,
                logStatus: 'COMPLETED'
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: "Progress saved!",
                    description: "Content marked as completed successfully."
                });
                fetchUserCourseContentProgress(userDetail.userId);
                fetchUserCourseEnrollment(userDetail.userId);
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "Error",
                    description: "Failed to update progress. Please try again.",
                    variant: "destructive"
                })
            });
    }

    const deleteUserEnrollmentData = () => {
        if (!courseList?.courseId || !courseVideoDetail?.courseContentId) return;

        axiosConn
            .post(import.meta.env.VITE_API_URL + "/deleteUserCourseContentProgress", {
                courseId: courseList.courseId,
                courseContentId: courseVideoDetail.courseContentId
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: "Progress updated",
                    description: "Content completion status removed."
                });
                fetchUserCourseContentProgress(userDetail.userId);
                fetchUserCourseEnrollment(userDetail.userId);
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "Error",
                    description: "Failed to update progress. Please try again.",
                    variant: "destructive"
                })
            });
    }

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
            content => content.courseContentId === courseVideoDetail.courseContentId
        );

        if (currentIndex === -1) {
            setPrevContent(null);
            setNextContent(null);
            return;
        }

        setPrevContent(currentIndex > 0 ? courseList.courseContent[currentIndex - 1] : null);
        setNextContent(currentIndex < courseList.courseContent.length - 1 ? courseList.courseContent[currentIndex + 1] : null);

    }, [courseList, courseVideoDetail?.courseContentId]);

    const navigateToNextModule = (content) => {
        if (!content) return;

        console.log('Navigating to content:', content);
        console.log('Course list:', courseList);

        const routes = {
            'CourseVideo': `/course/${courseList?.courseId}/video/${content.courseContentId}`,
            'CourseWritten': `/course/${courseList?.courseId}/doc/${content.courseContentId}`,
            'CourseQuiz': `/course/${courseList?.courseId}/quiz/${content.courseContentId}`,
            'CourseFlashcard': `/course/${courseList?.courseId}/flashcard/${content.courseContentId}`
        };

        const route = routes[content.courseContentType];
        console.log('Generated route:', route);
        
        if (route) {
            navigate(route);
        }
    }

    const [triggerNotesRefresh, setTriggerNotesRefresh] = useState(false);

    const handleNotesSave = () => {
        setTriggerNotesRefresh(prev => !prev);
    };

    const isCompleted = userCourseContentProgress?.some(
        log => log.courseId == CourseId && 
               log.courseContentId === courseVideoDetail?.courseContentId && 
               log.progressStatus === 'COMPLETED'
    );

    const formatDuration = (totalMinutes) => {
        const minutes = +totalMinutes || 0;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    // Check enrollment access
    const isUserEnrolled = userCourseEnrollment && userCourseEnrollment.length > 0;
    const enrollmentStatus = userCourseEnrollment?.[0]?.enrollmentStatus;
    const hasContentAccess = isUserEnrolled && ['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'CERTIFIED'].includes(enrollmentStatus);

    // If not enrolled, show access denied
    if (!hasContentAccess) {
        return (
            <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Locked</h2>
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
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage
                                className="truncate max-w-[30ch] font-medium text-muted-foreground">
                                {courseVideoDetail?.courseWrittenTitle || 'Loading...'}
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
                            <CircleArrowLeft className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={nextContent == null}
                            onClick={() => navigateToNextModule(nextContent)}
                            className="hover:bg-muted/50 transition-colors"
                        >
                            <CircleArrowRight className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Enhanced Content */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
                <div className="  mx-auto p-6 space-y-8">
                    {/* Enhanced Header Card */}
                    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                                    <FileText className="h-3 w-3 mr-1"/>
                                    Document
                                </Badge>
                                <Badge variant="outline" className="bg-white/80">
                                    <Clock className="h-3 w-3 mr-1"/>
                                    {formatDuration(courseTopicContent?.courseContentDuration)}
                                </Badge>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                                        {courseVideoDetail?.courseWrittenTitle || 'Loading...'}
                                    </CardTitle>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {isCompleted ? (
                                        <div className="flex items-center gap-2">
                                            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                                                <CheckCircle2 className="h-3 w-3 mr-1"/>
                                                Completed
                                            </Badge>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => saveUserEnrollmentData()}
                                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            <Check className="h-4 w-4 mr-2"/>
                                            Mark as Complete
                                        </Button>
                                    )}

                                    {isCompleted && (
                                        <button
                                            onClick={() => deleteUserEnrollmentData()}
                                            className="text-sm text-muted-foreground hover:text-blue-600 hover:underline underline-offset-4 italic transition-colors duration-200 flex items-center gap-1"
                                        >
                                            <Undo2 className="h-3 w-3"/>
                                            Undo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Enhanced Content Section */}
                    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                        <CardContent className="p-8">
                            <div className="prose prose-lg max-w-none">
                                <div
                                    className="whitespace-pre-wrap break-words text-gray-800 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: courseVideoDetail?.courseWrittenHtmlContent }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enhanced Notes Creation Section */}
                    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600"/>
                                Create Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <CreateNotesModule
                                handleNotesSave={handleNotesSave}
                                courseId={courseList.courseId}
                                courseContentId={courseVideoDetail?.courseContentId}
                            />
                        </CardContent>
                    </Card>

                    {/* Enhanced Notes Module */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg p-1">
                        <NotesModule
                            refreshTrigger={triggerNotesRefresh}
                            courseId={courseList.courseId}
                            userId={userDetail.userId}
                            courseContentId={courseVideoDetail?.courseContentId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseWritten;