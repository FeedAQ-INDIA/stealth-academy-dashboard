import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { useState } from "react";
import { Users, Mail } from "lucide-react";
import { useCourse } from "./CourseContext";
import { useAuthStore } from "@/zustland/store";
import { useCourseRoomMembers } from "@/hooks/useCourseRoomMembers.js";
import { MemberInviteSheet } from "./components/MemberInviteSheet";
import { MemberDetailsSheet } from "./components/MemberDetailsSheet";
import { MemberUpdateSheet } from "./components/MemberUpdateSheet";
import { RevokeAccessDialog } from "./components/RevokeAccessDialog";
import { MembersTable } from "./components/MembersTable";
import { InvitedMembersTable } from "./components/InvitedMembersTable";

/**
 * CourseRoomMembers Component
 * Main orchestration component for managing course room members
 * Displays active members, invited members, and handles member management
 */
function CourseRoomMembers() {
  const { courseList } = useCourse();
  const { userDetail } = useAuthStore();

  // Custom hook for member operations
  const {
    members,
    invitedMembers,
    inviteMembers,
    updateMember,
    revokeAccess,
    cancelInvite,
  } = useCourseRoomMembers(
    courseList?.courseId,
    userDetail?.userId,
    userDetail?.organizationId
  );

  // Permission checks
  const isCourseOwner = courseList?.userId === userDetail?.userId;
  const isAdmin =
    members?.some(
      (m) => m.user?.userId === userDetail?.userId && m.accessLevel === "ADMIN"
    ) || false;

  // UI state
  const [viewMode, setViewMode] = useState("members");
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false);
  const [memberDetailsSheetOpen, setMemberDetailsSheetOpen] = useState(false);
  const [memberUpdateSheetOpen, setMemberUpdateSheetOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Event handlers
  const handleViewMemberDetails = (member) => {
    setSelectedMember(member);
    setMemberDetailsSheetOpen(true);
  };

  const handleUpdateMember = (member) => {
    setSelectedMember(member);
    setMemberUpdateSheetOpen(true);
  };

  const handleInviteSubmit = async (data) => {
    await inviteMembers(data);
    setInviteSheetOpen(false);
  };

  const handleMemberUpdate = async (data, member) => {
    await updateMember(data, member);
    setMemberUpdateSheetOpen(false);
    setSelectedMember(null);
  };

  const handleCancelInvite = async (member) => {
    await cancelInvite(member);
  };

  const handleRevokeAccess = (member) => {
    setSelectedMember(member);
    setRevokeDialogOpen(true);
  };

  const handleConfirmRevoke = async (member) => {
    await revokeAccess(member);
    setRevokeDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <>
      {/* Header Card */}
      <Card className="border-0 bg-white shadow-md rounded-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                 
              </CardTitle>

              {/* View Mode Select */}
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="members">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" /> Members
                    </div>
                  </SelectItem>
                  <SelectItem value="invited">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" /> Invited Users
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invite Members Sheet */}
            <MemberInviteSheet
              open={inviteSheetOpen}
              onOpenChange={setInviteSheetOpen}
              onInviteSubmit={handleInviteSubmit}
              isCourseOwner={isCourseOwner}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Members Content */}
      <div className="bg-white shadow-md rounded-md">
        {viewMode === "members" ? (
          !members || members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No members yet
              </h3>
              <p className="text-gray-500 mb-4">
                Be the first to invite members to this course room!
              </p>
            </div>
          ) : (
            <MembersTable
              members={members}
              courseOwnerId={courseList?.userId}
              isCourseOwner={isCourseOwner}
              isAdmin={isAdmin}
              onViewDetails={handleViewMemberDetails}
              onUpdateMember={handleUpdateMember}
              onRevokeAccess={handleRevokeAccess}
            />
          )
        ) : !invitedMembers || invitedMembers.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No pending invitations
            </h3>
            <p className="text-gray-500 mb-4">
              Invite members to get started!
            </p>
          </div>
        ) : (
          <InvitedMembersTable
            invitedMembers={invitedMembers}
            isCourseOwner={isCourseOwner}
            isAdmin={isAdmin}
            onViewDetails={handleViewMemberDetails}
            onCancelInvite={handleCancelInvite}
          />
        )}
      </div>

      {/* Member Details Sheet */}
      <MemberDetailsSheet
        open={memberDetailsSheetOpen}
        onOpenChange={setMemberDetailsSheetOpen}
        member={selectedMember}
        courseOwnerId={courseList?.userId}
      />

      {/* Member Update Sheet */}
      <MemberUpdateSheet
        open={memberUpdateSheetOpen}
        onOpenChange={setMemberUpdateSheetOpen}
        member={selectedMember}
        onUpdateSubmit={handleMemberUpdate}
        isCourseOwner={isCourseOwner}
      />

      {/* Revoke Access Dialog */}
      <RevokeAccessDialog
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        member={selectedMember}
        onConfirm={handleConfirmRevoke}
      />
    </>
  );
}

export default CourseRoomMembers;
