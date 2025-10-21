import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useToast } from "@/hooks/use-toast.js";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Flame,
  Star,
  Crown,
  Zap,
} from "lucide-react";
import axiosConn from "@/axioscon.js";

// Achievement badges configuration
const ACHIEVEMENT_BADGES = {
  FAST_LEARNER: {
    label: "Fast Learner",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  CONSISTENT: {
    label: "Consistent",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  TOP_PERFORMER: {
    label: "Top Performer",
    icon: Star,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  COMPLETION_MASTER: {
    label: "Completion Master",
    icon: Award,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
};

// Rank tier configuration
const RANK_TIERS = {
  GOLD: {
    label: "Gold",
    color: "from-yellow-400 to-yellow-600",
    textColor: "text-yellow-900",
    icon: Crown,
    min: 1,
    max: 3,
  },
  SILVER: {
    label: "Silver",
    color: "from-gray-300 to-gray-500",
    textColor: "text-gray-900",
    icon: Medal,
    min: 4,
    max: 10,
  },
  BRONZE: {
    label: "Bronze",
    color: "from-orange-300 to-orange-500",
    textColor: "text-orange-900",
    icon: Award,
    min: 11,
    max: 20,
  },
};

function CourseRoomLeaderboard() {
  const { courseList, isLoading: contextLoading } = useOutletContext();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeRange, setTimeRange] = useState("all-time"); // all-time, monthly, weekly

  // Fetch leaderboard data
  useEffect(() => {
    if (!courseList?.courseId) {
      setIsLoading(false);
      return;
    }

    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 100,
        offset: 0,
        getThisData: {
          datasource: "User",
          attributes: [],
          include: [
            {
              datasource: "CourseAccess",
              as: "courseAccess",
              required: true,
              where: {
                courseId: courseList?.courseId,
              },
            },
            {
              datasource: "UserCourseEnrollment",
              as: "enrollments",
              required: false,
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
        const users = res.data?.results || [];
        
        // Process and calculate leaderboard metrics
        const processedData = users
          .map((user) => {
            const enrollment = user.enrollments?.[0];
            const activities = user.activityLogs || [];
            const quizResults = user.quizResults || [];

            const completedActivities = activities.filter(
              (a) => a.progressStatus === "COMPLETED"
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

            // Calculate average quiz score
            const avgQuizScore =
              quizResults.length > 0
                ? quizResults.reduce((sum, quiz) => sum + (quiz.score || 0), 0) /
                  quizResults.length
                : 0;

            // Calculate activity streak (consecutive days)
            const activityStreak = calculateStreak(activities);

            // Determine achievements
            const achievements = determineAchievements({
              progressPercent,
              completedActivities,
              totalTimeSpent,
              activityStreak,
              avgQuizScore,
            });

            // Calculate overall score for ranking
            const overallScore =
              progressPercent * 0.4 +
              (completedActivities / Math.max(totalActivities, 1)) * 100 * 0.3 +
              Math.min(activityStreak * 5, 100) * 0.2 +
              avgQuizScore * 0.1;

            return {
              userId: user.userId,
              displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User",
              email: user.email,
              avatar: user.profilePicture,
              progressPercent,
              completedActivities,
              totalActivities,
              totalTimeSpent,
              avgQuizScore,
              activityStreak,
              achievements,
              overallScore,
              enrollment,
              lastActive: enrollment?.enrollment_updated_at || enrollment?.enrollmentDate,
            };
          })
          .filter((user) => user.enrollment) // Only include enrolled users
          .sort((a, b) => b.overallScore - a.overallScore); // Sort by overall score

        setLeaderboardData(processedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leaderboard data:", err);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [courseList?.courseId, toast]);

  // Calculate activity streak
  const calculateStreak = (activities) => {
    if (!activities || activities.length === 0) return 0;

    const dates = activities
      .map((a) => new Date(a.v_created_date || a.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.floor(
        (new Date(dates[i - 1]) - new Date(dates[i])) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Determine user achievements
  const determineAchievements = ({
    progressPercent,
    completedActivities,
    totalTimeSpent,
    activityStreak,
    avgQuizScore,
  }) => {
    const achievements = [];

    if (completedActivities >= 10 && progressPercent === 100) {
      achievements.push("COMPLETION_MASTER");
    }
    if (activityStreak >= 7) {
      achievements.push("CONSISTENT");
    }
    if (avgQuizScore >= 90) {
      achievements.push("TOP_PERFORMER");
    }
    if (totalTimeSpent > 0 && totalTimeSpent < 300 && progressPercent > 80) {
      achievements.push("FAST_LEARNER");
    }

    return achievements;
  };

  // Get rank tier for position
  const getRankTier = (position) => {
    if (position >= RANK_TIERS.GOLD.min && position <= RANK_TIERS.GOLD.max) {
      return RANK_TIERS.GOLD;
    }
    if (position >= RANK_TIERS.SILVER.min && position <= RANK_TIERS.SILVER.max) {
      return RANK_TIERS.SILVER;
    }
    if (position >= RANK_TIERS.BRONZE.min && position <= RANK_TIERS.BRONZE.max) {
      return RANK_TIERS.BRONZE;
    }
    return null;
  };

  // Top 3 performers
  const topThree = useMemo(() => leaderboardData.slice(0, 3), [leaderboardData]);

  // Rest of the leaderboard
  const restOfLeaderboard = useMemo(
    () => leaderboardData.slice(3),
    [leaderboardData]
  );

  if (isLoading || contextLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-12 text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Leaderboard Data
            </h3>
            <p className="text-gray-500">
              Start completing activities to appear on the leaderboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Leaderboard Header */}
      <Card className="border-0 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 shadow-sm rounded-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Course Leaderboard
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Top performers ranked by overall score
                </CardDescription>
              </div>
            </div>

            {/* Filter Options */}
            <div className="flex items-center gap-2">
              <Button
                variant={timeRange === "all-time" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("all-time")}
              >
                All Time
              </Button>
              <Button
                variant={timeRange === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={timeRange === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("weekly")}
              >
                Weekly
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Top 3 Podium */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topThree.map((user, index) => {
              const position = index + 1;
              const rankTier = getRankTier(position);
              const RankIcon = rankTier?.icon || Trophy;
              const initials = user.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={user.userId}
                  className={`relative ${
                    position === 1 ? "md:order-2 md:scale-110" : position === 2 ? "md:order-1" : "md:order-3"
                  }`}
                >
                  <Card
                    className={`border-2 ${
                      position === 1
                        ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50"
                        : position === 2
                        ? "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100"
                        : "border-orange-300 bg-gradient-to-br from-orange-50 to-red-50"
                    } rounded-lg shadow-lg`}
                  >
                    <CardContent className="p-6 text-center">
                      {/* Rank Badge */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${rankTier.color} flex items-center justify-center shadow-lg border-4 border-white`}
                        >
                          <RankIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {/* Position Number */}
                      <div className="mt-4 mb-4">
                        <Badge
                          className={`text-lg font-bold px-3 py-1 ${
                            position === 1
                              ? "bg-yellow-500 text-yellow-900"
                              : position === 2
                              ? "bg-gray-400 text-gray-900"
                              : "bg-orange-400 text-orange-900"
                          }`}
                        >
                          #{position}
                        </Badge>
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-20 w-20 mx-auto mb-3 border-4 border-white shadow-lg">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback
                          className={`text-xl font-bold bg-gradient-to-br ${rankTier.color} text-white`}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Name */}
                      <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                        {user.displayName}
                      </h3>

                      {/* Score */}
                      <p className="text-2xl font-bold text-blue-600 mb-3">
                        {Math.round(user.overallScore)} pts
                      </p>

                      {/* Progress */}
                      <div className="mb-3">
                        <Progress value={user.progressPercent} className="h-2 mb-1" />
                        <p className="text-sm text-gray-600">
                          {user.progressPercent}% Complete
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-white/50 rounded p-2">
                          <p className="text-gray-600">Activities</p>
                          <p className="font-bold text-gray-900">
                            {user.completedActivities}
                          </p>
                        </div>
                        <div className="bg-white/50 rounded p-2">
                          <p className="text-gray-600">Streak</p>
                          <p className="font-bold text-gray-900">
                            {user.activityStreak} days
                          </p>
                        </div>
                      </div>

                      {/* Achievements */}
                      {user.achievements.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1 justify-center">
                          {user.achievements.map((achievement) => {
                            const badge = ACHIEVEMENT_BADGES[achievement];
                            const BadgeIcon = badge.icon;
                            return (
                              <div
                                key={achievement}
                                className={`${badge.bgColor} rounded-full p-1.5`}
                                title={badge.label}
                              >
                                <BadgeIcon className={`h-4 w-4 ${badge.color}`} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rest of Leaderboard */}
      {restOfLeaderboard.length > 0 && (
        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Full Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {restOfLeaderboard.map((user, index) => {
                const position = index + 4;
                const rankTier = getRankTier(position);
                const initials = user.displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={user.userId}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Position */}
                    <div className="w-10 text-center">
                      <span className="text-lg font-bold text-gray-700">
                        #{position}
                      </span>
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {user.displayName}
                        </h4>
                        {rankTier && (
                          <Badge variant="outline" className="text-xs">
                            {rankTier.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{user.completedActivities} activities</span>
                        <span>•</span>
                        <span>{user.activityStreak} day streak</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="hidden md:block w-32">
                      <Progress value={user.progressPercent} className="h-2 mb-1" />
                      <p className="text-xs text-gray-600 text-center">
                        {user.progressPercent}%
                      </p>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {Math.round(user.overallScore)}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>

                    {/* Achievements */}
                    {user.achievements.length > 0 && (
                      <div className="flex gap-1">
                        {user.achievements.slice(0, 3).map((achievement) => {
                          const badge = ACHIEVEMENT_BADGES[achievement];
                          const BadgeIcon = badge.icon;
                          return (
                            <div
                              key={achievement}
                              className={`${badge.bgColor} rounded-full p-1.5`}
                              title={badge.label}
                            >
                              <BadgeIcon className={`h-3.5 w-3.5 ${badge.color}`} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CourseRoomLeaderboard;
