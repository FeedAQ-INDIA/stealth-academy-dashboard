import { Clock, ExternalLink, Lock, BookOpen , TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/zustland/store.js";
import PropTypes from "prop-types";

export function ProgressCourseCard2({ course  }) {
  const { userDetail } = useAuthStore();

 
  // Grid view (default)
  return (
    <Card className="group relative overflow-hidden border shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-4">
      <CardHeader className="p-0">
        <div className="overflow-x-auto mb-2">
          <div className="flex gap-2">
            {course.courseSource && (
              <Badge variant="outline">{course.courseSource}</Badge>
            )}
            {course.courseLevel && (
              <Badge variant="outline">{course.courseLevel}</Badge>
            )}
            {course.courseMode && (
              <Badge variant="outline">{course.courseMode}</Badge>
            )}
            {course.deliveryMode && (
              <Badge variant="outline">{course.deliveryMode}</Badge>
            )}
            {course.courseDuration && (
              <Badge variant="outline">
                <Clock size={14} className="mr-1 inline" />
                {(() => {
                  const totalSeconds = +course?.courseDuration || 0;
                  const hours = Math.floor(totalSeconds / 3600);
                  const minutes = Math.floor((totalSeconds % 3600) / 60);
                  const seconds = totalSeconds % 60;
                  const pad = (n) => String(n).padStart(2, "0");
                  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
                })()}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative mb-2">
          <img
            src={course.courseImageUrl || 'http://localhost:5174/src/assets/byoc_2.png'}
            className="w-full h-40 object-cover rounded-lg"
            alt={course.courseTitle}
          />
          {course.enrollments && course.enrollments?.length > 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary">
                {course.enrollments[0]?.enrollmentStatus?.replaceAll("_", " ")}
              </Badge>
            </div>
          )}
        </div>

        <CardTitle className="text-md font-semibold line-clamp-2">
          {course.courseTitle?.toUpperCase()}
        </CardTitle>

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
      </CardHeader>

      <CardFooter className="mt-2 p-0">
        {course.courseIsLocked ? (
          <Button className="w-full" variant="secondary" disabled>
            <Lock className="mr-2 h-4 w-4" />
            COMING SOON
          </Button>
        ) : (
          <Link
            to={`/${userDetail ? "course" : "explore"}/${course.courseId}`}
            className="w-full"
          >
            <Button className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              EXPLORE COURSE
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
 