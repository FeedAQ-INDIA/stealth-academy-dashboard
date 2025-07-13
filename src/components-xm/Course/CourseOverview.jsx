import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {AlertCircle, Check, Terminal, Video} from "lucide-react";
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


function CourseOverview() {
    const {CourseId} = useParams();
    const {
        userEnrollmentObj,
        userEnrollmentCourseLog,
        isUserEnrolledAlready,
        courseList,
        enroll,
        disroll,
        enrollStatus
    } = useCourse();
    const {userDetail} = useAuthStore();

    const {
        state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar
    } = useSidebar();

    useEffect(() => {
        if (isUserEnrolledAlready) {
            setOpen(true);
        } else {
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
                    datasource: "Notes", attributes: [], where: {courseId: CourseId, userId: userDetail?.userId},
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

    const [deleteConfirmation, setDeleteConfirmation] = useState("");

    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                {isUserEnrolledAlready ? (<><SidebarTrigger className="-ml-1"/>
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

                            {/*<Badge className="animate-blink bg-green-600 text-white">{courseList?.courseCost == 0 ? 'FREE' : `Rs.${courseList?.courseCost}/-`}</Badge>*/}
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
                                {(isUserEnrolledAlready ?
                                    <>
                                        <div className="completed-stamp">
                                            ENROLLED
                                        </div>
                                        <p className='text-sm text-right cursor-pointer hover:text-blue-800 hover:underline  hover:underline-offset-4 italic'>View
                                            Order</p>
                                    </> :
                                    <Button onClick={() => enroll()}>ENROLL</Button>)
                                }
                            </div>
                        </div>

                    </CardHeader>


                </Card>

                {!userDetail?.number ? <section className="my-4">

                    <Alert  variant="destructive">
                        <AlertCircle className="h-4 w-4" />

                        <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
                            <div>

                                <AlertTitle>Phone number missing in your account</AlertTitle>
                                <AlertDescription>
                                    <p>Please update your phone number to receive updates regarding this {courseList?.courseType}</p>

                                </AlertDescription>
                            </div>

                            <div className="md:ml-auto">
                                <Link to='/account-settings/profile'>
                                    <Button className="mt-2 flex-1" size={'sm'}  variant="destructive">Update</Button>
                                </Link>

                            </div>
                        </div>

                    </Alert>
                </section> : <></>}


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
                                                                {userEnrollmentCourseLog?.filter(b => b.courseId == CourseId && b?.courseTopicContentId == a?.courseTopicContentId && b.enrollmentStatus == 'COMPLETED')?.length > 0 ?
                                                                    <Check color="#11a72a"/> : <></>}
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

                {/*<section className="my-4">*/}
                {/*    <Card className="border-0 bg-muted/50">*/}
                {/*        <CardHeader>*/}
                {/*            <CardTitle className="">*/}
                {/*                Notes*/}
                {/*            </CardTitle>*/}

                {/*        </CardHeader>*/}
                {/*        <CardContent>*/}
                {/*            <div>*/}

                {/*            </div>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}
                {/*</section>*/}

                <section className="my-4 flex">
                    {(courseList?.courseCost == 0 && userEnrollmentObj?.enrollmentStatus != 'CERTIFIED' &&
                        userEnrollmentObj?.enrollmentStatus != 'COMPLETED') ?
                        (isUserEnrolledAlready ?

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="ml-auto" variant="destructive">{ `LEAVE COURSE`}</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Are You Sure You Want To Leave The Course ?</DialogTitle>
                                        <DialogDescription>
                                            Type in <span className="font-medium text-black italic">{courseList?.courseTitle}</span> in the below input field and click on
                                            confirm to Leave the course
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center ">

                                        <Input
                                            id="link"
                                            value={deleteConfirmation}
                                            onChange={(e) => setDeleteConfirmation(e.target.value?.trim())}
                                        />

                                    </div>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
                                        {courseList?.courseCost == 0 ?
                                            <Button
                                                disabled={courseList?.courseTitle?.trim() === deleteConfirmation?.trim() ? false : true}
                                                onClick={() => {
                                                    if (courseList?.courseTitle.trim() === deleteConfirmation?.trim()) {
                                                        disroll();
                                                        setDeleteConfirmation('')
                                                    } else {
                                                        toast({
                                                            title: 'Failed to leave the course'
                                                        })
                                                    }
                                                }}>
                                                Confirm
                                            </Button> :
                                            <></>

                                        }

                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            :
                            <></>) : <></>
                    }
                </section>

            </div>

        </>)

}


export default CourseOverview;