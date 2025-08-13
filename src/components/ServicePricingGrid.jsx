import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Coins, BookOpen, MessageSquare, User, FileText, Target, Clock } from 'lucide-react';
import { useCreditTransaction } from '@/components/CreditWidget.jsx';

const ServicePricingCard = ({ 
    service, 
    onServiceSelect,
    disabled = false 
}) => {
    const { checkAndDeductCredits, InsufficientCreditsModal } = useCreditTransaction();

    const serviceIcons = {
        'course': BookOpen,
        'interview': MessageSquare,
        'guidance': User,
        'resume': FileText,
        'assessment': Target,
        'default': BookOpen
    };

    const Icon = serviceIcons[service.type] || serviceIcons.default;

    const handleServiceClick = () => {
        if (disabled) return;
        
        const success = checkAndDeductCredits(
            service.credits, 
            service.name, 
            service.type
        );
        
        if (success && onServiceSelect) {
            onServiceSelect(service);
        }
    };

    return (
        <>
            <Card className={`transition-all duration-300 hover:scale-105 cursor-pointer ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            } border-2 hover:border-purple-300`}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-full">
                                <Icon className="w-5 h-5 text-purple-600" />
                            </div>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-lg">{service.credits}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    {service.features && (
                        <div className="space-y-2 mb-4">
                            {service.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {service.duration && (
                                <Badge variant="secondary" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {service.duration}
                                </Badge>
                            )}
                            {service.difficulty && (
                                <Badge variant="outline" className="text-xs">
                                    {service.difficulty}
                                </Badge>
                            )}
                        </div>
                        <Button 
                            onClick={handleServiceClick}
                            disabled={disabled}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Use {service.credits} Credits
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <InsufficientCreditsModal />
        </>
    );
};

const ServicePricingGrid = ({ 
    services = [],
    title = "Available Services",
    subtitle = "Choose a service to get started",
    onServiceSelect,
    className = ""
}) => {
    const defaultServices = [
        {
            id: 'react-course',
            type: 'course',
            name: 'Advanced React Course',
            description: 'Master React hooks, context, and performance optimization',
            credits: 150,
            duration: '8 weeks',
            difficulty: 'Advanced',
            features: [
                'Interactive coding exercises',
                'Real-world projects',
                'Certificate upon completion',
                'Lifetime access'
            ]
        },
        {
            id: 'mock-interview',
            type: 'interview',
            name: 'AI Mock Interview',
            description: 'Practice with AI-powered interview simulation',
            credits: 75,
            duration: '1 hour',
            difficulty: 'All Levels',
            features: [
                'Industry-specific questions',
                'Real-time feedback',
                'Performance analytics',
                'Recording available'
            ]
        },
        {
            id: 'career-guidance',
            type: 'guidance',
            name: 'Career Guidance Session',
            description: 'One-on-one session with industry experts',
            credits: 100,
            duration: '45 mins',
            difficulty: 'All Levels',
            features: [
                'Personalized roadmap',
                'Industry insights',
                'Skill gap analysis',
                'Goal setting'
            ]
        },
        {
            id: 'resume-review',
            type: 'resume',
            name: 'AI Resume Review',
            description: 'Get your resume analyzed and improved',
            credits: 50,
            duration: '24 hours',
            difficulty: 'All Levels',
            features: [
                'ATS compatibility check',
                'Content optimization',
                'Format suggestions',
                'Industry-specific tips'
            ]
        },
        {
            id: 'skill-assessment',
            type: 'assessment',
            name: 'Comprehensive Skill Assessment',
            description: 'Evaluate your technical and soft skills',
            credits: 60,
            duration: '2 hours',
            difficulty: 'All Levels',
            features: [
                'Multi-domain testing',
                'Detailed score breakdown',
                'Improvement recommendations',
                'Certificate of completion'
            ]
        },
        {
            id: 'javascript-course',
            type: 'course',
            name: 'JavaScript Mastery',
            description: 'From basics to advanced JavaScript concepts',
            credits: 120,
            duration: '6 weeks',
            difficulty: 'Intermediate',
            features: [
                'ES6+ features',
                'Asynchronous programming',
                'DOM manipulation',
                'Project-based learning'
            ]
        }
    ];

    const servicesToRender = services.length > 0 ? services : defaultServices;

    return (
        <div className={className}>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600">{subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesToRender.map((service) => (
                    <ServicePricingCard
                        key={service.id}
                        service={service}
                        onServiceSelect={onServiceSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default ServicePricingGrid;
export { ServicePricingCard };
