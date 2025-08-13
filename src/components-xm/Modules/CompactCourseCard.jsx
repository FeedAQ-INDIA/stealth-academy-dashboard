import React from 'react';
import { 
  Clock, 
  ExternalLink, 
  Star, 
  Users, 
  BookOpen,
  Play,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardFooter } from "@/components/ui/card.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/zustland/store.js";
import PropTypes from 'prop-types';

/**
 * Compact Course Card - A minimal, space-efficient course card
 * Perfect for sidebar recommendations, small grids, or mobile views
 */
export function CompactCourseCard({ course, showProgress = true, size = 'sm' }) {
    const { userDetail } = useAuthStore();
    
    // Mock data
    const mockProgress = course.progress || Math.floor(Math.random() * 100);
    const mockRating = course.rating || (Math.random() * 2 + 3).toFixed(1);
    const mockStudents = course.studentCount || Math.floor(Math.random() * 500) + 50;

    const sizeClasses = {
        xs: 'p-3',
        sm: 'p-4',
        md: 'p-5'
    };

    const imageSizes = {
        xs: 'h-24',
        sm: 'h-32',
        md: 'h-40'
    };

    return (
        <Card className="group relative overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <CardContent className={sizeClasses[size]}>
                {/* Course Image */}
                <div className="relative mb-3">
                    <img
                        src={course.courseImageUrl || '/api/placeholder/300/200'}
                        className={`w-full ${imageSizes[size]} object-cover rounded-lg`}
                        alt={course.courseTitle}
                        onError={(e) => {
                            e.target.src = '/api/placeholder/300/200';
                        }}
                    />
                    
                    {/* Status Badge */}
                    {course.enrollmentStatus === 'COMPLETED' && (
                        <div className="absolute top-2 right-2">
                            <div className="bg-green-500 text-white p-1 rounded-full">
                                <CheckCircle2 className="h-3 w-3" />
                            </div>
                        </div>
                    )}
                    
                    {/* Rating */}
                    <div className="absolute bottom-2 left-2">
                        <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{mockRating}</span>
                        </div>
                    </div>
                </div>

                {/* Course Title */}
                <h3 className={`font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors ${
                    size === 'xs' ? 'text-sm' : size === 'sm' ? 'text-base' : 'text-lg'
                }`}>
                    {course.courseTitle}
                </h3>

                {/* Course Meta */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{mockStudents}</span>
                    </div>
                    {course.courseDuration && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{Math.floor(+course.courseDuration / 60)}h</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{Math.floor(Math.random() * 15) + 5}</span>
                    </div>
                </div>

                {/* Course Level Badge */}
                {course.courseLevel && (
                    <div className="mb-3">
                        <Badge variant="outline" size="sm">
                            {course.courseLevel}
                        </Badge>
                    </div>
                )}

                {/* Progress for enrolled courses */}
                {showProgress && course.enrollmentStatus === 'ENROLLED' && (
                    <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{mockProgress}%</span>
                        </div>
                        <Progress value={mockProgress} className="h-1.5" />
                    </div>
                )}

                {/* Price */}
                {course.coursePrice && (
                    <div className="mb-3">
                        <span className="text-lg font-bold text-green-600">${course.coursePrice}</span>
                        {course.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                                ${course.originalPrice}
                            </span>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className={`${sizeClasses[size]} pt-0`}>
                <Link to={`/${userDetail ? 'course' : 'explore'}/${course.courseId}`} className="w-full">
                    <Button 
                        size={size === 'xs' ? 'sm' : 'default'}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        {course.enrollmentStatus === 'ENROLLED' ? (
                            <>
                                <Play className="mr-2 h-4 w-4" />
                                Continue
                            </>
                        ) : (
                            <>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Explore
                            </>
                        )}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

CompactCourseCard.propTypes = {
    course: PropTypes.object.isRequired,
    showProgress: PropTypes.bool,
    size: PropTypes.oneOf(['xs', 'sm', 'md'])
};

export default CompactCourseCard;
