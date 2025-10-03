import { useState, useCallback, useMemo } from 'react';
import axiosConn from "@/axioscon.js";

export const useCourseState = (courseId) => {
  const [state, setState] = useState({
    course: null,
    userCourseContentProgress: null,
    userCourseEnrollment: null,
    notes: [],
    loading: false,
    error: null,
    progress: 0
  });

  const setLoading = useCallback((loading) => {
    setState(prev => ({ ...prev, loading, error: null }));
  }, []);

  const setError = useCallback((error) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const fetchCourseDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosConn.post(import.meta.env.VITE_API_URL + "/getCourseDetail", { courseId });
      setState(prev => ({
        ...prev,
        course: response.data.data,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  }, [courseId, setLoading]);

  const fetchUserCourseContentProgress = useCallback(async (userId) => {
    if (!userId || !courseId) return;
    
    try {
      setLoading(true);
      const response = await axiosConn.post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 2000,
        offset: 0,
        getThisData: {
          datasource: "UserCourseContentProgress",
          attributes: [],
          where: {
            userId,
            courseId,
          },
        },
      });
      setState(prev => ({
        ...prev,
        userCourseContentProgress: response.data.data?.results,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  }, [courseId, setLoading]);

  const fetchUserCourseEnrollment = useCallback(async (userId) => {
    if (!userId || !courseId) return;
    
    try {
      setLoading(true);
      const response = await axiosConn.post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 2000,
        offset: 0,
        getThisData: {
          datasource: "UserCourseEnrollment",
          attributes: [],
          where: {
            userId,
            courseId,
          },
        },
      });
      setState(prev => ({
        ...prev,
        userCourseEnrollment: response.data.data?.results,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  }, [courseId, setLoading]);

  const calculateProgress = useMemo(() => {
    if (!state.course?.courseTopic || !state.userCourseContentProgress) return 0;

    const totalContent = state.course.courseTopic.reduce(
      (acc, topic) => acc + (topic.courseTopicContent?.length || 0),
      0
    );

    const completedContent = state.userCourseContentProgress.filter(
      log => log.courseId === courseId && log.progressStatus === 'COMPLETED'
    ).length;

    return totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;
  }, [state.course, state.userCourseContentProgress, courseId]);

  return {
    ...state,
    progress: calculateProgress,
    actions: {
      fetchCourseDetail,
      fetchUserCourseContentProgress,
      fetchUserCourseEnrollment,
      setError,
      setLoading,
      updateState: setState
    }
  };
};
