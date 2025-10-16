// Centralized Course Room API Service
import axiosConn from "@/axioscon.js";

const API_BASE = "/course-room";

/**
 * Centralized error handler for API responses
 * @param {Error} error - The error object from axios
 * @param {string} defaultMessage - Default error message if none available
 * @returns {Error} - Processed error with user-friendly message
 */
const handleApiError = (error, defaultMessage = "An unexpected error occurred") => {
  console.error("Course Room API Error:", error);
  
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

export const courseRoomService = {
  /**
   * Get all members of a course room
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Course room members data
   */
  getCourseRoomMembers: async (courseId) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const response = await axiosConn.post("/searchCourse", {
        limit: 100,
        offset: 0,
        getThisData: {
          datasource: "CourseRoom",
          attributes: [],
          where: { courseId },
          include: [
            {
              datasource: "User",
              as: "user",
              required: true,
              attributes: ["userId", "firstName", "lastName", "email", "profilePicture"],
            },
          ],
        },
      });
      
      return validateResponse(response, "course room members fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch course room members");
    }
  },

  /**
   * Invite a user to join the course room
   * @param {string} courseId - Course ID
   * @param {string} email - Email address to invite
    * @returns {Promise<Object>} - Operation result
   */
  inviteUserToCourseRoom: async (courseId, email, ) => {
    if (!courseId || !email) {
      throw new Error("Course ID and email are required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please provide a valid email address");
    }

    try {
      const response = await axiosConn.post("/inviteToCourseRoom", {
        courseId,
        email,
       });
      
      return validateResponse(response, "course room invitation");
    } catch (error) {
      throw handleApiError(error, "Failed to send course room invitation");
    }
  },

  /**
   * Remove a member from the course room
   * @param {string} courseId - Course ID
   * @param {string} userId - User ID to remove
   * @returns {Promise<Object>} - Operation result
   */
  removeMemberFromCourseRoom: async (courseId, userId) => {
    if (!courseId || !userId) {
      throw new Error("Course ID and user ID are required");
    }

    try {
      const response = await axiosConn.post("/removeFromCourseRoom", {
        courseId,
        userId,
      });
      
      return validateResponse(response, "member removal from course room");
    } catch (error) {
      throw handleApiError(error, "Failed to remove member from course room");
    }
  },

  /**
   * Join a course room via invite link
   * @param {string} courseId - Course ID
   * @param {string} inviteToken - Optional invite token
   * @returns {Promise<Object>} - Operation result
   */
  joinCourseRoom: async (courseId, inviteToken = null) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const payload = { courseId };
      if (inviteToken) {
        payload.inviteToken = inviteToken;
      }

      const response = await axiosConn.post("/joinCourseRoom", payload);
      
      return validateResponse(response, "course room join");
    } catch (error) {
      throw handleApiError(error, "Failed to join course room");
    }
  },

  /**
   * Leave a course room
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Operation result
   */
  leaveCourseRoom: async (courseId) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const response = await axiosConn.post("/leaveCourseRoom", {
        courseId,
      });
      
      return validateResponse(response, "course room leave");
    } catch (error) {
      throw handleApiError(error, "Failed to leave course room");
    }
  },

  /**
   * Update member role in course room
   * @param {string} courseId - Course ID
   * @param {string} userId - User ID to update
   * @param {string} role - New role (MEMBER, MODERATOR)
   * @returns {Promise<Object>} - Operation result
   */
  updateMemberRole: async (courseId, userId, role) => {
    if (!courseId || !userId || !role) {
      throw new Error("Course ID, user ID, and role are required");
    }

    const validRoles = ["MEMBER", "MODERATOR"];
    if (!validRoles.includes(role)) {
      throw new Error("Invalid role. Must be MEMBER or MODERATOR");
    }

    try {
      const response = await axiosConn.post("/updateCourseRoomMemberRole", {
        courseId,
        userId,
        role,
      });
      
      return validateResponse(response, "member role update");
    } catch (error) {
      throw handleApiError(error, "Failed to update member role");
    }
  },

  /**
   * Get course room settings and permissions
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Course room settings
   */
  getCourseRoomSettings: async (courseId) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const response = await axiosConn.get(`${API_BASE}/settings/${courseId}`);
      
      return validateResponse(response, "course room settings fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch course room settings");
    }
  },

  /**
   * Update course room settings
   * @param {string} courseId - Course ID
   * @param {Object} settings - Settings object
   * @param {boolean} settings.allowInvites - Allow members to invite others
   * @param {boolean} settings.requireApproval - Require approval for new members
   * @param {string} settings.visibility - PRIVATE, PUBLIC, or INVITE_ONLY
   * @returns {Promise<Object>} - Operation result
   */
  updateCourseRoomSettings: async (courseId, settings) => {
    if (!courseId || !settings) {
      throw new Error("Course ID and settings are required");
    }

    try {
      const response = await axiosConn.post(`${API_BASE}/settings/${courseId}`, settings);
      
      return validateResponse(response, "course room settings update");
    } catch (error) {
      throw handleApiError(error, "Failed to update course room settings");
    }
  },

  /**
   * Generate a shareable invite link for the course room
   * @param {string} courseId - Course ID
   * @param {Object} options - Link options
   * @param {Date} options.expiresAt - Optional expiration date
   * @param {number} options.maxUses - Optional maximum number of uses
   * @returns {Promise<Object>} - Invite link data
   */
  generateInviteLink: async (courseId, options = {}) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const response = await axiosConn.post(`${API_BASE}/generate-invite-link`, {
        courseId,
        ...options,
      });
      
      return validateResponse(response, "invite link generation");
    } catch (error) {
      throw handleApiError(error, "Failed to generate invite link");
    }
  },

  /**
   * Get course room analytics and statistics
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Analytics data
   */
  getCourseRoomAnalytics: async (courseId) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const response = await axiosConn.get(`${API_BASE}/analytics/${courseId}`);
      
      return validateResponse(response, "course room analytics fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch course room analytics");
    }
  },
};

export default courseRoomService;