import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { useToast } from "@/hooks/use-toast.js";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  BookOpen,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  FileText,
  Star,
  Flame,
  Trophy,
} from "lucide-react";
import axiosConn from "@/axioscon.js";

// Progress status configuration
const PROGRESS_STATUS = {
  NOT_STARTED: {
    label: "Not Started",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    icon: BookOpen,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    icon: PlayCircle,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: CheckCircle,
  },
};

function CourseRoomMemberDetail() {
  const { CourseId, userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [memberData, setMemberData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch member detailed data
  useEffect(() => {
    if (!CourseId || !userId) {
      setIsLoading(false);
      return;
    }

    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 1,
        offset: 0,
        getThisData: {
          datasource: "User",
          attributes: [],
          where: {
            userId: parseInt(userId),
          },
          include: [
            {
              datasource: "CourseAccess",
              as: "courseAccess",
              required: true,
              where: {
                courseId: CourseId,
              },
            },
            {
              datasource: "UserCourseEnrollment",
              as: "enrollments",
              required: false,
              where: {
                courseId: CourseId,
              },
            },
            {
              datasource: "UserCourseContentProgress",
              as: "activityLogs",
              required: false,
              include: [
                {
                  datasource: "CourseContent",
                  as: "courseContent",
                  required: false,
                },
              ],
            },
            {
              datasource: "QuizResultLog",
              as: "quizResults",
              required: false,
            },
          ],
        },
      })
      .then((res) => {
        const userData = res.data?.results?.[0];
        if (userData) {
          const enrollment = userData.enrollments?.[0];
          const activities = userData.activityLogs || [];
          const quizResults = userData.quizResults || [];

          setMemberData({
            userId: userData.userId,
            displayName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Unknown User",
            email: userData.email,
            avatar: userData.profilePicture,
            enrollment,
            activities,
            quizResults,
            courseAccess: userData.courseAccess?.[0],
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching member details:", err);
        toast({
          title: "Error",
          description: "Failed to load member details",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [CourseId, userId, toast]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!memberData) return null;

    const { activities, quizResults, enrollment } = memberData;

    const completedActivities = activities.filter(
      (a) => a.progressStatus === "COMPLETED"
    ).length;
    const inProgressActivities = activities.filter(
      (a) => a.progressStatus === "IN_PROGRESS"
    ).length;
    const totalActivities = activities.length;
    const progressPercent =
      totalActivities > 0
        ? Math.round((completedActivities / totalActivities) * 100)
        : 0;

    // Calculate total time spent
    const totalTimeSpent = activities.reduce(
      (sum, activity) => sum + (parseInt(activity.activityDuration) || 0),
      0
    );

    // Calculate average time per activity
    const avgTimePerActivity =
      completedActivities > 0 ? Math.round(totalTimeSpent / completedActivities) : 0;

    // Calculate quiz statistics
    const totalQuizzes = quizResults.length;
    const passedQuizzes = quizResults.filter((q) => q.passed).length;
    const avgQuizScore =
      totalQuizzes > 0
        ? quizResults.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / totalQuizzes
        : 0;

    // Calculate streak
    const activityDates = activities
      .map((a) => new Date(a.v_created_date || a.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;
    for (let i = 0; i < activityDates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const diff = Math.floor(
          (new Date(activityDates[i - 1]) - new Date(activityDates[i])) /
            (1000 * 60 * 60 * 24)
        );
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Days since enrollment
    const daysSinceEnrollment = enrollment?.enrollmentDate
      ? Math.floor(
          (new Date() - new Date(enrollment.enrollmentDate)) / (1000 * 60 * 60 * 24)
        )
      : 0;

    return {
      completedActivities,
      inProgressActivities,
      totalActivities,
      progressPercent,
      totalTimeSpent,
      avgTimePerActivity,
      totalQuizzes,
      passedQuizzes,
      avgQuizScore: Math.round(avgQuizScore),
      currentStreak,
      daysSinceEnrollment,
    };
  }, [memberData]);

  // Group activities by content type
  const activitiesByType = useMemo(() => {
    if (!memberData) return {};

    return memberData.activities.reduce((acc, activity) => {
      const type = activity.courseContent?.contentType || "Other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(activity);
      return acc;
    }, {});
  }, [memberData]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Member Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested member could not be found
          </p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const initials = memberData.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Member Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 border-4 border-blue-100">
                <AvatarImage src={memberData.avatar} alt={memberData.displayName} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {memberData.displayName}
                  </h2>
                  {memberData.enrollment && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      {memberData.enrollment.enrollmentStatus}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{memberData.email}</p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Enrolled {formatDate(memberData.enrollment?.enrollmentDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-gray-600">
                      {statistics.currentStreak} day streak
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">
                      {statistics.completedActivities} completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="w-full md:w-48">
                <div className="text-center mb-2">
                  <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {statistics.progressPercent}%
                  </p>
                </div>
                <Progress value={statistics.progressPercent} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm rounded-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {statistics.completedActivities}
                  </p>
                  <p className="text-xs text-blue-600">
                    of {statistics.totalActivities} activities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-sm rounded-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 font-medium">Time Spent</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatDuration(statistics.totalTimeSpent)}
                  </p>
                  <p className="text-xs text-purple-600">
                    Avg: {formatDuration(statistics.avgTimePerActivity)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-sm rounded-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Quiz Score</p>
                  <p className="text-2xl font-bold text-green-900">
                    {statistics.avgQuizScore}%
                  </p>
                  <p className="text-xs text-green-600">
                    {statistics.passedQuizzes}/{statistics.totalQuizzes} passed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-sm rounded-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-700 font-medium">Streak</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {statistics.currentStreak}
                  </p>
                  <p className="text-xs text-orange-600">consecutive days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Activities
                </TabsTrigger>
                <TabsTrigger value="quizzes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Quizzes
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Progress by Content Type */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Progress by Content Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(activitiesByType).map(([type, activities]) => {
                          const completed = activities.filter(
                            (a) => a.progressStatus === "COMPLETED"
                          ).length;
                          const total = activities.length;
                          const percent = Math.round((completed / total) * 100);

                          return (
                            <div key={type}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">
                                  {type}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {completed}/{total}
                                </span>
                              </div>
                              <Progress value={percent} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {memberData.activities
                          .slice(0, 5)
                          .sort(
                            (a, b) =>
                              new Date(b.v_updated_date) - new Date(a.v_updated_date)
                          )
                          .map((activity, index) => {
                            const status = PROGRESS_STATUS[activity.progressStatus];
                            const StatusIcon = status.icon;

                            return (
                              <div
                                key={activity.progressId || index}
                                className="flex items-start gap-3 pb-3 border-b last:border-0"
                              >
                                <div className={`${status.bgColor} p-2 rounded`}>
                                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {activity.courseContent?.contentTitle ||
                                      "Activity"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {activity.v_updated_date || "Recently"}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${status.color}`}
                                >
                                  {status.label}
                                </Badge>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Activities Tab */}
              <TabsContent value="activities">
                <div className="space-y-3">
                  {memberData.activities.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No activities yet</p>
                    </div>
                  ) : (
                    memberData.activities.map((activity, index) => {
                      const status = PROGRESS_STATUS[activity.progressStatus];
                      const StatusIcon = status.icon;

                      return (
                        <div
                          key={activity.progressId || index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className={`${status.bgColor} p-3 rounded-lg`}>
                            <StatusIcon className={`h-5 w-5 ${status.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {activity.courseContent?.contentTitle || "Activity"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {activity.courseContent?.contentType || "Content"}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={status.color}>{status.label}</Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.activityDuration
                                ? `${activity.activityDuration}m`
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              {/* Quizzes Tab */}
              <TabsContent value="quizzes">
                <div className="space-y-3">
                  {memberData.quizResults.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No quiz attempts yet</p>
                    </div>
                  ) : (
                    memberData.quizResults.map((quiz, index) => (
                      <div
                        key={quiz.resultId || index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`${
                            quiz.passed ? "bg-green-100" : "bg-red-100"
                          } p-3 rounded-lg`}
                        >
                          {quiz.passed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            Quiz #{index + 1}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(quiz.attemptDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {quiz.score || 0}%
                          </p>
                          <Badge
                            className={
                              quiz.passed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {quiz.passed ? "Passed" : "Failed"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CourseRoomMemberDetail;
