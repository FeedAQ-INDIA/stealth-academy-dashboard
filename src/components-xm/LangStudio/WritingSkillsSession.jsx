import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Separator } from '@/components/ui/separator';
import { 
    PenTool, 
    BookOpen, 
    Target, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    FileText,
    Star,
    TrendingUp
} from 'lucide-react';
import { useCreditTransaction } from '@/components/CreditWidget.jsx';
import { useToast } from '@/components/hooks/use-toast.js';

const WritingSkillsSession = ({ 
    onClose, 
    sessionType = 'general' 
}) => {
    const { toast } = useToast();
    const [userResponse, setUserResponse] = useState('');
    const [sessionComplete, setSessionComplete] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState('');
    const [hover, setHover] = useState(0);

    const writingPrompt = {
        title: "Creative Writing",
        prompt: "Write a short story (150-200 words) about a character who discovers something unexpected in their daily routine.",
        timeLimit: 15,
        criteria: ["Creativity", "Grammar", "Structure", "Vocabulary"]
    };

    const currentPrompt = writingPrompt;
    const totalSteps = 1;
    const progress = 100; // Always 100% since there's only one exercise

    const handleSubmitResponse = async () => {
        if (!userResponse.trim()) {
            toast({
                title: "Response Required",
                description: "Please write your response before submitting.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        
        // Simulate AI feedback generation
        setTimeout(() => {
            const mockFeedback = {
                score: Math.floor(Math.random() * 30) + 70, // 70-100
                strengths: [
                    "Excellent vocabulary usage",
                    "Clear sentence structure",
                    "Engaging opening"
                ],
                improvements: [
                    "Consider varying sentence length",
                    "Add more descriptive details",
                    "Strengthen the conclusion"
                ],
                detailedAnalysis: {
                    grammar: Math.floor(Math.random() * 20) + 80,
                    creativity: Math.floor(Math.random() * 25) + 75,
                    structure: Math.floor(Math.random() * 20) + 80,
                    vocabulary: Math.floor(Math.random() * 15) + 85
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
        setUserResponse('');
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
                        Writing Skills Session Complete!
                    </CardTitle>
                    <p className="text-gray-600">
                        You've successfully completed all writing exercises
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="text-center p-4">
                            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <h3 className="font-semibold">Overall Progress</h3>
                            <p className="text-2xl font-bold text-blue-600">Excellent</p>
                        </Card>
                        <Card className="text-center p-4">
                            <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                            <h3 className="font-semibold">Exercises Completed</h3>
                            <p className="text-2xl font-bold text-yellow-600">{totalSteps}</p>
                        </Card>
                        <Card className="text-center p-4">
                            <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <h3 className="font-semibold">Skills Practiced</h3>
                            <p className="text-2xl font-bold text-purple-600">All</p>
                        </Card>
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                        <Button onClick={handleRestartSession} variant="outline">
                            <PenTool className="w-4 h-4 mr-2" />
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
        <div className="writing-skills-session min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-3">
            <div className="mx-auto">
                {/* Header */}
                <Card className="mb-4">
                    <CardHeader>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                                    <div className="bg-purple-100 text-purple-800 p-2 rounded-lg">
                                        ✍️
                                    </div>
                                    Writing Skills Session
                                </h1>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Develop your creative writing abilities
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-4">
                                    <Progress value={progress} className="w-32" />
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {currentPrompt?.timeLimit} min
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Writing Prompt */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
                                    📝
                                </div>
                                {currentPrompt?.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                                <p className="text-blue-800">{currentPrompt?.prompt}</p>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <strong>Evaluation Criteria:</strong> {currentPrompt?.criteria.join(', ')}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Writing Response */}
                    <div className="space-y-4">
                        {!feedback ? (
                            <Card>
                                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-wide">
                                        <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                                            🖋️
                                        </div>
                                        Your Response
                                    </CardTitle>
                                    <Badge variant="outline" className="self-start sm:self-center">
                                        Word Count: {userResponse.split(' ').filter(word => word.length > 0).length}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Write your response:</label>
                                        <Textarea
                                            value={userResponse}
                                            onChange={(e) => setUserResponse(e.target.value)}
                                            placeholder="Start writing your response here..."
                                            className="min-h-40 resize-none"
                                            maxLength={300}
                                        />
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Evaluation: {currentPrompt?.criteria.join(', ')}</span>
                                            <span>{userResponse.length}/300 characters</span>
                                        </div>
                                    </div>

                                     
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold text-green-700">Response Submitted!</span>
                                    </div>
                                </div>

                                <Tabs defaultValue="feedback" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="feedback">Feedback</TabsTrigger>
                                        <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
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
                                    
                                    <TabsContent value="analysis" className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(feedback.detailedAnalysis).map(([skill, score]) => (
                                                <Card key={skill}>
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-medium capitalize">{skill}</span>
                                                            <span className="font-bold">{score}%</span>
                                                        </div>
                                                        <Progress value={score} className="h-2" />
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
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                        RATING
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    How would you rate your writing session?
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
                            </div>

                            <Separator className="my-6" />

                            {/* Notes Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        NOTES
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Additional notes about your writing experience
                                </h3>

                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Share your thoughts about the writing session, areas you'd like to improve, or any challenges you faced..."
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
                                    Complete each writing exercise to enhance your creative expression and language skills.
                                </p>
                            </div>
                             <Button 
                                            onClick={handleSubmitResponse}
                                            disabled={loading || !userResponse.trim()}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Submit Response
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

export default WritingSkillsSession;
