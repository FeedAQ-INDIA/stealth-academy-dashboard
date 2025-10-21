import { Badge } from "@/components/ui/badge.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.jsx";
import {
  Mail,
  Calendar,
  Clock,
  UserPlus,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarClock,
} from "lucide-react";
import PropTypes from "prop-types";

/**
 * Get invite status display configuration
 */
function getInviteStatusDisplay(status) {
  const statusMap = {
    PENDING: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    ACCEPTED: {
      label: "Accepted",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    DECLINED: {
      label: "Declined",
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
    EXPIRED: {
      label: "Expired",
      color: "bg-gray-100 text-gray-800",
      icon: AlertCircle,
    },
  };

  return statusMap[status] || statusMap.PENDING;
}

/**
 * InvitedMemberDetailsSheet Component
 * Displays detailed information about an invited (pending) member
 */
export function InvitedMemberDetailsSheet({ open, onOpenChange, member }) {
  if (!member) return null;

  const statusDisplay = getInviteStatusDisplay(member.inviteStatus);
  const StatusIcon = statusDisplay.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md h-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Invitation Details
          </SheetTitle>
          <SheetDescription>
            View detailed information about this pending invitation.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Invite Profile Section */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {member.inviteeEmail}
              </h3>
              <p className="text-sm text-gray-500">Invited User</p>
              <div className="mt-2">
                <Badge className={statusDisplay.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusDisplay.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Invitation Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
              Invitation Information
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Address</p>
                  <p className="text-sm text-gray-600">{member.inviteeEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-sm text-gray-600">{member.inviteStatus}</p>
                </div>
              </div>

              {member.accessLevel && (
                <div className="flex items-center gap-3">
                  <UserPlus className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Access Level</p>
                    <p className="text-sm text-gray-600">{member.accessLevel}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Date Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
              Date Information
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Invited Date</p>
                  <p className="text-sm text-gray-600">
                    {member.v_created_date || "Recently invited"}
                  </p>
                </div>
              </div>

              {member.v_expires_date && (
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Expires At</p>
                    <p className="text-sm text-gray-600">
                      {member.v_expires_date} {member.v_expires_time}
                    </p>
                  </div>
                </div>
              )}

              {member.invitedBy && (
                <div className="flex items-center gap-3">
                  <UserPlus className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Invited By</p>
                    <p className="text-sm text-gray-600">{member.invitedBy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {member.inviteStatus === "PENDING" && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Pending Invitation
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    This user has been invited but hasn&apos;t accepted yet. The invitation
                    will expire on {member.v_expires_date}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {member.inviteStatus === "DECLINED" && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Invitation Declined
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    This user has declined the invitation to join the course.
                  </p>
                </div>
              </div>
            </div>
          )}

          {member.inviteStatus === "EXPIRED" && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Invitation Expired
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    This invitation has expired. You can send a new invitation if needed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

InvitedMemberDetailsSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  member: PropTypes.shape({
    inviteeEmail: PropTypes.string,
    inviteStatus: PropTypes.string,
    accessLevel: PropTypes.string,
    v_created_date: PropTypes.string,
    v_expires_date: PropTypes.string,
    v_expires_time: PropTypes.string,
    invitedBy: PropTypes.string,
  }),
};
