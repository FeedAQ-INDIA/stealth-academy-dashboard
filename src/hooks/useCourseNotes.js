import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for CourseNotes component
 * Handles fetching, creating, updating, and deleting course notes
 * 
 * @param {string} courseId - The course ID
 * @param {string} userId - The current user ID
 * @returns {Object} Hook state and actions
 */
export const useCourseNotes = (courseId, userId) => {
  const { toast } = useToast();
  
  // State management
  const [courseNotes, setCourseNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [deletingNote, setDeletingNote] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all notes for the course with course content details
   */
  const fetchCourseNotes = useCallback(async () => {
    if (!courseId || !userId) return;
    
    setLoading(true);
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
            include: [
              {
                datasource: "CourseContent",
                as: "courseContent",
                required: true,
                where: { courseId },
              },
            ],
          },
        }
      );

      if (response.data?.data?.results) {
        setCourseNotes(response.data.data.results);
        return response.data.data.results;
      }
      
      setCourseNotes([]);
      return [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch course notes";
      setError(errorMessage);
      console.error("Fetch course notes error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setCourseNotes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [courseId, userId, toast]);

  /**
   * Create a new note or update an existing note
   * 
   * @param {Object} noteData - Note data
   * @param {number} noteData.notesId - Note ID (for updates)
   * @param {string} noteData.courseContentId - Course content ID
   * @param {string} noteData.noteContent - Note content
   * @param {string} noteData.noteRefTimestamp - Optional timestamp reference
   */
  const saveNote = useCallback(async (noteData) => {
    if (!courseId) {
      toast({
        title: "Error",
        description: "Course ID is missing",
        variant: "destructive",
      });
      return { success: false, error: "Missing course ID" };
    }

    setSavingNote(true);
    setError(null);
    
    try {
      const payload = {
        courseId,
        noteContent: noteData.noteContent,
      };

      // Add optional fields if provided
      if (noteData.notesId) {
        payload.notesId = noteData.notesId;
      }
      if (noteData.courseContentId) {
        payload.courseContentId = noteData.courseContentId;
      }
      if (noteData.noteRefTimestamp) {
        payload.noteRefTimestamp = noteData.noteRefTimestamp;
      }

      const response = await axiosConn.post(
        import.meta.env.VITE_API_URL + "/saveNote",
        payload
      );

      if (response.data?.status === 200 || response.data?.success) {
        const successMessage = noteData.notesId 
          ? "Note updated successfully" 
          : "Note created successfully";
        
        toast({
          title: "Success",
          description: successMessage,
        });
        
        // Refresh notes list
        await fetchCourseNotes();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to save note");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save note";
      setError(errorMessage);
      console.error("Save note error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setSavingNote(false);
    }
  }, [courseId, toast, fetchCourseNotes]);

  /**
   * Delete a note
   * 
   * @param {number} notesId - Note ID to delete
   */
  const deleteNote = useCallback(async (notesId) => {
    if (!notesId) {
      toast({
        title: "Error",
        description: "Note ID is missing",
        variant: "destructive",
      });
      return { success: false, error: "Missing note ID" };
    }

    setDeletingNote(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(
        import.meta.env.VITE_API_URL + "/deleteNote",
        { notesId }
      );

      if (response.data?.status === 200 || response.data?.success) {
        toast({
          title: "Success",
          description: "Note deleted successfully",
        });
        
        // Refresh notes list
        await fetchCourseNotes();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to delete note");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete note";
      setError(errorMessage);
      console.error("Delete note error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setDeletingNote(false);
    }
  }, [toast, fetchCourseNotes]);

  /**
   * Update an existing note
   * 
   * @param {number} notesId - Note ID
   * @param {string} noteContent - Updated note content
   */
  const updateNote = useCallback(async (notesId, noteContent) => {
    return saveNote({ notesId, noteContent });
  }, [saveNote]);

  /**
   * Create a new note
   * 
   * @param {Object} noteData - Note data
   */
  const createNote = useCallback(async (noteData) => {
    return saveNote(noteData);
  }, [saveNote]);

  /**
   * Refresh notes data
   */
  const refreshNotes = useCallback(() => {
    return fetchCourseNotes();
  }, [fetchCourseNotes]);

  return {
    // State
    courseNotes,
    loading,
    savingNote,
    deletingNote,
    error,
    
    // Actions
    fetchCourseNotes,
    saveNote,
    deleteNote,
    updateNote,
    createNote,
    refreshNotes,
    
    // Computed
    hasNotes: courseNotes.length > 0,
    notesCount: courseNotes.length,
    isProcessing: loading || savingNote || deletingNote,
  };
};

export default useCourseNotes;
