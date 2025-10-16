import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast.js";
import courseRoomService from "@/services/courseRoomService.js";
import { inviteMembersSchema } from "@/utils/validationSchemas.js";
import {
  Users,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  Crown,
  Shield,
  User,
  UserX,
  UserCheck,
  Loader2,
  UserPlus,
  Mail,
  Send,
} from "lucide-react";

// Member status options
const MEMBER_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  INACTIVE: "INACTIVE",
};

// Get member role display with enhanced information
const getMemberRoleDisplay = (member, courseOwnerId) => {
  if (member.user?.userId === courseOwnerId) {
    return { 
      role: "Owner", 
      icon: Crown, 
      color: "text-yellow-600 bg-yellow-100 border-yellow-200",
      priority: 3
    };
  }
  if (member.role === "MODERATOR") {
    return { 
      role: "Moderator", 
      icon: Shield, 
      color: "text-blue-600 bg-blue-100 border-blue-200",
      priority: 2
    };
  }
  return { 
    role: "Member", 
    icon: User, 
    color: "text-gray-600 bg-gray-100 border-gray-200",
    priority: 1
  };
};

// Get member status display
const getMemberStatusDisplay = (member) => {
  const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
  
  if (member.status === MEMBER_STATUS.PENDING) {
    return {
      label: "Pending",
      icon: Clock,
      className: `${baseClasses} text-orange-600 bg-orange-100 border border-orange-200`,
    };
  }
  
  if (member.status === MEMBER_STATUS.INACTIVE) {
    return {
      label: "Inactive",
      icon: UserX,
      className: `${baseClasses} text-red-600 bg-red-100 border border-red-200`,
    };
  }
  
  if (member.isOnline) {
    return {
      label: "Online",
      icon: UserCheck,
      className: `${baseClasses} text-green-600 bg-green-100 border border-green-200`,
    };
  }
  
  return {
    label: "Offline",
    icon: UserX,
    className: `${baseClasses} text-gray-600 bg-gray-100 border border-gray-200`,
  };
};

