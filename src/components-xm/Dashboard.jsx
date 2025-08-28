import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

export function Dashboard() {
  const {
    userDetail,
    userEnrolledCourseIdList,
    fetchUserEnrolledCourseIdList,
  } = useAuthStore();
  const navigate = useNavigate();

  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
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
             enrollmentStatus: { $ne: 'COMPLETED' },
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

      <section className="my-4 animate-slide-in">
        <Card className="border-0 shadow-md rounded-md">
          <CardHeader className=" ">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2 tracking-wide">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span>Continue Learning</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {courseList?.map((course) => (
                  <Card
                    key={course.id}
                    className=" group relative overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 p-3 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-lg"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Course Image with hover zoom and skeleton loader */}
                        <div className="relative w-32 h-34 flex-shrink-0">
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse z-0 rounded-lg" style={{display: course.courseImageUrl ? 'none' : 'flex'}}>
                            <span className="text-gray-300">Image</span>
                          </div>
                          <img
                            src={course.courseImageUrl}
                            className="w-full h-full object-cover rounded-lg z-10 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                            alt={course.courseTitle || 'Course image'}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            loading="lazy"
                          />
                          {course.enrollmentStatus && (
                            <div className="absolute top-2 right-2 z-20">
                              <Badge
                                className={
                                  getStatusBadge(course.enrollmentStatus).color +
                                  ' text-xs px-2 py-0.5 shadow-md'
                                }
                              >
                                {getStatusBadge(course.enrollmentStatus).text}
                              </Badge>
                            </div>
                          )}
                          {course.courseIsLocked && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg z-30">
                              <Lock className="h-8 w-8 text-white mb-1" />
                              <span className="text-xs text-white font-semibold">Locked</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          {/* Course Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-xl line-clamp-1 text-gray-900 mb-1" title={course.courseTitle}>
                                  {course.courseTitle}
                                </h3>
                         
                                {course.courseDescription && (
                                  <p className="text-xs text-gray-600 mb-1 line-clamp-1" title={course.courseDescription}>
                                    {course.courseDescription}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="w-full space-y-2 mt-1">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <BookOpen size={12} />
                                <span>Progress</span>
                              </div>
                              <div className="flex items-center gap-1 text-blue-600 font-medium">
                                <TrendingUp size={12} />
                                {course.progress}%
                              </div>
                            </div>

                            <div
                              className="w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full h-3 overflow-hidden relative group border border-gray-300"
                              aria-label={`Progress: ${course.progress}%`}
                              role="progressbar"
                              aria-valuenow={course.progress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              {/* Enhanced Progress Bar with color transitions and animation */}
                              <div
                                className={
                                  `h-full rounded-full transition-all duration-700 ease-out shadow-sm ` +
                                  (course.progress === 100
                                    ? "bg-gradient-to-r from-green-400 to-green-600"
                                    : course.progress >= 70
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                    : course.progress >= 40
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                    : "bg-gradient-to-r from-red-400 to-orange-500")
                                }
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            {/* <Button
                              className="flex-1"
                              size="sm"
                              onClick={() => navigate(`/course/${course.courseId}`)}
                              aria-label={`Continue ${course.courseTitle}`}
                              disabled={!!course.courseIsLocked}
                            >
                              Continue
                            </Button> */}
                            <Button
                              className="flex-1 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50"
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/course/${course.courseId}`)}
                              aria-label={`View details for ${course.courseTitle}`}
                            >
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
