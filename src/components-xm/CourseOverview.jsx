import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
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
import {CircleDollarSign, Clock, Video} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import axiosConn from "@/axioscon.js";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {useParams} from "react-router-dom";
import {toast} from "@/components/hooks/use-toast.js";
import {useCourse} from "@/components-xm/CourseContext.jsx";
function CourseOverview() {
    const {CourseId} = useParams();
    const { isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus } = useCourse();




    const {
        state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar
    } = useSidebar()

    useEffect(() => {
        if(isUserEnrolledAlready) {
            setOpen(true);
        }else{
            setOpen(false);
        }

    }, [isUserEnrolledAlready]);


    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                {isUserEnrolledAlready? (<><SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/></>) : <></>}
                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>Course</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]"  title={courseList?.courseTitle}>{courseList?.courseTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>
            <Card className="rounded-none bg-muted/50 border-none">
                <CardHeader>


                    <div className="flex flex-wrap gap-2 w-full mb-3">
                        <Badge variant="outline">Course</Badge>


                    </div>
                    <div  className="flex flex-wrap gap-2 w-full mb-3 items-center">
                        <div className=" ">
                            <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                                {courseList?.courseTitle}
                            </CardTitle>
                        </div>
                        <div className="ml-auto ">
                            {isUserEnrolledAlready?
                                <Button onClick={()=> disroll()}>LEAVE COURSE</Button>  :
                                <Button onClick={()=> enroll()}>START COURSE</Button>
                            }
                        </div>
                    </div>

                </CardHeader>


            </Card>
            <div className="p-6">

                <section>
                    <div className="w-full  md:w-2/3 ">
                        <div className="w-full aspect-video">
                            <iframe
                                id="player"
                                src="https://www.youtube.com/embed/_WNIvJozdMY?enablejsapi=1"
                                className="w-full h-full shadow-md"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </section>
                <section className="my-8">
                    <div className="flex flex-wrap gap-4 w-full ">
                        <div className="flex gap-1 items-center">
                            <Clock size={18}/>  {`${Math.floor(+(courseList?.courseDuration) / 60)}hr ${+(courseList?.courseDuration) % 60}min`}
                        </div>
                        <div className="flex gap-2 items-center">
                            < CircleDollarSign size={18}/> {courseList?.courseCost == 0 ? 'Free' : 'Rs.'+courseList?.courseCost+'/-'}
                        </div>
                        <div className="flex gap-2 items-center">
                            <Badge variant="outline">{courseList?.courseLevel}</Badge>
                        </div>
                    </div>
                </section>

                <section className="my-8">
                    <div>
                        <p>{courseList?.courseDescription}</p>
                    </div>
                </section>
                <section className="my-8">
                    <h1 className="font-medium text-2xl">Course Structure</h1>
                    <div className="my-3">
                        {courseList?.courseTopic?.map(a => (
                            <Accordion type="single" key={a?.courseTopicId} collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>{a?.courseTopicTitle}</AccordionTrigger>
                                    <AccordionContent>
                                        {a?.courseTopicDescription}
                                        <div>
                                            <ul>
                                                {a?.courseTopicContent?.map(a => (
                                                    <li className="flex gap-2 items-center my-2" key={a?.contentId}>
                                                        <Video />
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
                </section>
            </div>

        </>)

}


export default CourseOverview;