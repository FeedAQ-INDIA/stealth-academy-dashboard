import { Clock, ExternalLink, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/zustland/store.js";
import PropTypes from 'prop-types';

export function CourseCard({ course }) {
    const { userDetail } = useAuthStore();

    return (
        <Card className="group relative overflow-hidden border shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-4">
            <CardHeader className="p-0">
                <div className="overflow-x-auto mb-2">
                    <div className="flex gap-2">
                        {course.courseSource && <Badge variant="outline">{course.courseSource}</Badge>}
                        {course.courseLevel && <Badge variant="outline">{course.courseLevel}</Badge>}
                        {course.courseMode && <Badge variant="outline">{course.courseMode}</Badge>}
                        {course.deliveryMode && <Badge variant="outline">{course.deliveryMode}</Badge>}
                        {course.courseDuration && (
                            <Badge variant="outline">
                                <Clock size={14} className="mr-1 inline" />
                                {`${Math.floor(+course.courseDuration / 60)}hr ${+course.courseDuration % 60}min`}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="relative mb-2">
                    <img
                        src={course.courseImageUrl}
                        className="w-full h-40 object-cover rounded-lg"
                        alt={course.courseTitle}
                    />
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary">
                            {course.enrollmentStatus}
                        </Badge>
                    </div>
                </div>

                <CardTitle className="text-md font-semibold line-clamp-2">
                    {course.courseTitle?.toUpperCase()}
                </CardTitle>
            </CardHeader>

            <CardFooter className="mt-2  p-0">
                {course.courseIsLocked ? (
                    <Button className="w-full" variant="secondary" disabled>
                        <Lock className="mr-2 h-4 w-4" />
                        COMING SOON
                    </Button>
                ) : (
                    <Link to={`/${userDetail ? 'course' : 'explore'}/${course.courseId}`} className="w-full">
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
 