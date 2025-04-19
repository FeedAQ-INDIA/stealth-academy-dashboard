import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState, useRef} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {Check, MessageCircle} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import NotesModule from "@/components-xm/NotesModule.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Label} from "@/components/ui/label.jsx";
import CreateNotesModule from "@/components-xm/CreateNotesModule.jsx";
import {useAuthStore} from "@/zustland/store.js";
import YouTubePlayer from "@/components-xm/YoutubePlayer.jsx";

function CourseVideoTutorial() {
    const { userDetail } = useAuthStore();
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
    const  [playerRefresh, setPlayerRefresh] = useState(false);

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



    const [prevContent, setPrevContent] = useState({}); ;
    const [nextContent, setNextContent] = useState({}); ;

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
        if(context.courseTopicContentType == 'CourseVideo'){
            navigate(`/course/${context?.courseTopicId}/video/${context?.contentId}`);
        } else if(context.courseTopicContentType == 'CourseWritten'){
            navigate(`/course/${context?.courseTopicId}/doc/${context?.contentId}`);
        } else if (context.courseTopicContentType == 'CourseQuiz') {
            navigate(`/course/${context?.courseTopicId}/quiz/${context?.contentId}`);
        }
    }

    const [triggerNotesRefresh, setTriggerNotesRefresh] = useState(false);

    const handleNotesSave = () => {
        setTriggerNotesRefresh(prev => !prev);
    };
    const [isOpen, setIsOpen] = useState(false);



    return (
        <>
            <div className=" ">
                <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>

                            {/*<BreadcrumbItem>*/}
                            {/*    <BreadcrumbPage><Link to={`/explore`}>Course</Link></BreadcrumbPage>*/}
                            {/*</BreadcrumbItem>*/}
                            {/*<BreadcrumbSeparator/>*/}
                            {/*<BreadcrumbItem>*/}
                            {/*    <BreadcrumbPage className="truncate max-w-[30ch]"*/}
                            {/*                    title={courseList?.courseTitle}>{courseList?.courseTitle}</BreadcrumbPage>*/}
                            {/*</BreadcrumbItem>*/}
                            {/*<BreadcrumbSeparator/>*/}
                            <BreadcrumbItem>
                                <BreadcrumbPage
                                    className="truncate max-w-[30ch]">{courseTopicContent?.courseTopicContentTitle}</BreadcrumbPage>
                            </BreadcrumbItem>

                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto sm:flex-initial">

                    </div>
                </header>
                <Card className="rounded-none border-none">
                    <CardHeader className="flex items-centergap-2 w-full p-2">
                        <div className="flex gap-2 justify-between ">
                            <Button className="w-fit" size="sm" disabled={prevContent == null} onClick={()=>navigateToNextModule(prevContent)}>Previous</Button>
                            <Button className="w-fit" size="sm" disabled={nextContent == null} onClick={()=>navigateToNextModule(nextContent)}>Next</Button>
                        </div>
                    </CardHeader>
                </Card>


                <div className="p-4">
                    <Card className="rounded-none bg-muted/50 border-none">
                        <CardHeader>
                            <div className="flex flex-wrap gap-2 w-full mb-3 justify-items-center">
                                <Badge variant="outline">Video</Badge>
                                <Badge variant="outline">
                                    {(() => {
                                        const totalMinutes = +courseTopicContent?.courseTopicContentDuration || 0;
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;

                                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                    })()}
                                </Badge>

                            </div>
                            <div className=" flex  items-center gap-2 ">
                                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold ">
                                    {courseTopicContent?.courseTopicContentTitle}
                                </CardTitle>

                                <div className="ml-auto">
                                    {userEnrollmentCourseLog?.filter(b => (b.courseId == CourseId && b?.courseTopicContentId == courseTopicContent?.courseTopicContentId && b.enrollmentStatus == 'COMPLETED'))?.length > 0   ?
                                        <h3 className="flex gap-1 "><Check color="#11a72a"/><span
                                            className="text-blue-800 font-medium">Completed</span></h3>: <Button className="w-fit" size="sm" onClick={() => saveUserEnrollmentData()}>Mark as
                                            Complete</Button>
                                    }
                                    {userEnrollmentCourseLog?.filter(b => b.courseId == CourseId && b?.courseTopicContentId == courseTopicContent?.courseTopicContentId && b.enrollmentStatus == 'COMPLETED')?.length > 0 ?
                                        <p className='text-right cursor-pointer hover:text-blue-800 hover:underline  hover:underline-offset-4' onClick={() => deleteUserEnrollmentData()}>Undo</p> : <></>
                                    }                        </div>

                            </div>
                        </CardHeader>
                    </Card>


                    <section className="my-4 ">
                        <Card className="  shadow-none border-none rounded-none ">
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Video container */}
                                    <div className="w-full md:col-span-2">
                                        <div className="w-full aspect-video">
                                            {/*<iframe*/}
                                            {/*    id={`${courseVideoDetail.courseVideoId}`}*/}
                                            {/*    src={`https://www.youtube.com/embed/${courseVideoDetail?.courseVideoUrl}?enablejsapi=1`}*/}
                                            {/*    className="w-full h-full shadow-md"*/}
                                            {/*    frameBorder="0"*/}
                                            {/*    allow="autoplay; encrypted-media"*/}
                                            {/*    allowFullScreen*/}
                                            {/*></iframe>*/}
                                                      <YouTubePlayer saveUserEnrollmentData={saveUserEnrollmentData} playerRefresh={playerRefresh} videoId={courseVideoDetail?.courseVideoUrl} playerId={`player-${courseVideoDetail?.courseVideoId}`} />


                                        </div>
                                    </div>

                                    {/* Notes container */}
                                    <div className="w-full flex flex-col ">
                                        <Label className="mb-4">Create Notes</Label>
                                        <div className="w-full flex flex-col h-full">
                                            <CreateNotesModule handleNotesSave={handleNotesSave}  courseId={courseList.courseId}
                                                               courseTopicContentId={courseList?.courseTopic?.find(a => a.courseTopicId == courseVideoDetail.courseTopicId)?.courseTopicContent?.find(a => a.contentId == courseVideoDetail.courseVideoId && a.courseTopicContentType == 'CourseVideo')?.courseTopicContentId}
                                                               courseTopicId={courseVideoDetail.courseTopicId}/>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </Card>


                    </section>

                    <NotesModule refreshTrigger={triggerNotesRefresh} courseId={courseList.courseId} userId={userDetail.userId}
                                 courseTopicContentId={courseList?.courseTopic?.find(a => a.courseTopicId == courseVideoDetail.courseTopicId)?.courseTopicContent?.find(a => a.contentId == courseVideoDetail.courseVideoId && a.courseTopicContentType == 'CourseVideo')?.courseTopicContentId}
                                 courseTopicId={courseVideoDetail.courseTopicId}/>
                </div>


            </div>

        </>)

}


export default CourseVideoTutorial;