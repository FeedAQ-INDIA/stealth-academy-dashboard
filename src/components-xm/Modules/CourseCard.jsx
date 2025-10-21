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

 
  // Grid view (default)
  return (
    <Card className="rounded-sm group relative overflow-hidden border shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-3">
      <CardHeader className="p-0">
        <div className="  mb-2">
          <div className="flex gap-2">
        
        
            {course.deliveryMode && (
              <Badge variant="outline">{course.deliveryMode}</Badge>
            )}
            {course.courseDuration !== null && course.courseDuration !== undefined && (
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
            className="w-full h-40 object-cover rounded-sm"
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

        <CardTitle className="text-md font-semibold line-clamp-2 ">
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
            <Button size="sm" className="w-full" variant="outline">
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
