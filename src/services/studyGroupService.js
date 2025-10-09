// Centralized Study Group API Service
import axiosConn from "@/axioscon.js";

const API_BASE = "/course-study-group";

/**
 * Centralized error handler for API responses
 * @param {Error} error - The error object from axios
 * @param {string} defaultMessage - Default error message if none available
 * @returns {Error} - Processed error with user-friendly message
 */
const handleApiError = (error, defaultMessage = "An unexpected error occurred") => {
  console.error("Study Group API Error:", error);
  
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

export const studyGroupService = {
  /**
   * Create a new study group
   * @param {Object} studyGroupData - Study group creation data
   * @param {string} studyGroupData.name - Group name
   * @param {string} studyGroupData.description - Group description
   * @returns {Promise<Object>} - Created study group data
   */
  createStudyGroup: async (studyGroupData) => {
    try {
      const response = await axiosConn.post(`${API_BASE}/createOrUpdate`, {
        groupName: studyGroupData.name,
        description: studyGroupData.description,
      });
      
      return validateResponse(response, "study group creation");
    } catch (error) {
      throw handleApiError(error, "Failed to create study group");
    }
  },

  /**
   * Update an existing study group
   * @param {string} courseStudyGroupId - Study group ID
   * @param {Object} studyGroupData - Updated study group data
   * @returns {Promise<Object>} - Updated study group data
   */
  updateStudyGroup: async (courseStudyGroupId, studyGroupData) => {
    try {
      const response = await axiosConn.post(`${API_BASE}/createOrUpdate`, {
        courseStudyGroupId,
        groupName: studyGroupData.name,
        description: studyGroupData.description,
      });
      
      return validateResponse(response, "study group update");
    } catch (error) {
      throw handleApiError(error, "Failed to update study group");
    }
  },

  /**
   * Get all study groups for the current user
   * @param {Object} filters - Filter options
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @param {string} filters.userId - User ID for filtering
   * @returns {Promise<Object>} - Study groups data
   */
  getAllStudyGroups: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      const response = await axiosConn.get(`${API_BASE}/getAllCourseStudyGroup?${queryParams}`);
      return validateResponse(response, "study groups fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch study groups");
    }
  },

  /**
   * Get study group details by ID
   * @param {string} courseStudyGroupId - Study group ID
   * @returns {Promise<Object>} - Study group details
   */
  getStudyGroupDetails: async (courseStudyGroupId) => {
    if (!courseStudyGroupId) {
      throw new Error("Study group ID is required");
    }

    try {
      const response = await axiosConn.get(`${API_BASE}/getCourseStudyGroupDetailById/${courseStudyGroupId}`);
      return validateResponse(response, "study group details fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch study group details");
    }
  },

  /**
   * Delete a study group
   * @param {string} courseStudyGroupId - Study group ID
   * @returns {Promise<Object>} - Deletion confirmation
   */
  deleteStudyGroup: async (courseStudyGroupId) => {
    if (!courseStudyGroupId) {
      throw new Error("Study group ID is required");
    }

    try {
      const response = await axiosConn.post(`${API_BASE}/deleteStudyGroup`, {
        courseStudyGroupId
      });
      
      return validateResponse(response, "study group deletion");
    } catch (error) {
      throw handleApiError(error, "Failed to delete study group");
    }
  },

  /**
   * Add member to study group
   * @param {string} courseStudyGroupId - Study group ID
   * @param {string} userId - User ID to add
   * @param {string} role - User role (default: "MEMBER")
   * @returns {Promise<Object>} - Operation result
   */
  addMemberToStudyGroup: async (courseStudyGroupId, userId, role = "MEMBER") => {
    if (!courseStudyGroupId || !userId) {
      throw new Error("Study group ID and user ID are required");
    }

    try {
      const response = await axiosConn.post(`${API_BASE}/addMember`, {
        courseStudyGroupId,
        userId,
        role,
      });
      
      return validateResponse(response, "member addition");
    } catch (error) {
      throw handleApiError(error, "Failed to add member to study group");
    }
  },

  /**
   * Remove member from study group
   * @param {string} courseStudyGroupId - Study group ID
   * @param {string} userId - User ID to remove
   * @returns {Promise<Object>} - Operation result
   */
  removeMemberFromStudyGroup: async (courseStudyGroupId, userId) => {
    if (!courseStudyGroupId || !userId) {
      throw new Error("Study group ID and user ID are required");
    }

    try {
      const response = await axiosConn.post(`${API_BASE}/removeMember`, {
        courseStudyGroupId,
        userId
      });
      
      return validateResponse(response, "member removal");
    } catch (error) {
      throw handleApiError(error, "Failed to remove member from study group");
    }
  },

  /**
   * Add content to study group
   * @param {string} courseStudyGroupId - Study group ID
   * @param {string} courseId - Course ID to add
   * @returns {Promise<Object>} - Operation result
   */
  addContentToStudyGroup: async (courseStudyGroupId, courseId) => {
    if (!courseStudyGroupId || !courseId) {
      throw new Error("Study group ID and course ID are required");
    }

    try {
      const response = await axiosConn.post(`${API_BASE}/addContent`, {
        courseStudyGroupId,
        courseId,
      });
      
      return validateResponse(response, "content addition");
    } catch (error) {
      throw handleApiError(error, "Failed to add content to study group");
    }
  },

  /**
   * Remove content from study group
   * @param {string} courseStudyGroupId - Study group ID
   * @param {string} courseId - Course ID to remove
   * @returns {Promise<Object>} - Operation result
   */
  removeContentFromStudyGroup: async (courseStudyGroupId, courseId) => {
    if (!courseStudyGroupId || !courseId) {
      throw new Error("Study group ID and course ID are required");
    }

    try {
      const response = await axiosConn.post(`${API_BASE}/removeContent`, {
        courseStudyGroupId,
        courseId,
      });
      
      return validateResponse(response, "content removal");
    } catch (error) {
      throw handleApiError(error, "Failed to remove content from study group");
    }
  },

  /**
   * Send invitation to join study group
   * @param {string} courseStudyGroupId - Study group ID
   * @param {string} email - Email address to invite
   * @param {string} message - Optional personal message
   * @returns {Promise<Object>} - Operation result
   */
  sendInvitation: async (courseStudyGroupId, email, message) => {
    if (!courseStudyGroupId || !email) {
      throw new Error("Study group ID and email are required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please provide a valid email address");
    }

    try {
      const response = await axiosConn.post(`${API_BASE}/invite`, {
        courseStudyGroupId,
        email,
        message: message || "",
      });
      
      return validateResponse(response, "invitation sending");
    } catch (error) {
      throw handleApiError(error, "Failed to send invitation");
    }
  },
};

export default studyGroupService;