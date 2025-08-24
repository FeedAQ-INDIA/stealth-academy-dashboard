import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {
    Check,
    Trophy,
    Clock,
    Play,
    CheckCircle2,
    XCircle,
    RotateCcw,
    BookOpen,
    AlertCircle,
    Timer
} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import QuizQuestionCard from "@/components-xm/Course/CourseQuiz/QuizQuestionCard.jsx";
import QuizResultReview from "@/components-xm/Course/QuizResultReview.jsx";
import {useAuthStore} from "@/zustland/store.js";
import {Progress} from "@/components/ui/progress.jsx";
import {Alert, AlertDescription} from "@/components/ui/alert.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";

function QuizRender({saveUserEnrollmentData, deleteUserEnrollmentData, fetchCourseVideo, courseQuizDetail}) {
    const {CourseId, CourseQuizId} = useParams();
    const {
        userEnrollmentObj,
        userCourseContentProgress,
        fetchUserCourseContentProgress,
        isUserEnrolledAlready,
        courseList,
        enroll,
        disroll,
        enrollStatus
    } = useCourse();
    const { userDetail } = useAuthStore();

    const [courseQuizQuestion, setCourseQuizQuestion] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [serverResult, setServerResult] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (courseList && CourseQuizId) {
            fetchCourseQuizQuestion();
            fetchAttemptedCourseVideo();
        }
    }, [CourseQuizId]);

    const fetchCourseQuizQuestion = async () => {
        try {
            const res = await axiosConn.post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: 50,
                offset: 0,
                getThisData: {
                    datasource: "QuizQuestion",
                    attributes: [],
                    where: {courseQuizId: courseQuizDetail.courseQuizId}
                },
            });

            const quizQues = res.data.data?.results || [];
            setCourseQuizQuestion(quizQues);
        } catch (err) {
            console.error(err);
            toast({
                title: "Error loading quiz",
                description: "Failed to load quiz questions. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAttemptedCourseVideo = async () => {
        try {
            const res = await axiosConn.post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: 1,
                offset: 0,
                getThisData: {
                    datasource: "QuizResultLog",
                    attributes: [],
                    where: {courseQuizId: courseQuizDetail.courseQuizId, userId: userDetail.userId}
                },
            });

            const attempt = res.data.data?.results || [];
            if (attempt.length > 0) {
                setServerResult(attempt[0]);
                setSubmitted(true);
            } else {
                setSubmitted(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateAnswer = (questionId, answers) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answers
        }));
    };

    // Helper function to check if a question has valid answers
    const hasValidAnswer = (answers) => {
        if (!answers) return false;

        // If answers is an array, check if it has at least one non-empty element
        if (Array.isArray(answers)) {
            return answers.length > 0 && answers.some(answer =>
                answer !== null && answer !== undefined && answer !== ""
            );
        }

        // If answers is a string or other type, check if it's not empty
        return answers !== null && answers !== undefined && answers !== "";
    };

    const handleSubmit = async () => {
        // Filter out questions with valid answers only
        const validAnswers = Object.entries(selectedAnswers).filter(([questionId, answers]) =>
            hasValidAnswer(answers)
        );

        if (validAnswers.length === 0) {
            toast({
                title: "No answers selected",
                description: "Please answer at least one question before submitting.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        const submissionList = validAnswers.map(([quizQuestionId, answerList]) => ({
            quizQuestionId,
            answerList,
        }));

        try {
            const res = await axiosConn.post(import.meta.env.VITE_API_URL + "/submitQuiz", {
                userId: userDetail.userId,
                courseId: CourseId,
                courseQuizId: courseQuizDetail.courseQuizId,
                submissionList
            });

            setServerResult(res.data?.data);
            setSubmitted(true);
            toast({
                title: "Quiz submitted successfully!",
                description: "Your answers have been recorded."
            });
            saveUserEnrollmentData();
        } catch (err) {
            console.error(err);
            toast({
                title: "Error submitting quiz",
                description: "Failed to submit your answers. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetake = async () => {
        try {
            await axiosConn.post(import.meta.env.VITE_API_URL + "/clearQuizResult", {
                userId: userDetail.userId,
                courseId: CourseId,
                courseQuizId: courseQuizDetail.courseQuizId,
            });

            fetchCourseVideo();
            deleteUserEnrollmentData();
            setSelectedAnswers({});
            setSubmitted(false);
            setServerResult(null);
            setQuizStarted(false);

            toast({
                title: "Quiz reset successfully!",
                description: "You can now retake the quiz."
            });

            navigate(`/course/${CourseId}/quiz/${CourseQuizId}`);
        } catch (err) {
            console.error(err);
            toast({
                title: "Error resetting quiz",
                description: "Failed to reset quiz. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        // Set timer if quiz has time limit (you can add this feature)
        // setTimeRemaining(quizTimeLimit * 60); // Convert minutes to seconds
    };

    const totalMarks = courseQuizQuestion.reduce((acc, curr) => acc + curr.quizQuestionPosPoint, 0);

    // Fixed: Only count questions with valid answers
    const answeredQuestions = Object.entries(selectedAnswers).filter(([questionId, answers]) =>
        hasValidAnswer(answers)
    ).length;

    const progressPercentage = courseQuizQuestion.length > 0 ? (answeredQuestions / courseQuizQuestion.length) * 100 : 0;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-6">
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-3/4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="space-y-6">
                <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                            <CardTitle className="text-green-800">Quiz Completed!</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-green-700">
                            Great job! You've successfully submitted your quiz. Review your results below.
                        </p>
                    </CardContent>
                </Card>

                <QuizResultReview
                    result={serverResult}
                    questionMap={Object.fromEntries(courseQuizQuestion.map(q => [q.quizQuestionId, q]))}
                />

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">Want to try again?</h3>
                                <p className="text-muted-foreground">
                                    You can retake this quiz to improve your score.
                                </p>
                            </div>
                            <Button
                                onClick={handleRetake}
                                variant="outline"
                                className="gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Retake Quiz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!quizStarted) {
        return (
            <div className="space-y-6">
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-blue-600" />
                            <CardTitle className="text-blue-800">Ready to Start Quiz?</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Questions</p>
                                    <p className="text-sm text-muted-foreground">
                                        {courseQuizQuestion.length} questions
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Total Marks</p>
                                    <p className="text-sm text-muted-foreground">
                                        {totalMarks} points
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Time Limit</p>
                                    <p className="text-sm text-muted-foreground">
                                        No time limit
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Make sure you have a stable internet connection before starting the quiz.
                                You can review your answers before submitting.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleStartQuiz}
                            className="w-full gap-2"
                            size="lg"
                        >
                            <Play className="w-4 h-4" />
                            Start Quiz
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Quiz Progress Header */}
            <Card className="sticky top-14 z-40 bg-white/95 backdrop-blur-sm border-b-2">
                <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="gap-1">
                                <Trophy className="w-3 h-3" />
                                Quiz in Progress
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                Total Marks: <span className="font-semibold">{totalMarks}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Progress:</span>
                            <span className="font-medium">
                                {answeredQuestions}/{courseQuizQuestion.length}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Questions Answered</span>
                            <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Quiz Questions */}
            <div className="space-y-4">
                {courseQuizQuestion.map((q, index) => (
                    <Card key={q.quizQuestionId} className="transition-all hover:shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                                <Badge variant="outline" className="mt-1">
                                    Q{index + 1}
                                </Badge>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-muted-foreground">
                                            {q.quizQuestionPosPoint} {q.quizQuestionPosPoint === 1 ? 'mark' : 'marks'}
                                        </span>
                                        {hasValidAnswer(selectedAnswers[q.quizQuestionId]) && (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <QuizQuestionCard
                                question={q}
                                onAnswerChange={updateAnswer}
                                questionNumber={index + 1}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Submit Section */}
            <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="py-6">
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Ready to Submit?</h3>
                            <p className="text-muted-foreground">
                                You have answered {answeredQuestions} out of {courseQuizQuestion.length} questions.
                            </p>
                        </div>

                        {answeredQuestions < courseQuizQuestion.length && (
                            <Alert className="text-left">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    You haven't answered all questions yet. You can still submit, but unanswered questions will be marked as incorrect.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            onClick={handleSubmit}
                            className="w-full sm:w-auto gap-2"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Submit Quiz
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default QuizRender;