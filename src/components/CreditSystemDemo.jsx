import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Coins, Play, BookOpen, MessageSquare, Target } from 'lucide-react';
import { useCreditTransaction } from '@/components/CreditWidget.jsx';
import CreditWidget from '@/components/CreditWidget.jsx';
import { useToast } from '@/components/hooks/use-toast.js';

// Example of how to integrate credit system in other components
const CourseCard = ({ course }) => {
    const { checkAndDeductCredits, InsufficientCreditsModal } = useCreditTransaction();
    const { toast } = useToast();
    const [isEnrolled, setIsEnrolled] = useState(false);

    const handleEnrollment = () => {
        const success = checkAndDeductCredits(
            course.creditCost, 
            `Course Enrollment: ${course.title}`,
            'course'
        );
        
        if (success) {
            setIsEnrolled(true);
            toast({
                title: "Enrollment Successful!",
                description: `You've been enrolled in ${course.title}. ${course.creditCost} credits deducted.`,
                duration: 4000,
            });
        }
    };

    return (
        <>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            {course.creditCost}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            {course.duration} • {course.level}
                        </div>
                        {isEnrolled ? (
                            <Button disabled className="bg-green-100 text-green-800">
                                <Play className="w-4 h-4 mr-2" />
                                Enrolled
                            </Button>
                        ) : (
                            <Button onClick={handleEnrollment}>
                                Enroll for {course.creditCost} Credits
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
            <InsufficientCreditsModal />
        </>
    );
};

const ServiceCard = ({ service, icon: Icon = Target }) => {
    const { checkAndDeductCredits, InsufficientCreditsModal } = useCreditTransaction();
    const { toast } = useToast();
    const [isUsing, setIsUsing] = useState(false);

    const handleServiceUse = async () => {
        setIsUsing(true);
        const success = checkAndDeductCredits(
            service.creditCost, 
            `Service Usage: ${service.title}`,
            service.type
        );
        
        if (success) {
            // Simulate service execution
            setTimeout(() => {
                setIsUsing(false);
                toast({
                    title: "Service Completed!",
                    description: `${service.title} has been completed successfully.`,
                    duration: 4000,
                });
            }, 2000);
        } else {
            setIsUsing(false);
        }
    };

    return (
        <>
            <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{service.title}</h3>
                            <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Coins className="w-3 h-3" />
                                {service.creditCost}
                            </Badge>
                            <Button 
                                onClick={handleServiceUse} 
                                disabled={isUsing}
                                size="sm"
                            >
                                {isUsing ? 'Processing...' : 'Use Service'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <InsufficientCreditsModal />
        </>
    );
};

// Main demo component showing integration examples
const CreditSystemDemo = () => {
    const sampleCourses = [
        {
            id: 1,
            title: 'Advanced React Development',
            description: 'Master React hooks, context, and performance optimization',
            creditCost: 150,
            duration: '8 weeks',
            level: 'Advanced'
        },
        {
            id: 2,
            title: 'JavaScript Fundamentals',
            description: 'Learn the core concepts of JavaScript programming',
            creditCost: 100,
            duration: '6 weeks',
            level: 'Beginner'
        }
    ];

    const sampleServices = [
        {
            id: 1,
            title: 'AI Mock Interview',
            description: 'Practice with AI-powered interview simulation',
            creditCost: 75,
            type: 'interview',
            icon: MessageSquare
        },
        {
            id: 2,
            title: 'Skill Assessment',
            description: 'Comprehensive evaluation of your skills',
            creditCost: 60,
            type: 'assessment',
            icon: Target
        }
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Credit Balance Widget */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Your Credit Balance</h2>
                <CreditWidget 
                    showBalance={true}
                    showQuickPurchase={true}
                    compact={false}
                />
            </div>

            {/* Course Examples */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sampleCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>

            {/* Service Examples */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Premium Services</h2>
                <div className="space-y-4">
                    {sampleServices.map(service => (
                        <ServiceCard 
                            key={service.id} 
                            service={service} 
                            icon={service.icon} 
                        />
                    ))}
                </div>
            </div>

            {/* Compact Credit Widget Example */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Compact Credit Display</h2>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Dashboard Header Example</CardTitle>
                            <CreditWidget compact={true} showQuickPurchase={true} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            This shows how the credit widget can be integrated into navigation bars 
                            or headers as a compact display.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreditSystemDemo;
export { CourseCard, ServiceCard };
