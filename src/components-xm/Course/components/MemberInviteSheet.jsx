import { Button } from "@/components/ui/button.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.jsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteMembersSchema } from "@/utils/validationSchemas.js";
import { getEmailCount } from "@/utils/memberHelpers.js";
import { UserPlus, Mail, Send } from "lucide-react";
import { InlineLoader } from "@/components/ui/loading-components";

/**
 * MemberInviteSheet Component
 * Handles the invitation of new members to a course room
 */
export function MemberInviteSheet({ 
  open, 
  onOpenChange, 
  onInviteSubmit,
  isCourseOwner 
}) {
  const form = useForm({
    resolver: zodResolver(inviteMembersSchema),
    defaultValues: {
      emailAddresses: "",
      accessType: "SHARED",
      enableCourseTracking: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = form;

  // Watch email addresses for real-time validation and count
  const watchedEmails = watch("emailAddresses");

  // Handle sheet close - reset form
  const handleSheetClose = (open) => {
    onOpenChange(open);
    if (!open) {
      reset();
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    await onInviteSubmit(data);
    reset();
  };

  if (!isCourseOwner) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={handleSheetClose}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md h-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Invite Members to Room
          </SheetTitle>
          <SheetDescription>
            Enter email addresses separated by semicolons (;) to invite multiple
            members at once.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            {/* Email Addresses Section */}
            <FormField
              control={form.control}
              name="emailAddresses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Addresses</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter email addresses separated by semicolons (;)&#10;Example: user1@email.com; user2@email.com; user3@email.com"
                      rows={4}
                      className="w-full resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tip: You can paste multiple emails from Excel or other
                    sources. Separate each email with a semicolon (;)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Access Type Section */}
            <FormField
              control={form.control}
              name="accessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SHARED">
                        <div className="font-medium">Shared Access</div>
                      </SelectItem>
                      <SelectItem value="ADMIN">
                        <div className="font-medium">Admin Access</div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the access level for invited members
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Enable Course Tracking Switch */}
            <FormField
              control={form.control}
              name="enableCourseTracking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable member course tracking
                    </FormLabel>
                    <FormDescription>
                      Track member progress and activity in this course room
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Email Count Display */}
            <div className="">
              <p className="text-sm text-gray-500">
                {getEmailCount(watchedEmails)} email(s) ready to send
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSheetClose(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !watchedEmails?.trim()}
                className="flex-1"
              >
                {isSubmitting ? (
                  <InlineLoader message="Sending..." size="sm" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitations
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
