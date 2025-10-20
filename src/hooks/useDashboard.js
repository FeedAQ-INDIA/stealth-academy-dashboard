import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for Dashboard component
 * Handles fetching enrolled courses and completed courses
 * 
 * @param {string} userId - The current user ID
 * @returns {Object} Hook state and actions
 */
export const useDashboard = (userId) => {
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  // State management
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [completedTotalCount, setCompletedTotalCount] = useState(0);
  const [limit, setLimit] = useState(4);
  const [offset, setOffset] = useState(0);
  const [loadingEnrolled, setLoadingEnrolled] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calculate progress for a course
   * 
   * @param {Object} course - Course object
   * @returns {number} Progress percentage
   */
  const calculateProgress = useCallback((course) => {
    if (!course?.courseContent) return 0;

    const completedContent = course.activityLogs?.filter(
      (p) => p.progressStatus === "COMPLETED"
    )?.length || 0;

    const totalContent = course.courseContent?.length || 0;
    const progressPercentage = totalContent > 0
      ? Math.round((completedContent / totalContent) * 100)
      : 0;

    return progressPercentage;
  }, []);

  /**
   * Fetch enrolled courses (not completed)
   * 
   * @param {Object} options - Fetch options
   * @param {number} options.limit - Limit per page
   * @param {number} options.offset - Offset for pagination
   */
  const fetchEnrolledCourses = useCallback(async (options = {}) => {
    if (!userId) return;
    
    setLoadingEnrolled(true);
    setError(null);
    
    const fetchLimit = options.limit || limit;
    const fetchOffset = options.offset || offset;
    
    try {
      const response = await axiosConn.post(`${API_BASE_URL}/searchCourse`, {
        limit: fetchLimit,
        offset: fetchOffset,
        getThisData: {
          datasource: "Course",
          attributes: [],
          include: [
            {
              datasource: "CourseAccess",
              as: "accessControls",
              where: {
                userId,
                accessLevel: "OWN",
              },
              required: true,
            },
            {
              datasource: "UserCourseContentProgress",
              as: "activityLogs",
              where: {
                userId,
              },
              required: false,
            },
            {
              datasource: "UserCourseEnrollment",
              as: "enrollments",
              where: {
                enrollmentStatus: { $ne: "COMPLETED" },
                userId,
              },
              required: true,
            },
            {
              datasource: "CourseContent",
              as: "courseContent",
              required: true,
            },
          ],
        },
      });

      if (response.data?.data?.results) {
        const courses = response.data.data.results;
        
        // Calculate progress for each course
        courses.forEach((course) => {
          course.progress = calculateProgress(course);
        });

        setEnrolledCourses(courses);
        setTotalCount(response.data.data.totalCount || 0);
        setOffset(response.data.data.offset || 0);
        setLimit(response.data.data.limit || 4);
        
        return courses;
      }
      
      setEnrolledCourses([]);
      return [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch enrolled courses";
      setError(errorMessage);
      console.error("Fetch enrolled courses error:", err);
      toast({
        title: "Error loading courses",
        description: errorMessage,
        variant: "destructive",
      });
      setEnrolledCourses([]);
      return [];
    } finally {
      setLoadingEnrolled(false);
    }
  }, [userId, limit, offset, API_BASE_URL, toast, calculateProgress]);

  /**
   * Fetch completed courses
   * 
   * @param {Object} options - Fetch options
   * @param {number} options.limit - Limit per page
   */
  const fetchCompletedCourses = useCallback(async (options = {}) => {
    if (!userId) return;
    
    setLoadingCompleted(true);
    setError(null);
    
    const fetchLimit = options.limit || 200;
    
    try {
      const response = await axiosConn.post(`${API_BASE_URL}/searchCourse`, {
        limit: fetchLimit,
        offset: 0,
        getThisData: {
          datasource: "UserCourseEnrollment",
          attributes: [],
          where: {
            enrollmentStatus: "COMPLETED",
            userId,
          },
          include: [
            {
              datasource: "Course",
              as: "course",
              required: true,
              include: [
                {
                  datasource: "CourseContent",
                  as: "courseContent",
                  required: false,
                },
              ],
            },
          ],
        },
      });

      if (response.data?.data?.results) {
        const enrollments = response.data.data.results;
        const courses = enrollments.map(enrollment => enrollment.course).filter(Boolean);
        
        setCompletedCourses(courses);
        setCompletedTotalCount(courses.length);
        
        return courses;
      }
      
      setCompletedCourses([]);
      return [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch completed courses";
      setError(errorMessage);
      console.error("Fetch completed courses error:", err);
      setCompletedCourses([]);
      return [];
    } finally {
      setLoadingCompleted(false);
    }
  }, [userId, API_BASE_URL]);

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = useCallback(async () => {
    await Promise.all([
      fetchEnrolledCourses(),
      fetchCompletedCourses(),
    ]);
  }, [fetchEnrolledCourses, fetchCompletedCourses]);

  /**
   * Navigate to next page of enrolled courses
   */
  const nextPage = useCallback(() => {
    if (offset + limit < totalCount) {
      const newOffset = offset + limit;
      setOffset(newOffset);
      fetchEnrolledCourses({ offset: newOffset });
    }
  }, [offset, limit, totalCount, fetchEnrolledCourses]);

  /**
   * Navigate to previous page of enrolled courses
   */
  const previousPage = useCallback(() => {
    if (offset > 0) {
      const newOffset = Math.max(0, offset - limit);
      setOffset(newOffset);
      fetchEnrolledCourses({ offset: newOffset });
    }
  }, [offset, limit, fetchEnrolledCourses]);

  /**
   * Refresh dashboard data
   */
  const refreshDashboard = useCallback(() => {
    return fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Get analytics about courses
   */
  const getAnalytics = useCallback(() => {
    const totalEnrolled = totalCount;
    const totalCompleted = completedTotalCount;
    const inProgress = enrolledCourses.filter(
      course => course.progress > 0 && course.progress < 100
    ).length;
    const notStarted = enrolledCourses.filter(
      course => course.progress === 0
    ).length;

    return {
      totalEnrolled,
      totalCompleted,
      inProgress,
      notStarted,
      totalCourses: totalEnrolled + totalCompleted,
    };
  }, [enrolledCourses, totalCount, completedTotalCount]);

  return {
    // State
    enrolledCourses,
    completedCourses,
    totalCount,
    completedTotalCount,
    limit,
    offset,
    loadingEnrolled,
    loadingCompleted,
    error,
    
    // Actions
    fetchEnrolledCourses,
    fetchCompletedCourses,
    fetchDashboardData,
    nextPage,
    previousPage,
    refreshDashboard,
    calculateProgress,
    
    // Computed
    getAnalytics,
    hasEnrolledCourses: enrolledCourses.length > 0,
    hasCompletedCourses: completedCourses.length > 0,
    hasNextPage: offset + limit < totalCount,
    hasPreviousPage: offset > 0,
    isLoading: loadingEnrolled || loadingCompleted,
  };
};

export default useDashboard;
