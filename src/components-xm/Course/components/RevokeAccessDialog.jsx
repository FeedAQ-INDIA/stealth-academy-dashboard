import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { AlertTriangle } from "lucide-react";

/**
 * RevokeAccessDialog Component
 * Confirmation dialog for revoking member access with type-to-confirm functionality
 */
export function RevokeAccessDialog({ open, onOpenChange, member, onConfirm }) {
  const [confirmText, setConfirmText] = useState("");
  const CONFIRMATION_TEXT = "REVOKE";

  const memberName = member?.user
    ? `${member.user.firstName} ${member.user.lastName}`
    : member?.email || "this member";

  const isConfirmValid = confirmText.trim().toUpperCase() === CONFIRMATION_TEXT;

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm(member);
      handleClose();
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Revoke Access</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-3">
            <p>
              You are about to revoke access for <strong>{memberName}</strong>.
            </p>
            <p className="text-red-600 font-medium">
              This action cannot be undone. The member will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
              <li>Immediately lose access to this course</li>
              <li>No longer see the course in their dashboard</li>
              <li>Lose all progress and notes (if applicable)</li>
            </ul>
            <div className="pt-2">
              <Label htmlFor="confirm-text" className="text-sm font-medium">
                Type <span className="font-bold text-red-600">{CONFIRMATION_TEXT}</span> to
                confirm:
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type "${CONFIRMATION_TEXT}" here`}
                className="mt-2"
                autoComplete="off"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Revoke Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
