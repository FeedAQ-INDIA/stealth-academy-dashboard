import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for Notifications component
 * Handles fetching, archiving, and responding to notifications
 * 
 * @param {string} userId - The current user ID
 * @returns {Object} Hook state and actions
 */
export const useNotifications = (userId) => {
  const { toast } = useToast();
  
  // State management
  const [notifications, setNotifications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch notifications
   * 
   * @param {Object} options - Fetch options
   * @param {number} options.limit - Limit per page
   * @param {number} options.offset - Offset for pagination
   */
  const fetchNotifications = useCallback(async (options = {}) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    const fetchLimit = options.limit || limit;
    const fetchOffset = options.offset || offset;
    
    try {
      const response = await axiosConn.post('/notifications/getNotifications', {
        limit: fetchLimit,
        offset: fetchOffset,
      });

      if (response.data?.status === 200) {
        const fetchedNotifications = response.data.data.notifications || [];
        
        setNotifications(fetchedNotifications);
        setTotalCount(response.data.data.total || 0);
        setLimit(response.data.data.limit || 20);
        setOffset(response.data.data.offset || 0);
        
        return {
          notifications: fetchedNotifications,
          total: response.data.data.total || 0,
        };
      } else {
        throw new Error(response.data?.message || "Failed to fetch notifications");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch notifications";
      setError(errorMessage);
      console.error("Fetch notifications error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setNotifications([]);
      return { notifications: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [userId, limit, offset, toast]);

  /**
   * Archive single notification
   * 
   * @param {string} notificationId - Notification ID to archive
   */
  const archiveNotification = useCallback(async (notificationId) => {
    if (!notificationId) return;
    
    setArchiving(true);
    setError(null);
    
    try {
      const response = await axiosConn.post('/notifications/archiveNotifications', {
        notificationIds: [notificationId],
      });

      if (response.data?.status === 200) {
        toast({
          title: "Notification Archived",
          description: "Notification has been archived successfully",
        });
        
        // Refresh notifications
        await fetchNotifications();
        
        return { success: true };
      } else {
        throw new Error(response.data?.message || "Failed to archive notification");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to archive notification";
      setError(errorMessage);
      console.error("Archive notification error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setArchiving(false);
    }
  }, [toast, fetchNotifications]);

  /**
   * Archive multiple notifications
   * 
   * @param {Array<string>} notificationIds - Array of notification IDs
   */
  const archiveMultipleNotifications = useCallback(async (notificationIds) => {
    if (!notificationIds || notificationIds.length === 0) return;
    
    setArchiving(true);
    setError(null);
    
    try {
      const response = await axiosConn.post('/notifications/archiveNotifications', {
        notificationIds,
      });

      if (response.data?.status === 200) {
        toast({
          title: "Notifications Archived",
          description: `${notificationIds.length} notification(s) archived successfully`,
        });
        
        // Refresh notifications
        await fetchNotifications();
        
        return { success: true };
      } else {
        throw new Error(response.data?.message || "Failed to archive notifications");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to archive notifications";
      setError(errorMessage);
      console.error("Archive notifications error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setArchiving(false);
    }
  }, [toast, fetchNotifications]);

  /**
   * Accept course invite
   * 
   * @param {string} inviteId - Invite ID
   */
  const acceptCourseInvite = useCallback(async (inviteId) => {
    if (!inviteId) {
      toast({
        title: "Error",
        description: "Invalid invite information",
        variant: "destructive",
      });
      return { success: false, error: "Invalid invite information" };
    }

    setProcessing(true);
    setError(null);
    
    try {
      const response = await axiosConn.post('/course-access/acceptInvite', { 
        inviteId 
      });

      if (response.data?.status === 200 || response.data?.success) {
        toast({
          title: "Invitation Accepted",
          description: "You have successfully joined the course!",
        });
        
        // Refresh notifications
        await fetchNotifications();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to accept invitation");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to accept invitation";
      setError(errorMessage);
      console.error("Accept invite error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setProcessing(false);
    }
  }, [toast, fetchNotifications]);

  /**
   * Decline course invite
   * 
   * @param {string} inviteId - Invite ID
   */
  const declineCourseInvite = useCallback(async (inviteId) => {
    if (!inviteId) {
      toast({
        title: "Error",
        description: "Invalid invite information",
        variant: "destructive",
      });
      return { success: false, error: "Invalid invite information" };
    }

    setProcessing(true);
    setError(null);
    
    try {
      const response = await axiosConn.post('/course-access/declineInvite', { 
        inviteId 
      });

      if (response.data?.status === 200 || response.data?.success) {
        toast({
          title: "Invitation Declined",
          description: "You have declined the course invitation",
        });
        
        // Refresh notifications
        await fetchNotifications();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to decline invitation");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to decline invitation";
      setError(errorMessage);
      console.error("Decline invite error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setProcessing(false);
    }
  }, [toast, fetchNotifications]);

  /**
   * Navigate to next page
   */
  const nextPage = useCallback(() => {
    if (offset + limit < totalCount) {
      const newOffset = offset + limit;
      setOffset(newOffset);
      fetchNotifications({ offset: newOffset });
    }
  }, [offset, limit, totalCount, fetchNotifications]);

  /**
   * Navigate to previous page
   */
  const previousPage = useCallback(() => {
    if (offset > 0) {
      const newOffset = Math.max(0, offset - limit);
      setOffset(newOffset);
      fetchNotifications({ offset: newOffset });
    }
  }, [offset, limit, fetchNotifications]);

  /**
   * Refresh notifications
   */
  const refreshNotifications = useCallback(() => {
    return fetchNotifications({ offset: 0 });
  }, [fetchNotifications]);

  /**
   * Archive all notifications
   */
  const archiveAll = useCallback(async () => {
    if (notifications.length === 0) return;
    
    const notificationIds = notifications.map(n => n.notificationId);
    return archiveMultipleNotifications(notificationIds);
  }, [notifications, archiveMultipleNotifications]);

  return {
    // State
    notifications,
    totalCount,
    limit,
    offset,
    loading,
    archiving,
    processing,
    error,
    
    // Actions
    fetchNotifications,
    archiveNotification,
    archiveMultipleNotifications,
    acceptCourseInvite,
    declineCourseInvite,
    nextPage,
    previousPage,
    refreshNotifications,
    archiveAll,
    
    // Computed
    hasNotifications: notifications.length > 0,
    notificationCount: notifications.length,
    hasNextPage: offset + limit < totalCount,
    hasPreviousPage: offset > 0,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(totalCount / limit),
    isProcessing: loading || archiving || processing,
  };
};

export default useNotifications;
