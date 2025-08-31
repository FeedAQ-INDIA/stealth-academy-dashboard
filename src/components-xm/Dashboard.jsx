import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  Star,
  TrendingUp,
  User,
  Flame,
  LogIn,
  Lock,
  Trophy,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axiosConn from "@/axioscon.js";
import { useAuthStore } from "@/zustland/store.js";
import { toast } from "@/components/hooks/use-toast.js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.jsx";
import compass from "../assets/compass.png";
import mockinterview from "../assets/mock-interview.png";
import languagestudio from "../assets/language-studio.png";
import companiontalks from "../assets/companion-talks.png";
import { ProgressCourseCard } from "./Modules/ProgressCourseCard";

export function Dashboard() {
  const {
    userDetail,
    userEnrolledCourseIdList,
    fetchUserEnrolledCourseIdList,
  } = useAuthStore();
  const navigate = useNavigate();

  // Static values for streaks
  const studyStreak = 5; // Example static value
  const loginStreak = 3; // Example static value

  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);
  const [courseList, setCourseList] = useState(null);
  const [apiQuery, setApiQuery] = useState({
    limit: limit,
    offset: offset,
    getThisData: {
      datasource: "Course",
      attributes: [],
      include: [
        {
          datasource: "CourseAccess",
          as: "accessControls",
          where: {
            userId: userDetail.id,
            accessLevel: "OWN",
          },
          required: true,
        },
        {
          datasource: "UserCourseContentProgress",
          as: "activityLogs",
          where: {
            userId: userDetail.id,
          },
          required: false,
        },
        {
          datasource: "UserCourseEnrollment",
          as: "enrollments",
          where: {
            enrollmentStatus: { $ne: "COMPLETED" },
             userId: userDetail.id,
          },
          required: true,
        },
        {
          datasource: "CourseContent",
          as: "courseContent",
          where: {
            userId: userDetail.id,
          },
          required: true,
        },
      ],
    },
  });

  useEffect(() => {
    fetchCourses();
    fetchCompletedCourses();
  }, [apiQuery]);

  const fetchCourses = () => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
      .then((res) => {
        setTotalCount(res.data.data.totalCount);
        setOffset(res.data.data.offset);
        setLimit(res.data.data.limit);
        res.data.data?.results?.forEach((a) => {
          calculateProgress(a);
        });
        console.log(res.data.data?.results);
        setCourseList(res.data.data?.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [completedCourseList, setCompletedCourseList] = useState([]);

  const fetchCompletedCourses = () => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 200,
        offset: 0,
        getThisData: {
          datasource: "UserCourseEnrollment",
          attributes: [],
          where: {
            enrollmentStatus: "COMPLETED",
            userId: userDetail.id,
          },
        },
      })
      .then((res) => {
        console.log(res.data.data?.results);
        setTotalCount(res.data.data.totalCount);
        setOffset(res.data.data.offset);
        setLimit(res.data.data.limit);
        setCompletedCourseList(res.data.data?.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Calculate progress
  const calculateProgress = (a) => {
    if (!a?.courseContent) return 0;

    const completedContent =
      a?.activityLogs?.filter((p) => p.progressStatus === "COMPLETED")
        ?.length || 0;

    const totalContent = a?.courseContent?.length || 0;
    const progressPercentage =
      totalContent > 0
        ? Math.round((completedContent / totalContent) * 100)
        : 0;

    a["progress"] = progressPercentage;
  };

  const [exploreCourseText, setExploreCourseText] = useState("");


    const getStatusBadge = (status) => {
    const variants = {
      ENROLLED: "bg-blue-100 text-blue-800 border-blue-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PENDING: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return variants[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  
  return (
    <div className="p-4">
      <Card className="mb-4 border-0 shadow-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700  ">
        <CardHeader className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
              <div className="relative flex-shrink-0">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 shadow-xl">
                  <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                    {userDetail?.nameInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0 ">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight text-white">
                  WELCOME, {userDetail?.derivedUserName}
                </h1>
                <p className="text-white text-base sm:text-lg flex items-center gap-2 flex-wrap">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">
                    Member since {userDetail?.created_date}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  ">
        {/* Study Streak Card */}
        <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-orange-50 via-white to-yellow-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-700 hover:scale-[1.03] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-yellow-400/15 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000"></div>
          <CardHeader>
            <div className=" flex gap-4 items-center z-10">
              <div className="flex items-center justify-between ">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 border border-orange-200/50">
                  <Flame className="w-7 h-7 text-orange-500 group-hover:text-orange-600 transition-colors duration-300" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-orange-700/80 tracking-wide uppercase">
                    Study Streak
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-gray-800 group-hover:text-orange-700 transition-colors duration-300 leading-none">
                    {userDetail?.studyStreak}
                  </p>
                  <p className="text-lg font-semibold text-orange-600 mb-1">
                    days
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 p-2 bg-orange-50/50 rounded-xl border border-orange-100 ">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-xs text-orange-700 font-medium">
                {userDetail?.studyStreak > 0
                  ? "Keep the momentum going!"
                  : "Start your learning journey!"}
              </span>
            </div>
          </CardHeader>
        </Card>

        {/* Enrolled Courses Card */}
        <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-cyan-50 via-white to-blue-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-700 hover:scale-[1.03] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/15 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000"></div>
          <CardHeader>
            <div className=" flex gap-4 items-center z-10">
              <div className="flex items-center justify-between ">
                <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 border border-cyan-200/50">
                  <BookOpen className="w-7 h-7 text-cyan-600 group-hover:text-cyan-700 transition-colors duration-300" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-cyan-700/80 tracking-wide uppercase">
                    Enrolled Courses
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-r from-cyan-200 to-transparent"></div>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-gray-800 group-hover:text-cyan-700 transition-colors duration-300 leading-none">
                    {courseList?.length || 0}
                  </p>
                  <p className="text-lg font-semibold text-cyan-600 mb-1">
                    {courseList?.length === 1 ? "course" : "courses"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 p-2 bg-cyan-50/50 rounded-xl border border-cyan-100">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span className="text-xs text-cyan-700 font-medium">
                {courseList?.length > 0
                  ? "Active learning paths"
                  : "Ready to explore?"}
              </span>
            </div>
          </CardHeader>
        </Card>

        {/* Learning Hours Card */}
        <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-emerald-50 via-white to-green-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-700 hover:scale-[1.03] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-400/15 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-green-200/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000"></div>
          <CardHeader>
            <div className=" flex gap-4 items-center z-10">
              <div className="flex items-center justify-between ">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 border border-emerald-200/50">
                  <Clock className="w-7 h-7 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-emerald-700/80 tracking-wide uppercase">
                    Learning Hours
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-gray-800 group-hover:text-emerald-700 transition-colors duration-300 leading-none">
                    {(() => {
                      const totalSeconds = +userDetail?.learningHours || 0;
                      const hours = totalSeconds / 3600;
                      return hours.toFixed(1);
                    })()}
                  </p>
                  <p className="text-lg font-semibold text-emerald-600 mb-1">
                    hrs
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-700 font-medium">
                Time invested in growth
              </span>
            </div>
          </CardHeader>
        </Card>

        {/* Achievements Card */}
        <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-purple-50 via-white to-violet-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-700 hover:scale-[1.03] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-400/15 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-violet-200/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000"></div>
          <CardHeader>
            <div className=" flex gap-4 items-center z-10">
              <div className="flex items-center justify-between ">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 border border-purple-200/50">
                  <Trophy className="w-7 h-7 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-purple-700/80 tracking-wide uppercase">
                    Achievements
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-gray-800 group-hover:text-purple-700 transition-colors duration-300 leading-none">
                    {completedCourseList.length}
                  </p>
                  <p className="text-lg font-semibold text-purple-600 mb-1">
                    earned
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 p-2 bg-purple-50/50 rounded-xl border border-purple-100">
              <Trophy className="w-4 h-4 text-purple-500 animate-bounce" />
              <span className="text-xs text-purple-700 font-medium">
                {completedCourseList.length > 0
                  ? "Celebrating your success!"
                  : "Your first badge awaits!"}
              </span>
            </div>
          </CardHeader>
        </Card>
      </div>

      <section className="my-4 animate-slide-in">
        <Card className="border-0 shadow-md rounded-md">
          <CardHeader className="flex flex-row gap-2 items-center">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2 tracking-wide">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span>Continue Learning</span>
            </CardTitle>
            <div className="ml-auto flex gap-2">
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
                className="hover:bg-blue-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={offset + limit >= totalCount}
                onClick={() => {
                  setOffset(
                    offset + limit < totalCount ? offset + limit : offset
                  );
                  setApiQuery((prevQuery) => ({
                    ...prevQuery,
                    offset:
                      offset + limit < totalCount ? offset + limit : offset,
                  }));
                }}
                className="hover:bg-blue-50"
              >
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {courseList?.map((course) => (
                  <ProgressCourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
