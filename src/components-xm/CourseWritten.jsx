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

function CourseWritten() {

    const {CourseId, CourseDocId} = useParams();
    const { isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus } = useCourse();

    const [courseVideoDetail, setCourseVideoDetail] = useState({});

    useEffect(() => {
        if(courseList && CourseDocId){
            fetchCourseVideo();
        }
    }, [courseList, CourseDocId]);

    const fetchCourseVideo = () => {
        axiosConn
            .post("http://localhost:3000/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "CourseWritten",  attributes: [], where : {courseWrittenId: CourseDocId},
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
                            <BreadcrumbPage className="truncate max-w-[30ch]">{courseVideoDetail?.courseWrittenTitle}</BreadcrumbPage>
                        </BreadcrumbItem>

                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>
            <Card  className="rounded-none bg-muted/50 border-none">
                <CardHeader>
                    <div className="flex flex-wrap gap-2 w-full mb-3 justify-items-center">
                        <Badge variant="outline">Doc</Badge>

                    </div>

                </CardHeader>
                <CardContent>
                    {/* Title with responsive spacing */}
                    <div className=" flex  items-center gap-2 ">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold ">
                            {courseVideoDetail?.courseWrittenTitle}
                        </CardTitle>
                        <div className="ml-auto flex gap-2">
                            <Button>Previous</Button> <Button>Next</Button>
                        </div>
                    </div>
                </CardContent>




            </Card>
            <div className="p-6">


                <section className="my-8 ">

                    <div className=" ">
                      <p>{courseVideoDetail?.courseWrittenHtmlContent}</p>

                    </div>


                </section>
                <section className="my-8">
                    <h1 className="text-lg   font-medium ">Note Book</h1>
                    <div className="grid w-full gap-2 my-4">
                        <Textarea className="" placeholder="Type your notes here."/>
                        <Button className="w-fit ml-auto">Save</Button>
                    </div>
                </section>
            </div>

        </>)

}


export default CourseWritten;