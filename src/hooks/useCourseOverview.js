import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for CourseOverview component
 * Handles course enrollment, unenrollment, deletion, and notes fetching
 * 
 * @param {string} courseId - The course ID
 * @param {string} userId - The current user ID
 * @returns {Object} Hook state and actions
 */
export const useCourseOverview = (courseId, userId) => {
  const { toast } = useToast();
  
  // State management
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [unenrollLoading, setUnenrollLoading] = useState(false);
  const [deleteCourseLoading, setDeleteCourseLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch notes for the current course
   */
  const fetchNotes = useCallback(async () => {
    if (!courseId || !userId) return;
    
    setNotesLoading(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(
        import.meta.env.VITE_API_URL + "/searchCourse",
        {
          limit: 10,
          offset: 0,
          getThisData: {
            datasource: "Notes",
            attributes: [],
            where: { courseId, userId },
          },
        }
      );

      if (response.data?.data?.results) {
        setNotes(response.data.data.results);
        return response.data.data.results;
      }
      
      setNotes([]);
      return [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch notes";
      setError(errorMessage);
      console.error("Fetch notes error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setNotes([]);
      return [];
    } finally {
      setNotesLoading(false);
    }
  }, [courseId, userId, toast]);

  /**
   * Enroll user in the course
   */
  const enrollInCourse = useCallback(async () => {
    if (!userId || !courseId) {
      toast({
        title: "Error",
        description: "User or course information is missing",
        variant: "destructive",
      });
      return { success: false, error: "Missing user or course information" };
    }

    setEnrollmentLoading(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(
        import.meta.env.VITE_API_URL + "/userCourseEnrollment",
        { courseId }
      );

      if (response.data.status === 200) {
        toast({
          title: "Success",
          description: "Successfully enrolled in the course!",
          variant: "default",
        });
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || "Enrollment failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to enroll in the course";
      setError(errorMessage);
      console.error("Enrollment error:", err);
      toast({
        title: "Enrollment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setEnrollmentLoading(false);
    }
  }, [courseId, userId, toast]);

  /**
   * Unenroll (disenroll) user from the course
   */
  const unenrollFromCourse = useCallback(async () => {
    if (!userId || !courseId) {
      toast({
        title: "Error",
        description: "User or course information is missing",
        variant: "destructive",
      });
      return { success: false, error: "Missing user or course information" };
    }

    setUnenrollLoading(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(
        import.meta.env.VITE_API_URL + "/userCourseDisrollment",
        { courseId }
      );

      if (response.data.status === 200) {
        toast({
          title: "Success",
          description: "Successfully unenrolled from the course!",
          variant: "default",
        });
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || "Unenrollment failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to unenroll from the course";
      setError(errorMessage);
      console.error("Unenrollment error:", err);
      toast({
        title: "Unenrollment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setUnenrollLoading(false);
    }
  }, [courseId, userId, toast]);

  /**
   * Delete the course
   */
  const deleteCourse = useCallback(async () => {
    if (!userId || !courseId) {
      toast({
        title: "Error",
        description: "User or course information is missing",
        variant: "destructive",
      });
      return { success: false, error: "Missing user or course information" };
    }

    setDeleteCourseLoading(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(
        `${import.meta.env.VITE_API_URL}/deleteCourse`,
        { courseId }
      );

      if (response.data.status === 200) {
        toast({
          title: "Success",
          description: "Course successfully deleted!",
          variant: "default",
        });
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || "Course deletion failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete the course";
      setError(errorMessage);
      console.error("Course deletion error:", err);
      toast({
        title: "Deletion Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setDeleteCourseLoading(false);
    }
  }, [courseId, userId, toast]);

  /**
   * Refresh notes data
   */
  const refreshNotes = useCallback(() => {
    return fetchNotes();
  }, [fetchNotes]);

  return {
    // State
    notes,
    notesLoading,
    enrollmentLoading,
    unenrollLoading,
    deleteCourseLoading,
    error,
    
    // Actions
    fetchNotes,
    enrollInCourse,
    unenrollFromCourse,
    deleteCourse,
    refreshNotes,
    
    // Computed
    hasNotes: notes.length > 0,
    isLoading: notesLoading || enrollmentLoading || unenrollLoading || deleteCourseLoading,
  };
};

export default useCourseOverview;
