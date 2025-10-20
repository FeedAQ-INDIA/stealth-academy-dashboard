import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for MyCourse component
 * Handles fetching enrolled courses with progress tracking
 * 
 * @param {string} userId - The current user ID
 * @returns {Object} Hook state and actions
 */
export const useMyCourses = (userId) => {
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  // State management
  const [courses, setCourses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');

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
   * Build API query based on current state
   */
  const buildQuery = useCallback((options = {}) => {
    const query = {
      limit: options.limit || limit,
      offset: options.offset !== undefined ? options.offset : offset,
      getThisData: {
        datasource: "Course",
        attributes: [],
        include: [
          {
            datasource: "UserCourseEnrollment",
            as: "enrollments",
            where: {
              userId,
            },
            required: true,
          },
          {
            datasource: "CourseContent",
            as: "courseContent",
            required: false,
          },
          {
            datasource: "UserCourseContentProgress",
            as: "activityLogs",
            where: {
              userId,
            },
            required: false,
          },
        ],
      },
    };

    // Add search filter
    if (searchQuery && searchQuery.trim()) {
      query.getThisData.where = {
        courseTitle: {
          $like: `%${searchQuery.trim().toUpperCase()}%`,
        },
      };
    }

    // Add sorting
    let orderClause = [];
    switch (sortBy) {
      case 'title':
        orderClause = [["courseTitle", "ASC"]];
        break;
      case 'recent':
        orderClause = [["createdAt", "DESC"]];
        break;
      case 'progress':
        orderClause = [["updatedAt", "DESC"]];
        break;
      default:
        orderClause = [["createdAt", "DESC"]];
    }
    query.getThisData.order = orderClause;

    return query;
  }, [userId, limit, offset, searchQuery, sortBy]);

  /**
   * Fetch enrolled courses
   * 
   * @param {Object} options - Fetch options
   */
  const fetchCourses = useCallback(async (options = {}) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const query = buildQuery(options);
      const response = await axiosConn.post(`${API_BASE_URL}/searchCourse`, query);

      if (response.data?.data?.results) {
        const fetchedCourses = response.data.data.results;
        
        // Calculate progress for each course
        fetchedCourses.forEach((course) => {
          course.progress = calculateProgress(course);
        });

        setCourses(fetchedCourses);
        setTotalCount(response.data.data.totalCount || 0);
        setOffset(response.data.data.offset || 0);
        setLimit(response.data.data.limit || 12);
        
        return fetchedCourses;
      }
      
      setCourses([]);
      return [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch courses";
      setError(errorMessage);
      console.error("Fetch courses error:", err);
      toast({
        title: "Error loading courses",
        description: errorMessage,
        variant: "destructive",
      });
      setCourses([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId, API_BASE_URL, toast, buildQuery, calculateProgress]);

  /**
   * Search courses
   * 
   * @param {string} query - Search query
   */
  const searchCourses = useCallback((query) => {
    setSearchQuery(query);
    setOffset(0);
    fetchCourses({ offset: 0 });
  }, [fetchCourses]);

  /**
   * Change sort order
   * 
   * @param {string} sortOption - Sort option ('recent', 'title', 'progress')
   */
  const changeSortOrder = useCallback((sortOption) => {
    setSortBy(sortOption);
    setOffset(0);
    fetchCourses({ offset: 0 });
  }, [fetchCourses]);

  /**
   * Apply filter
   * 
   * @param {string} filterOption - Filter option ('all', 'in-progress', 'completed', 'not-started')
   */
  const applyFilter = useCallback((filterOption) => {
    setFilterBy(filterOption);
    setOffset(0);
    // Filter logic would be applied here based on enrollment status
    fetchCourses({ offset: 0 });
  }, [fetchCourses]);

  /**
   * Navigate to next page
   */
  const nextPage = useCallback(() => {
    if (offset + limit < totalCount) {
      const newOffset = offset + limit;
      setOffset(newOffset);
      fetchCourses({ offset: newOffset });
    }
  }, [offset, limit, totalCount, fetchCourses]);

  /**
   * Navigate to previous page
   */
  const previousPage = useCallback(() => {
    if (offset > 0) {
      const newOffset = Math.max(0, offset - limit);
      setOffset(newOffset);
      fetchCourses({ offset: newOffset });
    }
  }, [offset, limit, fetchCourses]);

  /**
   * Refresh courses
   */
  const refreshCourses = useCallback(() => {
    return fetchCourses({ offset: 0 });
  }, [fetchCourses]);

  /**
   * Get filtered courses based on current filter
   */
  const getFilteredCourses = useCallback(() => {
    if (filterBy === 'all') return courses;
    
    return courses.filter(course => {
      const progress = course.progress || 0;
      
      switch (filterBy) {
        case 'in-progress':
          return progress > 0 && progress < 100;
        case 'completed':
          return progress === 100;
        case 'not-started':
          return progress === 0;
        default:
          return true;
      }
    });
  }, [courses, filterBy]);

  /**
   * Get course statistics
   */
  const getCourseStats = useCallback(() => {
    const total = courses.length;
    const inProgress = courses.filter(c => {
      const progress = c.progress || 0;
      return progress > 0 && progress < 100;
    }).length;
    const completed = courses.filter(c => (c.progress || 0) === 100).length;
    const notStarted = courses.filter(c => (c.progress || 0) === 0).length;

    return {
      total,
      inProgress,
      completed,
      notStarted,
    };
  }, [courses]);

  return {
    // State
    courses,
    totalCount,
    limit,
    offset,
    loading,
    error,
    searchQuery,
    sortBy,
    filterBy,
    
    // Actions
    fetchCourses,
    searchCourses,
    changeSortOrder,
    applyFilter,
    nextPage,
    previousPage,
    refreshCourses,
    
    // Computed
    filteredCourses: getFilteredCourses(),
    stats: getCourseStats(),
    hasCourses: courses.length > 0,
    hasNextPage: offset + limit < totalCount,
    hasPreviousPage: offset > 0,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(totalCount / limit),
  };
};

export default useMyCourses;
