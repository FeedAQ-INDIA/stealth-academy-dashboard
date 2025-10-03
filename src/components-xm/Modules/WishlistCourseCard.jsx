import React, { useState } from 'react';
import { 
  Clock, 
  ExternalLink, 
  Star, 
  Users, 
  BookOpen,
  Heart,
  HeartOff,
  ShoppingCart,
  Share2,
  MoreVertical,
  Calendar,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustland/store.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import PropTypes from 'prop-types';

/**
 * Specialized Wishlist Course Card
 * Features bulk selection, wishlist management, and cart actions
 */
export function WishlistCourseCard({ 
  course, 
  viewMode = 'grid',
  isSelected = false,
  onToggleSelect,
  onRemoveFromWishlist,
  onAddToCart,
  showBulkSelect = true
}) {
    const { userDetail } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // Mock data
    const mockRating = course.rating || (Math.random() * 2 + 3).toFixed(1);
    const mockStudents = course.studentCount || Math.floor(Math.random() * 1000) + 100;
    const mockReviews = course.reviewCount || Math.floor(Math.random() * 200) + 50;
    const mockLastUpdated = course.lastUpdated || "2 weeks ago";
    const mockLessons = course.lessonCount || Math.floor(Math.random() * 20) + 5;

    const handleRemoveFromWishlist = async () => {
        setIsLoading(true);
        try {
            await onRemoveFromWishlist();
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            await onAddToCart();
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: course.courseTitle,
                text: `Check out this course: ${course.courseTitle}`,
                url: `${window.location.origin}/explore/${course.courseId}`,
            });
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/explore/${course.courseId}`);
        }
    };

    const getPriceDisplay = () => {
        if (course.coursePrice === 0 || course.coursePrice === '0') {
            return { current: 'Free', original: null, discount: null };
        }
        
        const current = `$${course.coursePrice}`;
        const original = course.originalPrice ? `$${course.originalPrice}` : null;
        const discount = original ? Math.round((1 - course.coursePrice / course.originalPrice) * 100) : null;
        
        return { current, original, discount };
    };

    const priceInfo = getPriceDisplay();

    if (viewMode === 'list') {
        return (
            <Card className="group relative overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        {/* Selection Checkbox */}
                        {showBulkSelect && (
                            <div className="flex items-center">
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={onToggleSelect}
                                    className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                                />
                            </div>
                        )}

                        {/* Course Image */}
                        <div className="relative w-32 h-20 flex-shrink-0">
                            <img
                                src={course.courseImageUrl || '/api/placeholder/128/80'}
                                className="w-full h-full object-cover rounded-lg"
                                alt={course.courseTitle}
                                onError={(e) => {
                                    e.target.src = '/api/placeholder/128/80';
                                }}
                            />
                            {priceInfo.discount && (
                                <div className="absolute top-1 left-1">
                                    <Badge variant="destructive" className="text-xs px-1">
                                        {priceInfo.discount}% OFF
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                                    {course.courseTitle}
                                </h3>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="ml-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={handleShare}>
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share Course
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => navigate(`/explore/${course.courseId}`)}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{mockRating}</span>
                                    <span>({mockReviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{mockStudents.toLocaleString()} students</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Updated {mockLastUpdated}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                                {course.courseLevel && (
                                    <Badge variant="outline" size="sm">{course.courseLevel}</Badge>
                                )}
                                {course.courseDuration && (
                                    <Badge variant="outline" size="sm">
                                        <Clock size={12} className="mr-1" />
                                        {`${Math.floor(+course.courseDuration / 60)}h ${+course.courseDuration % 60}m`}
                                    </Badge>
                                )}
                                <Badge variant="outline" size="sm">
                                    <BookOpen size={12} className="mr-1" />
                                    {mockLessons} lessons
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-green-600">
                                        {priceInfo.current}
                                    </span>
                                    {priceInfo.original && (
                                        <span className="text-lg text-gray-500 line-through">
                                            {priceInfo.original}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleAddToCart}
                                        disabled={isLoading}
                                        className="hover:bg-blue-50 border-blue-200 text-blue-600"
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-1" />
                                        Add to Cart
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleRemoveFromWishlist}
                                        disabled={isLoading}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <HeartOff className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Grid view
    return (
        <Card className="group relative overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            {/* Selection Checkbox */}
            {showBulkSelect && (
                <div className="absolute top-3 left-3 z-10">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={onToggleSelect}
                        className="bg-white/90 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                    />
                </div>
            )}

            {/* Remove from Wishlist Button */}
            <Button
                size="sm"
                variant="ghost"
                onClick={handleRemoveFromWishlist}
                disabled={isLoading}
                className="absolute top-3 right-3 z-10 p-2 h-8 w-8 text-red-500 hover:bg-red-50 bg-white/90 rounded-full"
            >
                <HeartOff className="h-4 w-4" />
            </Button>

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
                    
                    {/* Discount Badge */}
                    {priceInfo.discount && (
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                            <Badge variant="destructive" className="font-bold">
                                {priceInfo.discount}% OFF
                            </Badge>
                        </div>
                    )}
                    
                    {/* Rating */}
                    <div className="absolute bottom-3 left-3">
                        <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{mockRating}</span>
                        </div>
                    </div>

                    {/* Trending indicator */}
                    {course.isTrending && (
                        <div className="absolute bottom-3 right-3">
                            <div className="flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                                <TrendingUp className="h-3 w-3" />
                                <span>Trending</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4">
                {/* Course Title */}
                <h3 className="font-semibold text-lg line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.courseTitle}
                </h3>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{mockStudents.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{mockLessons} lessons</span>
                    </div>
                    {course.courseDuration && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{Math.floor(+course.courseDuration / 60)}h</span>
                        </div>
                    )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {course.courseLevel && (
                        <Badge variant="outline" size="sm">{course.courseLevel}</Badge>
                    )}
                    {course.courseMode && (
                        <Badge variant="outline" size="sm">{course.courseMode}</Badge>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                            {priceInfo.current}
                        </span>
                        {priceInfo.original && (
                            <span className="text-lg text-gray-500 line-through">
                                {priceInfo.original}
                            </span>
                        )}
                    </div>
                    {course.lastPriceUpdate && (
                        <div className="text-xs text-gray-500">
                            <DollarSign className="h-3 w-3 inline mr-1" />
                            Price updated {course.lastPriceUpdate}
                        </div>
                    )}
                </div>

                {/* Reviews */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{mockRating}</span>
                    </div>
                    <span>({mockReviews} reviews)</span>
                    <span>•</span>
                    <span>Updated {mockLastUpdated}</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 space-y-2">
                {/* Add to Cart Button */}
                <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
                
                {/* View Details Button */}
                <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/explore/${course.courseId}`)}
                >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
}

WishlistCourseCard.propTypes = {
    course: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(['grid', 'list']),
    isSelected: PropTypes.bool,
    onToggleSelect: PropTypes.func,
    onRemoveFromWishlist: PropTypes.func,
    onAddToCart: PropTypes.func,
    showBulkSelect: PropTypes.bool
};

export default WishlistCourseCard;
