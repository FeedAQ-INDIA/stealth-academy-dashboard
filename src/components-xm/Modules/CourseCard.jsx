import { Clock, ExternalLink, Lock, BookOpen, Calendar, TrendingUp, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/zustland/store.js";
import PropTypes from "prop-types";

export function CourseCard({ course, viewMode = "grid" }) {
  const { userDetail } = useAuthStore();

  // Format duration helper
  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds === 0) return null;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'IN_PROGRESS': 'bg-blue-50 text-blue-700 border-blue-200',
      'COMPLETED': 'bg-green-50 text-green-700 border-green-200',
      'NOT_STARTED': 'bg-gray-50 text-gray-700 border-gray-200',
      'ENROLLED': 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const enrollmentStatus = course.enrollments?.[0]?.enrollmentStatus;
  const enrollmentDate = course.enrollments?.[0]?.enrollmentDate;
  const isPublished = course.status === 'PUBLISHED';
  const isPrivate = course.isPrivate;
  const duration = formatDuration(course.courseDuration);

  return (
    <Card className="bg-gradient-to-br from-white to-orange-50/30 border-2 border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-xl rounded-lg group relative overflow-hidden transition-all duration-300 hover:-translate-y-2">
      {/* Decorative gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      
      <CardHeader className="pb-3 pt-5">
        {/* Course Image */}
        <div className="relative mb-4 -mx-6 -mt-5">
          {course.courseImageUrl ? (
            <img
              src={course.courseImageUrl}
              className="w-full h-48 object-cover"
              alt={course.courseTitle}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-full h-48 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center"
            style={{ display: course.courseImageUrl ? 'none' : 'flex' }}
          >
            <BookOpen className="w-20 h-20 text-white/30" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Status badges overlay on image */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
            {enrollmentStatus && (
              <Badge className={`${getStatusColor(enrollmentStatus)} font-medium px-3 py-1 shadow-md`}>
                <TrendingUp size={12} className="mr-1.5" />
                {enrollmentStatus.replaceAll("_", " ")}
              </Badge>
            )}
            {course.accessControls?.[0]?.accessLevel && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-300 font-semibold px-3 py-1 shadow-md">
                {course.accessControls[0].accessLevel}
              </Badge>
            )}
          </div>
        </div>


      </CardHeader>

      <CardContent className=" pb-2 px-3">

                {/* Course title with icon */}
        <div className="flex items-start gap-3 mb-3">
          <CardTitle className="text-lg font-bold line-clamp-2 text-gray-900 flex-1 leading-tight">
            {course.courseTitle}
          </CardTitle>
        </div>


        {/* Course description */}
        {course.courseDescription && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2 leading-relaxed">
            {course.courseDescription}
          </p>
        )}

        {/* Course metadata */}
        <div className="space-y-2">
          {duration && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span className="font-medium">{duration}</span>
            </div>
          )}
          
          {enrollmentDate && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span>Enrolled {formatDate(enrollmentDate)}</span>
            </div>
          )}

        </div>
      </CardContent>

      <CardFooter className="py-3 px-3">
        {course.courseIsLocked ? (
          <Button size="sm" className="w-full bg-gray-100 text-gray-500 hover:bg-gray-200" disabled>
            <Lock className="mr-2 h-4 w-4" />
            COMING SOON
          </Button>
        ) : (
          <Link
            to={`/${userDetail ? "course" : "explore"}/${course.courseId}`}
            className="w-full"
          >
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
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
