import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import React, {useEffect, useState} from "react";
import {AlertCircle, CirclePlus, Terminal} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Link, useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import {useAuthStore} from "@/zustland/store.js";
import {Input} from "@/components/ui/input.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";

import {zodResolver} from "@hookform/resolvers/zod"

import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
 import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination.jsx";
import axiosConn from "@/axioscon.js";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"


function CourseSchedule() {
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


    const scheduleSchema = z.object({
        date: z.string()
    });


    const createScheduleForm = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0], // Pre-fill today's date
        },
    });

    function onSubmit(data) {
        console.log("Submitting mock interview:", data);

        fetchSchedule();

    }

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(50);
    const [offset, setOffset] = useState(0);
    const [scheduleList, setScheduleList] = useState([]);


    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: limit, offset: offset, getThisData: {
                    datasource: "CourseSchedule", attributes: [], where: { courseId: CourseId,
                        scheduledStartDateTime: {
                            "$between": [
                                new Date(createScheduleForm.getValues("date")),
                                new Date(new Date(createScheduleForm.getValues("date")).setUTCDate(new Date(createScheduleForm.getValues("date")).getUTCDate() + 1))
                            ]
                        }
                    },
                },
            })
            .then((res) => {
                console.log(res.data);
                setScheduleList(res.data.data?.results);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };






    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                {isUserEnrolledAlready ? (<><SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/></>) : <></>}
                <Breadcrumb>
                    <BreadcrumbList>

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

                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>

                        <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
                            <div>

                                <AlertTitle>Phone number missing in your account</AlertTitle>
                                <AlertDescription>
                                    <p>Please update your phone number to receive updates regarding
                                        this {courseList?.courseType}</p>

                                </AlertDescription>
                            </div>

                            <div className="md:ml-auto">
                                <Link to='/account-settings/profile'>
                                    <Button className="mt-2 flex-1" size={'sm'} variant="destructive">Update</Button>
                                </Link>

                            </div>
                        </div>

                    </Alert>
                </section> : <></>}

                <Form {...createScheduleForm}>
                    <form onSubmit={createScheduleForm.handleSubmit(onSubmit)} className="w-full space-y-3">
                        <div className="flex gap-2 w-full">
                            <FormField
                                control={createScheduleForm.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                className="appearance-none pr-2 pl-3 py-2 border rounded w-full text-gray-700
              [&::-webkit-calendar-picker-indicator]:absolute
              [&::-webkit-calendar-picker-indicator]:right-3
              [&::-webkit-calendar-picker-indicator]:cursor-pointer
              [&::-webkit-calendar-picker-indicator]:text-transparent
              relative"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="flex-shrink-0" variant="outline">
                                Search
                            </Button>
                        </div>


                    </form>
                </Form>


                <div className="mt-6">
                    {scheduleList?.length>0 ?

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>End Time</TableHead>
                                    {/*<TableHead>Duration</TableHead>*/}
                                    {/*<TableHead>Mode</TableHead>*/}
                                    {/*<TableHead>Medium</TableHead>*/}
                                    {/* <TableHead>Tutor</TableHead>*/}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    scheduleList?.map?.(a => (
                                        <TableRow key={a.courseScheduleId}>
                                            <TableCell>{a?.scheduledTitle}</TableCell>
                                            <TableCell>{a?.v_scheduled_start_date + ' '+ a?.v_scheduled_start_time}</TableCell>
                                            <TableCell>{a?.v_scheduled_end_date + ' '+ a?.v_scheduled_end_time}</TableCell>
                                            {/*<TableCell>*/}
                                            {/*    {`${Math.floor((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) / 3600000)} hr ${Math.floor(((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) % 3600000) / 60000)} min`}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell>{a?.scheduledDeliveryMode}</TableCell>*/}
                                            {/*<TableCell>{a?.scheduledDeliveryMedium}</TableCell>*/}

                                            {/*<TableCell>{a?.scheduledTutor}</TableCell>*/}
                                            <TableCell className="flex justify-end gap-2">
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button variant="ghost" size="sm"><CirclePlus/></Button>

                                                    </SheetTrigger>
                                                    <SheetContent>
                                                        <SheetHeader>
                                                            <SheetTitle>{a?.scheduledTitle}</SheetTitle>
                                                            <SheetDescription>
                                                                {a?.scheduledDescription}
                                                            </SheetDescription>
                                                            <div className="space-y-4">
                                                                <p><span className="font-medium">Start Time : </span>{a?.v_scheduled_start_date + ' '+ a?.v_scheduled_start_time}</p>
                                                                <p><span className="font-medium">End Time : </span>{a?.v_scheduled_end_date + ' '+ a?.v_scheduled_end_time}</p>
                                                                <p>
                                                                    <span className="font-medium">Duration : </span>{`${Math.floor((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) / 3600000)} hr ${Math.floor(((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) % 3600000) / 60000)} min`}
                                                                </p>
                                                                <p><span className="font-medium">Mode : </span>{a?.scheduledDeliveryMode}</p>
                                                                <p><span className="font-medium">Medium : </span>{a?.scheduledDeliveryMedium}</p>

                                                                <p><span className="font-medium">Tutor : </span>{a?.scheduledTutor}</p>
                                                                <p><span className="font-medium">Join Link : </span>{a?.scheduledUrl}</p>
                                                            </div>
                                                        </SheetHeader>
                                                    </SheetContent>
                                                </Sheet>
                                                 <Link to={a?.scheduledUrl}>
                                                    <Button variant="ghost" size="sm">JOIN</Button>
                                                </Link>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                }
                            </TableBody>

                        </Table>
                        :
                        <Alert> <Terminal className="h-4 w-4"/>
                            <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
                                <div>
                                    <AlertTitle>No schedule found</AlertTitle>

                                </div>

                            </div>

                        </Alert>}



                </div>

            </div>

        </>)

}


export default CourseSchedule;