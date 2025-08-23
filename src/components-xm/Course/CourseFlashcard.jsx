import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge.jsx";
import { 
    Check, 
    CircleArrowLeft, 
    CircleArrowRight, 
    Zap, 
    RotateCcw, 
    Eye, 
    EyeOff,
    Trophy,
    CheckCircle2,
    Undo2,
    Shuffle
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import { toast } from "@/components/hooks/use-toast.js";
import { useAuthStore } from "@/zustland/store.js";
import { Progress } from "@/components/ui/progress.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

function CourseFlashcard() {
    const { userDetail } = useAuthStore();
    const { CourseId, CourseFlashcardId } = useParams();
    const {
        userCourseEnrollment,
        userCourseContentProgress,
        fetchUserCourseContentProgress,
        fetchUserCourseEnrollment,
        courseList
    } = useCourse();

    const [courseFlashcardDetail, setCourseFlashcardDetail] = useState({});
    const [flashcards, setFlashcards] = useState([]);
    const [courseTopicContent, setCourseTopicContent] = useState({});
    const [prevContent, setPrevContent] = useState({});
    const [nextContent, setNextContent] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [flippedCards, setFlippedCards] = useState(new Set());
    const [completedCards, setCompletedCards] = useState(new Set());
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        if (courseList && CourseFlashcardId) {
            fetchCourseFlashcard();
        }
    }, [courseList, userCourseEnrollment, CourseFlashcardId]);

    const fetchCourseFlashcard = async () => {
        setIsLoading(true);
        try {
            // Fetch flashcard set details
            const flashcardSetRes = await axiosConn.post(
                import.meta.env.VITE_API_URL + "/searchCourse",
                {
                    limit: 10,
                    offset: 0,
                    getThisData: {
                        datasource: "CourseFlashcard",
                        attributes: [],
                        where: { courseFlashcardId: CourseFlashcardId },
                    },
                }
            );

            const flashcardSet = flashcardSetRes.data.data?.results?.[0];
            setCourseFlashcardDetail(flashcardSet);

            // Fetch individual flashcards
            const flashcardsRes = await axiosConn.post(
                import.meta.env.VITE_API_URL + "/searchCourse",
                {
                    limit: 100,
                    offset: 0,
                    getThisData: {
                        datasource: "Flashcard",
                        attributes: [],
                        where: { courseFlashcardId: CourseFlashcardId },
                    },
                }
            );

            const flashcardsList = flashcardsRes.data.data?.results || [];
            setFlashcards(flashcardsList);

            // Find the content from the courseContent structure
            const content = courseList?.courseContent?.find(
                a => a.courseContentId === flashcardSet?.courseContentId
            );
            setCourseTopicContent(content || {});

            // Find previous and next content
            const currentIndex = courseList?.courseContent?.findIndex(
                a => a.courseContentId === flashcardSet?.courseContentId
            );
            
            if (currentIndex !== -1) {
                const prev = currentIndex > 0 ? courseList.courseContent[currentIndex - 1] : null;
                const next = currentIndex < courseList.courseContent.length - 1 
                    ? courseList.courseContent[currentIndex + 1] : null;
                
                setPrevContent(prev || {});
                setNextContent(next || {});
            }

        } catch (err) {
            console.error("Error fetching flashcard data:", err);
            toast({
                title: "Error",
                description: "Failed to load flashcard content",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const saveUserProgress = () => {
        if (!courseList?.courseId || !courseFlashcardDetail?.courseContentId) return;

        axiosConn
            .post(import.meta.env.VITE_API_URL + "/saveUserCourseContentProgress", {
                courseId: courseList.courseId,
                courseContentId: courseFlashcardDetail.courseContentId,
                logStatus: 'COMPLETED'
            })
            .then((res) => {
                toast({
                    title: "Progress saved!",
                    description: "Flashcard set marked as completed successfully."
                });
                fetchUserCourseContentProgress(userDetail.userId);
                fetchUserCourseEnrollment(userDetail.userId);
            })
            .catch((err) => {
                console.error(err);
                toast({
                    title: "Error",
                    description: "Failed to update progress. Please try again.",
                    variant: "destructive"
                });
            });
    };

    const deleteUserProgress = () => {
        if (!courseList?.courseId || !courseFlashcardDetail?.courseContentId) return;

        axiosConn
            .post(import.meta.env.VITE_API_URL + "/deleteUserCourseContentProgress", {
                courseId: courseList.courseId,
                courseContentId: courseFlashcardDetail.courseContentId
            })
            .then((res) => {
                toast({
                    title: "Progress updated",
                    description: "Content marked as incomplete successfully."
                });
                fetchUserCourseContentProgress(userDetail.userId);
                fetchUserCourseEnrollment(userDetail.userId);
            })
            .catch((err) => {
                console.error(err);
                toast({
                    title: "Error",
                    description: "Failed to update progress. Please try again.",
                    variant: "destructive"
                });
            });
    };

    const isCompleted = userCourseContentProgress?.some(
        (progress) => 
            progress.courseId == CourseId &&
            progress.courseContentId == courseFlashcardDetail?.courseContentId &&
            progress.progressStatus === "COMPLETED"
    );

    const handleFlipCard = (cardIndex) => {
        const newFlipped = new Set(flippedCards);
        if (newFlipped.has(cardIndex)) {
            newFlipped.delete(cardIndex);
        } else {
            newFlipped.add(cardIndex);
        }
        setFlippedCards(newFlipped);
    };

    const handleMarkAsKnown = (cardIndex) => {
        const newCompleted = new Set(completedCards);
        newCompleted.add(cardIndex);
        setCompletedCards(newCompleted);
        
        toast({
            title: "✅ Marked as Known",
            description: "Great job! Keep going!"
        });
    };

    const handleMarkAsUnknown = (cardIndex) => {
        const newCompleted = new Set(completedCards);
        newCompleted.delete(cardIndex);
        setCompletedCards(newCompleted);
    };

    const handleShuffle = () => {
        const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setFlippedCards(new Set());
    };

    const handleReset = () => {
        setFlippedCards(new Set());
        setCompletedCards(new Set());
    };

    const handleFlipAll = () => {
        if (flippedCards.size === flashcards.length) {
            setFlippedCards(new Set());
        } else {
            setFlippedCards(new Set(Array.from({length: flashcards.length}, (_, i) => i)));
        }
    };

    const getContentUrlFromType = (content) => {
        const urlMap = {
            'CourseVideo': 'video',
            'CourseWritten': 'doc',
            'CourseQuiz': 'quiz',
            'CourseFlashcard': 'flashcard'
        };
        return urlMap[content?.courseContentType] || '';
    };

    const filteredFlashcards = flashcards.filter(card => {
        if (difficultyFilter === 'all') return true;
        return card.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
    });

    const progressPercentage = flashcards.length > 0 
        ? Math.round((completedCards.size / flashcards.length) * 100) 
        : 0;

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-64 w-full" />
                <div className="flex space-x-2">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                </div>
            </div>
        );
    }

    // Individual card component with enhanced animations
    const FlashcardItem = ({ card, index }) => {
        const isFlipped = flippedCards.has(index);
        const isCompleted = completedCards.has(index);

        return (
            <div 
                className="group perspective-1000 h-72 cursor-pointer"
                onClick={() => handleFlipCard(index)}
            >
                <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:scale-105 ${
                        isFlipped ? 'rotate-y-180' : ''
                    }`}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        transition: 'transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}
                >
                    {/* Front of card (Question) */}
                    <Card 
                        className={`absolute inset-0 w-full h-full backface-hidden shadow-xl border-2 transition-all duration-300 ${
                            isCompleted 
                                ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-100 shadow-green-200/50' 
                                : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl'
                        }`}
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)'
                        }}
                    >
                        <CardContent className="p-4 sm:p-6 h-full flex flex-col justify-between relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 transform translate-x-8 -translate-y-8"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-100 to-pink-100 rounded-full opacity-20 transform -translate-x-6 translate-y-6"></div>

                            <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                                <Badge 
                                    variant="outline" 
                                    className={`text-xs font-medium shadow-sm ${
                                        card.difficulty === 'EASY' ? 'bg-green-100 text-green-800 border-green-300' :
                                        card.difficulty === 'HARD' ? 'bg-red-100 text-red-800 border-red-300' :
                                        'bg-yellow-100 text-yellow-800 border-yellow-300'
                                    }`}
                                >
                                    {card.difficulty || 'MEDIUM'}
                                </Badge>
                                <div className="flex items-center gap-2">
                                    {isCompleted && (
                                        <div className="animate-bounce">
                                            <CheckCircle2 size={16} className="text-green-600" />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <EyeOff size={14} className="animate-pulse" />
                                        <span className="text-xs hidden sm:inline font-medium">Question</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center text-center px-2 relative z-10">
                                <div className="space-y-3 w-full">
                                    <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                                        {card.question}
                                    </div>
                                    <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
                                </div>
                            </div>

                            <div className="mt-4 text-center relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    <p className="text-xs text-blue-700 font-medium">
                                        <span className="hidden sm:inline">Click to reveal answer</span>
                                        <span className="sm:hidden">Tap for answer</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Back of card (Answer) */}
                    <Card 
                        className={`absolute inset-0 w-full h-full backface-hidden shadow-xl border-2 transition-all duration-300 ${
                            isCompleted 
                                ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-100 shadow-green-200/50' 
                                : 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-2xl'
                        }`}
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        <CardContent className="p-4 sm:p-6 h-full flex flex-col justify-between relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 transform translate-x-10 -translate-y-10"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full opacity-20 transform -translate-x-8 translate-y-8"></div>

                            <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                                <Badge 
                                    variant="outline" 
                                    className="text-xs font-medium bg-blue-100 text-blue-800 border-blue-300 shadow-sm"
                                >
                                    Answer
                                </Badge>
                                <div className="flex items-center gap-2">
                                    {isCompleted && (
                                        <div className="animate-bounce">
                                            <CheckCircle2 size={16} className="text-green-600" />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-sm text-blue-600">
                                        <Eye size={14} />
                                        <span className="text-xs hidden sm:inline font-medium">Revealed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center text-center px-2 relative z-10">
                                <div className="space-y-3 w-full">
                                    <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                                        {card.answer}
                                    </div>
                                    
                                    {card.explanation && (
                                        <div className="mt-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200 shadow-sm">
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                <span className="font-semibold text-blue-700">💡 Explanation:</span> {card.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 relative z-10">
                                <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkAsUnknown(index);
                                    }}
                                    className="flex-1 text-orange-600 border-orange-300 bg-orange-50 hover:bg-orange-100 text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105"
                                >
                                    <RotateCcw size={14} className="mr-1" />
                                    <span className="hidden sm:inline">Need Practice</span>
                                    <span className="sm:hidden">Practice</span>
                                </Button>
                                <Button 
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkAsKnown(index);
                                    }}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                                >
                                    <Check size={14} className="mr-1" />
                                    <span className="hidden sm:inline">I Know This</span>
                                    <span className="sm:hidden">Know It</span>
                                </Button>
                            </div>

                            <div className="mt-3 text-center relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <p className="text-xs text-gray-600 font-medium">
                                        <span className="hidden sm:inline">Click to show question</span>
                                        <span className="sm:hidden">Tap for question</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-[calc(100svh-4em)] bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white/80 backdrop-blur-sm border-b z-10">
                <div className="flex items-center gap-2 px-4 w-full">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb className="flex-1">
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <Link to={`/course/${CourseId}`}>Course</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-2">
                                    <Zap size={16} />
                                    <span className="truncate">{courseTopicContent?.courseContentTitle || 'Flashcards'}</span>
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="p-3 sm:p-4 lg:p-6">
                {/* Enhanced flashcard info section */}
                <div className="mx-auto mb-6">
                    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative overflow-hidden">
                        {/* Animated background elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-200 to-pink-200 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>
                        
                        <CardHeader className="pb-4 relative z-10">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                                        <Zap size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent line-clamp-2">
                                            {courseFlashcardDetail?.setTitle || 'Flashcard Set'}
                                        </CardTitle>
                                        {courseFlashcardDetail?.setDescription && (
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                                                {courseFlashcardDetail.setDescription}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Enhanced progress indicator */}
                                <div className="flex items-center gap-3 text-sm">
                                    <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-300 font-semibold shadow-sm">
                                        {completedCards.size} / {flashcards.length} completed
                                    </Badge>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-green-700 font-bold">{progressPercentage}%</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0 relative z-10">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                                        {flashcards.length}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Cards</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                                        {courseFlashcardDetail?.setDifficulty || 'MEDIUM'}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Difficulty</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                                        {courseFlashcardDetail?.setCategory || 'Study'}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Category</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="text-xl sm:text-2xl font-bold text-yellow-600 animate-pulse">
                                        {progressPercentage}%
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Progress</div>
                                </div>
                            </div>

                            {/* Enhanced progress bar */}
                            <div className="space-y-2 mb-4">
                                <div className="relative">
                                    <Progress value={progressPercentage} className="h-3 bg-gray-200" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full opacity-20 animate-pulse"></div>
                                </div>
                            </div>

                            {/* Enhanced tags */}
                            {courseFlashcardDetail?.setTags && courseFlashcardDetail.setTags.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Tags:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {courseFlashcardDetail.setTags.map((tag, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="secondary" 
                                                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium border border-blue-200 hover:shadow-sm transition-all duration-200"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Flashcard study interface */}
                <div className="  mx-auto space-y-4 sm:space-y-6">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                <span className="font-semibold text-gray-700">
                                    {filteredFlashcards.length} flashcards
                                </span>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
                                <Trophy size={14} className="text-yellow-500" />
                                <span className="text-xs font-medium text-blue-700">
                                    {completedCards.size} mastered
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleFlipAll} 
                                className="text-xs sm:text-sm transition-all duration-200 hover:scale-105 bg-white/80 hover:bg-white border-gray-300 hover:border-blue-400 hover:text-blue-600"
                            >
                                {flippedCards.size === flashcards.length ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                                <span className="hidden sm:inline">{flippedCards.size === flashcards.length ? 'Hide All' : 'Show All'}</span>
                                <span className="sm:hidden">{flippedCards.size === flashcards.length ? 'Hide' : 'Show'}</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleShuffle} 
                                className="text-xs sm:text-sm transition-all duration-200 hover:scale-105 bg-white/80 hover:bg-white border-gray-300 hover:border-purple-400 hover:text-purple-600"
                            >
                                <Shuffle size={14} className="mr-1" />
                                <span className="hidden sm:inline">Shuffle</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleReset} 
                                className="text-xs sm:text-sm transition-all duration-200 hover:scale-105 bg-white/80 hover:bg-white border-gray-300 hover:border-orange-400 hover:text-orange-600"
                            >
                                <RotateCcw size={14} className="mr-1" />
                                <span className="hidden sm:inline">Reset</span>
                            </Button>
                        </div>
                    </div>

                    {/* Flashcards Grid */}
                    {filteredFlashcards.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {filteredFlashcards.map((card, index) => (
                                <div 
                                    key={card.flashcardId || index}
                                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <FlashcardItem card={card} index={index} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-6 sm:p-8 text-center shadow-lg border-dashed border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white">
                            <CardContent>
                                <div className="text-gray-500 space-y-4">
                                    <div className="relative">
                                        <Zap size={48} className="mx-auto text-gray-300" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin opacity-50"></div>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">No flashcards found</h3>
                                    <p className="text-sm text-gray-600">Try adjusting your filters or check back later.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Study completion stats */}
                    {completedCards.size > 0 && (
                        <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-blue-50 border-2 border-green-200 shadow-lg animate-in fade-in slide-in-from-left-4 duration-500">
                            <CardContent className="p-4 relative overflow-hidden">
                                {/* Animated background pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400 to-blue-400 transform rotate-12 scale-150"></div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Trophy className="text-yellow-500 animate-pulse" size={24} />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 border-2 border-yellow-400 rounded-full animate-ping opacity-20"></div>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-sm sm:text-base bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                            Study Progress
                                        </span>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <div className="text-xl font-bold text-green-600 animate-pulse">
                                            {completedCards.size} / {filteredFlashcards.length}
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium">
                                            {progressPercentage}% Complete
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Completion celebration */}
                    {completedCards.size === filteredFlashcards.length && filteredFlashcards.length > 0 && (
                        <Card className="bg-gradient-to-r from-green-100 via-emerald-50 to-blue-100 border-2 border-green-300 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <CardContent className="p-4 sm:p-6 text-center relative overflow-hidden">
                                {/* Celebratory background elements */}
                                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                    <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="absolute top-6 right-8 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                                    <div className="absolute bottom-4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                                    <div className="absolute bottom-8 right-4 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.7s'}}></div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="relative">
                                        <Trophy className="mx-auto text-yellow-500 animate-bounce" size={56} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 border-4 border-yellow-300 rounded-full animate-pulse opacity-30"></div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                        🎉 Outstanding Achievement! 🎉
                                    </h3>
                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                        Congratulations! You've successfully mastered all <span className="font-bold text-green-600">{filteredFlashcards.length}</span> flashcards in this set. 
                                        <br className="hidden sm:inline" />
                                        Your dedication to learning is truly impressive!
                                    </p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                                        <Button 
                                            onClick={handleReset} 
                                            variant="outline" 
                                            size="sm"
                                            className="transition-all duration-200 hover:scale-105 bg-white/80 hover:bg-white border-gray-300 hover:border-blue-400"
                                        >
                                            <RotateCcw size={16} className="mr-2" />
                                            Study Again
                                        </Button>
                                        <Button 
                                            onClick={saveUserProgress} 
                                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105 shadow-lg" 
                                            size="sm"
                                        >
                                            <CheckCircle2 size={16} className="mr-2" />
                                            Mark Complete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Navigation to prev/next content */}
                <div className="max-w-7xl mx-auto mt-6 sm:mt-8 space-y-4">
                    <Separator />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            {isCompleted ? (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={deleteUserProgress}
                                    className="flex items-center gap-2"
                                >
                                    <Undo2 size={16} />
                                    <span className="hidden sm:inline">Mark as Incomplete</span>
                                    <span className="sm:hidden">Incomplete</span>
                                </Button>
                            ) : (
                                <Button 
                                    size="sm" 
                                    onClick={saveUserProgress}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle2 size={16} />
                                    <span className="hidden sm:inline">Mark as Complete</span>
                                    <span className="sm:hidden">Complete</span>
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {prevContent?.courseContentId && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/course/${CourseId}/${getContentUrlFromType(prevContent)}/${prevContent.courseContentId}`}>
                                        <CircleArrowLeft size={16} className="mr-1" />
                                        <span className="hidden sm:inline">Previous</span>
                                        <span className="sm:hidden">Prev</span>
                                    </Link>
                                </Button>
                            )}
                            
                            {nextContent?.courseContentId && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/course/${CourseId}/${getContentUrlFromType(nextContent)}/${nextContent.courseContentId}`}>
                                        <span className="hidden sm:inline">Next</span>
                                        <span className="sm:hidden">Next</span>
                                        <CircleArrowRight size={16} className="ml-1" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseFlashcard;
