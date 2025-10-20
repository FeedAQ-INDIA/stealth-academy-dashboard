import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Global Loading Context
 * Provides centralized loading state management across the application
 */

const LoadingContext = createContext(undefined);

/**
 * Loading Provider Component
 * Wraps the application to provide global loading state
 */
export function LoadingProvider({ children }) {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  /**
   * Start loading for a specific key
   * @param {string} key - Unique identifier for the loading operation
   */
  const startLoading = useCallback((key) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
  }, []);

  /**
   * Stop loading for a specific key
   * @param {string} key - Unique identifier for the loading operation
   */
  const stopLoading = useCallback((key) => {
    setLoadingStates((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  /**
   * Check if a specific key is loading
   * @param {string} key - Unique identifier to check
   * @returns {boolean}
   */
  const isLoading = useCallback((key) => {
    return !!loadingStates[key];
  }, [loadingStates]);

  /**
   * Check if any loading operation is active
   * @returns {boolean}
   */
  const isAnyLoading = useCallback(() => {
    return Object.keys(loadingStates).length > 0 || globalLoading;
  }, [loadingStates, globalLoading]);

  /**
   * Start global loading (full page overlay)
   */
  const startGlobalLoading = useCallback(() => {
    setGlobalLoading(true);
  }, []);

  /**
   * Stop global loading
   */
  const stopGlobalLoading = useCallback(() => {
    setGlobalLoading(false);
  }, []);

  /**
   * Clear all loading states
   */
  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
    setGlobalLoading(false);
  }, []);

  const value = {
    startLoading,
    stopLoading,
    isLoading,
    isAnyLoading,
    startGlobalLoading,
    stopGlobalLoading,
    clearAllLoading,
    globalLoading,
    loadingStates,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

/**
 * Custom hook to use loading context
 * @returns {Object} Loading context methods and state
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

/**
 * Custom hook for managing async operations with automatic loading states
 * @param {Function} asyncFunction - Async function to execute
 * @param {string} loadingKey - Unique key for the loading state
 * @returns {Object} Execute function, loading state, error, and data
 */
export function useAsyncLoading(asyncFunction, loadingKey) {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        startLoading(loadingKey);
        setError(null);
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        stopLoading(loadingKey);
      }
    },
    [asyncFunction, loadingKey, startLoading, stopLoading]
  );

  return {
    execute,
    loading: isLoading(loadingKey),
    error,
    data,
  };
}

export default LoadingContext;
