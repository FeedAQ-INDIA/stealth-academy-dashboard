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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.jsx";
import { Calendar, Eye, Trash2 } from "lucide-react";

/**
 * InvitedMembersTable Component
 * Displays the list of invited (pending) members
 */
export function InvitedMembersTable({
  invitedMembers,
  isCourseOwner,
  isAdmin,
  onViewDetails,
  onCancelInvite,
}) {
  if (!invitedMembers || invitedMembers.length === 0) {
    return null;
  }

  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Invited User</TableHead>
             <TableHead>Status</TableHead>
            <TableHead>Expires at</TableHead>
            <TableHead>Invited Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitedMembers.map((member) => {
            return (
              <TableRow key={member.inviteeEmail}>
                <TableCell className="font-medium">
                  <div className="font-medium text-gray-900">
                    {member.inviteeEmail}
                  </div>
                </TableCell>
 d

                <TableCell className="font-medium">
                  <div className="font-medium text-gray-900">
                    {member.inviteStatus}
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  <div className="font-medium text-gray-900">
                    {member.v_expires_date + " " + member.v_expires_time}
                  </div>
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Cancel Invite
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancel Invitation?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will cancel the pending invitation for{" "}
                              {member.inviteeEmail}. This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Invite</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => onCancelInvite(member)}
                            >
                              Cancel Invite
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