// Format join date with relative time
const formatJoinDate = (dateString) => {
  if (!dateString) return "Recently joined";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format last active time
const formatLastActive = (dateString) => {
  if (!dateString) return "Never";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Individual Member Row Component
function MemberRow({
  member,
  index,
  courseOwnerId,
  userDetail,
  isCourseOwner,
  isModerator,
  onRemoveMember,
  onUpdateMemberRole,
  removeLoading
}) {
  const roleInfo = getMemberRoleDisplay(member, courseOwnerId);
  const statusInfo = getMemberStatusDisplay(member);
  const RoleIcon = roleInfo.icon;
  const StatusIcon = statusInfo.icon;
  const isCurrentUser = member.user?.userId === userDetail?.userId;
  const canRemove = (isCourseOwner || (isModerator && member.user?.userId !== courseOwnerId)) && !isCurrentUser;
  const canManageRole = isCourseOwner && !isCurrentUser && member.user?.userId !== courseOwnerId;

  return (
    <div
      key={member.courseRoomId || index}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-blue-200 transition-all duration-200 group"
    >
      <div className="flex items-center gap-4 flex-1">
        <Avatar className="h-12 w-12 relative">
          <AvatarImage
            src={member.user?.profilePicture}
            alt={member.displayName}
          />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
            {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
          </AvatarFallback>
          {/* Online Status Indicator */}
          {member.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 truncate">
              {member.displayName}
              {isCurrentUser && (
                <span className="text-sm text-blue-600 font-normal ml-1">(You)</span>
              )}
            </h4>
            <Badge className={`${roleInfo.color} border flex items-center gap-1 text-xs`}>
              <RoleIcon className="h-3 w-3" />
              {roleInfo.role}
            </Badge>
            <div className={statusInfo.className}>
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 truncate">{member.user?.email}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {formatJoinDate(member.joinedAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Active {formatLastActive(member.lastActive)}
            </div>
          </div>
        </div>
      </div>

      {/* Member Actions */}
      {(canRemove || canManageRole) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {canManageRole && (
              <>
                <DropdownMenuItem
                  onClick={() => onUpdateMemberRole(
                    member.user?.userId, 
                    member.role === "MODERATOR" ? "MEMBER" : "MODERATOR",
                    member.displayName
                  )}
                  className="cursor-pointer"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {member.role === "MODERATOR" ? "Remove Moderator" : "Make Moderator"}
                </DropdownMenuItem>
                <div className="border-t my-1"></div>
              </>
            )}
            
            {canRemove && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer focus:text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Member
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-800">
                      <Trash2 className="h-5 w-5 text-red-600" />
                      Remove Member
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove{" "}
                      <span className="font-semibold">
                        {member.displayName}
                      </span>{" "}
                      from this course room? This action cannot be undone and they will lose access to course room discussions and activities.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemoveMember(member.user?.userId, member.displayName)}
                      disabled={removeLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {removeLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Removing...
                        </>
                      ) : (
                        "Remove Member"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// Main Members List Component
function CourseRoomMembers({
  members = [],
  courseList,
  userDetail,
  onRemoveMember,
  onUpdateMemberRole,
  removeLoading,
  fetchCourseRoomMembers,
}) {
  const isCourseOwner = courseList?.userId === userDetail?.userId;
  const isModerator = members?.some(m => m.user?.userId === userDetail?.userId && m.role === "MODERATOR") || false;
  const { toast } = useToast();

  // State for invite functionality
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false);

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(inviteMembersSchema),
    defaultValues: {
      emailAddresses: "",
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

  // Get email count for display
  const getEmailCount = (emailString) => {
    if (!emailString) return 0;
    return emailString
      .split(';')
      .map(email => email.trim())
      .filter(email => email && email.includes('@')).length;
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Parse semicolon-separated emails
      const emailArray = data.emailAddresses
        .split(';')
        .map(email => email.trim())
        .filter(email => email?.includes('@'));
      
      if (emailArray.length === 0) {
        toast({
          title: "No Valid Emails",
          description: "Please enter at least one valid email address.",
          variant: "destructive",
        });
        return;
      }

      const promises = emailArray.map(email => 
        courseRoomService.inviteUserToCourseRoom(
          courseList?.courseId, 
          email,
          { enableCourseTracking: data.enableCourseTracking }
        )
      );
      
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (successful > 0) {
        const successMessage = `${successful} invitation(s) sent successfully`;
        const failMessage = failed > 0 ? `, ${failed} failed` : '';
        toast({
          title: "Invitations Sent",
          description: successMessage + failMessage,
        });
      }
      
      if (failed === emailArray.length) {
        toast({
          title: "All Invitations Failed",
          description: "All invitations failed to send. Please check the email addresses and try again.",
          variant: "destructive",
        });
      }
      
      // Reset form and close sheet
      reset();
      setInviteSheetOpen(false);
      if (fetchCourseRoomMembers) {
        fetchCourseRoomMembers(); // Refresh member list
      }
    } catch (error) {
      console.error("Invite members error:", error);
      toast({
        title: "Invitation Failed",
        description: error.message || "Failed to send invitations",
        variant: "destructive",
      });
    }
  };

  // Handle sheet close - reset form
  const handleSheetClose = (open) => {
    setInviteSheetOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Card className="border-0 bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Course Room Members
            <Badge variant="secondary" className="ml-2">
              {members?.length || 0}
            </Badge>
          </CardTitle>
          
          {/* Invite Members Button */}
          {isCourseOwner && (
            <Sheet open={inviteSheetOpen} onOpenChange={handleSheetClose}>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite Members
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Invite Members to Room
                  </SheetTitle>
                  <SheetDescription>
                    Enter email addresses separated by semicolons (;) to invite multiple members at once.
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
                            Tip: You can paste multiple emails from Excel or other sources. Separate each email with a semicolon (;)
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
                    <div className="flex gap-3 pt-4  ">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setInviteSheetOpen(false)}
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
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Sending...
                          </>
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
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!members || members.length === 0 ? (
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
          <div className="space-y-3">
            {members.map((member, index) => (
              <MemberRow
                key={member.courseRoomId || index}
                member={member}
                index={index}
                courseOwnerId={courseList?.userId}
                userDetail={userDetail}
                isCourseOwner={isCourseOwner}
                isModerator={isModerator}
                onRemoveMember={onRemoveMember}
                onUpdateMemberRole={onUpdateMemberRole}
                removeLoading={removeLoading}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseRoomMembers;