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
import {Check, CircleDollarSign, Clock, Video} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import axiosConn from "@/axioscon.js";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {Link, useParams} from "react-router-dom";
import {toast} from "@/components/hooks/use-toast.js";
import {useCourse} from "@/components-xm/CourseContext.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {useAuthStore} from "@/zustland/store.js";
import NotesModule from "@/components-xm/NotesModule.jsx";
function CourseOverview() {
    const {CourseId} = useParams();
    const { userEnrollmentObj,userEnrollmentCourseLog, isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus } = useCourse();
    const { userDetail } = useAuthStore();

    const {
        state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar
    } = useSidebar();

    useEffect(() => {
        if(isUserEnrolledAlready) {
            setOpen(true);
        }else{
            setOpen(false);
        }

    }, [isUserEnrolledAlready]);

    useEffect(() => {
        fetchNotes();
    }, []);

    const [notesList, setNotesList] = useState([]);

    const fetchNotes = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "Notes", attributes: [], where: {courseId: CourseId, userId : userDetail.userId},
                },
            })
            .then((res) => {
                console.log(res.data);
                const notes = res.data.data?.results
                setNotesList(notes);
             })
            .catch((err) => {
                console.log(err);
            });
    }

    const [triggerNotesRefresh, setTriggerNotesRefresh] = useState(false);

    const handleNotesSave = () => {
        setTriggerNotesRefresh(prev => !prev);
    };

    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                {isUserEnrolledAlready? (<><SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/></>) : <></>}
                <Breadcrumb>
                    <BreadcrumbList>

                        {/*<BreadcrumbItem>*/}
                        {/*    <BreadcrumbPage><Link to={`/explore`}>Course</Link></BreadcrumbPage>*/}
                        {/*</BreadcrumbItem>*/}
                        {/*<BreadcrumbSeparator/>*/}
                        {/*<BreadcrumbItem>*/}
                        {/*    <BreadcrumbPage className="truncate max-w-[30ch]"  title={courseList?.courseTitle}>{courseList?.courseTitle}</BreadcrumbPage>*/}
                        {/*</BreadcrumbItem>*/}
                        {/*<BreadcrumbSeparator/>*/}
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]"  >Overview</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <div className="p-4">
                <Card className="rounded-none bg-muted/50 border-none">
                    <CardHeader>


                        <div className="flex flex-wrap gap-2 w-full mb-3">
                            <Badge className="animate-blink bg-green-600 text-white">FREE</Badge>
                            {userEnrollmentObj?.enrollmentStatus  ?
                                <Badge  className="animate-blink bg-blue-600 text-white"  variant="outline">
                                    {userEnrollmentObj?.enrollmentStatus}</Badge>
                                : <></>}
                            <Badge variant="outline">Course</Badge>
                            <Badge variant="outline">
                                {`${Math.floor(+(courseList?.courseDuration) / 60)}hr ${+(courseList?.courseDuration) % 60}min`}
                            </Badge>

                            <Badge variant="outline"> {courseList?.courseLevel}
                            </Badge>
                        </div>
                        <div  className="flex flex-wrap gap-2 w-full mb-3 items-center">
                            <div className=" ">
                                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                                    {courseList?.courseTitle}
                                </CardTitle>
                            </div>
                            <div className="ml-auto ">
                                {(userEnrollmentObj?.enrollmentStatus != 'CERTIFIED' &&
                                    userEnrollmentObj?.enrollmentStatus != 'COMPLETED') ?
                                    (isUserEnrolledAlready?
                                    <Button onClick={()=> disroll()}>LEAVE COURSE</Button>  :
                                    <Button onClick={()=> enroll()}>START COURSE</Button>) : <></>
                                }
                            </div>
                        </div>

                    </CardHeader>


                </Card>
                {/*<section>*/}
                {/*    <Card className="border-0 bg-[#ffdd00]">*/}
                {/*        <CardHeader>*/}
                {/*            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">*/}
                {/*                <div className="flex justify-center w-full">*/}
                {/*                    <div className="aspect-video w-full max-w-2xl shadow-md">*/}
                {/*                        <iframe*/}
                {/*                            id="player"*/}
                {/*                            src="https://www.youtube.com/embed/_WNIvJozdMY/?enablejsapi=1"*/}
                {/*                            className="w-full h-full"*/}
                {/*                            frameBorder="0"*/}
                {/*                            allow="autoplay; encrypted-media; gyroscope; accelerometer"*/}
                {/*                            allowFullScreen*/}
                {/*                        ></iframe>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div>*/}
                {/*                    <h1 className="text-xl font-medium">What's there in this course ? </h1>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </CardHeader>*/}
                {/*    </Card>*/}


                {/*</section>*/}


                <section className="my-4">
                    <Card className="border-0 bg-muted/50">
                        <CardHeader>
                            <CardTitle className="">
                                Description
                            </CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div>
                                <p>{courseList?.courseDescription}</p>
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
                                                            <li className="flex gap-2 items-center my-2" key={a?.courseTopicContentId}>
                                                                {userEnrollmentCourseLog?.filter(b => b.courseId == CourseId && b?.courseTopicContentId == a?.courseTopicContentId && b.enrollmentStatus == 'COMPLETED')?.length > 0?  <Check  color="#11a72a"/> : <></> }
                                                                <Badge>
                                                                    {(() => {
                                                                        const totalMinutes = +a?.courseTopicContentDuration || 0;
                                                                        const hours = Math.floor(totalMinutes / 60);
                                                                        const minutes = totalMinutes % 60;

                                                                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                                                    })()}
                                                                </Badge>
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
                        </CardContent>
                    </Card>

                </section>

                <section className="my-4">
                    <Card className="border-0 bg-muted/50">
                        <CardHeader>
                            <CardTitle className="">
                                Notes
                            </CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div>

                             </div>
                        </CardContent>
                    </Card>
                </section>
            </div>

        </>)

}


export default CourseOverview;