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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/zustland/store.js";
import React, { useEffect, useState, useRef } from "react";
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

  const [hoveredItem, setHoveredItem] = useState(null);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

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
      label: "MY COURSES",
      icon: GraduationCap,
      path: "/my-journey/courses",
      description: "Track your enrolled courses and progress",
    },
    {
      id: "wishlist",
      label: "WISHLIST",
      icon: Heart,
      path: "/my-journey/wishlist",
      description: "Courses you want to take later",
    },
    {
      id: "orders",
      label: "ORDERS",
      icon: ShoppingCart,
      path: "/my-journey/orders",
      description: "Your purchase history",
    },
  ];

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Check scroll position on mount and resize
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-3 lg:p-6 overflow-y-auto h-[calc(100svh-4em)]">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Hero Section with Enhanced Gradient */}
          <div className="relative overflow-hidden">
            <Card className="w-full rounded-2xl border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700  text-white shadow-2xl backdrop-blur-sm">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>
              
              <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-float" />
                </div>
                <CardTitle className="text-center tracking-wide text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                  Welcome back, {userDetail?.firstName || 'Learner'}!
                </CardTitle>
                <p className="text-center text-white/90 mt-2 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  Continue your learning journey and achieve your goals
                </p>
              </CardHeader>
              
              <CardContent className="relative z-10 pb-6">
                {/* Mobile: Horizontal scroll with arrows, Desktop: Flex wrap */}
                <div className="relative">
                  {/* Left Arrow */}
                  {showLeftArrow && (
                    <button
                      onClick={scrollLeft}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-orange-700 rounded-full p-1 shadow-lg transition-all duration-300 sm:hidden"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  
                  {/* Right Arrow */}
                  {showRightArrow && (
                    <button
                      onClick={scrollRight}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-orange-700 rounded-full p-1 shadow-lg transition-all duration-300 sm:hidden"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={16} />
                    </button>
                  )}
                  
                  <div 
                    ref={scrollContainerRef}
                    className="overflow-x-auto scrollbar-hide"
                    onScroll={checkScrollPosition}
                  >
                    <div className="flex gap-1.5 p-1 min-w-max sm:flex-wrap sm:justify-center sm:min-w-0 sm:gap-2">
                      {navigationItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        const isHovered = hoveredItem === item.id;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 flex-shrink-0 
                              px-2 py-1.5 sm:px-3 sm:py-2 ${
                              isActive
                                ? 'bg-white text-orange-700 shadow-lg ring-1 ring-white/50'
                                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-white/40'
                            }`}
                            style={{
                              animationDelay: `${index * 50}ms`
                            }}
                            aria-label={`Navigate to ${item.label}`}
                          >
                            {/* Animated background for active state */}
                            {isActive && (
                              <div className="absolute inset-0 bg-gradient-to-r from-white to-orange-50 rounded-lg"></div>
                            )}
                            
                            {/* Hover effect background */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-lg transition-opacity duration-300 ${isHovered && !isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                            
                            <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                              <div className={`p-1 sm:p-1.5 rounded transition-all duration-300 ${
                                isActive 
                                  ? 'bg-orange-100 text-orange-700' 
                                  : isHovered 
                                    ? 'bg-white/20 text-white scale-110' 
                                    : 'bg-white/10 text-white'
                              }`}>
                                <Icon size={14} className="sm:w-4 sm:h-4" />
                              </div>
                              
                              <span className={`font-medium whitespace-nowrap transition-colors duration-300 
                                text-[10px] sm:text-xs ${
                                isActive ? 'text-orange-700' : 'text-white'
                              }`}>
                                <span className="hidden xs:inline">{item.label}</span>
                                <span className="xs:hidden">
                                  {item.label.split(' ')[0]}
                                </span>
                              </span>
                            </div>
                            
                            {/* Animated border for active state */}
                            {isActive && (
                              <div className="absolute inset-0 rounded-lg border border-orange-300 animate-pulse-subtle"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Banner */}
          {learningStats.completedCourses > 0 && (
            <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
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

          {/* Content from child routes with enhanced container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 min-h-[50vh] overflow-hidden">
            <div className="p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
