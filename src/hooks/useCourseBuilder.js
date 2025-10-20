import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for CourseBuilder component
 * Handles course builder operations including topic management
 * 
 * @param {string} courseBuilderId - Course builder ID
 * @returns {Object} Hook state and actions
 */
export const useCourseBuilder = (courseBuilderId) => {
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  // State management
  const [builder, setBuilder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch course builder data
   */
  const fetchBuilder = useCallback(async () => {
    if (!courseBuilderId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosConn.get(`/courseBuilder/${courseBuilderId}`);

      if (response.data?.data) {
        setBuilder(response.data.data);
        return response.data.data;
      }
      
      setBuilder(null);
      return null;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch builder";
      setError(errorMessage);
      console.error("Fetch builder error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setBuilder(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [courseBuilderId, API_BASE_URL, toast]);

  /**
   * Register/Create a new course builder
   * 
   * @param {Object} builderData - Builder data
   * @param {string} builderData.courseTitle - Course title
   * @param {string} builderData.courseDescription - Course description
   */
  const registerBuilder = useCallback(async (builderData) => {
    setSaving(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(`${API_BASE_URL}/registerBuilder`, builderData);

      if (response.data?.status === 200 || response.data?.success) {
        const builderData = response.data.data;
        setBuilder(builderData);
        
        toast({
          title: "Builder Created",
          description: "Course builder created successfully",
        });
        
        return { success: true, data: builderData };
      } else {
        throw new Error(response.data?.message || "Failed to create builder");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create builder";
      setError(errorMessage);
      console.error("Register builder error:", err);
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  }, [API_BASE_URL, toast]);

  /**
   * Save course topic
   * 
   * @param {Object} topicData - Topic data
   * @param {string} topicData.topicTitle - Topic title
   * @param {string} topicData.topicDescription - Topic description
   * @param {Array} topicData.contents - Topic contents
   */
  const saveTopic = useCallback(async (topicData) => {
    if (!courseBuilderId) {
      toast({
        title: "Error",
        description: "Course builder ID is missing",
        variant: "destructive",
      });
      return { success: false, error: "Course builder ID is missing" };
    }

    setSaving(true);
    setError(null);
    
    try {
      const payload = {
        courseBuilderId,
        ...topicData,
      };

      const response = await axiosConn.post(
        `${API_BASE_URL}/saveCourseTopic`,
        payload
      );

      if (response.data?.status === 200 || response.data?.success) {
        toast({
          title: "Topic Saved",
          description: "Course topic saved successfully",
        });
        
        // Refresh builder data
        await fetchBuilder();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to save topic");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save topic";
      setError(errorMessage);
      console.error("Save topic error:", err);
      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  }, [courseBuilderId, API_BASE_URL, toast, fetchBuilder]);

  /**
   * Delete course content
   * 
   * @param {string} contentId - Content ID to delete
   * @param {string} contentType - Content type ('topic', 'content', etc.)
   */
  const deleteContent = useCallback(async (contentId, contentType = 'content') => {
    if (!contentId) {
      toast({
        title: "Error",
        description: "Content ID is missing",
        variant: "destructive",
      });
      return { success: false, error: "Content ID is missing" };
    }

    setDeleting(true);
    setError(null);
    
    try {
      const response = await axiosConn.delete(
        `${API_BASE_URL}/courseBuilder/${contentType}/${contentId}`
      );

      if (response.data?.status === 200 || response.data?.success) {
        toast({
          title: "Content Deleted",
          description: "Content deleted successfully",
        });
        
        // Refresh builder data
        await fetchBuilder();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to delete content");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete content";
      setError(errorMessage);
      console.error("Delete content error:", err);
      toast({
        title: "Deletion Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setDeleting(false);
    }
  }, [API_BASE_URL, toast, fetchBuilder]);

  /**
   * Refresh builder data
   */
  const refreshBuilder = useCallback(() => {
    return fetchBuilder();
  }, [fetchBuilder]);

  return {
    // State
    builder,
    loading,
    saving,
    deleting,
    error,
    
    // Actions
    fetchBuilder,
    registerBuilder,
    saveTopic,
    deleteContent,
    refreshBuilder,
    
    // Computed
    hasBuilder: !!builder,
    isProcessing: loading || saving || deleting,
  };
};

export default useCourseBuilder;
