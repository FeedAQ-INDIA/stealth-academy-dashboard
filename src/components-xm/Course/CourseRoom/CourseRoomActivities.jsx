import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Activity, Calendar, Clock, Users, BookOpen, CheckCircle, TrendingUp, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { useState } from "react";

function CourseRoomActivities() {
  const [timeFilter, setTimeFilter] = useState("ALL");

  // Mock data for activities - replace with real data
  const activities = [
    {
      id: 1,
      type: "quiz_completed",
      user: {
        name: "John Doe",
        avatar: null
      },
      title: "Completed Quiz: Module 3 Assessment",
      description: "Scored 85% on the module assessment",
      timestamp: "2 hours ago",
      score: 85,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100"
    },
    {
      id: 2,
      type: "member_joined",
      user: {
        name: "Alice Johnson",
        avatar: null
      },
      title: "New member joined the course room",
      description: "Welcome Alice to the learning community!",
      timestamp: "4 hours ago",
      icon: Users,
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: 3,
      type: "assignment_submitted",
      user: {
        name: "Mike Chen",
        avatar: null
      },
      title: "Submitted Assignment: Project Proposal",
      description: "Successfully submitted the project proposal document",
      timestamp: "1 day ago",
      icon: BookOpen,
      color: "text-purple-600 bg-purple-100"
    },
    {
      id: 4,
      type: "certificate_earned",
      user: {
        name: "Sarah Wilson",
        avatar: null
      },
      title: "Earned Certificate: Course Completion",
      description: "Congratulations on completing the entire course!",
      timestamp: "2 days ago",
      icon: Award,
      color: "text-yellow-600 bg-yellow-100"
    },
    {
      id: 5,
      type: "study_session",
      user: {
        name: "Course Room",
        avatar: null
      },
      title: "Study Group Session Scheduled",
      description: "Join the weekly study group tomorrow at 3 PM",
      timestamp: "3 days ago",
      icon: Calendar,
      color: "text-indigo-600 bg-indigo-100"
    }
  ];

  const timeFilters = [
    { value: "ALL", label: "All Time" },
    { value: "TODAY", label: "Today" },
    { value: "WEEK", label: "This Week" },
    { value: "MONTH", label: "This Month" }
  ];

  const activityStats = {
    totalActivities: activities.length,
    activeMembers: 8,
    completedQuizzes: 12,
    submittedAssignments: 6
  };

  const filteredActivities = activities.filter(() => {
    if (timeFilter === "ALL") return true;
    // Add actual time filtering logic here
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{activityStats.totalActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{activityStats.activeMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes Completed</p>
                <p className="text-2xl font-bold text-gray-900">{activityStats.completedQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Assignments Submitted</p>
                <p className="text-2xl font-bold text-gray-900">{activityStats.submittedAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter by:</span>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No activities found
              </h3>
              <p className="text-gray-500">
                Course activities and progress will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const IconComponent = activity.icon;
                
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-200">
                    {/* Activity Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                            {activity.score && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                {activity.score}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {activity.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-500">{activity.user.name}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              {activity.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Insights */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Activity Insights</h3>
              <p className="text-sm text-gray-600">Course engagement overview</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-gray-600">Most Active Day</p>
              <p className="font-semibold text-gray-900">Monday</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-gray-600">Average Completion Rate</p>
              <p className="font-semibold text-gray-900">87%</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-gray-600">Peak Activity Time</p>
              <p className="font-semibold text-gray-900">2-4 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseRoomActivities;