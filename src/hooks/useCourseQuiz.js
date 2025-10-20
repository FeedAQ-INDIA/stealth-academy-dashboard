import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for Quiz components (CourseQuiz, QuizRender, EnhancedQuizSystem)
 * Handles quiz fetching, submission, and result management
 * 
 * @param {string} courseId - The course ID
 * @param {string} userId - The current user ID
 * @returns {Object} Hook state and actions
 */
export const useCourseQuiz = (courseId, userId) => {
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  // State management
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch quiz data by quiz ID
   * 
   * @param {string} quizId - Quiz ID
   */
  const fetchQuiz = useCallback(async (quizId) => {
    if (!quizId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(`${API_BASE_URL}/searchCourse`, {
        limit: 1,
        offset: 0,
        getThisData: {
          datasource: "Quiz",
          attributes: [],
          where: { quizId },
        },
      });

      if (response.data?.data?.results?.[0]) {
        setQuiz(response.data.data.results[0]);
        return response.data.data.results[0];
      }
      
      setQuiz(null);
      return null;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch quiz";
      setError(errorMessage);
      console.error("Fetch quiz error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setQuiz(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, toast]);

  /**
   * Fetch quiz questions
   * 
   * @param {string} quizId - Quiz ID
   */
  const fetchQuizQuestions = useCallback(async (quizId) => {
    if (!quizId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(`${API_BASE_URL}/searchCourse`, {
        limit: 100,
        offset: 0,
        getThisData: {
          datasource: "QuizQuestion",
          attributes: [],
          where: { quizId },
          include: [
            {
              datasource: "QuizQuestionOption",
              as: "options",
              required: false,
            },
          ],
        },
      });

      if (response.data?.data?.results) {
        setQuestions(response.data.data.results);
        return response.data.data.results;
      }
      
      setQuestions([]);
      return [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch quiz questions";
      setError(errorMessage);
      console.error("Fetch quiz questions error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setQuestions([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, toast]);

  /**
   * Fetch user's quiz results
   * 
   * @param {string} quizId - Quiz ID
   */
  const fetchQuizResults = useCallback(async (quizId) => {
    if (!userId || !quizId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(`${API_BASE_URL}/searchCourse`, {
        limit: 10,
        offset: 0,
        getThisData: {
          datasource: "UserQuizResult",
          attributes: [],
          where: { userId, quizId },
          order: [["createdAt", "DESC"]],
        },
      });

      if (response.data?.data?.results?.[0]) {
        setQuizResults(response.data.data.results[0]);
        return response.data.data.results[0];
      }
      
      setQuizResults(null);
      return null;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch quiz results";
      setError(errorMessage);
      console.error("Fetch quiz results error:", err);
      setQuizResults(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, API_BASE_URL, toast]);

  /**
   * Submit quiz answers
   * 
   * @param {Object} submissionData - Quiz submission data
   * @param {string} submissionData.quizId - Quiz ID
   * @param {string} submissionData.courseContentId - Course content ID
   * @param {Array} submissionData.answers - Array of answers
   * @param {number} submissionData.timeTaken - Time taken in seconds (optional)
   */
  const submitQuiz = useCallback(async (submissionData) => {
    if (!userId || !submissionData.quizId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return { success: false, error: "Missing required information" };
    }

    setSubmitting(true);
    setError(null);
    
    try {
      const payload = {
        userId,
        quizId: submissionData.quizId,
        answers: submissionData.answers || [],
      };

      if (submissionData.courseContentId) {
        payload.courseContentId = submissionData.courseContentId;
      }
      if (submissionData.timeTaken !== undefined) {
        payload.timeTaken = submissionData.timeTaken;
      }
      if (courseId) {
        payload.courseId = courseId;
      }

      const response = await axiosConn.post(
        `${API_BASE_URL}/submitQuiz`,
        payload
      );

      if (response.data?.status === 200 || response.data?.success) {
        const resultData = response.data?.data || response.data;
        setQuizResults(resultData);
        
        toast({
          title: "Quiz Submitted",
          description: `You scored ${resultData.score || 0}/${resultData.totalQuestions || 0}`,
        });
        
        return { success: true, data: resultData };
      } else {
        throw new Error(response.data?.message || "Failed to submit quiz");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to submit quiz";
      setError(errorMessage);
      console.error("Submit quiz error:", err);
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [userId, courseId, API_BASE_URL, toast]);

  /**
   * Clear/Reset quiz results
   * 
   * @param {string} quizId - Quiz ID
   */
  const clearQuizResults = useCallback(async (quizId) => {
    if (!userId || !quizId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return { success: false, error: "Missing required information" };
    }

    setClearing(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(
        `${API_BASE_URL}/clearQuizResult`,
        {
          userId,
          quizId,
        }
      );

      if (response.data?.status === 200 || response.data?.success) {
        setQuizResults(null);
        
        toast({
          title: "Quiz Reset",
          description: "Quiz results have been cleared successfully",
        });
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to clear quiz results");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to clear quiz results";
      setError(errorMessage);
      console.error("Clear quiz results error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setClearing(false);
    }
  }, [userId, API_BASE_URL, toast]);

  /**
   * Load complete quiz data (quiz + questions + results)
   * 
   * @param {string} quizId - Quiz ID
   */
  const loadCompleteQuiz = useCallback(async (quizId) => {
    if (!quizId) return;

    setLoading(true);
    
    try {
      const [quizData, questionsData, resultsData] = await Promise.all([
        fetchQuiz(quizId),
        fetchQuizQuestions(quizId),
        fetchQuizResults(quizId),
      ]);

      return {
        quiz: quizData,
        questions: questionsData,
        results: resultsData,
      };
    } catch (err) {
      console.error("Load complete quiz error:", err);
      return {
        quiz: null,
        questions: [],
        results: null,
      };
    } finally {
      setLoading(false);
    }
  }, [fetchQuiz, fetchQuizQuestions, fetchQuizResults]);

  /**
   * Calculate quiz score percentage
   * 
   * @param {number} score - Score achieved
   * @param {number} total - Total questions
   * @returns {number} Percentage (0-100)
   */
  const calculateScorePercentage = useCallback((score, total) => {
    if (!total || total === 0) return 0;
    return Math.round((score / total) * 100);
  }, []);

  /**
   * Check if quiz is passed
   * 
   * @param {number} score - Score achieved
   * @param {number} total - Total questions
   * @param {number} passingScore - Passing score percentage (default 60)
   * @returns {boolean} True if passed
   */
  const isQuizPassed = useCallback((score, total, passingScore = 60) => {
    const percentage = calculateScorePercentage(score, total);
    return percentage >= passingScore;
  }, [calculateScorePercentage]);

  return {
    // State
    quiz,
    questions,
    quizResults,
    loading,
    submitting,
    clearing,
    error,
    
    // Actions
    fetchQuiz,
    fetchQuizQuestions,
    fetchQuizResults,
    submitQuiz,
    clearQuizResults,
    loadCompleteQuiz,
    
    // Computed/Utilities
    calculateScorePercentage,
    isQuizPassed,
    hasResults: !!quizResults,
    hasQuestions: questions.length > 0,
    questionCount: questions.length,
    isProcessing: loading || submitting || clearing,
  };
};

export default useCourseQuiz;
