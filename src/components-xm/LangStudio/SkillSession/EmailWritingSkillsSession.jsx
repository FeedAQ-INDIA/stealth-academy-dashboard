import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Separator } from '@/components/ui/separator';
import { 
    Mail, 
    Send, 
    Target, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    FileText,
    Star,
    TrendingUp,
    User,
    Building,
    Briefcase,
    PenTool
} from 'lucide-react';
import { useCreditTransaction } from '@/components/CreditWidget.jsx';
import { useToast } from '@/components/hooks/use-toast.js';

const EmailWritingSkillsSession = ({ 
    onClose, 
    sessionType = 'professional' 
}) => {
    const { toast } = useToast();
    const [emailData, setEmailData] = useState({
        subject: '',
        recipient: '',
        body: '',
        tone: 'professional'
    });
    const [sessionComplete, setSessionComplete] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState('');
    const [hover, setHover] = useState(0);

    const emailScenario = {
        title: "Professional Business Email",
        scenario: "You're reaching out to a potential client to inquire about their upcoming project requirements and establish a professional business relationship.",
        context: {
            recipient: "Project Manager at TechCorp",
            purpose: "Business inquiry",
            tone: "professional",
            expectedLength: "150-200 words"
        },
        criteria: ["Clarity", "Professionalism", "Purpose", "Call-to-Action"]
    };

    const currentScenario = emailScenario;
    const totalSteps = 1;
    const progress = 100; // Always 100% since there's only one scenario

    const toneOptions = [
        { value: 'professional', label: 'Professional' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'formal', label: 'Formal' },
        { value: 'casual', label: 'Casual' }
    ];

    const handleInputChange = (field, value) => {
        setEmailData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateEmail = () => {
        const errors = [];
        
        if (!emailData.subject.trim()) {
            errors.push("Subject line is required");
        }
        
        if (!emailData.body.trim()) {
            errors.push("Email body is required");
        }
        
        if (emailData.body.length < 50) {
            errors.push("Email body should be at least 50 characters");
        }

        return errors;
    };

    const handleSubmitEmail = async () => {
        const errors = validateEmail();
        
        if (errors.length > 0) {
            toast({
                title: "Please complete the email",
                description: errors.join(", "),
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        
        // Simulate AI feedback generation
        setTimeout(() => {
            const mockFeedback = {
                score: Math.floor(Math.random() * 25) + 75, // 75-100
                subjectScore: Math.floor(Math.random() * 20) + 80,
                bodyScore: Math.floor(Math.random() * 20) + 80,
                toneScore: Math.floor(Math.random() * 15) + 85,
                structureScore: Math.floor(Math.random() * 20) + 80,
                strengths: [
                    "Clear subject line",
                    "Appropriate professional tone",
                    "Well-structured paragraphs",
                    "Effective call-to-action"
                ],
                improvements: [
                    "Consider more specific subject line",
                    "Add more context in opening",
                    "Include clear next steps",
                    "Personalize the greeting"
                ],
                suggestions: {
                    subject: "Consider making the subject more specific and actionable",
                    opening: "A warmer opening would improve engagement",
                    closing: "Include a clear call-to-action",
                    tone: "The tone matches the professional context well"
                }
            };
            
            setFeedback(mockFeedback);
            setLoading(false);
            
            // Complete the session after a delay
            setTimeout(() => {
                setSessionComplete(true);
            }, 2500);
        }, 2000);
    };

    const handleRestartSession = () => {
        setEmailData({
            subject: '',
            recipient: '',
            body: '',
            tone: 'professional'
        });
        setFeedback(null);
        setSessionComplete(false);
    };

    if (sessionComplete) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-700">
                        Email Writing Session Complete!
                    </CardTitle>
                    <p className="text-gray-600">
                        You've mastered professional email communication
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="text-center p-4">
                            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <h3 className="font-semibold">Email Skills</h3>
                            <p className="text-2xl font-bold text-blue-600">Advanced</p>
                        </Card>
                        <Card className="text-center p-4">
                            <Mail className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <h3 className="font-semibold">Emails Composed</h3>
                            <p className="text-2xl font-bold text-purple-600">{totalSteps}</p>
                        </Card>
                        <Card className="text-center p-4">
                            <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                            <h3 className="font-semibold">Communication Level</h3>
                            <p className="text-2xl font-bold text-yellow-600">Professional</p>
                        </Card>
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                        <Button onClick={handleRestartSession} variant="outline">
                            <Mail className="w-4 h-4 mr-2" />
                            Practice Again
                        </Button>
                        <Button onClick={onClose}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete Session
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="email-writing-session min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
            <div className="mx-auto">
                {/* Header */}
                <Card className="mb-4">
                    <CardHeader>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
                                        📧
                                    </div>
                                    Email Writing Skills Session
                                </h1>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Master professional email communication skills
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-4">
                                    <Progress value={progress} className="w-32" />
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        <Briefcase className="w-4 h-4 mr-1" />
                                        Professional
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Email Scenario */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                                    💼
                                </div>
                                {currentScenario?.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                                    <h4 className="font-semibold text-green-800 mb-2">Scenario:</h4>
                                    <p className="text-green-700">{currentScenario?.scenario}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600" />
                                        <span><strong>Recipient:</strong> {currentScenario?.context.recipient}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-blue-600" />
                                        <span><strong>Purpose:</strong> {currentScenario?.context.purpose}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span><strong>Length:</strong> {currentScenario?.context.expectedLength}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building className="w-4 h-4 text-blue-600" />
                                        <span><strong>Tone:</strong> {currentScenario?.context.tone}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Composition */}
                    <div className="space-y-4">
                        {!feedback ? (
                            <Card>
                                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-wide">
                                        <div className="bg-purple-100 text-purple-800 p-2 rounded-lg">
                                            ✍️
                                        </div>
                                        Compose Your Email
                                    </CardTitle>
                                    <Badge variant="outline" className="self-start sm:self-center">
                                        Criteria: {currentScenario?.criteria.join(', ')}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">To:</label>
                                            <Input
                                                value={emailData.recipient}
                                                onChange={(e) => handleInputChange('recipient', e.target.value)}
                                                placeholder={currentScenario?.context.recipient}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Tone:</label>
                                            <Select 
                                                value={emailData.tone} 
                                                onValueChange={(value) => handleInputChange('tone', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {toneOptions.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject:</label>
                                        <Input
                                            value={emailData.subject}
                                            onChange={(e) => handleInputChange('subject', e.target.value)}
                                            placeholder="Enter a clear and specific subject line"
                                            maxLength={100}
                                        />
                                        <span className="text-xs text-gray-500">{emailData.subject.length}/100 characters</span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Body:</label>
                                        <Textarea
                                            value={emailData.body}
                                            onChange={(e) => handleInputChange('body', e.target.value)}
                                            placeholder="Compose your email here..."
                                            className="min-h-48 resize-none"
                                            maxLength={500}
                                        />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Evaluation: {currentScenario?.criteria.join(', ')}</span>
                                            <span>{emailData.body.length}/500 characters</span>
                                        </div>
                                    </div>

                                    
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold text-green-700">Email Analyzed!</span>
                                    </div>
                                </div>

                                <Tabs defaultValue="feedback" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="feedback">Feedback</TabsTrigger>
                                        <TabsTrigger value="scores">Scores</TabsTrigger>
                                        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="feedback" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Star className="w-5 h-5 text-yellow-500" />
                                                    Overall Score: {feedback.score}/100
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold text-green-700 mb-2">Strengths:</h4>
                                                    <ul className="space-y-1">
                                                        {feedback.strengths.map((strength, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                                <span className="text-sm">{strength}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                
                                                <div>
                                                    <h4 className="font-semibold text-blue-700 mb-2">Areas for Improvement:</h4>
                                                    <ul className="space-y-1">
                                                        {feedback.improvements.map((improvement, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                                <span className="text-sm">{improvement}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    
                                    <TabsContent value="scores" className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-medium">Subject Line</span>
                                                        <span className="font-bold">{feedback.subjectScore}%</span>
                                                    </div>
                                                    <Progress value={feedback.subjectScore} className="h-2" />
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-medium">Email Body</span>
                                                        <span className="font-bold">{feedback.bodyScore}%</span>
                                                    </div>
                                                    <Progress value={feedback.bodyScore} className="h-2" />
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-medium">Tone & Style</span>
                                                        <span className="font-bold">{feedback.toneScore}%</span>
                                                    </div>
                                                    <Progress value={feedback.toneScore} className="h-2" />
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-medium">Structure</span>
                                                        <span className="font-bold">{feedback.structureScore}%</span>
                                                    </div>
                                                    <Progress value={feedback.structureScore} className="h-2" />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="suggestions" className="space-y-4">
                                        <div className="space-y-4">
                                            {Object.entries(feedback.suggestions).map(([aspect, suggestion]) => (
                                                <Card key={aspect}>
                                                    <CardContent className="p-4">
                                                        <h4 className="font-semibold capitalize mb-2">{aspect}:</h4>
                                                        <p className="text-sm text-gray-600">{suggestion}</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </div>
                </div>

                {/* Session Feedback */}
                <div className="space-y-4 mt-4">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-wide">
                                <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                                    📝
                                </div>
                                Session Feedback
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* Rating Section */}
                            {/* <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                        RATING
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    How would you rate your email writing session?
                                </h3>

                                <div className="flex items-center gap-2 mb-2">
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        return (
                                            <button
                                                type="button"
                                                key={starValue}
                                                className={`text-3xl transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    starValue <= (hover || rating)
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                                onClick={() => setRating(starValue)}
                                                onMouseEnter={() => setHover(starValue)}
                                                onMouseLeave={() => setHover(0)}
                                            >
                                                <span className="sr-only">{starValue} Star</span>
                                                &#9733;
                                            </button>
                                        );
                                    })}
                                    <span className="ml-3 text-gray-600">
                                        {rating > 0 ? `${rating}/5 stars` : "Click to rate"}
                                    </span>
                                </div>
                                {rating > 0 && (
                                    <div className="text-sm text-gray-600">
                                        {rating === 1 && "Needs significant improvement"}
                                        {rating === 2 && "Below average performance"}
                                        {rating === 3 && "Average performance"}
                                        {rating === 4 && "Good performance"}
                                        {rating === 5 && "Excellent performance"}
                                    </div>
                                )}
                            </div> */}

                            {/* <Separator className="my-6" /> */}

                            {/* Notes Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        NOTES
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Additional notes about your email writing experience
                                </h3>

                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Share your thoughts about the email writing session, areas you'd like to improve, or any challenges you faced..."
                                    rows={6}
                                    className="resize-none mb-2"
                                />
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>{notes.length} characters</span>
                                    <span>Optional - Share your experience</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <Card className="mt-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-gray-600 text-center sm:text-left">
                                <p className="text-sm">
                                    Complete each email scenario to improve your professional communication skills.
                                </p>
                            </div>
                             <Button 
                                            onClick={handleSubmitEmail}
                                            disabled={loading || !emailData.subject.trim() || !emailData.body.trim()}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Submit
                                                </>
                                            )}
                                        </Button>
                            {/* <Button
                                onClick={() => {
                                    console.log("Session feedback:", { rating, notes });
                                    // Handle session completion
                                }}
                                size="lg"
                                className="flex items-center gap-2"
                            >
                                <span>✓</span>
                                Complete Session
                            </Button> */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmailWritingSkillsSession;
