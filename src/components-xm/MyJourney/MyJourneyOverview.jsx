import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, TrendingUp } from "lucide-react";
import React from "react";

export default function MyJourneyOverview() {
  const journeyData = {
    totalCourses: 5,
    completedCourses: 2,
    inProgressCourses: 2,
    upcomingCourses: 1,
    totalHours: 45,
    completedHours: 18,
  };

  const progressPercentage =
    (journeyData.completedCourses / journeyData.totalCourses) * 100;

  return (
    <Card className="border-2 border-dashed border-gray-200">
      <CardContent className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Start Your Learning Journey
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          Discover thousands of courses from beginner to advanced levels. Start
          learning something new today!
        </p>
      </CardContent>
    </Card>
  );
}
