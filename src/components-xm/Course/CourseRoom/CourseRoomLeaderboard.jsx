import { useState, useEffect } from "react";
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
  Target,
  TrendingUp,
  Award,
  Users,
  BarChart3,
  Zap,
  Flame,
  Star,
  Crown,
  Medal,
  CheckCircle,
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
  const [statistics, setStatistics] = useState(null);
  const [sortBy, setSortBy] = useState("score"); // score, progress, quiz, time

  // Fetch leaderboard data
  useEffect(() => {
    if (!courseList?.courseId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    axiosConn
      .post(import.meta.env.VITE_API_URL + "/getCourseLeaderboard", {
        courseId: courseList.courseId,
        limit: 0, // Get all users
        sortBy: sortBy,
      })
      .then((res) => {
        const data = res.data?.data;
        
        if (!data) {
          setLeaderboardData([]);
          setStatistics(null);
          setIsLoading(false);
          return;
        }

        // Map API response to component format
        const processedData = (data.leaderboard || []).map((user) => {
          // Calculate activity streak (days)
          const activityStreak = user.lastActivityDate 
            ? Math.max(1, Math.floor((Date.now() - new Date(user.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)))
            : 0;

          // Determine achievements based on user stats
          const achievements = determineAchievements({
            progressPercent: user.progressPercent,
            completedActivities: user.completedContent,
            totalTimeSpent: user.totalActivityHours * 3600, // Convert hours to seconds
            activityStreak: activityStreak,
            avgQuizScore: user.averageQuizScore,
            status: user.status,
            passedQuizzes: user.passedQuizzes,
          });

          return {
            userId: user.userId,
            rank: user.rank,
            displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User",
            email: user.email,
            avatar: user.profilePic,
            progressPercent: user.progressPercent,
            completedActivities: user.completedContent,
            totalActivities: user.totalContent,
            totalTimeSpent: user.totalActivityHours * 3600, // Convert to seconds
            totalTimeHours: user.totalActivityHours,
            avgQuizScore: user.averageQuizScore,
            passedQuizzes: user.passedQuizzes,
            totalQuizzes: user.totalQuizzes,
            activityStreak: activityStreak,
            achievements: achievements,
            overallScore: user.leaderboardScore,
            status: user.status,
            enrollmentDate: user.enrollmentDate,
            lastActive: user.lastActivityDate,
          };
        });

        setLeaderboardData(processedData);
        setStatistics(data.statistics || null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leaderboard data:", err);
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load leaderboard data",
          variant: "destructive",
        });
        setLeaderboardData([]);
        setStatistics(null);
        setIsLoading(false);
      });
  }, [courseList?.courseId, sortBy, toast]);

  // Determine user achievements based on performance metrics
  const determineAchievements = ({
    progressPercent,
    completedActivities,
    totalTimeSpent,
    activityStreak,
    avgQuizScore,
    status,
    passedQuizzes,
  }) => {
    const achievements = [];

    // Completion Master: Completed the course with significant content
    if (status === "COMPLETED" && completedActivities >= 10) {
      achievements.push("COMPLETION_MASTER");
    }
    
    // Consistent: Active for 7+ days
    if (activityStreak >= 7) {
      achievements.push("CONSISTENT");
    }
    
    // Top Performer: High quiz average
    if (avgQuizScore >= 90 && passedQuizzes > 0) {
      achievements.push("TOP_PERFORMER");
    }
    
    // Fast Learner: High progress with moderate time investment
    const hoursSpent = totalTimeSpent / 3600;
    if (hoursSpent > 0 && hoursSpent < 5 && progressPercent >= 80) {
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

            {/* Overall Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  {statistics.totalUsers}
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
                  {statistics.completedUsers}
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
{statistics.averageProgress.toFixed(1)}%                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
      
         
            </div>
  <CardTitle className="text-lg flex items-center gap-2 tracking-wide">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Rankings
          </CardTitle>

           <div className="space-y-2">
            {leaderboardData.map((user, index) => {
              const position = index + 1;
              const rankTier = getRankTier(position);
              const RankIcon = rankTier?.icon;
              const initials = user.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              // Special styling for top 3
              const isTopThree = position <= 3;
              const borderColor = 
                position === 1 ? "border-l-yellow-400" :
                position === 2 ? "border-l-gray-400" :
                position === 3 ? "border-l-orange-400" :
                "border-l-transparent";

              return (
                <div
                  key={user.userId}
                  className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 ${borderColor} ${
                    isTopThree ? "shadow-sm" : ""
                  }`}
                >

                  {/* Avatar */}
                  <Avatar className={`${isTopThree ? "h-14 w-14 border-2 border-white shadow-md" : "h-12 w-12"}`}>
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback className={`${
                      isTopThree 
                        ? `bg-gradient-to-br ${rankTier.color} text-white` 
                        : "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
                    } font-semibold`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`${isTopThree ? "font-bold text-lg" : "font-semibold"} text-gray-900 truncate`}>
                        {user.displayName}
                      </h4>
                      {rankTier && (
                        <Badge variant="outline" className="text-xs">
                          {rankTier.label}
                        </Badge>
                      )}
                      {user.status === "COMPLETED" && (
                        <Badge className="text-xs bg-green-100 text-green-700 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Target className="h-3.5 w-3.5" />
                        {user.completedActivities}/{user.totalActivities}
                      </span>
                      <span>•</span>
                      <span>{user.totalTimeHours.toFixed(1)}h</span>
                      {user.totalQuizzes > 0 && (
                        <>
                          <span>•</span>
                          <span>{user.passedQuizzes}/{user.totalQuizzes} quizzes</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="hidden lg:block w-40">
                    <Progress value={user.progressPercent} className="h-2 mb-1" />
                    <p className="text-xs text-gray-600 text-center">
                      {user.progressPercent}% Complete
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

      
    </div>
  );
}

export default CourseRoomLeaderboard;
