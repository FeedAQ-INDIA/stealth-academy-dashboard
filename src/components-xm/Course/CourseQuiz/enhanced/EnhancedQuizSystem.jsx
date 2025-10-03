import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  QuizTaking, 
  QuizResults, 
  QuizHistory, 
  QuizManagement 
} from './index.js';
 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Clock, 
  BookOpen, 
  Settings,
  History,
  Play,
  AlertCircle
} from "lucide-react";
import axiosConn from "@/axioscon.js";
import { toast } from "@/components/hooks/use-toast.js";
import { useAuthStore } from "@/zustland/store.js";
import PropTypes from 'prop-types';

const EnhancedQuizSystem = ({ userRole = 'student' }) => {
  const { CourseId, CourseQuizId } = useParams();
  const navigate = useNavigate();
  const { userDetail } = useAuthStore();
  
  // State management
  const [currentView, setCurrentView] = useState('overview'); // overview, taking, results, history, management
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAttempts, setUserAttempts] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load quiz data on component mount
  useEffect(() => {
    if (CourseQuizId) {
      loadQuizData();
      loadUserAttempts();
    }
  }, [CourseQuizId, loadQuizData, loadUserAttempts]);

  const loadQuizData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load quiz details
      const quizResponse = await axiosConn.post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 1,
        offset: 0,
        getThisData: {
          datasource: "CourseQuiz",
          attributes: [],
          where: { courseContentId: CourseQuizId }
        },
      });

      const quizData = quizResponse.data.data?.results?.[0];
      if (!quizData) {
        throw new Error('Quiz not found');
      }
      
      setQuiz(quizData);

      // Load quiz questions
      const questionsResponse = await axiosConn.post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 50,
        offset: 0,
        getThisData: {
          datasource: "QuizQuestion",
          attributes: [],
          where: { courseQuizId: quizData.courseQuizId }
        },
      });

      const questionsData = questionsResponse.data.data?.results || [];
      setQuestions(questionsData.sort((a, b) => a.questionSequence - b.questionSequence));
      
    } catch (error) {
      console.error('Error loading quiz data:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [CourseQuizId]);

  const loadUserAttempts = useCallback(async () => {
    try {
      const response = await axiosConn.post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 10,
        offset: 0,
        getThisData: {
          datasource: "QuizResultLog",
          attributes: [],
          where: { 
            courseQuizId: CourseQuizId,
            userId: userDetail.userId 
          }
        },
      });

      const attempts = response.data.data?.results || [];
      setUserAttempts(attempts);
      
      if (attempts.length > 0) {
        setLatestResult(attempts[attempts.length - 1]);
      }
      
    } catch (error) {
      console.error('Error loading user attempts:', error);
    }
  }, [CourseQuizId, userDetail.userId]);

  const handleStartQuiz = () => {
    setCurrentView('taking');
  };

  const handleSubmitQuiz = async (answers, isAutoSubmit = false) => {
    try {
      setIsSubmitting(true);
      
      const submissionList = Object.entries(answers).map(([quizQuestionId, answerList]) => ({
        quizQuestionId: parseInt(quizQuestionId),
        answerList: Array.isArray(answerList) ? answerList : [answerList],
      }));

      const response = await axiosConn.post(import.meta.env.VITE_API_URL + "/submitQuiz", {
        userId: userDetail.userId,
        courseId: CourseId,
        courseQuizId: quiz.courseQuizId,
        submissionList
      });

      const result = response.data?.data;
      setLatestResult(result);
      setCurrentView('results');
      
      // Reload attempts
      await loadUserAttempts();
      
      toast({
        title: isAutoSubmit ? "Time's up!" : "Quiz submitted!",
        description: isAutoSubmit 
          ? "Your quiz was automatically submitted when time ran out."
          : "Your answers have been recorded successfully."
      });
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeQuiz = async () => {
    try {
      // Clear previous results if needed
      await axiosConn.post(import.meta.env.VITE_API_URL + "/clearQuizResult", {
        userId: userDetail.userId,
        courseId: CourseId,
        courseQuizId: quiz.courseQuizId,
      });

      setCurrentView('taking');
      toast({
        title: "Quiz reset",
        description: "You can now retake the quiz."
      });
      
    } catch (error) {
      console.error('Error clearing quiz result:', error);
      toast({
        title: "Error",
        description: "Failed to reset quiz. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewResults = (attempt = null) => {
    if (attempt) {
      setLatestResult(attempt);
    }
    setCurrentView('results');
  };

  const handleShareResults = () => {
    if (navigator.share && latestResult) {
      navigator.share({
        title: `Quiz Results - ${quiz.courseQuizDescription}`,
        text: `I scored ${Math.round((latestResult.quizResultPoint / latestResult.totalPoints) * 100)}% on this quiz!`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      const text = `I scored ${Math.round((latestResult.quizResultPoint / latestResult.totalPoints) * 100)}% on the quiz: ${quiz.courseQuizDescription}`;
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Quiz results have been copied to your clipboard."
      });
    }
  };

  const handleDownloadCertificate = () => {
    // Implementation for certificate download
    toast({
      title: "Certificate",
      description: "Certificate download feature coming soon!"
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Quiz Not Found</h3>
          <p className="text-gray-500">The requested quiz could not be found.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Management view for instructors
  if (userRole === 'instructor' && currentView === 'management') {
    return (
      <QuizManagement
        quizzes={[quiz]}
        onCreateQuiz={() => {}}
        onUpdateQuiz={() => {}}
        onDeleteQuiz={() => {}}
        onDuplicateQuiz={() => {}}
        onViewAnalytics={() => {}}
      />
    );
  }

  // Render based on current view
  switch (currentView) {
    case 'taking':
      return (
        <QuizTaking
          quiz={quiz}
          questions={questions}
          onSubmit={handleSubmitQuiz}
          isSubmitting={isSubmitting}
        />
      );

    case 'results':
      return (
        <QuizResults
          quiz={quiz}
          result={latestResult}
          questions={questions}
          onRetake={handleRetakeQuiz}
          onShare={handleShareResults}
          onDownloadCertificate={handleDownloadCertificate}
        />
      );

    case 'history':
      return (
        <QuizHistory
          attempts={userAttempts}
          onViewResult={handleViewResults}
          onRetakeQuiz={handleRetakeQuiz}
          onDownloadCertificate={handleDownloadCertificate}
        />
      );

    default: // overview
      return (
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <Tabs value={currentView} onValueChange={setCurrentView}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="gap-2">
                <Trophy className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                History ({userAttempts.length})
              </TabsTrigger>
              {userRole === 'instructor' && (
                <TabsTrigger value="management" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Manage
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quiz Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-blue-50">
                        {quiz.courseQuizType === 'CERTIFICATION' ? (
                          <Trophy className="w-6 h-6 text-blue-600" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {quiz.courseQuizDescription || 'Course Quiz'}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{quiz.courseQuizType}</Badge>
                          {quiz.isQuizTimed && (
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="w-3 h-3" />
                              {quiz.courseQuizTimer} minutes
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{questions.length}</p>
                      <p className="text-sm text-gray-600">Questions</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{quiz.courseQuizPassPercent || 70}%</p>
                      <p className="text-sm text-gray-600">Pass Mark</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {quiz.isQuizTimed ? `${quiz.courseQuizTimer}m` : 'Unlimited'}
                      </p>
                      <p className="text-sm text-gray-600">Time Limit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Section */}
              <Card>
                <CardContent className="py-6">
                  <div className="text-center space-y-4">
                    {userAttempts.length === 0 ? (
                      <>
                        <h3 className="text-xl font-semibold">Ready to start?</h3>
                        <p className="text-gray-600">
                          Take your time and read each question carefully. Good luck!
                        </p>
                        <Button 
                          onClick={handleStartQuiz} 
                          size="lg" 
                          className="gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Start Quiz
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold">Quiz Completed</h3>
                        <p className="text-gray-600">
                          You&apos;ve completed this quiz. View your results or retake if allowed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button 
                            onClick={() => handleViewResults()} 
                            variant="outline"
                            className="gap-2"
                          >
                            View Latest Results
                          </Button>
                          <Button 
                            onClick={handleRetakeQuiz} 
                            className="gap-2"
                          >
                            Retake Quiz
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Instructions:</strong> Make sure you have a stable internet connection. 
                  {quiz.isQuizTimed && ` This quiz has a ${quiz.courseQuizTimer}-minute time limit.`}
                  {' '}You need {quiz.courseQuizPassPercent || 70}% to pass.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="history">
              <QuizHistory
                attempts={userAttempts.map(attempt => ({
                  quizId: attempt.resultId,
                  quizTitle: quiz.courseQuizDescription,
                  quizType: quiz.courseQuizType,
                  scorePercentage: Math.round((attempt.score / attempt.totalQuestions) * 100),
                  correctAnswers: attempt.correctAnswers,
                  totalQuestions: attempt.totalQuestions,
                  timeTaken: attempt.timeTaken,
                  completedAt: attempt.result_created_at,
                  isPassed: attempt.isPassed,
                }))}
                onViewResult={handleViewResults}
                onRetakeQuiz={handleRetakeQuiz}
                onDownloadCertificate={handleDownloadCertificate}
              />
            </TabsContent>
          </Tabs>
        </div>
      );
  }
};

EnhancedQuizSystem.propTypes = {
  userRole: PropTypes.oneOf(['student', 'instructor']),
};

export default EnhancedQuizSystem;