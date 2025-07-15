import {ChevronLeft, ChevronRight, CirclePlus, ExternalLink, Terminal, BookOpen, Calendar, Users, Clock, MapPin, User, Play} from "lucide-react"
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
import {Badge} from "@/components/ui/badge";

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

    const getStatusBadge = (status) => {
        const variants = {
            'ENROLLED': 'bg-blue-100 text-blue-800 border-blue-200',
            'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
            'IN_PROGRESS': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'PENDING': 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return variants[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if(loading){
        return (
            <div className="flex items-center justify-center h-[100svh] w-full bg-gradient-to-br from-slate-50 to-gray-100">
                <LoaderOne />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="p-4 md:p-8   mx-auto">
                {/* Welcome Header */}
                <Card className="rounded-sm border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl mb-8 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <CardHeader className="relative z-10 pb-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                                <div className="relative flex-shrink-0">
                                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/20 shadow-xl">
                                        <AvatarFallback className="text-xl sm:text-2xl bg-white/20 text-white font-bold">
                                            {userDetail?.nameInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                                        Welcome , {userDetail?.derivedUserName}!
                                    </h1>
                                    <p className="text-blue-100 text-base sm:text-lg flex items-center gap-2 flex-wrap">
                                        <User className="w-4 h-4 flex-shrink-0" />
                                        <span className="break-words">Member since {userDetail?.created_date}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col xs:flex-row gap-3 w-full lg:w-auto">
                                <Link to={'/explore'}>   <Button
                                    variant="secondary"
                                    className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm w-full xs:w-auto justify-center xs:justify-start"
                                >
                                    <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="whitespace-nowrap">Explore Courses</span>
                                </Button> </Link>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                {/* Course History Section */}
                {historySelection == "CourseHistory" && (
                    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl mb-8">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                                Course History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {courseList?.length > 0 ? (
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/80">
                                                <TableHead className="font-semibold text-gray-700">Course Title</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Enrollment Date</TableHead>
                                                <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {courseList?.map(a => (
                                                <TableRow key={a.courseId} className="hover:bg-blue-50/50 transition-colors">
                                                    <TableCell className="font-medium text-gray-900">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                            {a.courseTitle?.toUpperCase()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId) ? (
                                                            <Badge className={getStatusBadge(userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus)}>
                                                                {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus}
                                                            </Badge>
                                                        ) : null}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {a.v_created_date + ' ' + a.v_created_time}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Link to={`/course/${a?.courseId}`}>
                                                            <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
                                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                                View Course
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={4} className="py-4 bg-gray-50/50">
                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                        <div className="text-sm text-gray-600">
                                                            Showing {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} courses
                                                        </div>
                                                        <Pagination className="w-auto">
                                                            <PaginationContent>
                                                                <PaginationItem>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        disabled={offset === 0}
                                                                        onClick={() => {
                                                                            setOffset(Math.max(offset - limit, 0));
                                                                            setApiQuery((prevQuery) => ({
                                                                                ...prevQuery,
                                                                                offset: Math.max(offset - limit, 0),
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                                                        Previous
                                                                    </Button>
                                                                </PaginationItem>
                                                                <PaginationItem>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        disabled={offset + limit >= totalCount}
                                                                        onClick={() => {
                                                                            setOffset(offset + limit < totalCount ? offset + limit : offset);
                                                                            setApiQuery((prevQuery) => ({
                                                                                ...prevQuery,
                                                                                offset: offset + limit < totalCount ? offset + limit : offset,
                                                                            }));
                                                                        }}
                                                                    >
                                                                        Next
                                                                        <ChevronRight className="h-4 w-4 ml-1" />
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
                            ) : (
                                <Alert className="border-blue-200 bg-blue-50/50">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <AlertTitle className="text-blue-800 font-semibold">No Courses Found</AlertTitle>
                                            <AlertDescription className="text-blue-700">
                                                You haven't enrolled in any courses yet. Start your learning journey today!
                                            </AlertDescription>
                                        </div>
                                        <Link to='/explore?type=COURSE'>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                Browse Courses
                                            </Button>
                                        </Link>
                                    </div>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Scheduled Meetings Section */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                            <Calendar className="w-6 h-6 text-green-600" />
                            Scheduled Meetings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {scheduledMeetList?.length > 0 ? (
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/80">
                                            <TableHead className="font-semibold text-gray-700">Meeting Title</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Course</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Start Time</TableHead>
                                            <TableHead className="font-semibold text-gray-700">End Time</TableHead>
                                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scheduledMeetList?.map?.(a => (
                                            <TableRow key={a.courseScheduleId} className="hover:bg-green-50/50 transition-colors">
                                                <TableCell className="font-medium text-gray-900">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                        {a?.scheduledTitle?.toUpperCase()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    <Badge variant="outline" className="border-green-200 text-green-700">
                                                        {a?.course_title?.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        {a?.v_scheduled_start_date + ' ' + a?.v_scheduled_start_time}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        {a?.v_scheduled_end_date + ' ' + a?.v_scheduled_end_time}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Sheet>
                                                            <SheetTrigger asChild>
                                                                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
                                                                    <CirclePlus className="w-4 h-4 mr-1" />
                                                                    Details
                                                                </Button>
                                                            </SheetTrigger>
                                                            <SheetContent className="w-full sm:max-w-lg">
                                                                <SheetHeader className="mb-6">
                                                                    <SheetTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                                        <Calendar className="w-5 h-5 text-blue-600" />
                                                                        Meeting Details
                                                                    </SheetTitle>
                                                                    <SheetDescription className="text-gray-600 text-base">
                                                                        {a?.scheduledDescription}
                                                                    </SheetDescription>
                                                                </SheetHeader>
                                                                <div className="space-y-6">
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                            <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                                                                            <div>
                                                                                <span className="font-medium text-gray-700">Meeting Title</span>
                                                                                <p className="text-gray-900">{a?.scheduledTitle?.toUpperCase() || 'N/A'}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                            <BookOpen className="w-5 h-5 text-green-600 mt-0.5" />
                                                                            <div>
                                                                                <span className="font-medium text-gray-700">Course</span>
                                                                                <p className="text-gray-900">{a?.course_title?.toUpperCase() || 'N/A'}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                            <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                                                                            <div>
                                                                                <span className="font-medium text-gray-700">Batch</span>
                                                                                <p className="text-gray-900">{a?.courseBatch || 'N/A'}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                            <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                                                                            <div>
                                                                                <span className="font-medium text-gray-700">Duration</span>
                                                                                <p className="text-gray-900">
                                                                                    {`${Math.floor((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) / 3600000)} hr ${Math.floor(((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) % 3600000) / 60000)} min`}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                            <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                                                                            <div>
                                                                                <span className="font-medium text-gray-700">Mode</span>
                                                                                <p className="text-gray-900">{a?.scheduledDeliveryMode || 'N/A'}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                            <User className="w-5 h-5 text-indigo-600 mt-0.5" />
                                                                            <div>
                                                                                <span className="font-medium text-gray-700">Tutor</span>
                                                                                <p className="text-gray-900">{a?.scheduledTutor || 'N/A'}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SheetContent>
                                                        </Sheet>
                                                        <Link to={a?.scheduledUrl}>
                                                            <Button  size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
                                                                <Play className="w-4 h-4 mr-2" />
                                                                JOIN
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-4 bg-gray-50/50">
                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <div className="text-sm text-gray-600">
                                                        Showing {offset4 + 1} to {Math.min(offset4 + limit4, totalCount4)} of {totalCount4} meetings
                                                    </div>
                                                    <Pagination className="w-auto">
                                                        <PaginationContent>
                                                            <PaginationItem>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled={offset4 === 0}
                                                                    onClick={() => {
                                                                        setOffset4(Math.max(offset4 - limit4, 0));
                                                                    }}
                                                                >
                                                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                                                    Previous
                                                                </Button>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled={offset4 + limit4 >= totalCount4}
                                                                    onClick={() => {
                                                                        setOffset4(offset4 + limit4 < totalCount4 ? offset4 + limit4 : offset4);
                                                                    }}
                                                                >
                                                                    Next
                                                                    <ChevronRight className="h-4 w-4 ml-1" />
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
                        ) : (
                            <Alert className="border-green-200 bg-green-50/50">
                                <Calendar className="h-5 w-5 text-green-600" />
                                <div>
                                    <AlertTitle className="text-green-800 font-semibold">No Scheduled Meetings</AlertTitle>
                                    <AlertDescription className="text-green-700">
                                        You don't have any scheduled meetings at the moment.
                                    </AlertDescription>
                                </div>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}