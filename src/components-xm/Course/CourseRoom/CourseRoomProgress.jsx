import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet.jsx";
import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle,
  Award,
  Target,
  Activity,
  BarChart3,
  BookOpen,
  PlayCircle,
  AlertCircle,
  Users,
  Timer,
  Trophy,
  Sparkles,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import axiosConn from "@/axioscon.js";
import { useToast } from "@/hooks/use-toast.js";

// Enrollment Status Configuration
const ENROLLMENT_STATUS = {
  ENROLLED: {
    label: "Enrolled",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: BookOpen,
    variant: "default",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: PlayCircle,
    variant: "default",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    variant: "default",
  },
  CERTIFIED: {
    label: "Certified",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Award,
    variant: "default",
  },
};

// Progress Status Configuration
const PROGRESS_STATUS = {
  NOT_STARTED: {
    label: "Not Started",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  LOCKED: { label: "Locked", color: "text-red-600", bgColor: "bg-red-100" },
};

function CourseRoomProgress() {
  const { courseList, members, isLoading: contextLoading } = useOutletContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { CourseId } = useParams();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState("overview"); // overview | detailed
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Generate mock progress data for demo/testing purposes
  const generateMockProgressData = (member) => {
    const totalActivities = Math.floor(Math.random() * 15) + 5; // 5-20 activities
    const completedActivities = Math.floor(Math.random() * totalActivities);
    const enrollmentStatus =
      completedActivities === totalActivities
        ? "COMPLETED"
        : completedActivities > 0
        ? "IN_PROGRESS"
        : "ENROLLED";

    const activityLogs = Array.from({ length: totalActivities }, (_, i) => ({
      progressId: i + 1,
      userId: member.userId || member.user?.userId,
      courseId: courseList?.courseId,
      courseContentId: i + 1,
      progressStatus: i < completedActivities ? "COMPLETED" : "NOT_STARTED",
      activityDuration:
        i < completedActivities ? Math.floor(Math.random() * 30) + 5 : 0,
      progressPercent: i < completedActivities ? "100.00" : "0.00",
      v_created_date: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      v_created_time: new Date(
        Date.now() - Math.random() * 24 * 60 * 60 * 1000
      ).toLocaleTimeString("en-GB"),
      v_updated_date: new Date(
        Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      v_updated_time: new Date().toLocaleTimeString("en-GB"),
    }));

    const enrollmentDate = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );

    return {
      enrollments: {
        enrollmentId: Math.floor(Math.random() * 1000),
        userId: member.userId || member.user?.userId,
        courseId: courseList?.courseId,
        enrollmentStatus,
        enrollmentDate: enrollmentDate.toISOString(),
        completionDate:
          enrollmentStatus === "COMPLETED" ? new Date().toISOString() : null,
        v_created_date: enrollmentDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        v_created_time: enrollmentDate.toLocaleTimeString("en-GB"),
        v_updated_date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        v_updated_time: new Date().toLocaleTimeString("en-GB"),
      },
      activityLogs,
    };
  };

  useEffect(() => {
    if (!courseList?.courseId) {
      console.log("No courseId available yet");
      return;
    }

    axiosConn
      .post(import.meta.env.VITE_API_URL + "/getCourseProgress", {
        courseId: courseList.courseId,
      })
      .then((res) => {
        console.log("API Response:", res);

        // Handle new API response structure
        if (res.data?.success && res.data?.data?.results) {
          const users = res.data.data.results;
          console.log("Fetched users from API:", users.length);

          // Transform API data to match component's expected structure
          const transformedData = users.map((user) => {
            // Find the first enrollment for this course
            const enrollment =
              user.enrollments && user.enrollments.length > 0
                ? user.enrollments.find(
                    (e) => e.courseId === courseList?.courseId
                  ) || user.enrollments[0]
                : null;

            return {
              userId: user.userId,
              displayName:
                user.derivedUserName ||
                `${user.firstName} ${user.lastName}`.trim(),
              user: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePicture: user.profilePic,
                nameInitial: user.nameInitial,
              },
              avatar: user.profilePic,
              enrollment: enrollment,
              activityLogs: user.activityLogs || [],
              quizResults: user.quizResults || [],
              courseAccess: user.courseAccess || [],
              progressData: {
                enrollments: enrollment,
                activityLogs: user.activityLogs || [],
                quizResults: user.quizResults || [],
              },
            };
          });

          setProgressData(transformedData);
          setIsLoading(false);

          toast({
            title: "Progress Data Loaded",
            description: `Loaded progress data for ${users.length} user(s)`,
            variant: "default",
          });
        } else {
          console.warn("Unexpected API response format:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching progress data:", err);
        toast({
          title: "Error Loading Data",
          description: "Could not load progress data. Please try again.",
          variant: "destructive",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseList?.courseId]);

  // Fetch user progress data
  const fetchMemberProgress = async (userId) => {
    try {
      const response = await axiosConn.get(
        `/user-progress/${courseList?.courseId}/${userId}`
      );
      return response.data?.results || null;
    } catch (error) {
      console.error(`Error fetching progress for user ${userId}:`, error);
      // Return null to indicate API is not available
      return null;
    }
  };

  // Fetch all members' progress
  const fetchAllProgress = async () => {
    if (!members || members.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Try to fetch real data from API
      const progressPromises = members.map((member) =>
        fetchMemberProgress(member.user?.userId || member.userId)
      );

      const results = await Promise.all(progressPromises);

      // Check if any real data was returned
      const hasRealData = results.some((result) => result !== null);

      const enrichedData = members.map((member, index) => {
        let progress = results[index];

        // If API returned null (not available), use mock data
        if (!progress) {
          progress = generateMockProgressData(member);
        }

        return {
          ...member,
          progressData: progress,
          enrollment: progress?.enrollments || null,
          activityLogs: progress?.activityLogs || [],
        };
      });

      setProgressData(enrichedData);

      // Show info toast if using mock data
      if (!hasRealData) {
        toast({
          title: "Demo Mode",
          description:
            "Showing sample progress data. Connect backend API for real data.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);

      // Fallback to mock data on error
      const mockData = members.map((member) => ({
        ...member,
        progressData: generateMockProgressData(member),
        enrollment: generateMockProgressData(member).enrollments,
        activityLogs: generateMockProgressData(member).activityLogs,
      }));

      setProgressData(mockData);

      toast({
        title: "Using Demo Data",
        description: "Could not connect to API. Showing sample data.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("CourseRoomProgress - useEffect triggered", {
      courseList: !!courseList,
      members: members?.length || 0,
      contextLoading,
    });

    // Set a timeout to force loading to false after 3 seconds
    const timeoutId = setTimeout(() => {
      console.log("Timeout reached - forcing loading to false");
      setIsLoading(false);

      if (!progressData || progressData.length === 0) {
        // Generate mock data if we still don't have any
        if (members && members.length > 0) {
          console.log("Generating mock data from timeout");
          const mockData = members.map((member) => {
            const generated = generateMockProgressData(member);
            return {
              ...member,
              progressData: generated,
              enrollment: generated.enrollments,
              activityLogs: generated.activityLogs,
            };
          });
          setProgressData(mockData);
          toast({
            title: "Demo Mode Active",
            description: "Showing sample data for demonstration.",
            variant: "default",
          });
        }
      }
    }, 3000); // 3 second timeout

    if (!courseList) {
      console.log("No courseList, waiting...");
      return () => clearTimeout(timeoutId);
    }

    if (contextLoading) {
      console.log("Context still loading, waiting...");
      return () => clearTimeout(timeoutId);
    }

    // If no members, set loading to false and show empty state
    if (!members || members.length === 0) {
      console.log("No members found, showing empty state");
      setIsLoading(false);
      setProgressData([]);
      clearTimeout(timeoutId);
      return;
    }

    // Fetch progress data
    console.log("Fetching progress for", members.length, "members");
    fetchAllProgress().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseList, members, contextLoading]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (!progressData || progressData.length === 0) {
      return {
        totalMembers: 0,
        enrolledMembers: 0,
        completedMembers: 0,
        averageProgress: 0,
        totalActivities: 0,
        avgCompletionTime: 0,
      };
    }

    const enrolledMembers = progressData.filter((m) => m.enrollment).length;
    const completedMembers = progressData.filter(
      (m) =>
        m.enrollment?.enrollmentStatus === "COMPLETED" ||
        m.enrollment?.enrollmentStatus === "CERTIFIED"
    ).length;

    const totalActivities = progressData.reduce(
      (sum, m) => sum + (m.activityLogs?.length || 0),
      0
    );

    const totalProgress = progressData.reduce((sum, m) => {
      const activities = m.activityLogs || [];
      const completedActivities = activities.filter(
        (a) => a.progressStatus === "COMPLETED"
      ).length;
      return (
        sum +
        (activities.length > 0
          ? (completedActivities / activities.length) * 100
          : 0)
      );
    }, 0);

    const averageProgress =
      enrolledMembers > 0 ? totalProgress / enrolledMembers : 0;

    // Calculate average completion time (mock calculation)
    const avgCompletionTime = progressData
      .filter((m) => m.enrollment?.completionDate)
      .reduce((sum, m) => {
        const start = new Date(m.enrollment.enrollmentDate);
        const end = new Date(m.enrollment.completionDate);
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);

    return {
      totalMembers: progressData.length,
      enrolledMembers,
      completedMembers,
      averageProgress: Math.round(averageProgress),
      totalActivities,
      avgCompletionTime:
        enrolledMembers > 0
          ? Math.round(avgCompletionTime / enrolledMembers)
          : 0,
    };
  }, [progressData]);

  // Get leaderboard - top performers
  const leaderboard = useMemo(() => {
    return progressData
      .filter((m) => m.activityLogs && m.activityLogs.length > 0)
      .map((member) => {
        const completedCount = member.activityLogs.filter(
          (a) => a.progressStatus === "COMPLETED"
        ).length;
        const totalProgress =
          (completedCount / member.activityLogs.length) * 100;

        return {
          ...member,
          completedCount,
          totalProgress: Math.round(totalProgress),
        };
      })
      .sort((a, b) => b.totalProgress - a.totalProgress)
      .slice(0, 5);
  }, [progressData]);

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

  // Calculate days since enrollment
  const getDaysSince = (dateString) => {
    if (!dateString) return 0;
    const start = new Date(dateString);
    const now = new Date();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  };

  if (isLoading && contextLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 bg-white shadow-sm rounded-sm">
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {overallStats.totalMembers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-sm rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-900">
                  {overallStats.completedMembers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-sm rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Avg. Progress
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {overallStats.averageProgress}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-sm rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">
                  Total Activities
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {overallStats.totalActivities}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Section */}
      {leaderboard.length > 0 && (
        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Top Performers</CardTitle>
            </div>
            <CardDescription>
              Members leading in course completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((member, index) => {
                const displayName =
                  member.displayName ||
                  `${member.user?.firstName || ""} ${
                    member.user?.lastName || ""
                  }`.trim() ||
                  "Unknown User";
                const initials = displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={member.userId || index}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : index === 2
                          ? "bg-orange-300 text-orange-900"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* User Info */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={member.avatar || member.user?.profilePicture}
                        alt={displayName}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {member.completedCount} activities completed
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <Progress
                          value={member.totalProgress}
                          className="h-2"
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                        {member.totalProgress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Progress List */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Member Progress Details</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setViewMode(viewMode === "overview" ? "detailed" : "overview")
              }
            >
              {viewMode === "overview" ? "Detailed View" : "Overview"}
            </Button>
          </div>
          <CardDescription>
            Track individual member progress and activity logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progressData.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Members Found
              </h3>
              <p className="text-gray-500">
                No members have enrolled in this course yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {progressData.map((member, index) => {
                const displayName =
                  member.displayName ||
                  `${member.user?.firstName || ""} ${
                    member.user?.lastName || ""
                  }`.trim() ||
                  "Unknown User";
                const initials = displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();
                const enrollment = member.enrollment;
                const activities = member.activityLogs || [];
                const completedActivities = activities.filter(
                  (a) => a.progressStatus === "COMPLETED"
                ).length;
                const progressPercent =
                  activities.length > 0
                    ? Math.round(
                        (completedActivities / activities.length) * 100
                      )
                    : 0;

                const statusInfo = enrollment
                  ? ENROLLMENT_STATUS[enrollment.enrollmentStatus] ||
                    ENROLLMENT_STATUS.ENROLLED
                  : null;

                const StatusIcon = statusInfo?.icon || BookOpen;

                return (
                  <div
                    key={member.userId || index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Member Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={member.avatar || member.user?.profilePicture}
                          alt={displayName}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {displayName}
                          </h4>
                          {enrollment && (
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {member.user?.email || "No email"}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigate(
                            `/course/${CourseId}/room/member/${member.userId}`
                          );
                        }}
                      >
                        View Details
                      </Button>
                    </div>

                    {/* Enrollment Info */}
                    {enrollment && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Enrolled
                            </p>
                            <p className="font-medium text-gray-900">
                              {enrollment.v_created_date ||
                                formatDate(enrollment.enrollmentDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last Active
                            </p>
                            <p className="font-medium text-gray-900">
                              {enrollment.v_updated_date ||
                                formatDate(enrollment.enrollment_updated_at)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              Days Active
                            </p>
                            <p className="font-medium text-gray-900">
                              {getDaysSince(enrollment.enrollmentDate)} days
                            </p>
                          </div>
                          {enrollment.completionDate && (
                            <div>
                              <p className="text-gray-600 flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                Completed
                              </p>
                              <p className="font-medium text-gray-900">
                                {enrollment.v_completed_date ||
                                  formatDate(enrollment.completionDate)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progress: {completedActivities} / {activities.length}{" "}
                          activities
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {progressPercent}%
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    {/* Activity Summary */}
                    {activities.length > 0 && (
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{completedActivities} completed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span>{activities.length} total</span>
                        </div>
                      </div>
                    )}

                    {/* No Enrollment Message */}
                    {!enrollment && (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          This member hasn&apos;t enrolled in the course yet
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights Card */}
      <Card className="border-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Course Insights</h3>
              <p className="text-sm text-gray-600">
                Performance overview and trends
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.enrolledMembers > 0
                  ? Math.round(
                      (overallStats.completedMembers /
                        overallStats.enrolledMembers) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {overallStats.completedMembers} of{" "}
                {overallStats.enrolledMembers} completed
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Avg. Completion Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.avgCompletionTime} days
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Estimated time to complete
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Engagement Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.averageProgress > 75
                  ? "🔥 High"
                  : overallStats.averageProgress > 40
                  ? "👍 Good"
                  : "📈 Growing"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Based on activity and progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Details Sheet - Full Screen */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="full" className="overflow-y-auto p-0">
          {selectedMember &&
            (() => {
              const displayName =
                selectedMember.displayName ||
                `${selectedMember.user?.firstName || ""} ${
                  selectedMember.user?.lastName || ""
                }`.trim() ||
                "Unknown User";
              const initials = displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
              const enrollment = selectedMember.enrollment;
              const activities = selectedMember.activityLogs || [];
              const completedActivities = activities.filter(
                (a) => a.progressStatus === "COMPLETED"
              ).length;
              const progressPercent =
                activities.length > 0
                  ? Math.round((completedActivities / activities.length) * 100)
                  : 0;

              const statusInfo = enrollment
                ? ENROLLMENT_STATUS[enrollment.enrollmentStatus] ||
                  ENROLLMENT_STATUS.ENROLLED
                : null;

              const StatusIcon = statusInfo?.icon || BookOpen;

              return (
                <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
                  {/* Header Section */}
                  <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
                    <SheetHeader>
                      <div className="flex items-center gap-4 mb-2">
                        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                          <AvatarImage
                            src={
                              selectedMember.avatar ||
                              selectedMember.user?.profilePicture
                            }
                            alt={displayName}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <SheetTitle className="text-3xl font-bold text-gray-900 mb-2">
                            {displayName}
                          </SheetTitle>
                          <div className="flex items-center gap-3 flex-wrap">
                            {enrollment && (
                              <Badge
                                className={`${statusInfo.color} px-3 py-1`}
                              >
                                <StatusIcon className="h-4 w-4 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">
                                {selectedMember.user?.email || "No email"}
                              </span>
                            </div>
                            {selectedMember.user?.number && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span className="text-sm">
                                  {selectedMember.user.number}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <SheetDescription className="text-base text-gray-600">
                        Detailed progress tracking and activity timeline for
                        this member
                      </SheetDescription>
                    </SheetHeader>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Progress Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="border-0 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Progress</p>
                              <p className="text-2xl font-bold text-gray-900">
                                {progressPercent}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Completed</p>
                              <p className="text-2xl font-bold text-gray-900">
                                {completedActivities}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Activity className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Activities
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {activities.length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Timer className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Days Active
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {enrollment
                                  ? getDaysSince(enrollment.enrollmentDate)
                                  : 0}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Enrollment Details */}
                    {enrollment && (
                      <Card className="border-0 bg-white shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Enrollment Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                                <Calendar className="h-4 w-4" />
                                Enrollment Date
                              </p>
                              <p className="font-semibold text-gray-900">
                                {enrollment.v_created_date ||
                                  formatDate(enrollment.enrollmentDate)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {enrollment.v_created_time}
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                                <Clock className="h-4 w-4" />
                                Last Updated
                              </p>
                              <p className="font-semibold text-gray-900">
                                {enrollment.v_updated_date ||
                                  formatDate(enrollment.enrollment_updated_at)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {enrollment.v_updated_time}
                              </p>
                            </div>
                            {enrollment.completionDate && (
                              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-700 flex items-center gap-1 mb-2">
                                  <Award className="h-4 w-4" />
                                  Completion Date
                                </p>
                                <p className="font-semibold text-green-900">
                                  {enrollment.v_completed_date ||
                                    formatDate(enrollment.completionDate)}
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                  Course Completed
                                </p>
                              </div>
                            )}
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-700 flex items-center gap-1 mb-2">
                                <TrendingUp className="h-4 w-4" />
                                Completion Rate
                              </p>
                              <p className="font-semibold text-blue-900 text-2xl">
                                {progressPercent}%
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                {completedActivities} of {activities.length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Progress Bar */}
                    <Card className="border-0 bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Overall Progress
                        </CardTitle>
                        <CardDescription>
                          Track completion status across all course activities
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {completedActivities} of {activities.length}{" "}
                              activities completed
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              {progressPercent}%
                            </span>
                          </div>
                          <Progress value={progressPercent} className="h-3" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Activity Timeline */}
                    {activities.length > 0 ? (
                      <Card className="border-0 bg-white shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            Activity Timeline
                          </CardTitle>
                          <CardDescription>
                            Detailed progress log for all course activities
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {activities.map((activity, actIndex) => {
                              const statusConfig =
                                PROGRESS_STATUS[activity.progressStatus] ||
                                PROGRESS_STATUS.NOT_STARTED;

                              return (
                                <div
                                  key={actIndex}
                                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                  <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${statusConfig.bgColor} flex-shrink-0`}
                                  >
                                    {activity.progressStatus === "COMPLETED" ? (
                                      <CheckCircle
                                        className={`h-6 w-6 ${statusConfig.color}`}
                                      />
                                    ) : (
                                      <PlayCircle
                                        className={`h-6 w-6 ${statusConfig.color}`}
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold text-gray-900">
                                        Content #{activity.courseContentId}
                                      </h4>
                                      <Badge className={statusConfig.bgColor}>
                                        <span className={statusConfig.color}>
                                          {statusConfig.label}
                                        </span>
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{activity.v_updated_date}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{activity.v_updated_time}</span>
                                      </div>
                                      {activity.activityDuration > 0 && (
                                        <div className="flex items-center gap-1">
                                          <Timer className="h-3 w-3" />
                                          <span>
                                            {activity.activityDuration} minutes
                                          </span>
                                        </div>
                                      )}
                                      {activity.progressPercent && (
                                        <div className="flex items-center gap-1">
                                          <Target className="h-3 w-3" />
                                          <span>
                                            {activity.progressPercent}%
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="border-0 bg-white shadow-sm">
                        <CardContent className="p-12 text-center">
                          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No Activity Yet
                          </h3>
                          <p className="text-gray-500">
                            This member hasn&apos;t started any activities in
                            this course
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* User Details */}
                    <Card className="border-0 bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          User Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">
                              User ID
                            </p>
                            <p className="font-semibold text-gray-900">
                              {selectedMember.userId}
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">
                              Email Address
                            </p>
                            <p className="font-semibold text-gray-900 break-all">
                              {selectedMember.user?.email || "Not provided"}
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">
                              Full Name
                            </p>
                            <p className="font-semibold text-gray-900">
                              {selectedMember.user?.firstName}{" "}
                              {selectedMember.user?.lastName}
                            </p>
                          </div>
                          {selectedMember.user?.number && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">
                                Phone Number
                              </p>
                              <p className="font-semibold text-gray-900">
                                {selectedMember.user.number}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default CourseRoomProgress;
