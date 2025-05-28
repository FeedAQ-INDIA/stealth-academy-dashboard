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


function LiveCourseAttendance() {
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
                    datasource: "Notes", attributes: [], where: {courseId: CourseId, userId: userDetail.userId},
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
                            <BreadcrumbPage className="truncate max-w-[30ch]">Schedule</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <div className="p-4">

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

            </div>

        </>)

}


export default LiveCourseAttendance;