import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Grid3X3, 
  List, 
  Eye, 
  Heart,
  ShoppingCart,
  Star,
  Palette
} from 'lucide-react';

// Import all course card variants
import { CourseCard } from './CourseCard.jsx';
import EnhancedCourseCard from './EnhancedCourseCard.jsx';
import CompactCourseCard from './CompactCourseCard.jsx';
import WishlistCourseCard from './WishlistCourseCard.jsx';

/**
 * Course Card Showcase Demo
 * Demonstrates all course card variants with interactive controls
 */
export function CourseCardShowcase() {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCards, setSelectedCards] = useState(new Set());
    
    // Demo course data
    const demoCourses = [
        {
            courseId: 'react-masterclass',
            courseTitle: 'Complete React Masterclass 2024',
            courseImageUrl: '/api/placeholder/400/240',
            courseLevel: 'Intermediate',
            courseMode: 'Online',
            courseDuration: 480, // 8 hours
            coursePrice: 79.99,
            originalPrice: 129.99,
            enrollmentStatus: 'ENROLLED',
            courseSource: 'Premium',
            progress: 65,
            rating: 4.8,
            studentCount: 12450,
            lessonCount: 45,
            instructor: { name: 'Sarah Johnson', avatar: '' },
            isWishlisted: true,
            isTrending: true,
            certificateAvailable: true,
            lastUpdated: '1 week ago'
        },
        {
            courseId: 'python-basics',
            courseTitle: 'Python Programming for Beginners',
            courseImageUrl: '/api/placeholder/400/240',
            courseLevel: 'Beginner',
            courseMode: 'Self-paced',
            courseDuration: 360, // 6 hours
            coursePrice: 0,
            enrollmentStatus: 'COMPLETED',
            courseSource: 'Free',
            progress: 100,
            rating: 4.6,
            studentCount: 8920,
            lessonCount: 28,
            instructor: { name: 'Mike Chen', avatar: '' },
            isWishlisted: false,
            certificateAvailable: true,
            lastUpdated: '3 days ago'
        },
        {
            courseId: 'ui-ux-design',
            courseTitle: 'Advanced UI/UX Design Principles',
            courseImageUrl: '/api/placeholder/400/240',
            courseLevel: 'Advanced',
            courseMode: 'Live',
            courseDuration: 720, // 12 hours
            coursePrice: 149.99,
            originalPrice: 199.99,
            enrollmentStatus: 'NOT_STARTED',
            courseSource: 'Premium',
            progress: 0,
            rating: 4.9,
            studentCount: 5640,
            lessonCount: 32,
            instructor: { name: 'Emma Davis', avatar: '' },
            isWishlisted: true,
            courseIsLocked: false,
            certificateAvailable: true,
            lastUpdated: '2 weeks ago'
        },
        {
            courseId: 'coming-soon',
            courseTitle: 'Machine Learning with TensorFlow',
            courseImageUrl: '/api/placeholder/400/240',
            courseLevel: 'Advanced',
            courseMode: 'Hybrid',
            courseDuration: 960, // 16 hours
            coursePrice: 199.99,
            enrollmentStatus: 'NOT_STARTED',
            courseSource: 'Premium',
            progress: 0,
            rating: 0,
            studentCount: 0,
            lessonCount: 48,
            instructor: { name: 'Dr. Alex Kumar', avatar: '' },
            isWishlisted: false,
            courseIsLocked: true,
            certificateAvailable: true,
            lastUpdated: 'Coming Soon'
        }
    ];

    const handleCardSelect = (courseId) => {
        setSelectedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(courseId)) {
                newSet.delete(courseId);
            } else {
                newSet.add(courseId);
            }
            return newSet;
        });
    };

    const handleRemoveFromWishlist = async (courseId) => {
        console.log('Remove from wishlist:', courseId);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
    };

    const handleAddToCart = async (courseId) => {
        console.log('Add to cart:', courseId);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
    };

    return (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        🎨 Course Card Components Showcase
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore different course card variants designed for various use cases
                        in the FeedAQ Academy platform.
                    </p>
                </div>

                {/* Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Interactive Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Label>View Mode:</Label>
                                <div className="flex border rounded-lg p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="h-8 w-8 p-0"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{demoCourses.length} Demo Courses</Badge>
                                <Badge variant="outline">{selectedCards.size} Selected</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Course Card Variants */}
                <Tabs defaultValue="enhanced" className="space-y-6">
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
                        <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
                        <TabsTrigger value="original">Original</TabsTrigger>
                        <TabsTrigger value="compact">Compact</TabsTrigger>
                        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                    </TabsList>

                    {/* Enhanced Course Cards */}
                    <TabsContent value="enhanced" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    Enhanced Course Cards
                                </CardTitle>
                                <p className="text-gray-600">
                                    Feature-rich cards with instructor info, wishlist actions, progress tracking, and detailed metadata.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className={`gap-6 ${
                                    viewMode === 'grid' 
                                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                                        : 'flex flex-col space-y-4'
                                }`}>
                                    {demoCourses.map((course, index) => (
                                        <EnhancedCourseCard
                                            key={course.courseId}
                                            course={course}
                                            viewMode={viewMode}
                                            variant={index === 0 ? 'featured' : 'default'}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Original Course Cards */}
                    <TabsContent value="original" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-blue-500" />
                                    Original Course Cards
                                </CardTitle>
                                <p className="text-gray-600">
                                    Clean, simple design with essential course information and enrollment status.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className={`gap-6 ${
                                    viewMode === 'grid' 
                                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                        : 'flex flex-col space-y-4'
                                }`}>
                                    {demoCourses.map((course) => (
                                        <CourseCard
                                            key={course.courseId}
                                            course={course}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Compact Course Cards */}
                    <TabsContent value="compact" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Grid3X3 className="h-5 w-5 text-green-500" />
                                    Compact Course Cards
                                </CardTitle>
                                <p className="text-gray-600">
                                    Space-efficient cards perfect for sidebars, recommendations, and mobile views.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Different sizes */}
                                {['xs', 'sm', 'md'].map((size) => (
                                    <div key={size}>
                                        <h4 className="font-semibold mb-4 text-lg">
                                            Size: {size.toUpperCase()}
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                            {demoCourses.slice(0, 3).map((course) => (
                                                <CompactCourseCard
                                                    key={`${course.courseId}-${size}`}
                                                    course={course}
                                                    size={size}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Wishlist Course Cards */}
                    <TabsContent value="wishlist" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    Wishlist Course Cards
                                </CardTitle>
                                <p className="text-gray-600">
                                    Specialized cards for wishlist management with bulk selection and quick actions.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex items-center gap-4">
                                    <Badge variant="outline">
                                        {selectedCards.size} Selected
                                    </Badge>
                                    {selectedCards.size > 0 && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Add Selected to Cart
                                            </Button>
                                            <Button size="sm" variant="outline" className="text-red-600">
                                                Remove Selected
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className={`gap-6 ${
                                    viewMode === 'grid' 
                                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                                        : 'flex flex-col space-y-4'
                                }`}>
                                    {demoCourses.filter(course => course.isWishlisted).map((course) => (
                                        <WishlistCourseCard
                                            key={course.courseId}
                                            course={course}
                                            viewMode={viewMode}
                                            isSelected={selectedCards.has(course.courseId)}
                                            onToggleSelect={() => handleCardSelect(course.courseId)}
                                            onRemoveFromWishlist={() => handleRemoveFromWishlist(course.courseId)}
                                            onAddToCart={() => handleAddToCart(course.courseId)}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Features Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Component Features Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-blue-600">Enhanced Card</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Rich metadata display</li>
                                    <li>• Instructor information</li>
                                    <li>• Wishlist integration</li>
                                    <li>• Progress tracking</li>
                                    <li>• Share functionality</li>
                                </ul>
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="font-semibold text-green-600">Original Card</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Clean, simple design</li>
                                    <li>• Essential information</li>
                                    <li>• Grid/List view support</li>
                                    <li>• Enrollment status</li>
                                    <li>• Lightweight</li>
                                </ul>
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="font-semibold text-purple-600">Compact Card</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Space efficient</li>
                                    <li>• Multiple sizes</li>
                                    <li>• Mobile optimized</li>
                                    <li>• Quick overview</li>
                                    <li>• Sidebar friendly</li>
                                </ul>
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="font-semibold text-red-600">Wishlist Card</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Bulk selection</li>
                                    <li>• Quick actions</li>
                                    <li>• Price tracking</li>
                                    <li>• Cart integration</li>
                                    <li>• Management tools</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default CourseCardShowcase;
