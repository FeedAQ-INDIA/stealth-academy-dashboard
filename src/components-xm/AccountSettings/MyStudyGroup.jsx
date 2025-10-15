import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Trash2,
  Mail,
  Edit,
  MoreVertical,
  Eye,
  BookOpen,
  AlertCircle,
  Loader2,
  Crown,
  ShieldCheck,
} from "lucide-react";

// UI Components
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

// API Base URL
const API_BASE = "/course-study-group";

// Simplified API functions
const createStudyGroup = async (studyGroupData) => {
  const response = await axiosConn.post(`${API_BASE}/createOrUpdate`, {
    groupName: studyGroupData.name,
    description: studyGroupData.description,
  });
  return response.data;
};

const updateStudyGroup = async (courseStudyGroupId, studyGroupData) => {
  const response = await axiosConn.post(`${API_BASE}/createOrUpdate`, {
    courseStudyGroupId,
    groupName: studyGroupData.name,
    description: studyGroupData.description,
  });
  return response.data;
};

const getAllStudyGroups = async () => {
  const response = await axiosConn.get(`${API_BASE}/getAllCourseStudyGroup`);
  return response.data;
};

const deleteStudyGroup = async (courseStudyGroupId) => {
  const response = await axiosConn.post(`${API_BASE}/deleteStudyGroup`, {
    courseStudyGroupId
  });
  return response.data;
};

// Schema for study group validation
const studyGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(100, "Group name must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
});

const MyStudyGroup = () => {
  const navigate = useNavigate();
  const [studyGroups, setStudyGroups] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const { userDetail } = useAuthStore();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(studyGroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const fetchStudyGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStudyGroups();
      const processedGroups = (response.data || []).map(group => ({
        ...group,
        isOwner: group.ownedBy === userDetail?.userId,
        memberCount: group.members?.length || 0,
        contentCount: group.groupContent?.length || 0,
      }));
      setStudyGroups(processedGroups);
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch study groups";
      setError(errorMessage);
      toast({
        title: "Error Loading Study Groups",
        description: errorMessage,
        variant: "destructive",
      });
      setStudyGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyGroups();
  }, []);

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      if (editingGroup) {
        await updateStudyGroup(editingGroup.courseStudyGroupId, data);
        toast({
          title: "Success",
          description: "Study group updated successfully",
        });
      } else {
        await createStudyGroup(data);
        toast({
          title: "Success", 
          description: "Study group created successfully",
        });
      }
      
      await fetchStudyGroups();
      setIsCreateOpen(false);
      setEditingGroup(null);
      form.reset();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    form.reset({
      name: group.groupName,
      description: group.description,
    });
    setIsCreateOpen(true);
  };

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!groupToDelete) return;
    
    try {
      await deleteStudyGroup(groupToDelete.courseStudyGroupId);
      await fetchStudyGroups();
      toast({
        title: "Success",
        description: "Study group deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleInvite = (group) => {
    setSelectedGroup(group);
    setIsInviteOpen(true);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[30ch]">
                My Study Groups
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto sm:flex-initial"></div>
      </header>

      <div className="p-4 mx-auto">
        {/* Header Card */}
        <Card className="w-full rounded-lg border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700  rounded-2xl text-white shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
              <Users className="w-8 h-8" />
              My Study Groups
            </CardTitle>
          </CardHeader>
        </Card>

 
        {/* Controls */}
        <div className="flex justify-between items-center my-6">
          <Button
            variant="outline"
            onClick={fetchStudyGroups}
            disabled={loading}
            className="hover:bg-blue-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingGroup(null);
              form.reset();
              setIsCreateOpen(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Study Group
          </Button>
        </div>

        {/* Study Groups Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex flex-col items-center">
                <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                <p className="text-gray-600 font-medium">Loading study groups...</p>
              </div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex flex-col items-center">
                <div className="p-3 bg-red-100 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Study Groups</h3>
                <p className="text-gray-500 mb-4 max-w-md">{error}</p>
                <Button onClick={fetchStudyGroups} className="bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              </div>
            </div>
          ) : studyGroups.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex flex-col items-center">
                <div className="p-4 bg-blue-50 rounded-full mb-4">
                  <Users className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No study groups found</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Create your first study group to start collaborating with peers
                </p>
                <Button 
                  onClick={() => {
                    setEditingGroup(null);
                    form.reset();
                    setIsCreateOpen(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Your First Study Group
                </Button>
              </div>
            </div>
          ) : (
            studyGroups.map((group) => (
              <StudyGroupCard
                key={group.courseStudyGroupId}
                group={group}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onInvite={handleInvite}
                onViewDetails={() => navigate(`/account-settings/my-study-group/${group.courseStudyGroupId}`)}
              />
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                {editingGroup ? "Edit Study Group" : "Create New Study Group"}
              </SheetTitle>
              <SheetDescription>
                {editingGroup
                  ? "Update your study group details"
                  : "Create a new study group to collaborate with peers"}
              </SheetDescription>
            </SheetHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter group name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your study group's purpose and goals"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetFooter>
                  <Button type="submit" disabled={submitLoading}>
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingGroup ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editingGroup ? "Update Group" : "Create Group"
                    )}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>

        {/* Invite Modal */}
        <Sheet open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Invite Users</SheetTitle>
              <SheetDescription>
                Invite users to join {selectedGroup?.groupName}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Invite functionality would be implemented here with email input and send invitation logic.
              </p>
            </div>
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Study Group</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {groupToDelete?.groupName}? This action cannot be undone and will remove all members and content from the group.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

// Study Group Card Component
const StudyGroupCard = ({ group, onEdit, onDelete, onInvite, onViewDetails }) => {
  const getStatusBadge = () => {
    if (group.isOwner) {
      return <Badge variant="default" className="bg-purple-600"><Crown className="w-3 h-3 mr-1" />Owner</Badge>;
    }
    return <Badge variant="secondary"><ShieldCheck className="w-3 h-3 mr-1" />Member</Badge>;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600 transform hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate text-gray-800">{group.groupName}</h3>
             </div>
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge()}
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                <BookOpen className="w-3 h-3 mr-1" />
                Study Group
              </Badge>
            </div>
          </div>
          
      
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {group.description || "No description provided"}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{group.memberCount || 0}</span>
            </span>
            {group.contentCount > 0 && (
              <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span className="font-medium">{group.contentCount}</span>
                <span className="text-xs">courses</span>
              </span>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewDetails}
            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            Created {new Date(group.study_group_created_at || group.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
 
export default MyStudyGroup;