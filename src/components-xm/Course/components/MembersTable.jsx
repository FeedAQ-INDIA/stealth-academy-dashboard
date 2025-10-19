import { Button } from "@/components/ui/button.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { getMemberRoleDisplay } from "@/utils/memberHelpers.js";
import { Calendar, Eye, Edit, UserMinus } from "lucide-react";

/**
 * MembersTable Component
 * Displays the list of active course room members
 */
export function MembersTable({
  members,
  courseOwnerId,
  isCourseOwner,
  isAdmin,
  onViewDetails,
  onUpdateMember,
  onRevokeAccess,
}) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const roleDisplay = getMemberRoleDisplay(member, courseOwnerId);
            const RoleIcon = roleDisplay.icon;

            return (
              <TableRow key={member.user?.userId || member.email}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user?.profilePicture} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {member.user?.nameInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {member.user?.firstName +
                          " " +
                          member.user?.lastName || member.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={roleDisplay.color}
                  >
                    <RoleIcon className="h-3 w-3" />
                    {roleDisplay.role}
                  </Button>
                </TableCell>

                <TableCell className="text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {member.v_created_date}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(member)}
                      className="h-8 px-2"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>

                    {(isCourseOwner || isAdmin) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateMember(member)}
                          className="h-8 px-2"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>

                        {member.user?.userId !== courseOwnerId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRevokeAccess(member)}
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            Revoke
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
