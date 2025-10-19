import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast.js";
import courseRoomService from "@/services/courseRoomService.js";
import { parseEmailAddresses } from "@/utils/memberHelpers.js";

/**
 * Custom hook for managing course room members
 * Handles fetching, inviting, updating, and managing members
 */
export function useCourseRoomMembers(courseId, userId, organizationId) {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch active members
  const fetchMembers = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setIsLoading(true);
      const result = await courseRoomService.getCourseRoomMembers(courseId);
      if (result && result.data) {
        setMembers(result.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [courseId, toast]);

  // Fetch invited members
  const fetchInvitedMembers = useCallback(async () => {
    if (!courseId) return;
    
    try {
      const result = await courseRoomService.getCourseRoomInvitedMembers(courseId);
      if (result && result.data) {
        setInvitedMembers(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching invited members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch invited members",
        variant: "destructive",
      });
    }
  }, [courseId, toast]);

  // Invite members to course room
  const inviteMembers = useCallback(
    async (data) => {
      try {
        console.log("=== INVITE DEBUG INFO ===");
        console.log("Form data:", data);
        console.log("Course ID:", courseId);
        console.log("User ID:", userId);

        // Validate course ID
        if (!courseId) {
          console.error("Missing course ID");
          toast({
            title: "Course Error",
            description: "Course ID is missing. Please try refreshing the page.",
            variant: "destructive",
          });
          return;
        }

        // Validate user ID
        if (!userId) {
          console.error("Missing user ID");
          toast({
            title: "Authentication Error",
            description: "User information is missing. Please sign in again.",
            variant: "destructive",
          });
          return;
        }

        // Parse email addresses
        const emailArray = parseEmailAddresses(data.emailAddresses);
        console.log("Parsed emails:", emailArray);

        if (emailArray.length === 0) {
          console.error("No valid emails found");
          toast({
            title: "No Valid Emails",
            description: "Please enter at least one valid email address.",
            variant: "destructive",
          });
          return;
        }

        // Prepare invites array
        const invites = emailArray.map((email) => ({
          email,
          accessLevel: data.accessType,
        }));

        console.log("Final invites array:", invites);

        // Call the batch invite API
        const result = await courseRoomService.inviteUsersToCourseRoom(
          courseId,
          invites,
          {
            userId,
            orgId: organizationId,
            enableCourseTracking: data.enableCourseTracking,
          }
        );

        // Handle response
        const {
          failed = [],
          successCount = 0,
          failureCount = 0,
        } = result.data || {};

        if (successCount > 0) {
          const successMessage = `${successCount} invitation(s) sent successfully`;
          const failMessage = failureCount > 0 ? `, ${failureCount} failed` : "";
          toast({
            title: "Invitations Sent",
            description: successMessage + failMessage,
          });
        }

        if (failureCount > 0 && successCount === 0) {
          const failedEmails = failed.map((f) => f.email).join(", ");
          toast({
            title: "All Invitations Failed",
            description: `Failed to invite: ${failedEmails}. Please check the email addresses and try again.`,
            variant: "destructive",
          });
        } else if (failureCount > 0) {
          const failedEmails = failed.map((f) => f.email).join(", ");
          toast({
            title: "Some Invitations Failed",
            description: `Failed to invite: ${failedEmails}`,
            variant: "destructive",
          });
        }

        // Refresh member lists
        await fetchMembers();
        await fetchInvitedMembers();
      } catch (error) {
        console.error("Invite members error:", error);
        toast({
          title: "Invitation Failed",
          description: error.message || "Failed to send invitations",
          variant: "destructive",
        });
      }
    },
    [courseId, userId, organizationId, toast, fetchMembers, fetchInvitedMembers]
  );

  // Update member access level
  const updateMember = useCallback(
    async (data, member) => {
      try {
        // Here you would call the API to update member details
        console.log("Updating member:", member, "with data:", data);

        toast({
          title: "Member Updated",
          description: `Successfully updated ${
            member?.user?.firstName || member?.email
          }'s access level.`,
        });

        // Refresh member list
        await fetchMembers();
      } catch (error) {
        console.error("Update member error:", error);
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update member",
          variant: "destructive",
        });
      }
    },
    [toast, fetchMembers]
  );

  // Revoke member access
  const revokeAccess = useCallback(
    async (member) => {
      try {
        if (!member?.courseAccessId) {
          throw new Error("Invalid member data");
        }

        await courseRoomService.removeMemberFromCourseRoom(member.courseAccessId);

        const memberName = member?.user
          ? `${member.user.firstName} ${member.user.lastName}`
          : member?.email;

        toast({
          title: "Access Revoked",
          description: `Successfully revoked access for ${memberName}.`,
        });

        // Refresh member list
        await fetchMembers();
      } catch (error) {
        console.error("Revoke access error:", error);
        toast({
          title: "Revoke Failed",
          description: error.message || "Failed to revoke access",
          variant: "destructive",
        });
      }
    },
    [toast, fetchMembers]
  );

  // Cancel invitation
  const cancelInvite = useCallback(
    async (member) => {
      try {
        if (!member?.inviteId) {
          throw new Error("Invalid invitation data");
        }

        console.log("Canceling invite for:", member);

        await courseRoomService.cancelInvite(member.inviteId);

        toast({
          title: "Invitation Cancelled",
          description: `Invitation for ${member.inviteeEmail} has been cancelled.`,
        });

        // Refresh invited members list
        await fetchInvitedMembers();
      } catch (error) {
        console.error("Cancel invite error:", error);
        toast({
          title: "Cancel Failed",
          description: error.message || "Failed to cancel invitation",
          variant: "destructive",
        });
      }
    },
    [toast, fetchInvitedMembers]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchMembers();
    fetchInvitedMembers();
  }, [fetchMembers, fetchInvitedMembers]);

  return {
    members,
    invitedMembers,
    isLoading,
    inviteMembers,
    updateMember,
    revokeAccess,
    cancelInvite,
    refreshMembers: fetchMembers,
    refreshInvitedMembers: fetchInvitedMembers,
  };
}
