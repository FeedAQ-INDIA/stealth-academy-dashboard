import { Badge } from "@/components/ui/badge.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.jsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import {
  getMemberRoleDisplay,
  getMemberStatusDisplay,
  formatLastActive,
} from "@/utils/memberHelpers.js";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  UserCheck,
  Calendar,
  Clock,
} from "lucide-react";

/**
 * MemberDetailsSheet Component
 * Displays detailed information about a course room member
 */
export function MemberDetailsSheet({ open, onOpenChange, member, courseOwnerId }) {
  if (!member) return null;

  const roleDisplay = getMemberRoleDisplay(member, courseOwnerId);
  const RoleIcon = roleDisplay.icon;
  const statusDisplay = getMemberStatusDisplay(member);
  const StatusIcon = statusDisplay.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md h-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Member Details
          </SheetTitle>
          <SheetDescription>
            View detailed information about this course room member.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Member Profile Section */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.user?.profilePicture} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {member.user?.nameInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {member.user?.firstName + " " + member.user?.lastName || member.email}
              </h3>
              <p className="text-sm text-gray-500">
                {member.user?.email || member.email}
              </p>
              <div className="mt-2">
                <Badge className={roleDisplay.color}>
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {roleDisplay.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Member Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
              Member Information
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">
                    {member.user?.email || member.email}
                  </p>
                </div>
              </div>

              {member.user?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-600">{member.user.phone}</p>
                  </div>
                </div>
              )}

              {member.user?.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">{member.user.location}</p>
                  </div>
                </div>
              )}

              {member.user?.organization && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Organization</p>
                    <p className="text-sm text-gray-600">{member.user.organization}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Access Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
              Access Information
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Access Level</p>
                  <p className="text-sm text-gray-600">
                    {member.accessLevel || "SHARED"}
                  </p>
                </div>
              </div>

              

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Joined Date</p>
                  <p className="text-sm text-gray-600">
                    {member.v_created_date || "Recently joined"}
                  </p>
                </div>
              </div>

              {member.lastActiveDate && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Active</p>
                    <p className="text-sm text-gray-600">
                      {formatLastActive(member.lastActiveDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
