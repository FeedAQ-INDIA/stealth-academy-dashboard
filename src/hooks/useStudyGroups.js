import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/zustland/store";
import studyGroupService from "@/services/studyGroupService";

/**
 * Custom hook for study group operations
 * Provides centralized state management and error handling for study groups
 */
export const useStudyGroups = () => {
  const { toast } = useToast();
  const { userDetail } = useAuthStore();
  
  // State management
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Process study groups data with user context
   * @param {Array} groups - Raw study groups data
   * @returns {Array} - Processed study groups with user context
   */
  const processStudyGroups = useCallback((groups) => {
    if (!Array.isArray(groups) || !userDetail?.userId) {
      return [];
    }

    return groups.map(group => {
      const isOwner = group.ownedBy === userDetail.userId;
      const userMembership = group.members?.find(
        member => member?.user?.userId === userDetail.userId || member?.userId === userDetail.userId
      );
      const userRole = userMembership?.role || null;
      
      return {
        ...group,
        isOwner,
        userRole,
        memberCount: group.members?.length || 0,
        contentCount: group.groupContent?.length || 0,
        study_group_created_at: group.study_group_created_at || group.createdAt || new Date().toISOString()
      };
    });
  }, [userDetail?.userId]);

  /**
   * Fetch all study groups
   * @param {Object} options - Fetch options
   * @param {boolean} options.showSuccessMessage - Show success toast
   * @param {Object} options.filters - Additional filters
   * @returns {Promise<void>}
   */
  const fetchStudyGroups = useCallback(async (options = {}) => {
    const { showSuccessMessage = false, filters = {} } = options;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiFilters = {
        page: 1,
        limit: 50,
        ...filters
      };

      // Add user ID for user-specific filtering
      if (userDetail?.userId) {
        apiFilters.userId = userDetail.userId;
      }

      const response = await studyGroupService.getAllStudyGroups(apiFilters);
      const processedGroups = processStudyGroups(response.data || []);
      
      setStudyGroups(processedGroups);
      
      if (showSuccessMessage) {
        toast({
          title: "Success",
          description: `Loaded ${processedGroups.length} study groups`,
        });
      }
      
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch study groups";
      setError(errorMessage);
      
      toast({
        title: "Error Loading Study Groups",
        description: errorMessage,
        variant: "destructive",
      });
      
      setStudyGroups([]);
    } finally {
      setLoading(false);
    }
  }, [userDetail?.userId, processStudyGroups, toast]);

  /**
   * Create a new study group
   * @param {Object} studyGroupData - Study group data
   * @returns {Promise<Object|null>} - Created study group or null on error
   */
  const createStudyGroup = useCallback(async (studyGroupData) => {
    setSubmitLoading(true);
    setError(null);
    
    try {
      const response = await studyGroupService.createStudyGroup(studyGroupData);
      
      toast({
        title: "Success",
        description: "Study group created successfully!",
      });
      
      // Refresh the list
      await fetchStudyGroups();
      
      return response.data;
    } catch (err) {
      const errorMessage = err.message || "Failed to create study group";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setSubmitLoading(false);
    }
  }, [fetchStudyGroups, toast]);

  /**
   * Update an existing study group
   * @param {string} courseStudyGroupId - Study group ID
   * @param {Object} studyGroupData - Updated study group data
   * @returns {Promise<Object|null>} - Updated study group or null on error
   */
  const updateStudyGroup = useCallback(async (courseStudyGroupId, studyGroupData) => {
    setSubmitLoading(true);
    setError(null);
    
    try {
      const response = await studyGroupService.updateStudyGroup(courseStudyGroupId, studyGroupData);
      
      toast({
        title: "Success",
        description: "Study group updated successfully!",
      });
      
      // Refresh the list
      await fetchStudyGroups();
      
      return response.data;
    } catch (err) {
      const errorMessage = err.message || "Failed to update study group";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setSubmitLoading(false);
    }
  }, [fetchStudyGroups, toast]);

  /**
   * Delete a study group
   * @param {string} courseStudyGroupId - Study group ID
   * @returns {Promise<boolean>} - Success status
   */
  const deleteStudyGroup = useCallback(async (courseStudyGroupId) => {
    setSubmitLoading(true);
    setError(null);
    
    try {
      await studyGroupService.deleteStudyGroup(courseStudyGroupId);
      
      toast({
        title: "Success",
        description: "Study group deleted successfully!",
      });
      
      // Refresh the list
      await fetchStudyGroups();
      
      return true;
    } catch (err) {
      const errorMessage = err.message || "Failed to delete study group";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setSubmitLoading(false);
    }
  }, [fetchStudyGroups, toast]);

  /**
   * Send invitation to join study group
   * @param {string} courseStudyGroupId - Study group ID
   * @param {string} email - Email address
   * @param {string} message - Optional message
   * @returns {Promise<boolean>} - Success status
   */
  const sendInvitation = useCallback(async (courseStudyGroupId, email, message) => {
    setSubmitLoading(true);
    setError(null);
    
    try {
      await studyGroupService.sendInvitation(courseStudyGroupId, email, message);
      
      toast({
        title: "Success",
        description: "Invitation sent successfully!",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err.message || "Failed to send invitation";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setSubmitLoading(false);
    }
  }, [toast]);

  /**
   * Filter study groups based on criteria
   * @param {string} filterType - Filter type ('all', 'owned', 'member')
   * @param {string} searchTerm - Search term
   * @returns {Array} - Filtered study groups
   */
  const getFilteredGroups = useCallback((filterType = 'all', searchTerm = '') => {
    let filtered = [...studyGroups];
    
    // Apply role filter
    if (filterType === 'owned') {
      filtered = filtered.filter(group => group.isOwner);
    } else if (filterType === 'member') {
      filtered = filtered.filter(group => !group.isOwner && group.userRole);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(group => 
        group.groupName?.toLowerCase().includes(search) ||
        group.description?.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }, [studyGroups]);

  /**
   * Get analytics about study groups
   * @returns {Object} - Analytics data
   */
  const getAnalytics = useCallback(() => {
    const total = studyGroups.length;
    const owned = studyGroups.filter(group => group.isOwner).length;
    const member = studyGroups.filter(group => !group.isOwner && group.userRole).length;
    const totalMembers = studyGroups.reduce((sum, group) => sum + (group.memberCount || 0), 0);
    const totalCourses = studyGroups.reduce((sum, group) => sum + (group.contentCount || 0), 0);
    
    return {
      total,
      owned,
      member,
      totalMembers,
      totalCourses
    };
  }, [studyGroups]);

  return {
    // State
    studyGroups,
    loading,
    error,
    submitLoading,
    
    // Actions
    fetchStudyGroups,
    createStudyGroup,
    updateStudyGroup,
    deleteStudyGroup,
    sendInvitation,
    clearError,
    
    // Computed
    getFilteredGroups,
    getAnalytics
  };
};

export default useStudyGroups;