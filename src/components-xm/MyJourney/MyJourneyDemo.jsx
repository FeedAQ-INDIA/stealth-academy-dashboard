import React from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock, 
  Users, 
  Star,
  Heart,
  ShoppingCart,
  GraduationCap,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

/**
 * Demo component showcasing the enhanced MyJourney UI/UX features
 * This demonstrates the improvements made to the learning experience
 */
export function MyJourneyDemo() {
  const demoStats = {
    totalCourses: 12,
    completedCourses: 8,
    inProgressCourses: 3,
    totalHours: 156,
    certificatesEarned: 5,
    currentStreak: 15
  };

  const recentAchievements = [
    { title: "JavaScript Master", date: "2 days ago", icon: Award },
    { title: "15-Day Streak", date: "Today", icon: Zap },
    { title: "React Expert", date: "1 week ago", icon: Target }
  ];

  const featuredCourse = {
    title: "Advanced React Development",
    progress: 75,
    nextLesson: "React Performance Optimization",
    estimatedTime: "45 min"
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Hero Section with Enhanced Stats */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Enhanced Learning Journey 🚀
              </h1>
              <p className="text-blue-100 text-lg">
                Experience the improved UI/UX with better navigation and insights
              </p>
            </div>
            
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{demoStats.totalCourses}</div>
                <div className="text-sm text-blue-100">Total Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{demoStats.completedCourses}</div>
                <div className="text-sm text-blue-100">Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{demoStats.currentStreak}</div>
                <div className="text-sm text-blue-100">Day Streak</div>
              </div>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm">
                {Math.round((demoStats.completedCourses / demoStats.totalCourses) * 100)}%
              </span>
            </div>
            <Progress 
              value={(demoStats.completedCourses / demoStats.totalCourses) * 100} 
              className="h-3 bg-white/20"
            />
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Enhanced Search & Filtering */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Smart Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Advanced filtering by progress, difficulty, and category with instant results.
            </p>
            <Badge variant="outline" className="text-xs">Enhanced</Badge>
          </CardContent>
        </Card>

        {/* Visual Progress Tracking */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Progress Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Visual progress bars, completion rates, and learning streaks.
            </p>
            <Badge variant="outline" className="text-xs">New</Badge>
          </CardContent>
        </Card>

        {/* Wishlist Management */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Smart Wishlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Bulk actions, price tracking, and quick add-to-cart functionality.
            </p>
            <Badge variant="outline" className="text-xs">Improved</Badge>
          </CardContent>
        </Card>

        {/* Achievement System */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Celebration of milestones and learning achievements.
            </p>
            <Badge variant="outline" className="text-xs">New</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{featuredCourse.title}</h3>
              <p className="text-gray-600 mb-4">
                Next: <span className="font-medium">{featuredCourse.nextLesson}</span>
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{featuredCourse.progress}%</span>
                  </div>
                  <Progress value={featuredCourse.progress} className="h-2" />
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {featuredCourse.estimatedTime}
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Continue Learning
              </Button>
            </div>
            
            <div className="md:w-64">
              <img 
                src="/api/placeholder/256/144" 
                alt="Course thumbnail"
                className="w-full h-36 object-cover rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Icon className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    New
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* UI/UX Improvements Summary */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-blue-800">
            🎨 UI/UX Enhancements Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-700">Visual Improvements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Modern gradient hero sections with stats
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Enhanced card designs with hover effects
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Progress bars and visual indicators
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Better spacing and typography
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-blue-700">Functional Improvements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Advanced search and filtering
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Grid/List view toggle
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Bulk actions for wishlist
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Enhanced loading states
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
