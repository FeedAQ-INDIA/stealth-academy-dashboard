import React, { useState } from 'react';
import { 
  Clock, 
  ExternalLink, 
  Lock, 
  Star, 
  Users, 
  BookOpen, 
  Heart,
  HeartOff,
  Play,
  Calendar,
  Award,
  TrendingUp,
  MoreVertical,
  Share2,
  Download,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/zustland/store.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from 'prop-types';

export function EnhancedCourseCard({ course, viewMode = 'grid', showActions = true, variant = 'default' }) {
    const { userDetail } = useAuthStore();
    const [isWishlisted, setIsWishlisted] = useState(course.isWishlisted || false);
    const [isLoading, setIsLoading] = useState(false);

    // Mock data - replace with actual data from your API
    const mockProgress = course.progress || Math.floor(Math.random() * 100);
    const mockStudents = course.studentCount || Math.floor(Math.random() * 1000) + 100;
    const mockRating = course.rating || (Math.random() * 2 + 3).toFixed(1);
    const mockLessons = course.lessonCount || Math.floor(Math.random() * 20) + 5;
    const mockInstructor = course.instructor || { name: "Dr. Smith", avatar: "" };
    const mockLastUpdated = course.lastUpdated || "2 weeks ago";

    const handleWishlistToggle = async () => {
        setIsLoading(true);
        try {
            // API call to toggle wishlist
            setIsWishlisted(!isWishlisted);
            // await toggleWishlist(course.courseId);
        } catch (error) {
            console.error('Failed to toggle wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: course.courseTitle,
                text: `Check out this course: ${course.courseTitle}`,
                url: window.location.href,
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'ENROLLED': { variant: 'default', text: 'Enrolled', color: 'bg-blue-100 text-blue-800' },
            'COMPLETED': { variant: 'secondary', text: 'Completed', color: 'bg-green-100 text-green-800' },
            'IN_PROGRESS': { variant: 'outline', text: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
            'NOT_STARTED': { variant: 'outline', text: 'Not Started', color: 'bg-gray-100 text-gray-800' },
        };
        return statusConfig[status] || statusConfig['NOT_STARTED'];
    };

    const getDifficultyColor = (level) => {
        const colors = {
            'Beginner': 'bg-green-100 text-green-800 border-green-200',
            'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Advanced': 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (viewMode === 'list') {
        return (
            <Card className="group relative overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex gap-6">
                        {/* Course Image */}
                        <div className="relative w-48 h-32 flex-shrink-0">
                            <img
                                src={course.courseImageUrl || '/api/placeholder/192/128'}
                                className="w-full h-full object-cover rounded-lg"
                                alt={course.courseTitle}
                                onError={(e) => {
                                    e.target.src = '/api/placeholder/192/128';
                                }}
                            />
                            {course.enrollmentStatus && (
                                <div className="absolute top-2 right-2">
                                    <Badge className={getStatusBadge(course.enrollmentStatus).color}>
                                        {getStatusBadge(course.enrollmentStatus).text}
                                    </Badge>
                                </div>
                            )}
                            {course.courseIsLocked && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                    <Lock className="h-8 w-8 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl line-clamp-2 text-gray-900 mb-2">
                                        {course.courseTitle}
                                    </h3>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium">{mockRating}</span>
                                            <span className="text-gray-500">({mockStudents} students)</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">Updated {mockLastUpdated}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {showActions && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleWishlistToggle}
                                            disabled={isLoading}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            {isWishlisted ? <Heart className="h-4 w-4 fill-current" /> : <HeartOff className="h-4 w-4" />}
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={handleShare}>
                                                    <Share2 className="h-4 w-4 mr-2" />
                                                    Share Course
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download Syllabus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.courseLevel && (
                                    <Badge variant="outline" className={getDifficultyColor(course.courseLevel)}>
                                        {course.courseLevel}
                                    </Badge>
                                )}
                                {course.courseMode && <Badge variant="outline">{course.courseMode}</Badge>}
                                {course.courseDuration && (
                                    <Badge variant="outline">
                                        <Clock size={12} className="mr-1" />
                                        {`${Math.floor(+course.courseDuration / 60)}h ${+course.courseDuration % 60}m`}
                                    </Badge>
                                )}
                                <Badge variant="outline">
                                    <BookOpen size={12} className="mr-1" />
                                    {mockLessons} lessons
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={mockInstructor.avatar} />
                                            <AvatarFallback>{mockInstructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-gray-600">{mockInstructor.name}</span>
                                    </div>
                                    
                                    {course.enrollmentStatus === 'ENROLLED' && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium">Progress:</span>
                                            <div className="w-32">
                                                <Progress value={mockProgress} className="h-2" />
                                            </div>
                                            <span className="text-sm font-medium">{mockProgress}%</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex gap-2">
                                    {course.coursePrice && (
                                        <div className="text-right mr-4">
                                            <div className="text-2xl font-bold text-green-600">
                                                ${course.coursePrice}
                                            </div>
                                            {course.originalPrice && (
                                                <div className="text-sm text-gray-500 line-through">
                                                    ${course.originalPrice}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {course.courseIsLocked ? (
                                        <Button variant="secondary" disabled className="min-w-[120px]">
                                            <Lock className="mr-2 h-4 w-4" />
                                            Coming Soon
                                        </Button>
                                    ) : (
                                        <Link to={`/${userDetail ? 'course' : 'explore'}/${course.courseId}`}>
                                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 min-w-[120px]">
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
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Grid view (default)
    return (
        <Card className={`group relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
            variant === 'featured' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}>
            {variant === 'featured' && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            )}
            
            <CardHeader className="p-0">
                {/* Course Image */}
                <div className="relative">
                    <img
                        src={course.courseImageUrl || '/api/placeholder/400/240'}
                        className="w-full h-48 object-cover"
                        alt={course.courseTitle}
                        onError={(e) => {
                            e.target.src = '/api/placeholder/400/240';
                        }}
                    />
                    
                    {/* Overlay Elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Status Badge */}
                    {course.enrollmentStatus && (
                        <div className="absolute top-3 left-3">
                            <Badge className={getStatusBadge(course.enrollmentStatus).color}>
                                {course.enrollmentStatus === 'COMPLETED' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {getStatusBadge(course.enrollmentStatus).text}
                            </Badge>
                        </div>
                    )}
                    
                    {/* Actions */}
                    {showActions && (
                        <div className="absolute top-3 right-3 flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleWishlistToggle}
                                disabled={isLoading}
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                            >
                                {isWishlisted ? 
                                    <Heart className="h-4 w-4 text-red-500 fill-current" /> : 
                                    <HeartOff className="h-4 w-4 text-gray-600" />
                                }
                            </Button>
                        </div>
                    )}
                    
                    {/* Rating */}
                    <div className="absolute bottom-3 left-3">
                        <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{mockRating}</span>
                        </div>
                    </div>
                    
                    {/* Lock Overlay */}
                    {course.courseIsLocked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center text-white">
                                <Lock className="h-12 w-12 mx-auto mb-2" />
                                <p className="font-medium">Coming Soon</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* Course Title */}
                <CardTitle className="text-lg font-bold line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.courseTitle}
                </CardTitle>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={mockInstructor.avatar} />
                        <AvatarFallback className="text-xs">
                            {mockInstructor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{mockInstructor.name}</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {course.courseLevel && (
                        <Badge variant="outline" className={getDifficultyColor(course.courseLevel)}>
                            {course.courseLevel}
                        </Badge>
                    )}
                    {course.courseDuration && (
                        <Badge variant="outline">
                            <Clock size={12} className="mr-1" />
                            {`${Math.floor(+course.courseDuration / 60)}h ${+course.courseDuration % 60}m`}
                        </Badge>
                    )}
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{mockStudents.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{mockLessons} lessons</span>
                    </div>
                    {course.certificateAvailable && (
                        <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            <span>Certificate</span>
                        </div>
                    )}
                </div>

                {/* Progress Bar for enrolled courses */}
                {course.enrollmentStatus === 'ENROLLED' && (
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Progress</span>
                            <span className="font-medium">{mockProgress}%</span>
                        </div>
                        <Progress value={mockProgress} className="h-2" />
                    </div>
                )}

                {/* Price */}
                {course.coursePrice && (
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-2xl font-bold text-green-600">${course.coursePrice}</span>
                            {course.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                    ${course.originalPrice}
                                </span>
                            )}
                        </div>
                        {course.originalPrice && (
                            <Badge variant="destructive">
                                {Math.round((1 - course.coursePrice / course.originalPrice) * 100)}% OFF
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-6 pt-0">
                {course.courseIsLocked ? (
                    <Button className="w-full" variant="secondary" disabled>
                        <Lock className="mr-2 h-4 w-4" />
                        Coming Soon
                    </Button>
                ) : (
                    <Link to={`/${userDetail ? 'course' : 'explore'}/${course.courseId}`} className="w-full">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium">
                            {course.enrollmentStatus === 'ENROLLED' ? (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Continue Learning
                                </>
                            ) : (
                                <>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Explore Course
                                </>
                            )}
                        </Button>
                    </Link>
                )}
            </CardFooter>
        </Card>
    );
}

EnhancedCourseCard.propTypes = {
    course: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(['grid', 'list']),
    showActions: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'featured'])
};

export default EnhancedCourseCard;
