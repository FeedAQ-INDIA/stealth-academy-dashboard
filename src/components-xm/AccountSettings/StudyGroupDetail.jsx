import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Send,
  Crown,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  BookOpen,
  MoreVertical,
  UserMinus,
  Loader2,
  AlertCircle,
  Plus,
  X,
  GraduationCap,
  ExternalLink,
  Clock,
  Edit,
} from "lucide-react";

// UI Components
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Services
import axiosConn from "../../axioscon";
import { useAuthStore } from "@/zustland/store";

// Simplified API service
const API_BASE = "/course-study-group";

const apiCall = async (method, endpoint, data = null) => {
  try {
    const response =
      method === "GET"
        ? await axiosConn.get(`${API_BASE}${endpoint}`)
        : await axiosConn.post(`${API_BASE}${endpoint}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `API call failed: ${endpoint}`
    );
  }
};

const studyGroupAPI = {
  getDetails: (id) => apiCall("GET", `/getCourseStudyGroupDetailById/${id}`),
  addMember: (groupId, userId, role = "MEMBER") =>
    apiCall("POST", "/addMember", {
      courseStudyGroupId: groupId,
      userId,
      role,
    }),
  removeMember: (groupId, userId) =>
    apiCall("POST", "/removeMember", { courseStudyGroupId: groupId, userId }),
  addContent: (groupId, courseId) =>
    apiCall("POST", "/addContent", { courseStudyGroupId: groupId, courseId }),
  removeContent: (groupId, courseId) =>
    apiCall("POST", "/removeContent", {
      courseStudyGroupId: groupId,
      courseId,
    }),
  sendInvite: (groupId, email, message) =>
    apiCall("POST", "/invite", { courseStudyGroupId: groupId, email, message }),
  updateGroup: (groupId, groupName, description) =>
    apiCall("POST", "/createOrUpdate", {
      courseStudyGroupId: groupId,
      groupName,
      description,
    }),
};

// Simplified components
const MemberCard = ({ member, isOwner, isAdmin, userDetailId, onRemove }) => (
  <Card className="relative">
    <CardHeader className="p-3">
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={member?.user?.profilePicture} />
          <AvatarFallback>
            {member?.user?.firstName?.[0]}
            {member?.user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            {member?.user?.firstName} {member?.user?.lastName}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {member?.user?.email}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {member.role === "OWNER" && (
              <Badge
                variant="default"
                className="bg-yellow-100 text-yellow-800"
              >
                <Crown className="w-3 h-3 mr-1" />
                Owner
              </Badge>
            )}
            {member.role === "ADMIN" && (
              <Badge
                variant="default"
                className="bg-purple-100 text-purple-800"
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
            {member.role === "MEMBER" && (
              <Badge variant="secondary">
                <Users className="w-3 h-3 mr-1" />
                Member
              </Badge>
            )}
          </div>
        </div>
        {(isOwner || isAdmin) &&
          member?.user?.userId !== userDetailId &&
          member.role !== "OWNER" && (
            <Button
              variant="ghost"
              size="sm"
              className=""
              onClick={() => onRemove(member)}
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Remove Member
            </Button>
          )}
      </div>
    </CardHeader>
  </Card>
);

const ContentCard = ({ content, isOwner, isAdmin, onRemove }) => (
  <Card className="relative">
    <CardContent className="pt-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">
            {content.course?.courseName || `Course ${content.courseId}`}
          </h4>
          <p className="text-sm text-gray-500 truncate">
            {content.course?.courseDescription || "No description available"}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {content.course?.duration || "Duration N/A"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <GraduationCap className="w-3 h-3 mr-1" />
              Course
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ExternalLink className="w-4 h-4" />
          </Button>
          {(isOwner || isAdmin) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onRemove(content.courseId)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const LoadingState = () => (
  <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/account-settings/my-study-group">
              My Study Groups
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Loading...</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">
          Loading study group details...
        </p>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, navigate }) => (
  <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/account-settings/my-study-group">
              My Study Groups
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Error</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to Load Study Group
        </h3>
        <p className="text-gray-500 mb-4">{error || "Study group not found"}</p>
        <Button onClick={() => navigate("/account-settings/my-study-group")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Study Groups
        </Button>
      </div>
    </div>
  </div>
);

const StudyGroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Consolidated state
  const [studyGroup, setStudyGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [newCourseId, setNewCourseId] = useState("");
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const { userDetail } = useAuthStore();

  // Permissions
  const isOwner = studyGroup?.ownedBy === userDetail.userId;
  const userMembership = studyGroup?.members?.find(
    (m) => m?.user?.userId === userDetail.userId
  );
  const isAdmin = userMembership?.role === "ADMIN" || isOwner;

  // Fetch data
  const fetchStudyGroupDetails = useCallback(async () => {
    if (!groupId) {
      setError("Study group ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await studyGroupAPI.getDetails(groupId);
      if (response.data) {
        setStudyGroup(response.data);
      } else {
        setError("Study group not found");
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [groupId, toast]);

  useEffect(() => {
    fetchStudyGroupDetails();
  }, [fetchStudyGroupDetails]);

  // Initialize edit form when dialog opens
  useEffect(() => {
    if (showEditDialog && studyGroup) {
      setEditGroupName(studyGroup.groupName || "");
      setEditGroupDescription(studyGroup.description || "");
    }
  }, [showEditDialog, studyGroup]);

  // Simplified handlers
  const showToast = (title, description, variant = "default") => {
    toast({ title, description, variant });
  };

  const handleApiAction = async (action, successMessage) => {
    setIsProcessing(true);
    try {
      await action();
      await fetchStudyGroupDetails();
      showToast("Success", successMessage);
    } catch (err) {
      showToast("Error", err.message, "destructive");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveMember = (member) => {
    setMemberToRemove(member);
    setShowRemoveDialog(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    await handleApiAction(
      () => studyGroupAPI.removeMember(groupId, memberToRemove.userId),
      `${memberToRemove.firstName} ${memberToRemove.lastName} has been removed from the group`
    );

    setShowRemoveDialog(false);
    setMemberToRemove(null);
  };

  const handleRemoveContent = async (courseId) => {
    await handleApiAction(
      () => studyGroupAPI.removeContent(groupId, courseId),
      "Content removed from study group"
    );
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail.trim()) {
      showToast("Error", "Email address is required", "destructive");
      return;
    }

    await handleApiAction(
      () => studyGroupAPI.sendInvite(groupId, inviteEmail, inviteMessage),
      `Invitation sent to ${inviteEmail}`
    );

    setShowInviteDialog(false);
    setInviteEmail("");
    setInviteMessage("");
  };

  const handleAddContent = async () => {
    if (!newCourseId.trim()) {
      showToast("Error", "Course ID is required", "destructive");
      return;
    }

    await handleApiAction(
      () => studyGroupAPI.addContent(groupId, newCourseId),
      "Content added to study group"
    );

    setNewCourseId("");
  };

  const handleUpdateGroup = async () => {
    if (!editGroupName.trim()) {
      showToast("Error", "Group name is required", "destructive");
      return;
    }

    await handleApiAction(
      () =>
        studyGroupAPI.updateGroup(groupId, editGroupName, editGroupDescription),
      "Study group updated successfully"
    );

    setShowEditDialog(false);
  };

  // Render states
  if (loading) return <LoadingState />;
  if (error || !studyGroup)
    return <ErrorState error={error} navigate={navigate} />;

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/account-settings/my-study-group">
                My Study Groups
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[30ch]">
                {studyGroup.groupName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-4 mx-auto max-w-7xl">
        {/* Study Group Header */}
        <Card className="w-full rounded-lg border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700  rounded-2xl text-white shadow-2xl mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">{studyGroup.groupName}</h1>
            
                </div>
                <p className="text-blue-100 text-lg leading-relaxed mb-4">
                  {studyGroup.description || "No description provided"}
                </p>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created{" "}
                    {new Date(
                      studyGroup.study_group_created_at
                    ).toLocaleDateString()}
                  </span>

                   {isOwner && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 border-yellow-300"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Owner
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      {studyGroup.members?.length || 0} Members
                    </Badge>
                </div>
              </div>
              {(isOwner || isAdmin) && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowInviteDialog(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    <UserPlus className="w-4 h-4  " />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowEditDialog(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    <Edit className="w-4 h-4 " />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setShowMembers(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            Members ({studyGroup.members?.length || 0})
          </Button>
          <Button
            onClick={() => setShowContent(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Content ({studyGroup.groupContent?.length || 0})
          </Button>
        </div>

        {/* Members Sheet */}
        <Sheet open={showMembers} onOpenChange={setShowMembers}>
          <SheetContent className="w-full max-w-2xl">
            <SheetHeader>
              <SheetTitle>Study Group Members</SheetTitle>
              <SheetDescription>
                Manage members in {studyGroup.groupName}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="grid gap-4">
                {studyGroup.members?.map((member) => (
                  <MemberCard
                    key={member?.user?.userId}
                    member={member}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    userDetailId={userDetail.userId}
                    onRemove={handleRemoveMember}
                  />
                ))}
              </div>

              {(!studyGroup.members || studyGroup.members.length === 0) && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Members Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Invite members to start collaborating in this study group.
                  </p>
                  {(isOwner || isAdmin) && (
                    <Button onClick={() => setShowInviteDialog(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite First Member
                    </Button>
                  )}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Content Sheet */}
        <Sheet open={showContent} onOpenChange={setShowContent}>
          <SheetContent className="w-full max-w-2xl">
            <SheetHeader>
              <SheetTitle>Study Group Content</SheetTitle>
              <SheetDescription>
                Manage courses in {studyGroup.groupName}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Content ({studyGroup.groupContent?.length || 0})
                </h3>
                {(isOwner || isAdmin) && (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Course ID"
                      value={newCourseId}
                      onChange={(e) => setNewCourseId(e.target.value)}
                      className="w-40"
                    />
                    <Button onClick={handleAddContent} disabled={isProcessing}>
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Add Course
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                {studyGroup.groupContent?.map((content) => (
                  <ContentCard
                    key={content.courseId}
                    content={content}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    onRemove={handleRemoveContent}
                  />
                ))}
              </div>

              {(!studyGroup.groupContent ||
                studyGroup.groupContent.length === 0) && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Content Added Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add courses to this study group to start learning together.
                  </p>
                  {(isOwner || isAdmin) && (
                    <div className="flex items-center justify-center gap-2">
                      <Input
                        placeholder="Enter course ID"
                        value={newCourseId}
                        onChange={(e) => setNewCourseId(e.target.value)}
                        className="w-40"
                      />
                      <Button
                        onClick={handleAddContent}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 mr-2" />
                        )}
                        Add First Course
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Member to Study Group</DialogTitle>
              <DialogDescription>
                Send an invitation to join {studyGroup.groupName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="invite-email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="invite-message" className="text-sm font-medium">
                  Personal Message (Optional)
                </label>
                <Textarea
                  id="invite-message"
                  placeholder="Add a personal message to the invitation"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSendInvitation} disabled={isProcessing}>
                <Send className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Group Sheet */}
        <Sheet open={showEditDialog} onOpenChange={setShowEditDialog}>
          <SheetContent className="w-full max-w-lg">
            <SheetHeader>
              <SheetTitle>Edit Study Group</SheetTitle>
              <SheetDescription>
                Update the details of your study group
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-group-name"
                    className="text-sm font-medium"
                  >
                    Group Name *
                  </label>
                  <Input
                    id="edit-group-name"
                    placeholder="Enter group name"
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-group-description"
                    className="text-sm font-medium"
                  >
                    Description
                  </label>
                  <Textarea
                    id="edit-group-description"
                    placeholder="Enter group description"
                    value={editGroupDescription}
                    onChange={(e) => setEditGroupDescription(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateGroup}
                  disabled={isProcessing || !editGroupName.trim()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Group
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Remove Member Dialog */}
        <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {memberToRemove?.firstName}{" "}
                {memberToRemove?.lastName} from this study group? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRemoveMember}
                className="bg-red-600 hover:bg-red-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Remove Member"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default StudyGroupDetail;
