import { Clock, ExternalLink, Lock } from "lucide-react";
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
import byoc2 from "@/assets/byoc_2.png";

export function CourseCard({ course, viewMode = "grid" }) {
  const { userDetail } = useAuthStore();

  if (viewMode === "list") {
    return (
      <Card className="group relative overflow-hidden border shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="flex p-4 gap-4">
          {/* Image */}
          <div className="relative flex-shrink-0">
            <img
              src={course.courseImageUrl || byoc2}
              className="w-32 h-24 object-cover rounded-lg"
              alt={course.courseTitle}
            />
            {course.enrollments && (
              <div className="absolute top-1 right-1">
                <Badge variant="secondary" className="text-xs">
                  {course.enrollments?.[0]?.enrollmentStatus || "URS"}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col h-full">
              {/* Badges */}
              <div className="overflow-x-auto mb-2">
                <div className="flex gap-2 flex-wrap">
                  {course.courseSource && (
                    <Badge variant="outline" className="text-xs">
                      {course.courseSource}
                    </Badge>
                  )}
              
                  {course.courseDuration && (
                    <Badge variant="outline" className="text-xs">
                      <Clock size={12} className="mr-1 inline" />
                      {`${Math.floor(+course.courseDuration / 60)}hr ${
                        +course.courseDuration % 60
                      }min`}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                {course.courseTitle?.toUpperCase()}
              </h3>

              {/* Action Button */}
              <div className="mt-auto">
                {course.courseIsLocked ? (
                  <Button  size="sm"  variant="secondary" disabled className="w-auto">
                    <Lock className="mr-2 h-4 w-4" />
                    COMING SOON
                  </Button>
                ) : (
                  <Link
                    to={`/${userDetail ? "course" : "explore"}/${
                      course.courseId
                    }`}
                  >
                    <Button  size="sm"  className="w-auto">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      EXPLORE COURSE
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group relative overflow-hidden border shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-4">
      <CardHeader className="p-0">
        <div className="overflow-x-auto mb-2">
          <div className="flex gap-2">
        
        
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
      </CardHeader>

      <CardFooter className="mt-2 p-0">
        {course.courseIsLocked ? (
          <Button size="sm" className="w-full" variant="secondary" disabled>
            <Lock className="mr-2 h-4 w-4" />
            COMING SOON
          </Button>
        ) : (
          <Link
            to={`/${userDetail ? "course" : "explore"}/${course.courseId}`}
            className="w-full"
          >
            <Button size="sm" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              EXPLORE COURSE
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  viewMode: PropTypes.oneOf(["grid", "list"]),
};
