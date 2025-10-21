// User Progress API Service
import axiosConn from "@/axioscon.js";

/**
 * Centralized error handler for API responses
 * @param {Error} error - The error object from axios
 * @param {string} defaultMessage - Default error message if none available
 * @returns {Error} - Processed error with user-friendly message
 */
const handleApiError = (error, defaultMessage = "An unexpected error occurred") => {
  console.error("User Progress API Error:", error);
  
  const message = error.response?.data?.message || 
                  error.response?.data?.error ||
                  error.message || 
                  defaultMessage;
  
  return new Error(message);
};

/**
 * Validate API response and extract data
 * @param {Object} response - Axios response object
 * @param {string} operation - Operation name for error context
 * @returns {Object} - Validated response data
 */
const validateResponse = (response, operation) => {
  if (!response?.data) {
    throw new Error(`Invalid response from ${operation}`);
  }
  
  // Handle different response formats
  if (response.data.success === false) {
    throw new Error(response.data.message || `${operation} failed`);
  }
  
  return response.data;
};

export const userProgressService = {
  /**
   * Get user progress for a specific course
   * @param {number} courseId - Course ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - User progress data including enrollments and activity logs
   */
  getUserProgress: async (courseId, userId) => {
    if (!courseId || !userId) {
      throw new Error("Course ID and User ID are required");
    }

    try {
      const response = await axiosConn.get(`/user-progress/${courseId}/${userId}`);
      return validateResponse(response, "user progress fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch user progress");
    }
  },

  /**
   * Get progress for all users in a course (for instructors/admins)
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} - All users' progress data
   */
  getAllUsersProgress: async (courseId) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const response = await axiosConn.get(`/user-progress/course/${courseId}/all`);
      return validateResponse(response, "all users progress fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch all users progress");
    }
  },

  /**
   * Update user progress for a specific content item
   * @param {Object} progressData - Progress update data
   * @param {number} progressData.courseId - Course ID
   * @param {number} progressData.courseContentId - Course content ID
   * @param {string} progressData.progressStatus - Progress status (COMPLETED, IN_PROGRESS, etc.)
   * @param {number} progressData.activityDuration - Duration of activity in minutes
   * @param {number} progressData.progressPercent - Progress percentage (0-100)
   * @returns {Promise<Object>} - Updated progress data
   */
  updateUserProgress: async (progressData) => {
    const { courseId, courseContentId, progressStatus } = progressData;
    
    if (!courseId || !courseContentId || !progressStatus) {
      throw new Error("Course ID, Content ID, and Progress Status are required");
    }

    try {
      const response = await axiosConn.post("/user-progress/update", progressData);
      return validateResponse(response, "user progress update");
    } catch (error) {
      throw handleApiError(error, "Failed to update user progress");
    }
  },

  /**
   * Get activity logs for a user in a course
   * @param {number} courseId - Course ID
   * @param {number} userId - User ID
   * @param {Object} filters - Optional filters
   * @param {string} filters.startDate - Start date for filtering
   * @param {string} filters.endDate - End date for filtering
   * @param {string} filters.status - Filter by progress status
   * @returns {Promise<Object>} - Activity logs
   */
  getActivityLogs: async (courseId, userId, filters = {}) => {
    if (!courseId || !userId) {
      throw new Error("Course ID and User ID are required");
    }

    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);

      const queryString = params.toString();
      const url = `/user-progress/${courseId}/${userId}/activities${queryString ? `?${queryString}` : ''}`;
      
      const response = await axiosConn.get(url);
      return validateResponse(response, "activity logs fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch activity logs");
    }
  },

  /**
   * Get completion certificate for a user
   * @param {number} courseId - Course ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Certificate data with URL
   */
  getCompletionCertificate: async (courseId, userId) => {
    if (!courseId || !userId) {
      throw new Error("Course ID and User ID are required");
    }

    try {
      const response = await axiosConn.get(`/user-progress/${courseId}/${userId}/certificate`);
      return validateResponse(response, "certificate fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch completion certificate");
    }
  },

  /**
   * Get course completion analytics
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} - Course completion analytics
   */
  getCourseAnalytics: async (courseId) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const response = await axiosConn.get(`/user-progress/course/${courseId}/analytics`);
      return validateResponse(response, "course analytics fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch course analytics");
    }
  },

  /**
   * Mark content as completed
   * @param {number} courseId - Course ID
   * @param {number} courseContentId - Course content ID
   * @returns {Promise<Object>} - Updated progress data
   */
  markContentCompleted: async (courseId, courseContentId) => {
    return await this.updateUserProgress({
      courseId,
      courseContentId,
      progressStatus: "COMPLETED",
      activityDuration: 0,
      progressPercent: 100,
    });
  },

  /**
   * Reset user progress for a course
   * @param {number} courseId - Course ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Operation result
   */
  resetUserProgress: async (courseId, userId) => {
    if (!courseId || !userId) {
      throw new Error("Course ID and User ID are required");
    }

    try {
      const response = await axiosConn.post("/user-progress/reset", {
        courseId,
        userId,
      });
      return validateResponse(response, "progress reset");
    } catch (error) {
      throw handleApiError(error, "Failed to reset user progress");
    }
  },
};

export default userProgressService;
