import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {AlertCircle, Book, Check, Terminal, Video} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import axiosConn from "@/axioscon.js";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion.jsx"
import {Link, useParams} from "react-router-dom";
import {toast} from "@/components/hooks/use-toast.js";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import {useAuthStore} from "@/zustland/store.js";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.jsx"
import {Input} from "@/components/ui/input.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import axios from "axios";


function CourseSnapView() {
    const {CourseId} = useParams();
    const [courseList, setCourseList] = useState({});


    const {
        state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar
    } = useSidebar();

    const [apiQuery, setApiQuery] = useState({
        limit: 2, offset: 0, getThisData: {
            datasource: "Course",  attributes: [], where : {courseId: CourseId},
            include: [{
                datasource: "CourseTopic", as: "courseTopic", required: false, order: [], attributes: [], where: {},
                include:[
                    {
                        datasource: "CourseTopicContent", as: "courseTopicContent", required: false, order: [], attributes: [], where: {},
                    }
                ]
            },
            ],
        },
    });


    useEffect(() => {
        fetchCourses();
     }, [apiQuery]);

    const identifyContentTypeIcons = (type) => {
        if(type == 'CourseVideo') return <Video/>
        else if(type == 'CourseWritten') return <Book />
    }

    const fetchCourses = () => {

        axios
            .post(import.meta.env.VITE_API_URL+"/searchCourse", apiQuery)
            .then((res) => {
                console.log(res.data);
                setCourseList(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">

                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">Overview</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <div className="p-4">
                <Card className="rounded-none bg-muted/50 border-none">
                    <CardHeader>


                        <div className="flex flex-wrap gap-2 w-full mb-2">

                            <Badge className="animate-blink bg-green-600 text-white">{courseList?.courseCost == 0 ? 'FREE' : `Rs.${courseList?.courseCost}/-`}</Badge>
                            <Badge variant="outline">{courseList?.courseType}</Badge>
                            <Badge variant="outline">
                                {`${Math.floor(+(courseList?.courseDuration) / 60)}hr ${+(courseList?.courseDuration) % 60}min`}
                            </Badge>
                            {courseList?.courseSource ? <Badge variant="outline">{courseList?.courseSource}</Badge> : <></>}
                            {courseList?.courseLevel ? <Badge variant="outline">{courseList?.courseLevel}</Badge> : <></>}

                            {courseList?.courseMode && <Badge variant="outline">{courseList?.courseMode}</Badge>}
                            {courseList?.deliveryMode && <Badge variant="outline">{courseList?.deliveryMode}</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-2 w-full   items-center">
                            <div className=" ">
                                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                                    {courseList?.courseTitle}
                                </CardTitle>
                            </div>
                            <div className="ml-auto ">

                            </div>
                        </div>

                    </CardHeader>


                </Card>




                <section className="my-4">
                    <Card className="border-0 bg-muted/50">
                        <CardHeader>
                            <CardTitle className="">
                                Description
                            </CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div>
                                <div className="whitespace-pre-wrap break-words">
                                    {courseList?.courseDescription}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
                <section className="my-8">
                    <Card className="border-0 bg-muted/50">
                        <CardHeader>
                            <CardTitle className="">
                                Course Structure
                            </CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div className="my-3">
                                {courseList?.courseTopic?.map(a => (
                                    <Accordion type="single" key={a?.courseTopicId} collapsible>
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="flex items-center gap-2  justify-start">
                                                <Badge>
                                                    {(() => {
                                                        const totalMinutes = +a?.courseTopicDuration || 0;
                                                        const hours = Math.floor(totalMinutes / 60);
                                                        const minutes = totalMinutes % 60;

                                                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                                    })()}
                                                </Badge>
                                                <span>{a?.courseTopicTitle}</span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {a?.courseTopicDescription}
                                                <div>
                                                    <ul>
                                                        {a?.courseTopicContent?.map(a => (
                                                            <li className="flex gap-2 items-center my-2"
                                                                key={a?.courseTopicContentId}>

                                                                <Badge>
                                                                    {(() => {
                                                                        const totalMinutes = +a?.courseTopicContentDuration || 0;
                                                                        const hours = Math.floor(totalMinutes / 60);
                                                                        const minutes = totalMinutes % 60;

                                                                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                                                    })()}
                                                                </Badge>
                                                                <Video/>
                                                                <span>{a?.courseTopicContentTitle}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}

                            </div>
                        </CardContent>
                    </Card>

                </section>


            </div>

        </>)

}


export default CourseSnapView;