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

export function MyLearningLayout() {
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

  const [historySelection, setHistorySelection] = useState("CourseHistory");

  // Navigation items for tabs
  const navigationItems = [
    // {
    //   id: "overview",
    //   label: "OVERVIEW",
    //   icon: GraduationCap,
    //   path: "/my-journey",
    //   description: "Track your enrolled courses and progress",
    // },
    {
      id: "courses",
      label: "MY COURSES",
      icon: GraduationCap,
      path: "/my-journey/courses",
      description: "Track your enrolled courses and progress",
    },
    {
      id: "achievement",
      label: "MY ACHIEVEMENT",
      icon: Heart,
      path: "/my-journey/my-achievement",
      description: "Courses you want to take later",
    },
    //  {
    //   id: "study-group",
    //   label: "MY STUDY GROUP",
    //   icon: Users,
    //   path: "/my-journey/my-study-group",
    //   description: "Collaborate with peers and enhance your learning",
    // },

    //    {
    //   id: "learning-schedule",
    //   label: "MY LEARNING SCHEDULE",
    //   icon: Calendar,
    //   path: "/my-journey/my-learning-schedule",
    //   description: "Organize your study sessions and stay on track",
    // },
    //        {
    //   id: "my-goals",
    //   label: "MY GOALS",
    //   icon: Target,
    //   path: "/my-journey/my-goals",
    //   description: "Set and track your personal learning goals",
    // },
  
  ];

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Check scroll position on mount and resize
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);

      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
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

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-[100svh] w-full bg-gradient-to-br from-slate-50 to-gray-100">
  //       <div className="text-center">
  //         <LoaderOne />
  //         <p className="mt-4 text-gray-600">Loading your learning journey...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-4 ">
        <div className="  mx-auto space-y-4">
          {/* Hero Section with Enhanced Gradient */}
          <div className="relative overflow-hidden">

                            <Card className="  border-0 shadow-lg   bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700   ">
                                      <CardHeader className="">
                                                 {/* <div className="flex items-center justify-center mb-2">
                                                   <Sparkles className="w-6 h-6 text-yellow-300 animate-float" />
                                                 </div> */}
                                                 <CardTitle className="text-center tracking-wide text-2xl md:text-3xl  font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                                   My Journey
                                                 </CardTitle>
                                                 {/* <p className="text-center text-white/90 mt-2 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                                                   Discover thousands of courses from beginner to advanced levels
                                                 </p> */}
                                               </CardHeader>
                                               
                                       <CardContent className="relative z-10 pb-6">
                {/* Mobile: Horizontal scroll with arrows, Desktop: Flex wrap */}
                <div className="relative">
                  {/* Left Arrow */}
                  {showLeftArrow && (
                    <button
                      onClick={scrollLeft}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-purple-700 rounded-full p-1 shadow-lg transition-all duration-300 sm:hidden"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}

                  {/* Right Arrow */}
                  {showRightArrow && (
                    <button
                      onClick={scrollRight}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-purple-700 rounded-full p-1 shadow-lg transition-all duration-300 sm:hidden"
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
                                       ? "bg-white text-purple-700 shadow-lg ring-1 ring-white/50"
                                       : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-white/40"
                                   }`}
                            style={{
                              animationDelay: `${index * 50}ms`,
                            }}
                            aria-label={`Navigate to ${item.label}`}
                          >
                            {/* Animated background for active state */}
                            {isActive && (
                              <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-50 rounded-lg"></div>
                            )}

                            {/* Hover effect background */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-lg transition-opacity duration-300 ${
                                isHovered && !isActive
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            ></div>

                            <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                              <div
                                className={`p-1 sm:p-1.5 rounded transition-all duration-300 ${
                                  isActive
                                    ? "bg-purple-100 text-purple-700"
                                    : isHovered
                                    ? "bg-white/20 text-white scale-110"
                                    : "bg-white/10 text-white"
                                }`}
                              >
                                <Icon size={14} className="sm:w-4 sm:h-4" />
                              </div>

                              <span
                                className={`font-medium whitespace-nowrap transition-colors duration-300 
                                     text-[10px] sm:text-xs ${
                                       isActive
                                         ? "text-purple-700"
                                         : "text-white"
                                     }`}
                              >
                                <span className=" inline">
                                  {item.label}
                                </span>
                                {/* <span className="xs:hidden">
                                  {item.label.split(" ")[0]}
                                </span> */}
                              </span>
                            </div>

                            {/* Animated border for active state */}
                            {isActive && (
                              <div className="absolute inset-0 rounded-lg border border-purple-300 animate-pulse-subtle"></div>
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
          <div className=" ">
            <div className=" ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
