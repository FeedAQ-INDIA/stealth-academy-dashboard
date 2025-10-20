import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for CourseVideoTutorial component
 * Handles user course content progress tracking
 * 
 * @param {string} courseId - The course ID
 * @param {string} userId - The current user ID
 * @returns {Object} Hook state and actions
 */
export const useCourseVideoTutorial = (courseId, userId) => {
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  // State management
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [deletingProgress, setDeletingProgress] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user's course content progress
   * 
   * @param {string} courseContentId - Optional: specific content ID to filter
   */
  const fetchUserProgress = useCallback(async (courseContentId = null) => {
    if (!courseId || !userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const whereClause = {
        userId,
        courseId,
      };

      if (courseContentId) {
        whereClause.courseContentId = courseContentId;
      }

      const response = await axiosConn.post(`${API_BASE_URL}/searchCourse`, {
        limit: 2000,
        offset: 0,
        getThisData: {
          datasource: "UserCourseContentProgress",
          attributes: [],
          where: whereClause,
        },
      });

      if (response.data?.data?.results) {
        setUserProgress(response.data.data.results);
        return response.data.data.results;
      }
      
      setUserProgress([]);
      return [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch progress";
      setError(errorMessage);
      console.error("Fetch progress error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setUserProgress([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [courseId, userId, API_BASE_URL, toast]);

  /**
   * Save or update user's course content progress
   * 
   * @param {Object} progressData - Progress data
   * @param {string} progressData.courseContentId - Course content ID
   * @param {string} progressData.progressStatus - Status: 'COMPLETED', 'IN_PROGRESS', etc.
   * @param {number} progressData.watchTime - Watch time in seconds (optional)
   * @param {Object} progressData.additionalData - Any additional progress data (optional)
   */
  const saveProgress = useCallback(async (progressData) => {
    if (!courseId || !userId || !progressData.courseContentId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return { success: false, error: "Missing required information" };
    }

    setSavingProgress(true);
    setError(null);
    
    try {
      const payload = {
        userId,
        courseId,
        courseContentId: progressData.courseContentId,
        progressStatus: progressData.progressStatus || 'COMPLETED',
      };

      // Add optional fields if provided
      if (progressData.watchTime !== undefined) {
        payload.watchTime = progressData.watchTime;
      }
      if (progressData.additionalData) {
        Object.assign(payload, progressData.additionalData);
      }

      const response = await axiosConn.post(
        `${API_BASE_URL}/saveUserCourseContentProgress`,
        payload
      );

      if (response.data?.status === 200 || response.data?.success) {
        toast({
          title: "Progress Saved",
          description: "Your progress has been saved successfully",
        });
        
        // Refresh progress data
        await fetchUserProgress();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to save progress");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save progress";
      setError(errorMessage);
      console.error("Save progress error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setSavingProgress(false);
    }
  }, [courseId, userId, API_BASE_URL, toast, fetchUserProgress]);

  /**
   * Mark content as completed
   * 
   * @param {string} courseContentId - Course content ID
   * @param {number} watchTime - Optional watch time
   */
  const markAsCompleted = useCallback(async (courseContentId, watchTime = null) => {
    const progressData = {
      courseContentId,
      progressStatus: 'COMPLETED',
    };

    if (watchTime !== null) {
      progressData.watchTime = watchTime;
    }

    return saveProgress(progressData);
  }, [saveProgress]);

  /**
   * Mark content as in progress
   * 
   * @param {string} courseContentId - Course content ID
   * @param {number} watchTime - Optional watch time
   */
  const markAsInProgress = useCallback(async (courseContentId, watchTime = null) => {
    const progressData = {
      courseContentId,
      progressStatus: 'IN_PROGRESS',
    };

    if (watchTime !== null) {
      progressData.watchTime = watchTime;
    }

    return saveProgress(progressData);
  }, [saveProgress]);

  /**
   * Delete/Reset user's progress for specific content
   * 
   * @param {string} courseContentId - Course content ID
   */
  const resetProgress = useCallback(async (courseContentId) => {
    if (!courseId || !userId || !courseContentId) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return { success: false, error: "Missing required information" };
    }

    setDeletingProgress(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(
        `${API_BASE_URL}/deleteUserCourseContentProgress`,
        {
          userId,
          courseId,
          courseContentId,
        }
      );

      if (response.data?.status === 200 || response.data?.success) {
        toast({
          title: "Progress Reset",
          description: "Your progress has been reset successfully",
        });
        
        // Refresh progress data
        await fetchUserProgress();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to reset progress");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to reset progress";
      setError(errorMessage);
      console.error("Reset progress error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setDeletingProgress(false);
    }
  }, [courseId, userId, API_BASE_URL, toast, fetchUserProgress]);

  /**
   * Check if specific content is completed
   * 
   * @param {string} courseContentId - Course content ID
   * @returns {boolean} True if completed
   */
  const isContentCompleted = useCallback((courseContentId) => {
    return userProgress.some(
      progress => 
        progress.courseContentId === courseContentId && 
        progress.progressStatus === 'COMPLETED'
    );
  }, [userProgress]);

  /**
   * Get progress data for specific content
   * 
   * @param {string} courseContentId - Course content ID
   * @returns {Object|null} Progress data or null
   */
  const getContentProgress = useCallback((courseContentId) => {
    return userProgress.find(
      progress => progress.courseContentId === courseContentId
    ) || null;
  }, [userProgress]);

  /**
   * Calculate overall progress percentage
   * 
   * @param {number} totalContent - Total number of content items
   * @returns {number} Progress percentage (0-100)
   */
  const calculateProgressPercentage = useCallback((totalContent) => {
    if (!totalContent || totalContent === 0) return 0;
    
    const completedCount = userProgress.filter(
      progress => progress.progressStatus === 'COMPLETED'
    ).length;
    
    return Math.round((completedCount / totalContent) * 100);
  }, [userProgress]);

  /**
   * Refresh progress data
   */
  const refreshProgress = useCallback(() => {
    return fetchUserProgress();
  }, [fetchUserProgress]);

  return {
    // State
    userProgress,
    loading,
    savingProgress,
    deletingProgress,
    error,
    
    // Actions
    fetchUserProgress,
    saveProgress,
    markAsCompleted,
    markAsInProgress,
    resetProgress,
    refreshProgress,
    
    // Computed/Utilities
    isContentCompleted,
    getContentProgress,
    calculateProgressPercentage,
    hasProgress: userProgress.length > 0,
    completedCount: userProgress.filter(p => p.progressStatus === 'COMPLETED').length,
    isProcessing: loading || savingProgress || deletingProgress,
  };
};

export default useCourseVideoTutorial;
