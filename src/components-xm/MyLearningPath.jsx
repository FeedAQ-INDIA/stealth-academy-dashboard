import {ChevronLeft, ChevronRight, CirclePlus, ExternalLink, Terminal,} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card";
import {useAuthStore} from "@/zustland/store.js";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {Link} from "react-router-dom";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination.jsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {LoaderOne} from "@/components/ui/loader.jsx";

export function MyLearningPath() {

    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState({});
    const [loading, setLoading] = useState(false); // local loader


    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "UserEnrollment", attributes: [], where: {userId: userDetail?.userId, courseId: {"$ne": null}},
            include: [{
                datasource: "Course", as: "course", required: false, order: [], attributes: [], where: {},
            },
            ],
        },
    });


    useEffect(() => {
        fetchCourses();
    }, [apiQuery]);

    const fetchCourses = () => {
        setLoading(true)
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
            .then((res) => {
                console.log(res.data.data?.results?.map(a => a.course));
                setCourseList(res.data.data?.results?.map(a => a.course));
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
                setLoading(false)

            })
            .catch((err) => {
                console.log(err);
                setLoading(false)

            });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [totalCount1, setTotalCount1] = useState(0);
    const [limit1, setLimit1] = useState(5);
    const [offset1, setOffset1] = useState(0);
    const [courseList1, setCourseList1] = useState({});

    const [apiQuery1, setApiQuery1] = useState({
        limit: limit1, offset: offset1, getThisData: {
            datasource: "UserEnrollment", attributes: [], where: {userId: userDetail?.userId, webinarId: {"$ne": null}},
            include: [{
                datasource: "Webinar", as: "webinar", required: false, order: [], attributes: [], where: {},
            },
            ],
        },
    });

    useEffect(() => {
        fetchWebinar();
    }, [apiQuery1]);

    const fetchWebinar = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery1)
            .then((res) => {
                console.log(res.data);
                setCourseList1(res.data.data?.results?.map(a => a.webinar));
                setTotalCount1(res.data.data.totalCount);
                setOffset1(res.data.data.offset);
                setLimit1(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [totalCount2, setTotalCount2] = useState(0);
    const [limit2, setLimit2] = useState(5);
    const [offset2, setOffset2] = useState(0);
    const [mockInterviewHistoryList, setMockInterviewHistoryList] = useState([]);

    const [apiQuery2, setApiQuery2] = useState({
        limit: limit2, offset: offset2, getThisData: {
            datasource: "InterviewReq", attributes: [], where: {userId: userDetail?.userId},

        },
    });

    useEffect(() => {
        fetchMockInterviewHistory();
    }, [apiQuery2]);

    const fetchMockInterviewHistory = () => {
        setLoading(true)
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery2)
            .then((res) => {
                console.log(res.data);
                setMockInterviewHistoryList(res.data.data?.results);
                setTotalCount2(res.data.data.totalCount);
                setOffset2(res.data.data.offset);
                setLimit2(res.data.data.limit);
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            });
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [totalCount3, setTotalCount3] = useState(0);
    const [limit3, setLimit3] = useState(5);
    const [offset3, setOffset3] = useState(0);
    const [counsellingHistoryList, setCounsellingHistoryList] = useState([]);

    const [apiQuery3, setApiQuery3] = useState({
        limit: limit3, offset: offset3, getThisData: {
            datasource: "Counselling", attributes: [], where: {userId: userDetail?.userId},

        },
    });

    useEffect(() => {
        fetchCounsellingHistory();
    }, [apiQuery3]);

    const fetchCounsellingHistory = () => {
        setLoading(true)
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery3)
            .then((res) => {
                console.log(res.data);
                setCounsellingHistoryList(res.data.data?.results);
                setTotalCount3(res.data.data.totalCount);
                setOffset3(res.data.data.offset);
                setLimit3(res.data.data.limit);
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [totalCount4, setTotalCount4] = useState(0);
    const [limit4, setLimit4] = useState(5);
    const [offset4, setOffset4] = useState(0);
    const [scheduledMeetList, setScheduledMeetList] = useState([]);


    useEffect(() => {
        fetchScheduledMeetHistory();
    }, [offset4]);

    const fetchScheduledMeetHistory = () => {
        setLoading(true)
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/fetchScheduledCourseMeet",
                {
                    page: offset4,
                    limit: limit4,
                })
            .then((res) => {
                console.log(res.data);
                setScheduledMeetList(res.data?.data?.results);
                setTotalCount4(res.data.data.totalCount);
                setOffset4(res.data.data.offset);
                setLimit4(res.data.data.limit);
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            });
    };


    const [historySelection, setHistorySelection] = useState("CourseHistory");


    if(loading){
        return (
            <div className="flex items-center justify-center h-[100svh] w-full">
                <LoaderOne />
            </div>
        )
    }

    return (
        <div className="p-3 md:p-6">

            <Card className="border-0 bg-[#ffdd00]">
                <CardHeader>
                    <div className="flex flex-sm justify-items-center gap-4 items-center">
                        <Avatar className="w-12 h-12">
                            <AvatarFallback className="text-xl">{userDetail?.nameInitial}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-xl font-medium">Welcome {userDetail?.derivedUserName}</h1>
                            <p>Member since {userDetail?.created_date}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>


            <Card className="border-0 bg-muted/50 py-4 my-6">
 {/*<CardHeader>*/}
     {/*<Select onValueChange={setHistorySelection} value={historySelection}>*/}
     {/*    <SelectTrigger className="w-full" >*/}
     {/*        <SelectValue placeholder="Select History Type" />*/}
     {/*    </SelectTrigger>*/}
     {/*    <SelectContent>*/}
     {/*        <SelectGroup>*/}
     {/*            <SelectItem value="CourseHistory">Course History</SelectItem>*/}
     {/*            <SelectItem value="MockInterviewHistory">Mock Interview History</SelectItem>*/}
     {/*            <SelectItem value="CounsellingHistory">Counselling History</SelectItem>*/}
     {/*        </SelectGroup>*/}
     {/*    </SelectContent>*/}
     {/*</Select>*/}
 {/*</CardHeader>*/}
            {historySelection == "CourseHistory" ?    <div>
                <CardHeader>
                    <CardTitle className="flex gap-2 tracking-wide">
                        Course History
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="mt-2">
                        {courseList?.length > 0 ?

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Enrollment Date</TableHead>

                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courseList?.map(a => (
                                        <TableRow key={a.courseId}>

                                            <TableCell  className="whitespace-nowrap font-medium" >{a.courseId}</TableCell>
                                            <TableCell  className="whitespace-nowrap">{a.courseTitle}</TableCell>
                                            <TableCell  className="whitespace-nowrap">
                                                {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId) ?
                                                    <div className="  ">
                                                        <p className=" text-base">{userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus}</p>
                                                    </div>
                                                    : <></>}</TableCell>


                                            <TableCell  className="whitespace-nowrap">  {a.v_created_date + ' ' + a.v_created_time}</TableCell>


                                            <TableCell  className="whitespace-nowrap text-right"  >
                                                <Link
                                                    to={`/course/${a?.courseId}`}>
                                                    <Button size="sm" variant="outline"><ExternalLink/></Button></Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell  className="whitespace-nowrap py-3" colSpan={7}  >
                                            <div className="flex flex-row items-center">
                                                <div className="text-xs text-muted-foreground">
                                                    {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} row(s)
                                                    selected.
                                                </div>
                                                <Pagination className="ml-auto mr-0 w-auto">
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-6 w-6"
                                                                onClick={() => {
                                                                    setOffset(Math.max(offset - limit, 0));
                                                                    setApiQuery((prevQuery) => ({
                                                                        ...prevQuery,
                                                                        offset: Math.max(offset - limit, 0),
                                                                    }));
                                                                }}
                                                            >
                                                                <ChevronLeft className="h-3.5 w-3.5"/>
                                                                <span className="sr-only">Previous Order</span>
                                                            </Button>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-6 w-6"
                                                                onClick={() => {
                                                                    setOffset(offset + limit < totalCount ? offset + limit : offset);
                                                                    setApiQuery((prevQuery) => ({
                                                                        ...prevQuery,
                                                                        offset: offset + limit < totalCount ? offset + limit : offset,
                                                                    }));
                                                                }}
                                                            >
                                                                <ChevronRight className="h-3.5 w-3.5"/>
                                                                <span className="sr-only">Next Order</span>
                                                            </Button>
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            :
                            <Alert> <Terminal className="h-4 w-4"/>
                                <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
                                    <div>
                                        <AlertTitle>No Enrollment found</AlertTitle>
                                        <AlertDescription>
                                            <p>You are not enrolled in any course</p>

                                        </AlertDescription>
                                    </div>

                                    <div className="md:ml-auto">
                                        <Link to='/explore?type=COURSE'>
                                            <Button className="mt-2 flex-1" size={'sm'}>Start your journey
                                                today</Button>
                                        </Link>

                                    </div>
                                </div>

                            </Alert>}
                    </div>
                </CardContent>


            </div>
            : <></>}



            {historySelection == "MockInterviewHistory" ?     <div >
                <CardHeader>
                    <CardTitle className="flex gap-2 tracking-wide">
                        Mock Interview History
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="mt-2">
                        {mockInterviewHistoryList?.length > 0 ?

                            <div className="  items-center">
                                {/*{courseList1?.webinars?.map(a => (*/}
                                {/*    <WebinarCard userEnrolledCourseIdList={userEnrolledCourseIdList} a={a}/>*/}
                                {/*))}*/}

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">ID</TableHead>
                                            <TableHead>Requested Date</TableHead>
                                            <TableHead>Interview Date</TableHead>
                                             <TableHead>Duration</TableHead>
                                            <TableHead>Cost</TableHead>

                                            <TableHead className="text-right">Status</TableHead>
                                            <TableHead className="text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockInterviewHistoryList?.map(a => (
                                            <TableRow key={a.interviewReqId}>
                                                <TableCell  className="whitespace-nowrap font-medium" >{a.interviewReqId}</TableCell>
                                                <TableCell  className="whitespace-nowrap">  {a.v_created_date + ' ' + a.v_created_time}</TableCell>
                                                <TableCell  className="whitespace-nowrap">  {a.interviewReqDate ? new Date(a.interviewReqDate).toLocaleDateString('en-GB').replace(/\//g, '-') +' '+a.interviewReqTime: ''}
                                                </TableCell>
                                                 <TableCell  className="whitespace-nowrap">{a.interviewReqDuration} min</TableCell>
                                                <TableCell  className="whitespace-nowrap">{a.interviewReqCost == 0 || !a.interviewReqCost ? "FREE" : ""}</TableCell>

                                                <TableCell  className="whitespace-nowrap text-right"  >{a.interviewReqStatus}</TableCell>
                                                <TableCell  className="whitespace-nowrap text-right"  >
                                                    <Link to={`/mock-interview/${a.interviewReqId}`}> <Button size="sm"
                                                                                                              variant="outline"><ExternalLink/></Button></Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell  className="whitespace-nowrap py-3" colSpan={8}  >
                                                <div className="flex flex-row items-center">
                                                    <div className="text-xs text-muted-foreground">
                                                        {offset2 + 1} to {Math.min(offset2 + limit2, totalCount2)} of {totalCount2} row(s)
                                                        selected.
                                                    </div>
                                                    <Pagination className="ml-auto mr-0 w-auto">
                                                        <PaginationContent>
                                                            <PaginationItem>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-6 w-6"
                                                                    onClick={() => {
                                                                        setOffset2(Math.max(offset2 - limit2, 0));
                                                                        setApiQuery2((prevQuery) => ({
                                                                            ...prevQuery,
                                                                            offset: Math.max(offset2 - limit2, 0),
                                                                        }));
                                                                    }}
                                                                >
                                                                    <ChevronLeft className="h-3.5 w-3.5"/>
                                                                    <span className="sr-only">Previous Order</span>
                                                                </Button>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-6 w-6"
                                                                    onClick={() => {
                                                                        setOffset2(offset2 + limit2 < totalCount2 ? offset2 + limit2 : offset2);
                                                                        setApiQuery2((prevQuery) => ({
                                                                            ...prevQuery,
                                                                            offset: offset2 + limit2 < totalCount2 ? offset2 + limit2 : offset2,
                                                                        }));
                                                                    }}
                                                                >
                                                                    <ChevronRight className="h-3.5 w-3.5"/>
                                                                    <span className="sr-only">Next Order</span>
                                                                </Button>
                                                            </PaginationItem>
                                                        </PaginationContent>
                                                    </Pagination>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                            :
                            <Alert> <Terminal className="h-4 w-4"/>
                                <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
                                    <div>
                                        <AlertTitle>No Mock Interview History Found</AlertTitle>
                                        <AlertDescription>
                                            <p>You are not enrolled in any mock interview</p>

                                        </AlertDescription>
                                    </div>

                                    <div className="md:ml-auto">
                                        <Link to='/mock-interview'>
                                            <Button className="mt-2 flex-1" size={'sm'}>Schedule Now</Button>
                                        </Link>

                                    </div>
                                </div>

                            </Alert>}
                    </div>
                </CardContent>


            </div>
:<></>}

                {historySelection == "CounsellingHistory" ?   <div>
                <CardHeader>
                    <CardTitle className="flex gap-2 tracking-wide">
                        Counselling History
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="mt-2">
                        {counsellingHistoryList?.length > 0 ?

                            <div className="   items-center">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">ID</TableHead>
                                            <TableHead>Requested Date</TableHead>
                                            <TableHead>Counselling Date</TableHead>
                                              <TableHead>Cost</TableHead>
                                            <TableHead  >Mode</TableHead>

                                            <TableHead className="text-right">Status</TableHead>
                                            <TableHead className="text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {counsellingHistoryList?.map(a => (
                                            <TableRow key={a.counsellingId}>
                                                <TableCell  className="whitespace-nowrap font-medium" >{a.counsellingId}</TableCell>
                                                <TableCell  className="whitespace-nowrap">  {a.v_created_date + ' ' + a.v_created_time}</TableCell>
                                                <TableCell  className="whitespace-nowrap">  {a.counsellingDate ? new Date(a.counsellingDate).toLocaleDateString('en-GB').replace(/\//g, '-') +' '+a.counsellingTime: ''}
                                                </TableCell>
                                                  <TableCell  className="whitespace-nowrap">{a.counsellingCost == 0 || !a.counsellingCost ? "FREE" : ""}</TableCell>
<TableCell  className="whitespace-nowrap">{a?.counsellingMode}</TableCell>
                                                <TableCell  className="whitespace-nowrap text-right"  >{a.counsellingStatus}</TableCell>
                                                <TableCell  className="whitespace-nowrap text-right" >
                                                    <Link to={`/counselling-compass/${a.counsellingId}`}> <Button size="sm"
                                                                                                              variant="outline"><ExternalLink/></Button></Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell  className="whitespace-nowrap py-3" colSpan={8}  >
                                                <div className="flex flex-row items-center">
                                                    <div className="text-xs text-muted-foreground">
                                                        {offset3 + 1} to {Math.min(offset3 + limit3, totalCount3)} of {totalCount3} row(s)
                                                        selected.
                                                    </div>
                                                    <Pagination className="ml-auto mr-0 w-auto">
                                                        <PaginationContent>
                                                            <PaginationItem>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-6 w-6"
                                                                    onClick={() => {
                                                                        setOffset3(Math.max(offset3 - limit3, 0));
                                                                        setApiQuery3((prevQuery) => ({
                                                                            ...prevQuery,
                                                                            offset: Math.max(offset3 - limit3, 0),
                                                                        }));
                                                                    }}
                                                                >
                                                                    <ChevronLeft className="h-3.5 w-3.5"/>
                                                                    <span className="sr-only">Previous Order</span>
                                                                </Button>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-6 w-6"
                                                                    onClick={() => {
                                                                        setOffset3(offset3 + limit3 < totalCount3 ? offset3 + limit3 : offset3);
                                                                        setApiQuery3((prevQuery) => ({
                                                                            ...prevQuery,
                                                                            offset: offset3 + limit3 < totalCount3 ? offset3 + limit3 : offset3,
                                                                        }));
                                                                    }}
                                                                >
                                                                    <ChevronRight className="h-3.5 w-3.5"/>
                                                                    <span className="sr-only">Next Order</span>
                                                                </Button>
                                                            </PaginationItem>
                                                        </PaginationContent>
                                                    </Pagination>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                            :
                            <Alert> <Terminal className="h-4 w-4"/>
                                <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
                                    <div>
                                        <AlertTitle>No Mock Interview History Found</AlertTitle>
                                        <AlertDescription>
                                            <p>You are not enrolled in any mock interview</p>

                                        </AlertDescription>
                                    </div>

                                    <div className="md:ml-auto">
                                        <Link to='/mock-interview'>
                                            <Button className="mt-2 flex-1" size={'sm'}>Schedule Now</Button>
                                        </Link>

                                    </div>
                                </div>

                            </Alert>}
                    </div>
                </CardContent>


            </div>
:<></>}
        </Card>


            <Card className="border-0 bg-muted/50 py-4 my-6">
                <CardHeader>
                    <CardTitle className="flex gap-2 tracking-wide">
                        Scheduled Meet
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="mt-2">

                        {scheduledMeetList?.length>0 ?

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Start Time</TableHead>
                                        <TableHead>End Time</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        scheduledMeetList?.map?.(a => (
                                            <TableRow key={a.courseScheduleId}>
                                                <TableCell  className="whitespace-nowrap">{a?.scheduledTitle}</TableCell>
                                                <TableCell  className="whitespace-nowrap">{a?.v_scheduled_start_date + ' '+ a?.v_scheduled_start_time}</TableCell>
                                                <TableCell  className="whitespace-nowrap">{a?.v_scheduled_end_date + ' '+ a?.v_scheduled_end_time}</TableCell>
                                                {/*<TableCell  className="whitespace-nowrap">*/}
                                                {/*    {`${Math.floor((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) / 3600000)} hr ${Math.floor(((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) % 3600000) / 60000)} min`}*/}
                                                {/*</TableCell>*/}
                                                {/*<TableCell  className="whitespace-nowrap">{a?.scheduledDeliveryMode}</TableCell>*/}
                                                {/*<TableCell  className="whitespace-nowrap">{a?.scheduledDeliveryMedium}</TableCell>*/}

                                                {/*<TableCell  className="whitespace-nowrap">{a?.scheduledTutor}</TableCell>*/}
                                                <TableCell  className="whitespace-nowrap flex justify-end gap-2"  >
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
                                <TableFooter>
                                    <TableRow>
                                        <TableCell  className="whitespace-nowrap py-3" colSpan={7}  >
                                            <div className="flex flex-row items-center">
                                                <div className="text-xs text-muted-foreground">
                                                    {offset4 + 1} to {Math.min(offset4 + limit4, totalCount4)} of {totalCount4} row(s)
                                                    selected.
                                                </div>
                                                <Pagination className="ml-auto mr-0 w-auto">
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-6 w-6"
                                                                onClick={() => {
                                                                    setOffset4(Math.max(offset4 - limit4, 0));

                                                                }}
                                                            >
                                                                <ChevronLeft className="h-3.5 w-3.5"/>
                                                                <span className="sr-only">Previous Order</span>
                                                            </Button>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-6 w-6"
                                                                onClick={() => {
                                                                    setOffset4(offset4 + limit4 < totalCount4 ? offset4 + limit4 : offset4);
                                                                }}
                                                            >
                                                                <ChevronRight className="h-3.5 w-3.5"/>
                                                                <span className="sr-only">Next Order</span>
                                                            </Button>
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
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
                </CardContent>


            </Card>



        </div>
    )

}
