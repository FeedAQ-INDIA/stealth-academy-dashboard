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
      const response = await axiosConn.get(`/course-access/getCourseMembers/${courseId}`);
      
      return validateResponse(response, "course room members fetch");
    } catch (error) {
      throw handleApiError(error, "Failed to fetch course room members");
    }
  },

  /**
   * Invite users to join the course room
   * @param {string} courseId - Course ID
   * @param {Array} invites - Array of invite objects with email and accessLevel
   * @param {Object} options - Additional options for invitation
   * @param {string} options.userId - User ID of the inviter
   * @param {string} options.orgId - Organization ID (optional)
   * @param {boolean} options.enableCourseTracking - Enable tracking for invited members
   * @returns {Promise<Object>} - Operation result
   */
  inviteUsersToCourseRoom: async (courseId, invites, options = {}) => {
    if (!courseId || !invites || !Array.isArray(invites) || invites.length === 0) {
      throw new Error("Course ID and invites array are required");
    }

    if (!options.userId) {
      throw new Error("User ID is required for invitation");
    }

    // Validate each invite
    for (const invite of invites) {
      if (!invite.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email)) {
        throw new Error(`Invalid email address: ${invite.email || 'undefined'}`);
      }
      
      const validAccessLevels = ["SHARED", "ADMIN"];
      if (invite.accessLevel && !validAccessLevels.includes(invite.accessLevel)) {
        throw new Error(`Invalid access level: ${invite.accessLevel}`);
      }
    }

    try {
      const payload = {
        courseId,
        userId: options.userId,
        invites: invites.map(invite => ({
          email: invite.email,
          accessLevel: invite.accessLevel || "SHARED",
          message: invite.message || null
        })),
        enableCourseTracking: options.enableCourseTracking || false
      };

      if (options.orgId) {
        payload.orgId = options.orgId;
      }

      const response = await axiosConn.post("/course-access/inviteUser", payload);
      
      return validateResponse(response, "course room invitation");
    } catch (error) {
      throw handleApiError(error, "Failed to invite users to course room");
    }
  },


  inviteUserToCourseRoom: async (courseId, email, options = {}) => {
    if (!courseId || !email) {
      throw new Error("Course ID and email are required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please provide a valid email address");
    }

    const invite = {
      email,
      accessLevel: options.accessType || "SHARED",
      message: options.message || null
    };

    return await this.inviteUsersToCourseRoom(courseId, [invite], {
      userId: options.userId,
      orgId: options.orgId,
      enableCourseTracking: options.enableCourseTracking || false
    });
  },

  /**
   * Remove a member from the course room
   * @param {string} courseAccessId - Course Access ID to remove
   * @returns {Promise<Object>} - Operation result
   */
  removeMemberFromCourseRoom: async (courseAccessId) => {
    if (!courseAccessId) {
      throw new Error("Course Access ID is required");
    }

    try {
      const response = await axiosConn.post("/course-access/revokeAccess", {
        courseAccessId,
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
   * @param {string} courseAccessId - Course Access ID to update
   * @param {string} accessLevel - New access level (SHARED, ADMIN)
   * @returns {Promise<Object>} - Operation result
   */
  updateMemberRole: async (courseAccessId, accessLevel) => {
    if (!courseAccessId || !accessLevel) {
      throw new Error("Course Access ID and access level are required");
    }

    const validAccessLevels = ["SHARED", "ADMIN"];
    if (!validAccessLevels.includes(accessLevel)) {
      throw new Error("Invalid access level. Must be SHARED or ADMIN");
    }

    try {
      const response = await axiosConn.post("/course-access/updateUserAccess", {
        courseAccessId,
        accessLevel,
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