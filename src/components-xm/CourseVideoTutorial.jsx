import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {CircleDollarSign, Clock} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import NotesModule from "@/components-xm/NotesModule.jsx";

function CourseVideoTutorial() {

    const {CourseId, CourseVideoId} = useParams();
    const { isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus } = useCourse();

    const [courseVideoDetail, setCourseVideoDetail] = useState({});

    useEffect(() => {
         if(courseList && CourseVideoId){
             fetchCourseVideo();
         }
    }, [courseList, CourseVideoId]);

    const fetchCourseVideo = () => {
        axiosConn
            .post("http://localhost:3000/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "CourseVideo",  attributes: [], where : {courseVideoId: CourseVideoId},
                },
            })
            .then((res) => {
                console.log(res.data);
                setCourseVideoDetail(res.data.data?.results?.[0]);
                 // setTotalCount(res.data.data.totalCount);
                // setOffset(res.data.data.offset);
                // setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
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
                            <BreadcrumbPage className="truncate max-w-[30ch]" title={courseList?.courseTitle}>{courseList?.courseTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">{courseVideoDetail?.courseVideoTitle}</BreadcrumbPage>
                        </BreadcrumbItem>

                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>
            <Card  className="rounded-none bg-muted/50 border-none">
                <CardHeader>
                    <div className="flex flex-wrap gap-2 w-full mb-3 justify-items-center">
                        <Badge variant="outline">Video</Badge>

                    </div>

                </CardHeader>
                <CardContent>
                    {/* Title with responsive spacing */}
                    <div className=" flex  items-center gap-2 ">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold ">
                            {courseVideoDetail?.courseVideoTitle}
                        </CardTitle>
                        <div className="ml-auto flex gap-2">
                            <Button>Previous</Button> <Button>Next</Button>
                        </div>
                    </div>
                </CardContent>




            </Card>
            <div className="p-6">


                <section className="my-8 ">

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Video container */}
                        <div className="w-full md:w-2/3">
                            <div className="w-full aspect-video">
                                <iframe
                                    id="player"
                                    src={`https://www.youtube.com/embed/${courseVideoDetail?.courseVideoUrl}?enablejsapi=1`}
                                    className="w-full h-full shadow-md"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Side panel */}
                        <div className="w-full md:w-1/3 bg-gray-100 p-4 flex items-center justify-center  shadow-md">
                            <p className="overflow-y-auto h-full"> This content box will match the video height on
                                larger screens.</p>
                        </div>


                    </div>


                </section>
                <NotesModule courseId={courseList.courseId}
                             courseTopicContentId={ courseList?.courseTopic?.
                             find(a=>a.courseTopicId == courseVideoDetail.courseTopicId)?.courseTopicContent?.
                             find(a=> a.contentId == courseVideoDetail.courseVideoId && a.courseTopicContentType == 'CourseVideo')?.
                                 courseTopicContentId}
                             courseTopicId={courseVideoDetail.courseTopicId}/>
            </div>

        </>)

}


export default CourseVideoTutorial;