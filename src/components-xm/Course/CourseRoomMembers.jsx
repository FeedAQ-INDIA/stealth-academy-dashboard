import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { useEffect, useState, useCallback } from "react";
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
  Eye,
  Edit,
  Phone,
  MapPin,
  Building,

} from "lucide-react";
import { useCourse } from "./CourseContext";
import { useAuthStore } from "@/zustland/store";

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
      priority: 3,
    };
  }
  if (member.accessLevel === "ADMIN") {
    return {
      role: "Admin",
      icon: Shield,
      color: "text-purple-600 bg-purple-100 border-purple-200",
      priority: 2,
    };
  }
  return {
    role: "Member",
    icon: User,
    color: "text-gray-600 bg-gray-100 border-gray-200",
    priority: 1,
  };
};

// Get member status display
const getMemberStatusDisplay = (member) => {
  const baseClasses =
    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";

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

// Main Members List Component
function CourseRoomMembers() {
  const { courseList } = useCourse();
  const { userDetail } = useAuthStore();
  const [members, setMembers] = useState([]);
  const [invitedMembers, setInvitedMembers] = useState([]);

  const isCourseOwner = courseList?.userId === userDetail?.userId;
  const isAdmin =
    members?.some(
      (m) => m.user?.userId === userDetail?.userId && m.accessLevel === "ADMIN"
    ) || false;
  const { toast } = useToast();

  // State for view mode (members/invited)
  const [viewMode, setViewMode] = useState("members");

  // State for invite functionality
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false);

  // State for member details and update functionality
  const [memberDetailsSheetOpen, setMemberDetailsSheetOpen] = useState(false);
  const [memberUpdateSheetOpen, setMemberUpdateSheetOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(inviteMembersSchema),
    defaultValues: {
      emailAddresses: "",
      accessType: "SHARED",
      enableCourseTracking: false,
    },
  });

  // Form for member updates
  const updateForm = useForm({
    defaultValues: {
      accessLevel: "SHARED",
      status: "ACTIVE",
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
      .split(";")
      .map((email) => email.trim())
      .filter((email) => email && email.includes("@")).length;
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      console.log("=== INVITE DEBUG INFO ===");
      console.log("Form data:", data);
      console.log("Course List:", courseList);
      console.log("User Detail:", userDetail);
      console.log("Course ID:", courseList?.courseId);
      console.log("User ID:", userDetail?.userId);

      // Validate course ID
      if (!courseList?.courseId) {
        console.error("Missing course ID");
        toast({
          title: "Course Error",
          description: "Course ID is missing. Please try refreshing the page.",
          variant: "destructive",
        });
        return;
      }

      // Validate user ID
      if (!userDetail?.userId) {
        console.error("Missing user ID");
        toast({
          title: "Authentication Error",
          description: "User information is missing. Please sign in again.",
          variant: "destructive",
        });
        return;
      }

      // Parse semicolon-separated emails
      const emailArray = data.emailAddresses
        .split(";")
        .map((email) => email.trim())
        .filter((email) => email?.includes("@"));

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

      // Prepare invites array for the new API
      const invites = emailArray.map((email) => ({
        email,
        accessLevel: data.accessType,
      }));

      console.log("Final invites array:", invites);
      console.log("API call parameters:", {
        courseId: courseList.courseId,
        invites,
        options: {
          userId: userDetail.userId,
          orgId: userDetail?.organizationId,
          enableCourseTracking: data.enableCourseTracking,
        },
      });

      // Call the batch invite API
      const result = await courseRoomService.inviteUsersToCourseRoom(
        courseList.courseId,
        invites,
        {
          userId: userDetail.userId,
          orgId: userDetail?.organizationId,
          enableCourseTracking: data.enableCourseTracking,
        }
      );

      // Handle response from the batch API
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

      // Reset form and close sheet
      reset();
      setInviteSheetOpen(false);
      fetchMembers(); // Refresh member list
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

  // Handle member details sheet
  const handleViewMemberDetails = (member) => {
    setSelectedMember(member);
    setMemberDetailsSheetOpen(true);
  };

  const handleMemberDetailsSheetClose = (open) => {
    setMemberDetailsSheetOpen(open);
    if (!open) {
      setSelectedMember(null);
    }
  };

  // Handle member update sheet
  const handleUpdateMember = (member) => {
    setSelectedMember(member);
    updateForm.reset({
      accessLevel: member.accessLevel || "SHARED",
      status: member.status || "ACTIVE",
      enableCourseTracking: member.enableCourseTracking || false,
    });
    setMemberUpdateSheetOpen(true);
  };

  const handleMemberUpdateSheetClose = (open) => {
    setMemberUpdateSheetOpen(open);
    if (!open) {
      setSelectedMember(null);
      updateForm.reset({
        accessLevel: "SHARED",
        status: "ACTIVE",
        enableCourseTracking: false
      });
    }
  };

  // Handle member update submission
  const onUpdateSubmit = async (data) => {
    try {
      // Here you would call the API to update member details
      console.log("Updating member:", selectedMember, "with data:", data);
      
      toast({
        title: "Member Updated",
        description: `Successfully updated ${selectedMember?.user?.firstName || selectedMember?.email}'s access level.`,
      });

      setMemberUpdateSheetOpen(false);
      setSelectedMember(null);
      updateForm.reset();
      fetchMembers(); // Refresh member list
    } catch (error) {
      console.error("Update member error:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update member",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchInvitedMembers();
  }, []);


  const fetchMembers = useCallback(async () => {
    const result = await courseRoomService.getCourseRoomMembers(
      courseList.courseId
    );
    console.log("Fetched members:", result.data);
    if (result && result.data) {
      setMembers(result.data);
    }
  }, [courseList.courseId]);


  const fetchInvitedMembers = useCallback(async () => {
    const result = await courseRoomService.getCourseRoomInvitedMembers(
      courseList.courseId
    );
    console.log("Fetched members:", result.invites);
    if (result && result.invites) {
      setInvitedMembers(result.invites);
    }
  }, [courseList.courseId]);

  return (
    <>
      <Card className="border-0 bg-white shadow-md  rounded-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Course Room Members
              </CardTitle>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    View Mode <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setViewMode("members")}>
                    <Users className="h-4 w-4 mr-2" /> Members
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setViewMode("invited")}>
                    <Mail className="h-4 w-4 mr-2" /> Invited Users
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Invite Members Button */}
            {isCourseOwner && (
              <Sheet open={inviteSheetOpen} onOpenChange={handleSheetClose}>
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
                      Enter email addresses separated by semicolons (;) to
                      invite multiple members at once.
                    </SheetDescription>
                  </SheetHeader>

                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6 mt-6"
                    >
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
                              Tip: You can paste multiple emails from Excel or
                              other sources. Separate each email with a
                              semicolon (;)
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
                                  <div className="font-medium">
                                    Shared Access
                                  </div>
                                </SelectItem>
                                <SelectItem value="ADMIN">
                                  <div className="font-medium">
                                    Admin Access
                                  </div>
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
                                Track member progress and activity in this
                                course room
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
      </Card>

      <div className="bg-white shadow-md rounded-md">
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
          <div className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">{viewMode === "members" ? "Member" : "Invited User"}</TableHead>
                  <TableHead>{viewMode === "members" ? "Role" : "Status"}</TableHead>
                  <TableHead>{viewMode === "members" ? "Joined" : "Invited Date"}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewMode === "members" ? (
                  members.map((member) => {
                    const roleDisplay = getMemberRoleDisplay(member, courseList?.userId);
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
                                {member.user?.firstName + " " + member.user?.lastName || member.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Button size="sm" variant="ghost" className={roleDisplay.color}>
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
                              onClick={() => handleViewMemberDetails(member)}
                              className="h-8 px-2"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>

                            {(isCourseOwner || isAdmin) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateMember(member)}
                                className="h-8 px-2"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  invitedMembers.map((member) => {
 
                    return (
                      <TableRow key={member.inviteeEmail}>
                        <TableCell className="font-medium">
              
                               <div className="font-medium text-gray-900">
                                {member.inviteeEmail}
                              </div>
                          </TableCell>

                                    <TableCell className="font-medium">
              
                               <div className="font-medium text-gray-900">
                                {member.accessLevel}
                              </div>
                          </TableCell>

     <TableCell className="font-medium">
              
                               <div className="font-medium text-gray-900">
                                {member.inviteStatus}
                              </div>
                          </TableCell>     

                          
     <TableCell className="font-medium">
              
                               <div className="font-medium text-gray-900">
                                {member.expiredAt}
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
                              onClick={() => handleViewMemberDetails(member)}
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
                                    <AlertDialogTitle>Cancel Invitation?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will cancel the pending invitation for {member.email}. 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Invite</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => {/* Handle cancel invite */}}
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
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Member Details Sheet */}
      <Sheet open={memberDetailsSheetOpen} onOpenChange={handleMemberDetailsSheetClose}>
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

          {selectedMember && (
            <div className="mt-6 space-y-6">
              {/* Member Profile Section */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMember.user?.profilePicture} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    {selectedMember.user?.nameInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedMember.user?.firstName + " " + selectedMember.user?.lastName || selectedMember.email}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedMember.user?.email || selectedMember.email}
                  </p>
                  <div className="mt-2">
                    {(() => {
                      const roleDisplay = getMemberRoleDisplay(selectedMember, courseList?.userId);
                      const RoleIcon = roleDisplay.icon;
                      return (
                        <Badge className={roleDisplay.color}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleDisplay.role}
                        </Badge>
                      );
                    })()}
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
                        {selectedMember.user?.email || selectedMember.email}
                      </p>
                    </div>
                  </div>

                  {selectedMember.user?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Phone</p>
                        <p className="text-sm text-gray-600">{selectedMember.user.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedMember.user?.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-600">{selectedMember.user.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedMember.user?.organization && (
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Organization</p>
                        <p className="text-sm text-gray-600">{selectedMember.user.organization}</p>
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
                      <p className="text-sm text-gray-600">{selectedMember.accessLevel || "SHARED"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <div className="mt-1">
                        {(() => {
                          const statusDisplay = getMemberStatusDisplay(selectedMember);
                          const StatusIcon = statusDisplay.icon;
                          return (
                            <span className={statusDisplay.className}>
                              <StatusIcon className="h-3 w-3" />
                              {statusDisplay.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Joined Date</p>
                      <p className="text-sm text-gray-600">
                        {selectedMember.v_created_date || "Recently joined"}
                      </p>
                    </div>
                  </div>

                  {selectedMember.lastActiveDate && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Last Active</p>
                        <p className="text-sm text-gray-600">
                          {formatLastActive(selectedMember.lastActiveDate)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Member Update Sheet */}
      <Sheet open={memberUpdateSheetOpen} onOpenChange={handleMemberUpdateSheetClose}>
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

          {selectedMember && (
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-6 mt-6">
                {/* Member Info Display */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedMember.user?.profilePicture} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {selectedMember.user?.nameInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedMember.user?.firstName + " " + selectedMember.user?.lastName || selectedMember.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedMember.user?.email || selectedMember.email}
                    </p>
                  </div>
                </div>

                {/* Access Level Field */}
                <FormField
                  control={updateForm.control}
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
                  control={updateForm.control}
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
                    onClick={() => setMemberUpdateSheetOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={updateForm.formState.isSubmitting}
                  >
                    {updateForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
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
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default CourseRoomMembers;
