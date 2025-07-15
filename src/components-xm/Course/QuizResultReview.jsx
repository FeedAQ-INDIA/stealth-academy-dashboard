import {useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Progress} from "@/components/ui/progress.jsx";
import {
    Trophy,
    CheckCircle2,
    XCircle,
    Target,
    Award,
    BookOpen,
    TrendingUp,
    AlertCircle,
    Check,
    X
} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert.jsx";
import {Separator} from "@/components/ui/separator.jsx";

export default function QuizResultReview({ result, questionMap }) {
    useEffect(() => {
        console.log(result);
        console.log(questionMap);
    }, []);

    if (!result || !questionMap) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No results available to display.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const scorePercentage = result.totalPoints > 0 ? Math.round((result.quizResultPoint / result.totalPoints) * 100) : 0;
    const correctAnswers = result.quizResultSnapshot?.filter(q => q.isAnswerCorrect).length || 0;
    const totalQuestions = result.quizResultSnapshot?.length || 0;
    const incorrectAnswers = totalQuestions - correctAnswers;

    // Performance evaluation
    const getPerformanceLevel = (percentage) => {
        if (percentage >= 90) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" };
        if (percentage >= 80) return { level: "Very Good", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
        if (percentage >= 70) return { level: "Good", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
        if (percentage >= 60) return { level: "Average", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" };
        return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
    };

    const performance = getPerformanceLevel(scorePercentage);

    return (
        <div className="space-y-6">
            {/* Overall Results Card */}
            <Card className={`${performance.bgColor} ${performance.borderColor} border-2`}>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${performance.bgColor}`}>
                            <Trophy className={`w-8 h-8 ${performance.color}`} />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">Quiz Results</CardTitle>
                            <p className={`text-lg font-semibold ${performance.color}`}>
                                {performance.level}
                            </p>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                            <div className="text-center space-y-2">
                                <div className="text-4xl font-bold">
                                    <span className={performance.color}>{result.quizResultPoint}</span>
                                    <span className="text-2xl text-muted-foreground">/{result.totalPoints}</span>
                                </div>
                                <p className="text-lg text-muted-foreground">
                                    You scored <span className="font-semibold">{scorePercentage}%</span>
                                </p>
                            </div>
                        </div>
                        </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Score Display */}
                    {/*<div className="text-center space-y-2">*/}
                    {/*    <div className="text-4xl font-bold">*/}
                    {/*        <span className={performance.color}>{result.quizResultPoint}</span>*/}
                    {/*        <span className="text-2xl text-muted-foreground">/{result.totalPoints}</span>*/}
                    {/*    </div>*/}
                    {/*    <p className="text-lg text-muted-foreground">*/}
                    {/*        You scored <span className="font-semibold">{scorePercentage}%</span>*/}
                    {/*    </p>*/}
                    {/*</div>*/}

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Performance</span>
                            <span className="font-medium">{scorePercentage}%</span>
                        </div>
                        <Progress
                            value={scorePercentage}
                            className="h-3"
                        />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="font-semibold text-green-600">Correct</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="font-semibold text-red-600">Incorrect</span>
                            </div>
                            <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-blue-600">Total</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                        </div>
                    </div>

                    {/* Performance Message */}
                    {scorePercentage >= 80 ? (
                        <Alert className="bg-green-50 border-green-200">
                            <Trophy className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700">
                                Congratulations! You've demonstrated excellent understanding of the material.
                            </AlertDescription>
                        </Alert>
                    ) : scorePercentage >= 60 ? (
                        <Alert className="bg-yellow-50 border-yellow-200">
                            <TrendingUp className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-700">
                                Good work! Review the incorrect answers to improve your understanding.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className="bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700">
                                Consider reviewing the material and retaking the quiz to improve your score.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Detailed Question Review */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Question Review
                    </CardTitle>
                    <p className="text-muted-foreground">
                        Review each question to understand your performance
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {result.quizResultSnapshot?.map((q, index) => {
                            const question = questionMap[q.quizQuestionId];
                            const isCorrect = q.isAnswerCorrect;

                            return (
                                <Card key={q.quizQuestionId} className={`transition-all hover:shadow-md ${
                                    isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
                                }`}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start gap-3">
                                            <Badge variant="outline" className="mt-1">
                                                Q{index + 1}
                                            </Badge>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {isCorrect ? (
                                                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 gap-1">
                                                            <Check className="w-3 h-3" />
                                                            Correct
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 gap-1">
                                                            <X className="w-3 h-3" />
                                                            Incorrect
                                                        </Badge>
                                                    )}
                                                    <span className="text-xs text-muted-foreground">
                                                        {question?.quizQuestionPosPoint || 1} {(question?.quizQuestionPosPoint || 1) === 1 ? 'point' : 'points'}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-lg leading-tight">
                                                    {question?.quizQuestionTitle || "Question"}
                                                </h3>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* User's Answer */}
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm text-muted-foreground">Your Answer:</h4>
                                            <div className={`p-3 rounded-lg border ${
                                                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                            }`}>
                                                <div className="flex flex-wrap gap-2">
                                                    {q.answerList?.map((answer, idx) => (
                                                        <Badge
                                                            key={idx}
                                                            variant="outline"
                                                            className={isCorrect ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}
                                                        >
                                                            {answer}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Correct Answer (if different) */}
                                        {question?.quizQuestionCorrectAnswer && !isCorrect && (
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-sm text-green-700">Correct Answer:</h4>
                                                <div className="p-3 rounded-lg border bg-green-50 border-green-200">
                                                    <div className="flex flex-wrap gap-2">
                                                        {question.quizQuestionCorrectAnswer.map((answer, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                variant="outline"
                                                                className="border-green-300 text-green-700"
                                                            >
                                                                {answer}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Explanation (if available) */}
                                        {question?.quizQuestionExplanation && (
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-sm text-blue-700">Explanation:</h4>
                                                <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                                                    <p className="text-sm text-blue-800">
                                                        {question.quizQuestionExplanation}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Performance Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold">Strengths:</h4>
                            <ul className="space-y-1 text-sm">
                                {correctAnswers > 0 && (
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span>Answered {correctAnswers} questions correctly</span>
                                    </li>
                                )}
                                {scorePercentage >= 80 && (
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span>Excellent overall performance</span>
                                    </li>
                                )}
                                {scorePercentage >= 60 && scorePercentage < 80 && (
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span>Good understanding of key concepts</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold">Areas for Improvement:</h4>
                            <ul className="space-y-1 text-sm">
                                {incorrectAnswers > 0 && (
                                    <li className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-orange-600" />
                                        <span>Review {incorrectAnswers} incorrect answers</span>
                                    </li>
                                )}
                                {scorePercentage < 60 && (
                                    <li className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-orange-600" />
                                        <span>Consider revisiting the course material</span>
                                    </li>
                                )}
                                {scorePercentage < 80 && (
                                    <li className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-orange-600" />
                                        <span>Practice more to improve understanding</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}