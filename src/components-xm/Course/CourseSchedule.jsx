import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import React, {useEffect, useState} from "react";
import {
    AlertCircle,
    CirclePlus,
    Terminal,
    Calendar,
    Clock,
    User,
    Video,
    ExternalLink,
    Search,
    CalendarDays,
    BookOpen,
    Users,
    MapPin,
    Play,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Link, useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import {useAuthStore} from "@/zustland/store.js";
import {Input} from "@/components/ui/input.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormMessage, FormLabel} from "@/components/ui/form"
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination.jsx";
import axiosConn from "@/axioscon.js";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
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
        userCourseContentProgress,
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
                        courseBatch : userEnrollmentObj?.enrollmentBatch,
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

    const formatDuration = (start, end) => {
        const hours = Math.floor((new Date(end) - new Date(start)) / 3600000);
        const minutes = Math.floor(((new Date(end) - new Date(start)) % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    const getModeColor = (mode) => {
        switch (mode?.toLowerCase()) {
            case 'online': return 'bg-green-100 text-green-800 border-green-200';
            case 'offline': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'hybrid': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <>
            {/* Enhanced Header with Gradient */}
            <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm px-3 sm:px-4 shadow-sm">
                {isUserEnrolledAlready ? (
                    <>
                        <SidebarTrigger className="-ml-1 hover:bg-gray-100 transition-colors" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </>
                ) : null}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[20ch] sm:max-w-[30ch] flex items-center gap-2 font-medium">
                                <CalendarDays className="h-4 w-4 text-blue-600" />
                                <span className="hidden sm:inline">Schedule</span>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">
                    {scheduleList?.length > 0 && (
                        <Badge variant="secondary" className="font-normal text-xs sm:text-sm">
                            <span className="hidden sm:inline">{scheduleList.length} sessions</span>
                            <span className="sm:hidden">{scheduleList.length}</span>
                        </Badge>
                    )}
                </div>
            </header>

            <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Enhanced Phone Number Alert */}
                {!userDetail?.number && (
                    <Alert variant="destructive" className="border-l-4 border-l-red-500 bg-red-50/50">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:gap-3">
                            <div>
                                <AlertTitle className="text-red-800 font-semibold text-sm sm:text-base">
                                    Phone number missing in your account
                                </AlertTitle>
                                <AlertDescription className="text-red-700 text-sm">
                                    Please update your phone number to receive updates regarding this {courseList?.courseType}
                                </AlertDescription>
                            </div>
                            <Link to='/account-settings/profile' className="shrink-0">
                                <Button variant="destructive" size="sm" className="w-full sm:w-auto whitespace-nowrap">
                                    Update Profile
                                </Button>
                            </Link>
                        </div>
                    </Alert>
                )}

                {/* Enhanced Search Form */}
                <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-gray-800">
                            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            Find Your Sessions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...createScheduleForm}>
                            <form onSubmit={createScheduleForm.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <FormField
                                        control={createScheduleForm.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Select Date
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            className="pl-10 h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex items-end">
                                        <Button
                                            type="submit"
                                            className="h-11 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
                                        >
                                            <Search className="h-4 w-4 mr-2" />
                                            Search
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Enhanced Schedule Display */}
                <div className="space-y-4">
                    {scheduleList?.length > 0 ? (
                        <Card className="border-0 shadow-lg overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                                <CardTitle className="text-lg sm:text-xl text-gray-800">
                                    Scheduled Sessions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/80">
                                                <TableHead className="font-semibold text-gray-700">Meeting Title</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Start Time</TableHead>
                                                <TableHead className="font-semibold text-gray-700">End Time</TableHead>
                                                <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {scheduleList?.map?.(a => (
                                                <TableRow key={a.courseScheduleId} className="hover:bg-green-50/50 transition-colors">
                                                    <TableCell className="font-medium text-gray-900">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                            <span className="truncate">{a?.scheduledTitle?.toUpperCase()}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 shrink-0" />
                                                            <span className="text-sm">{a?.v_scheduled_start_date + ' ' + a?.v_scheduled_start_time}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 shrink-0" />
                                                            <span className="text-sm">{a?.v_scheduled_end_date + ' ' + a?.v_scheduled_end_time}</span>
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
                                                                                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                                                                <div>
                                                                                    <span className="font-medium text-gray-700">Meeting Title</span>
                                                                                    <p className="text-gray-900 break-words">{a?.scheduledTitle?.toUpperCase() || 'N/A'}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                                <Users className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                                                                                <div>
                                                                                    <span className="font-medium text-gray-700">Batch</span>
                                                                                    <p className="text-gray-900">{a?.courseBatch || 'N/A'}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                                <Clock className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                                                                                <div>
                                                                                    <span className="font-medium text-gray-700">Duration</span>
                                                                                    <p className="text-gray-900">
                                                                                        {`${Math.floor((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) / 3600000)} hr ${Math.floor(((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) % 3600000) / 60000)} min`}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                                <MapPin className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                                                                <div>
                                                                                    <span className="font-medium text-gray-700">Mode</span>
                                                                                    <p className="text-gray-900">{a?.scheduledDeliveryMode || 'N/A'}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                                <User className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
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
                                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
                                                                    <Play className="w-4 h-4 mr-2" />
                                                                    JOIN
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden divide-y divide-gray-200">
                                    {scheduleList?.map?.(a => (
                                        <div key={a.courseScheduleId} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="w-2 h-2 bg-green-600 rounded-full shrink-0"></div>
                                                        <h3 className="font-medium text-gray-900 truncate text-sm">
                                                            {a?.scheduledTitle?.toUpperCase()}
                                                        </h3>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs shrink-0">
                                                        {a?.scheduledDeliveryMode || 'N/A'}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 gap-2 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock className="w-4 h-4 shrink-0" />
                                                        <span className="truncate">
                                                            {a?.v_scheduled_start_date + ' ' + a?.v_scheduled_start_time}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock className="w-4 h-4 shrink-0" />
                                                        <span className="truncate">
                                                            {a?.v_scheduled_end_date + ' ' + a?.v_scheduled_end_time}
                                                        </span>
                                                    </div>
                                                    {a?.scheduledTutor && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <User className="w-4 h-4 shrink-0" />
                                                            <span className="truncate">{a?.scheduledTutor}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                                    <Sheet>
                                                        <SheetTrigger asChild>
                                                            <Button variant="outline" size="sm" className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
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
                                                                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                                                        <div>
                                                                            <span className="font-medium text-gray-700">Meeting Title</span>
                                                                            <p className="text-gray-900 break-words">{a?.scheduledTitle?.toUpperCase() || 'N/A'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                        <Users className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                                                                        <div>
                                                                            <span className="font-medium text-gray-700">Batch</span>
                                                                            <p className="text-gray-900">{a?.courseBatch || 'N/A'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                        <Clock className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                                                                        <div>
                                                                            <span className="font-medium text-gray-700">Duration</span>
                                                                            <p className="text-gray-900">
                                                                                {`${Math.floor((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) / 3600000)} hr ${Math.floor(((new Date(a?.scheduledEndDateTime) - new Date(a?.scheduledStartDateTime)) % 3600000) / 60000)} min`}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                        <MapPin className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                                                        <div>
                                                                            <span className="font-medium text-gray-700">Mode</span>
                                                                            <p className="text-gray-900">{a?.scheduledDeliveryMode || 'N/A'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                                        <User className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                                                                        <div>
                                                                            <span className="font-medium text-gray-700">Tutor</span>
                                                                            <p className="text-gray-900">{a?.scheduledTutor || 'N/A'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SheetContent>
                                                    </Sheet>
                                                    <Link to={a?.scheduledUrl} className="flex-1">
                                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-lg w-full">
                                                            <Play className="w-4 h-4 mr-2" />
                                                            JOIN
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-8 sm:p-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-gray-100 rounded-full">
                                        <Terminal className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                                            No sessions found
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            There are no scheduled sessions for the selected date. Try choosing a different date.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

export default CourseSchedule;