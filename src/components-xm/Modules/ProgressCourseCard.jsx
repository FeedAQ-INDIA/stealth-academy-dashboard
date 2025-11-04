import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Lock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProgressCourseCard({ course }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusConfig = {
      IN_PROGRESS: { color: "bg-blue-100 text-blue-700" },
      COMPLETED: { color: "bg-green-100 text-green-700" },
      ENROLLED: { color: "bg-purple-100 text-purple-700" },
      PAUSED: { color: "bg-yellow-100 text-yellow-700" },
      DEFAULT: { color: "bg-gray-100 text-gray-700" },
    };
    return statusConfig[status] || statusConfig.DEFAULT;
  };

  return (
    <Card className="bg-gradient-to-br from-white to-orange-50/30 border-2 border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-xl rounded-lg group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 p-4">
      {/* Decorative gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      
      <CardContent className="p-0 pt-2">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Course Image with hover zoom and skeleton loader */}
          <div className="relative w-36 h-36 flex-shrink-0 rounded-xl overflow-hidden"> 
            {course.courseImageUrl ? (
              <img
                src={course.courseImageUrl}
                className="w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-110"
                alt={course.courseTitle || "Course image"}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
                loading="lazy"
              />
            ) : null}
            <div 
              className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center absolute inset-0 z-0"
              style={{ display: course.courseImageUrl ? 'none' : 'flex' }}
            >
              <BookOpen className="w-12 h-12 text-white/30" />
            </div>
            {course?.enrollments?.[0]?.enrollmentStatus && (
              <div className="absolute top-2 right-2 z-20">
                <Badge
                  className={
                    getStatusBadge(course?.enrollments?.[0]?.enrollmentStatus)
                      .color + " font-medium px-3 py-1 shadow-md"
                  }
                >
                  {course?.enrollments?.[0]?.enrollmentStatus}
                </Badge>
              </div>
            )}
            {course.courseIsLocked && (
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 flex flex-col items-center justify-center rounded-xl z-30 backdrop-blur-sm">
                <Lock className="h-10 w-10 text-white mb-2" />
                <span className="text-sm text-white font-semibold">
                  Locked
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-lg line-clamp-2 text-gray-900 mb-2 leading-tight"
                    title={course.courseTitle}
                  >
                    {course.courseTitle}
                  </h3>

                  {course.courseDescription && (
                    <p
                      className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed"
                      title={course.courseDescription}
                    >
                      {course.courseDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full space-y-3 mt-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <BookOpen size={16} className="text-orange-500 flex-shrink-0" />
                  <span>Progress</span>
                </div>
                <div className="flex items-center gap-1.5 text-orange-600 font-bold">
                  <TrendingUp size={16} />
                  {course.progress}%
                </div>
              </div>

              <div
                className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative shadow-inner"
                aria-label={`Progress: ${course.progress}%`}
                role="progressbar"
                aria-valuenow={course.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={
                    `h-full rounded-full transition-all duration-1000 ease-out shadow-md relative overflow-hidden ` +
                    (course.progress === 100
                      ? "bg-gradient-to-r from-green-500 via-green-600 to-green-500"
                      : course.progress >= 70
                      ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"
                      : course.progress >= 40
                      ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-red-400 via-orange-500 to-red-500")
                  }
                  style={{ width: `${course.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-200"
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
  );
}
