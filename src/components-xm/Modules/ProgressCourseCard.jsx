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
    <Card className="group relative overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 p-3 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-lg">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Course Image with hover zoom and skeleton loader */}
          <div className="relative w-32 h-34 flex-shrink-0">
            <div
              className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse z-0 rounded-lg"
              style={{
                display: course.courseImageUrl ? "none" : "flex",
              }}
            >
              <span className="text-gray-300">Image</span>
            </div>
            <img
              src={course.courseImageUrl || 'http://localhost:5174/src/assets/byoc_2.png'}
              className="w-full h-full object-cover rounded-lg z-10 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
              alt={course.courseTitle || "Course image"}
              onError={(e) => {
                e.target.style.display = "none";
              }}
              loading="lazy"
            />
            {course?.enrollments?.[0]?.enrollmentStatus && (
              <div className="absolute top-2 right-2 z-20">
                <Badge
                  className={
                    getStatusBadge(course?.enrollments?.[0]?.enrollmentStatus)
                      .color + " text-xs px-2 py-0.5 shadow-md"
                  }
                >
                  {course?.enrollments?.[0]?.enrollmentStatus}
                </Badge>
              </div>
            )}
            {course.courseIsLocked && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg z-30">
                <Lock className="h-8 w-8 text-white mb-1" />
                <span className="text-xs text-white font-semibold">
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
                    className="font-bold text-xl line-clamp-1 text-gray-900 mb-1"
                    title={course.courseTitle}
                  >
                    {course.courseTitle}
                  </h3>

                  {course.courseDescription && (
                    <p
                      className="text-xs text-gray-600 mb-1 line-clamp-1"
                      title={course.courseDescription}
                    >
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
  );
}
