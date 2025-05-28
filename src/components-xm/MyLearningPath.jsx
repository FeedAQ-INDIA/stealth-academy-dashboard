import {ChevronLeft, ChevronRight, ExternalLink, Terminal,} from "lucide-react";
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


export function MyLearningPath() {

    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState({});


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
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
            .then((res) => {
                console.log(res.data.data?.results?.map(a => a.course));
                setCourseList(res.data.data?.results?.map(a => a.course));
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
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
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery2)
            .then((res) => {
                console.log(res.data);
                setMockInterviewHistoryList(res.data.data?.results);
                setTotalCount2(res.data.data.totalCount);
                setOffset2(res.data.data.offset);
                setLimit2(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
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
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery3)
            .then((res) => {
                console.log(res.data);
                setCounsellingHistoryList(res.data.data?.results);
                setTotalCount3(res.data.data.totalCount);
                setOffset3(res.data.data.offset);
                setLimit3(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };


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
                <CardHeader>
                    <CardTitle className="flex gap-2 tracking-wide">
                        Course History
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="mt-2">
                        {courseList?.length > 0 ?

                            // <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6 items-center">
                            //     {courseList?.courses?.map(a => (
                            //
                            //         <CourseCard userEnrolledCourseIdList={userEnrolledCourseIdList} a={a}/>
                            //     ))}
                            // </div>


                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Cost</TableHead>
                                        <TableHead>Enrollment Date</TableHead>

                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courseList?.map(a => (
                                        <TableRow key={a.courseId}>

                                            <TableCell className="font-medium">{a.courseId}</TableCell>
                                            <TableCell>{a.courseTitle}</TableCell>
                                            <TableCell>
                                                {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId) ?
                                                    <div className="  ">
                                                        <p className=" text-base">{userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus}</p>
                                                    </div>
                                                    : <></>}</TableCell>

                                            <TableCell>
                                                {a?.courseCost == 0 || !a.courseCost ? 'FREE' : `Rs.${a?.courseCost}/-`}
                                            </TableCell>
                                            <TableCell>  {a.v_created_date + ' ' + a.v_created_time}</TableCell>


                                            <TableCell className="text-right">
                                                <Link
                                                    to={`/${a?.courseType === "COURSE" ? 'course' : 'webinar'}/${a?.courseId}`}>
                                                    <Button size="sm" variant="outline"><ExternalLink/></Button></Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-3">
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


            </Card>


            <Card className="border-0 bg-muted/50 py-4 my-6">
                <CardHeader>
                    <CardTitle className="flex gap-2 tracking-wide">
                        Webinar History
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="mt-2">
                        {courseList1?.length > 0 ?

                            // <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6 items-center">
                            //     {/*{courseList1?.webinars?.map(a => (*/}
                            //
                            //     {/*    <WebinarCard userEnrolledCourseIdList={userEnrolledCourseIdList} a={a}/>*/}
                            //     {/*))}*/}
                            //
                            //
                            // </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Cost</TableHead>
                                        <TableHead>Enrollment Date</TableHead>

                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courseList1?.map(a => (
                                        <TableRow key={a.webinarId}>
                                            <TableCell className="font-medium">{a.webinarId}</TableCell>
                                            <TableCell>{a.webinarTitle}</TableCell>
                                            <TableCell>
                                                {userEnrolledCourseIdList?.find(m => m.webinarId == a.webinarId) ?
                                                    <div className="  ">
                                                        <p className=" text-base">{userEnrolledCourseIdList?.find(m => m.webinarId == a.webinarId)?.enrollmentStatus}</p>
                                                    </div>
                                                    : <></>}
                                            </TableCell>

                                            <TableCell>
                                                {a?.webinarCost == 0 || !a.webinarCost ? 'FREE' : `Rs.${a?.webinarCost}/-`}
                                            </TableCell>
                                            <TableCell>{a.v_created_date + ' ' + a.v_created_time}</TableCell>

                                            <TableCell className="text-right">
                                                <Link to={`/webinar/${a?.webinarId}`}> <Button size="sm"
                                                                                               variant="outline"><ExternalLink/></Button></Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-3">
                                            <div className="flex flex-row items-center">
                                                <div className="text-xs text-muted-foreground">
                                                    {offset1 + 1} to {Math.min(offset1 + limit1, totalCount1)} of {totalCount1} row(s)
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
                                                                    setOffset(Math.max(offset1 - limit1, 0));
                                                                    setApiQuery((prevQuery) => ({
                                                                        ...prevQuery,
                                                                        offset: Math.max(offset1 - limit1, 0),
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
                                                                    setOffset(offset1 + limit1 < totalCount1 ? offset1 + limit1 : offset1);
                                                                    setApiQuery((prevQuery) => ({
                                                                        ...prevQuery,
                                                                        offset: offset1 + limit1 < totalCount1 ? offset1 + limit1 : offset1,
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
                                            <p>You are not enrolled in any webinar</p>

                                        </AlertDescription>
                                    </div>

                                    <div className="md:ml-auto">
                                        <Link to='/explore?type=WEBINAR'>
                                            <Button className="mt-2 flex-1" size={'sm'}>Start your journey
                                                today</Button>
                                        </Link>

                                    </div>
                                </div>

                            </Alert>}
                    </div>
                </CardContent>


            </Card>


            <Card className="border-0 bg-muted/50 py-4 my-6">
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
                                            <TableHead>Interview Time</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Cost</TableHead>

                                            <TableHead className="text-right">Status</TableHead>
                                            <TableHead className="text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockInterviewHistoryList?.map(a => (
                                            <TableRow key={a.interviewReqId}>
                                                <TableCell className="font-medium">{a.interviewReqId}</TableCell>
                                                <TableCell>  {a.v_created_date + ' ' + a.v_created_time}</TableCell>
                                                <TableCell>  {a.interviewReqDate ? new Date(a.interviewReqDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}
                                                </TableCell>
                                                <TableCell>{a.interviewReqTime}</TableCell>
                                                <TableCell>{a.interviewReqDuration} min</TableCell>
                                                <TableCell>{a.interviewReqCost == 0 || !a.interviewReqCost ? "FREE" : ""}</TableCell>

                                                <TableCell className="text-right">{a.interviewReqStatus}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link to={`/mock-interview/${a.interviewReqId}`}> <Button size="sm"
                                                                                                              variant="outline"><ExternalLink/></Button></Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-3">
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


            </Card>


            <Card className="border-0 bg-muted/50 py-4 my-6">
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
                                            <TableHead>Counselling Time</TableHead>
                                             <TableHead>Cost</TableHead>
                                            <TableHead  >Mode</TableHead>

                                            <TableHead className="text-right">Status</TableHead>
                                            <TableHead className="text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {counsellingHistoryList?.map(a => (
                                            <TableRow key={a.counsellingId}>
                                                <TableCell className="font-medium">{a.counsellingId}</TableCell>
                                                <TableCell>  {a.v_created_date + ' ' + a.v_created_time}</TableCell>
                                                <TableCell>  {a.counsellingDate ? new Date(a.counsellingDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}
                                                </TableCell>
                                                <TableCell>{a.counsellingTime}</TableCell>
                                                 <TableCell>{a.counsellingCost == 0 || !a.counsellingCost ? "FREE" : ""}</TableCell>
<TableCell>{a?.counsellingMode}</TableCell>
                                                <TableCell className="text-right">{a.counsellingStatus}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link to={`/counselling-compass/${a.counsellingId}`}> <Button size="sm"
                                                                                                              variant="outline"><ExternalLink/></Button></Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-3">
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


            </Card>

        </div>
    )

}
