import { Button } from "@/components/ui/button.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Edit } from "lucide-react";
import { InlineLoader } from "@/components/ui/loading-components";

/**
 * MemberUpdateSheet Component
 * Handles updating member access levels and permissions
 */
export function MemberUpdateSheet({
  open,
  onOpenChange,
  member,
  onUpdateSubmit,
  isCourseOwner,
}) {
  const form = useForm({
    defaultValues: {
      accessLevel: "SHARED",
      status: "ACTIVE",
      enableCourseTracking: false,
    },
  });

  // Update form when member changes
  useEffect(() => {
    if (member && open) {
      form.reset({
        accessLevel: member.accessLevel || "SHARED",
        status: member.status || "ACTIVE",
        enableCourseTracking: member.enableCourseTracking || false,
      });
    }
  }, [member, open, form]);

  const handleSheetClose = (open) => {
    onOpenChange(open);
    if (!open) {
      form.reset({
        accessLevel: "SHARED",
        status: "ACTIVE",
        enableCourseTracking: false,
      });
    }
  };

  const onSubmit = async (data) => {
    await onUpdateSubmit(data, member);
    form.reset();
  };

  if (!member) return null;

  return (
    <Sheet open={open} onOpenChange={handleSheetClose}>
      <SheetContent className="sm:max-w-md h-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Update Member
          </SheetTitle>
          <SheetDescription>
            Update access level and permissions for this member.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            {/* Member Info Display */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.user?.profilePicture} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {member.user?.nameInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {member.user?.firstName + " " + member.user?.lastName ||
                    member.email}
                </p>
                <p className="text-sm text-gray-500">
                  {member.user?.email || member.email}
                </p>
              </div>
            </div>

            {/* Access Level Field */}
            <FormField
              control={form.control}
              name="accessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SHARED">
                        <div className="font-medium">Shared Access</div>
                      </SelectItem>
                      {isCourseOwner && (
                        <SelectItem value="ADMIN">
                          <div className="font-medium">Admin Access</div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the access level for this member
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

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSheetClose(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <InlineLoader message="Updating..." size="sm" />
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Member
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
