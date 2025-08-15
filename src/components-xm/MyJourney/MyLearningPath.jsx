import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  ExternalLink,
  Terminal,
  BookOpen,
  Calendar,
  Users,
  Clock,
  MapPin,
  User,
  Play,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Heart,
  ShoppingCart,
  GraduationCap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/zustland/store.js";
import React, { useEffect, useState } from "react";
import axiosConn from "@/axioscon.js";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.jsx";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderOne } from "@/components/ui/loader.jsx";

export function MyLearningPath() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userDetail,
    userEnrolledCourseIdList,
    fetchUserEnrolledCourseIdList,
  } = useAuthStore();

  // Stats calculation
  const [learningStats, setLearningStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [courseList, setCourseList] = useState({});
  const [loading, setLoading] = useState(false); // local loader

  const [apiQuery, setApiQuery] = useState({
    limit: limit,
    offset: offset,
    getThisData: {
      datasource: "UserEnrollment",
      attributes: [],
      where: { userId: userDetail?.userId, courseId: { $ne: null } },
      include: [
        {
          datasource: "Course",
          as: "course",
          required: false,
          order: [],
          attributes: [],
          where: {},
        },
      ],
    },
  });

  useEffect(() => {
    fetchCourses();
  }, [apiQuery]);

  const fetchCourses = () => {
    setLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
      .then((res) => {
        const courses = res.data.data?.results?.map((a) => a.course) || [];
        setCourseList(courses);
        setTotalCount(res.data.data.totalCount);
        setOffset(res.data.data.offset);
        setLimit(res.data.data.limit);

        // Calculate learning stats
        const stats = {
          totalCourses: courses.length,
          completedCourses: courses.filter(
            (course) => course.status === "COMPLETED"
          ).length,
          inProgressCourses: courses.filter(
            (course) => course.status === "IN_PROGRESS"
          ).length,
          totalHours:
            courses.reduce(
              (total, course) => total + (course.courseDuration || 0),
              0
            ) / 60,
        };
        setLearningStats(stats);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [totalCount1, setTotalCount1] = useState(0);
  const [limit1, setLimit1] = useState(5);
  const [offset1, setOffset1] = useState(0);
  const [courseList1, setCourseList1] = useState({});

  const [apiQuery1, setApiQuery1] = useState({
    limit: limit1,
    offset: offset1,
    getThisData: {
      datasource: "UserEnrollment",
      attributes: [],
      where: { userId: userDetail?.userId, webinarId: { $ne: null } },
      include: [
        {
          datasource: "Webinar",
          as: "webinar",
          required: false,
          order: [],
          attributes: [],
          where: {},
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
        setCourseList1(res.data.data?.results?.map((a) => a.webinar));
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
    limit: limit2,
    offset: offset2,
    getThisData: {
      datasource: "InterviewReq",
      attributes: [],
      where: { userId: userDetail?.userId },
    },
  });

  useEffect(() => {
    fetchMockInterviewHistory();
  }, [apiQuery2]);

  const fetchMockInterviewHistory = () => {
    setLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery2)
      .then((res) => {
        console.log(res.data);
        setMockInterviewHistoryList(res.data.data?.results);
        setTotalCount2(res.data.data.totalCount);
        setOffset2(res.data.data.offset);
        setLimit2(res.data.data.limit);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [totalCount3, setTotalCount3] = useState(0);
  const [limit3, setLimit3] = useState(5);
  const [offset3, setOffset3] = useState(0);
  const [counsellingHistoryList, setCounsellingHistoryList] = useState([]);

  const [apiQuery3, setApiQuery3] = useState({
    limit: limit3,
    offset: offset3,
    getThisData: {
      datasource: "Counselling",
      attributes: [],
      where: { userId: userDetail?.userId },
    },
  });

  useEffect(() => {
    fetchCounsellingHistory();
  }, [apiQuery3]);

  const fetchCounsellingHistory = () => {
    setLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery3)
      .then((res) => {
        console.log(res.data);
        setCounsellingHistoryList(res.data.data?.results);
        setTotalCount3(res.data.data.totalCount);
        setOffset3(res.data.data.offset);
        setLimit3(res.data.data.limit);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
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
    setLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/fetchScheduledCourseMeet", {
        page: offset4,
        limit: limit4,
      })
      .then((res) => {
        console.log(res.data);
        setScheduledMeetList(res.data?.data?.results);
        setTotalCount4(res.data.data.totalCount);
        setOffset4(res.data.data.offset);
        setLimit4(res.data.data.limit);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const [historySelection, setHistorySelection] = useState("CourseHistory");

  // Navigation items for tabs
  const navigationItems = [
    {
      id: "courses",
      label: "My Courses",
      icon: GraduationCap,
      path: "/my-journey/courses",
      description: "Track your enrolled courses and progress",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      path: "/my-journey/wishlist",
      description: "Courses you want to take later",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: "/my-journey/orders",
      description: "Your purchase history",
    },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      ENROLLED: "bg-blue-100 text-blue-800 border-blue-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PENDING: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return variants[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100svh] w-full bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <LoaderOne />
          <p className="mt-4 text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-4   mx-auto ">
        <Card className="w-full rounded-xl border-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-700 text-white shadow-2xl mb-8  ">
          <CardHeader>
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide">
              My Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="">
              <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Hero Header */}
        {/* <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl mb-8">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Welcome back, {userDetail?.firstName || 'Learner'}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Continue your learning journey and achieve your goals
                </p>
              </div>
              
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{learningStats.totalCourses}</div>
                  <div className="text-sm text-blue-100">Enrolled</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{learningStats.completedCourses}</div>
                  <div className="text-sm text-blue-100">Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{learningStats.inProgressCourses}</div>
                  <div className="text-sm text-blue-100">In Progress</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{Math.round(learningStats.totalHours)}h</div>
                  <div className="text-sm text-blue-100">Learning Time</div>
                </div>
              </div>
            </div>
            
             {learningStats.totalCourses > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm">
                    {Math.round((learningStats.completedCourses / learningStats.totalCourses) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(learningStats.completedCourses / learningStats.totalCourses) * 100} 
                  className="h-2 bg-white/20"
                />
              </div>
            )}
          </div>
        </div> */}

        {/* Navigation Tabs */}
        {/* <div className="mb-8">
          <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div> */}

        {/* Achievement Banner */}
        {learningStats.completedCourses > 0 && (
          <Card className="mb-6 border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Great Progress! 🎉
                  </h3>
                  <p className="text-sm text-gray-600">
                    You've completed {learningStats.completedCourses} course
                    {learningStats.completedCourses !== 1 ? "s" : ""}. Keep up
                    the excellent work!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Area */}
        <Outlet />
      </div>
    </div>
  );
}
