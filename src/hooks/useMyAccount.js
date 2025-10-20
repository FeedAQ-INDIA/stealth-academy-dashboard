import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for MyAccount component
 * Handles user profile updates
 * 
 * @param {Object} userDetail - Current user details
 * @returns {Object} Hook state and actions
 */
export const useMyAccount = (userDetail) => {
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  // State management
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Update user profile
   * 
   * @param {Object} profileData - Updated profile data
   * @param {string} profileData.firstName - First name
   * @param {string} profileData.lastName - Last name
   * @param {string} profileData.email - Email address
   * @param {string} profileData.number - Phone number
   * @param {string} profileData.bio - User bio (optional)
   * @param {Object} profileData.additionalFields - Any additional fields
   */
  const updateProfile = useCallback(async (profileData) => {
    if (!userDetail?.userId) {
      toast({
        title: "Error",
        description: "User information is missing",
        variant: "destructive",
      });
      return { success: false, error: "User information is missing" };
    }

    setSaving(true);
    setError(null);
    
    try {
      const payload = {
        userId: userDetail.userId,
        ...profileData,
      };

      const response = await axiosConn.post(
        `${API_BASE_URL}/saveUserDetail`,
        payload
      );

      if (response.data?.status === 200 || response.data?.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to update profile");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile";
      setError(errorMessage);
      console.error("Update profile error:", err);
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  }, [userDetail, API_BASE_URL, toast]);

  /**
   * Update specific field
   * 
   * @param {string} field - Field name
   * @param {any} value - Field value
   */
  const updateField = useCallback(async (field, value) => {
    return updateProfile({ [field]: value });
  }, [updateProfile]);

  /**
   * Update phone number
   * 
   * @param {string} phoneNumber - Phone number
   */
  const updatePhoneNumber = useCallback(async (phoneNumber) => {
    return updateProfile({ number: phoneNumber });
  }, [updateProfile]);

  /**
   * Update email
   * 
   * @param {string} email - Email address
   */
  const updateEmail = useCallback(async (email) => {
    return updateProfile({ email });
  }, [updateProfile]);

  /**
   * Update name
   * 
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   */
  const updateName = useCallback(async (firstName, lastName) => {
    return updateProfile({ firstName, lastName });
  }, [updateProfile]);

  return {
    // State
    saving,
    error,
    
    // Actions
    updateProfile,
    updateField,
    updatePhoneNumber,
    updateEmail,
    updateName,
    
    // Computed
    isProcessing: saving,
  };
};

export default useMyAccount;
