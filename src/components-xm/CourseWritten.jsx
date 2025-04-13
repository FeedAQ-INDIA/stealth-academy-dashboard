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
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {Check} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import NotesModule from "@/components-xm/NotesModule.jsx";
import {toast} from "@/components/hooks/use-toast.js";

function CourseWritten() {

    const {CourseId, CourseDocId} = useParams();
    const {userEnrollmentObj, userEnrollmentCourseLog, fetchUserEnrollmentData, isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus} = useCourse();

    const [courseVideoDetail, setCourseVideoDetail] = useState({});
    const [courseTopicContent, setCourseTopicContent] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (courseList && CourseDocId) {
            fetchCourseVideo();
        }
    }, [courseList, userEnrollmentObj, CourseDocId]);

    const fetchCourseVideo = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "CourseWritten", attributes: [], where: {courseWrittenId: CourseDocId},
                },
            })
            .then((res) => {
                console.log(res.data);
                const video = res.data.data?.results?.[0]
                setCourseVideoDetail(video);
                setCourseTopicContent(courseList?.courseTopic?.find(a => a.courseTopicId == video.courseTopicId)?.courseTopicContent?.find(a => a.contentId == video.courseWrittenId && a.courseTopicContentType == 'CourseWritten'))
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
                fetchUserEnrollmentData()
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
                fetchUserEnrollmentData()
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

        }
    }



    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>Course</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]"
                                            title={courseList?.courseTitle}>{courseList?.courseTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage
                                className="truncate max-w-[30ch]">{courseVideoDetail?.courseWrittenTitle}</BreadcrumbPage>
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


            <Card className="rounded-none bg-muted/50 border-none">
                <CardHeader>
                    <div className="flex flex-wrap gap-2 w-full mb-3 justify-items-center">
                        <Badge variant="outline">Doc</Badge>
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
                            {courseVideoDetail?.courseWrittenTitle}
                        </CardTitle>
                        <div className="ml-auto">
                            {userEnrollmentCourseLog?.filter(b => b.courseId == CourseId && b?.courseTopicContentId == courseTopicContent?.courseTopicContentId && b.enrollmentStatus == 'COMPLETED')?.length > 0  ?
                                <h3 className="flex gap-1 "><Check color="#11a72a"/><span
                                    className="text-blue-800 font-medium">Completed</span></h3> : <Button className="w-fit" size="sm" onClick={() => saveUserEnrollmentData()}>Mark as
                                    Complete</Button>
                                }
                            {userEnrollmentCourseLog?.filter(b => b.courseId == CourseId && b?.courseTopicContentId == courseTopicContent?.courseTopicContentId && b.enrollmentStatus == 'COMPLETED')?.length > 0 ?
                                <p className='text-right cursor-pointer hover:text-blue-800 hover:underline  hover:underline-offset-4' onClick={() => deleteUserEnrollmentData()}>Undo</p> : <></>
                            }
                        </div>

                    </div>
                </CardHeader>

            </Card>


            <div className="p-6">


                <section className="my-8 ">

                    <div className=" ">
                        <p>{courseVideoDetail?.courseWrittenHtmlContent}</p>

                    </div>


                </section>
                <NotesModule courseId={courseList.courseId}
                             courseTopicContentId={courseList?.courseTopic?.find(a => a.courseTopicId == courseVideoDetail.courseTopicId)?.courseTopicContent?.find(a => a.contentId == courseVideoDetail.courseWrittenId && a.courseTopicContentType == 'CourseWritten')?.courseTopicContentId}
                             courseTopicId={courseVideoDetail.courseTopicId}/>
            </div>

        </>)

}


export default CourseWritten;