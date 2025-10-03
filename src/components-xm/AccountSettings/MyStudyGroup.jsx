import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";
import {
  Users,
  UserPlus,
  Edit3,
  Trash2,
  Send,
  Crown,
  Calendar,
  MessageCircle,
  Eye,
  Settings,
  Mail,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";

import axiosConn from "@/axioscon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

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
  category: z.string().min(1, "Please select a category"),
  maxMembers: z
    .number()
    .min(2, "Group must allow at least 2 members")
    .max(50, "Group cannot exceed 50 members"),
  isPrivate: z.boolean().default(false),
  studySchedule: z.string().optional(),
});

// Schema for inviting users
const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
});

const MyStudyGroup = () => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm({
    resolver: zodResolver(studyGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      maxMembers: 10,
      isPrivate: false,
      studySchedule: "",
    },
  });

  const inviteForm = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  useEffect(() => {
    fetchStudyGroups();
  }, []);

  const fetchStudyGroups = async () => {
    setLoading(true);
    try {
      const { data } = await axiosConn.post("/study-group/search", {});
      if (data.success) {
        setStudyGroups(data.data);
      }
    } catch (error) {
      console.error("Error loading study groups:", error);
      toast({
        title: "Error",
        description: "Failed to load study groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const requestBody = {
        ...data,
        studyGroupId: editingGroup?.id,
      };

      const endpoint = editingGroup ? "/study-group/update" : "/study-group/create";
      const { data: response } = await axiosConn.post(endpoint, requestBody);

      if (response.success) {
        toast({
          title: "Success",
          description: `Study group ${editingGroup ? "updated" : "created"} successfully`,
        });
        fetchStudyGroups();
        setIsCreateOpen(false);
        setEditingGroup(null);
        form.reset();
      }
    } catch (error) {
      console.error("Error saving study group:", error);
      toast({
        title: "Error",
        description: "Failed to save study group",
        variant: "destructive",
      });
    }
  };

  const onInviteSubmit = async (data) => {
    try {
      const requestBody = {
        studyGroupId: selectedGroup.id,
        email: data.email,
        message: data.message || `You've been invited to join "${selectedGroup.name}" study group!`,
      };

      const { data: response } = await axiosConn.post("/study-group/invite", requestBody);

      if (response.success) {
        toast({
          title: "Success",
          description: "Invitation sent successfully",
        });
        setIsInviteOpen(false);
        inviteForm.reset();
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    form.reset({
      name: group.name,
      description: group.description,
      category: group.category,
      maxMembers: group.maxMembers,
      isPrivate: group.isPrivate,
      studySchedule: group.studySchedule || "",
    });
    setIsCreateOpen(true);
  };

  const handleDelete = async (groupId) => {
    try {
      const { data } = await axiosConn.post("/study-group/delete", {
        studyGroupId: groupId,
      });

      if (data.success) {
        toast({
          title: "Success",
          description: "Study group deleted successfully",
        });
        fetchStudyGroups();
      }
    } catch (error) {
      console.error("Error deleting study group:", error);
      toast({
        title: "Error",
        description: "Failed to delete study group",
        variant: "destructive",
      });
    }
  };

  const handleInvite = (group) => {
    setSelectedGroup(group);
    setIsInviteOpen(true);
  };

  const filteredGroups = useMemo(() => {
    return studyGroups.filter((group) => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === "all") return matchesSearch;
      if (filter === "owned") return matchesSearch && group.isOwner;
      if (filter === "member") return matchesSearch && !group.isOwner;
      return matchesSearch;
    });
  }, [studyGroups, searchTerm, filter]);

  const analytics = useMemo(() => {
    const totalGroups = studyGroups.length;
    const ownedGroups = studyGroups.filter(g => g.isOwner).length;
    const memberGroups = totalGroups - ownedGroups;
    const totalMembers = studyGroups.reduce((sum, g) => sum + (g.memberCount || 0), 0);

    return { totalGroups, ownedGroups, memberGroups, totalMembers };
  }, [studyGroups]);

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
        {/* Header Section */}
        <Card className="w-full rounded-lg border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
              <Users className="w-8 h-8" />
              My Study Groups
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Analytics Dashboard */}
        <StudyGroupAnalytics analytics={analytics} />

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between my-6">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="owned">Owned by Me</SelectItem>
                <SelectItem value="member">Member of</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <SheetTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingGroup(null);
                  form.reset();
                }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Study Group
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full p-0">
              <div className="px-6 py-6 h-full flex flex-col">
                <SheetHeader className="px-0">
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
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 overflow-y-auto space-y-4 py-4 px-2 h-[calc(100svh-5em)]"
                  >
                    <div className="space-y-4">
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
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="programming">Programming</SelectItem>
                                <SelectItem value="mathematics">Mathematics</SelectItem>
                                <SelectItem value="science">Science</SelectItem>
                                <SelectItem value="language">Language Learning</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxMembers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Members</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="2"
                                max="50"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="studySchedule"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Study Schedule (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Weekdays 7-9 PM EST"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isPrivate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Private Group</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Only invited members can join this group
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex-shrink-0 py-4 mt-auto border-t sticky bottom-0 bg-white">
                      <SheetFooter className="w-full">
                        <Button type="submit" className="w-full">
                          {editingGroup ? "Update Group" : "Create Group"}
                        </Button>
                      </SheetFooter>
                    </div>
                  </form>
                </Form>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Study Groups Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading study groups...</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Create your first study group to get started"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Study Group
                </Button>
              )}
            </div>
          ) : (
            filteredGroups.map((group) => (
              <StudyGroupCard
                key={group.id}
                group={group}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onInvite={handleInvite}
              />
            ))
          )}
        </div>

        {/* Invite Users Sheet */}
        <Sheet open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Invite Users</SheetTitle>
              <SheetDescription>
                Invite users to join "{selectedGroup?.name}"
              </SheetDescription>
            </SheetHeader>

            <Form {...inviteForm}>
              <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)} className="space-y-4 mt-6">
                <FormField
                  control={inviteForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter user's email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={inviteForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a personal message to your invitation"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetFooter>
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

// Study Group Card Component
const StudyGroupCard = ({ group, onEdit, onDelete, onInvite }) => {
  const getStatusBadge = () => {
    if (group.isOwner) {
      return <Badge variant="default" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
        <Crown className="w-3 h-3 mr-1" />
        Owner
      </Badge>;
    }
    return <Badge variant="secondary">Member</Badge>;
  };

  const getCategoryColor = (category) => {
    const colors = {
      programming: "bg-blue-100 text-blue-700",
      mathematics: "bg-green-100 text-green-700",
      science: "bg-purple-100 text-purple-700",
      language: "bg-orange-100 text-orange-700",
      business: "bg-red-100 text-red-700",
      design: "bg-pink-100 text-pink-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.other;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {group.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {group.description}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onInvite(group)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Users
              </DropdownMenuItem>
              {group.isOwner && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(group)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Group
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Group
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Study Group</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{group.name}"? This action cannot be undone and all group data will be lost.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(group.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={getCategoryColor(group.category)}>
              {group.category}
            </Badge>
            {getStatusBadge()}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{group.memberCount || 0} / {group.maxMembers} members</span>
            {group.isPrivate && (
              <Badge variant="outline" className="ml-auto">
                Private
              </Badge>
            )}
          </div>

          {group.studySchedule && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="truncate">{group.studySchedule}</span>
            </div>
          )}

          <div className="flex items-center text-xs text-gray-500">
            <span>Created {format(new Date(group.createdAt), "MMM dd, yyyy")}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Analytics Component
const StudyGroupAnalytics = ({ analytics }) => {
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <StatCard
        title="Total Groups"
        value={analytics.totalGroups}
        icon={Users}
        color="text-purple-600"
      />
      <StatCard
        title="Groups I Own"
        value={analytics.ownedGroups}
        icon={Crown}
        color="text-blue-600"
      />
      <StatCard
        title="Member Of"
        value={analytics.memberGroups}
        icon={UserPlus}
        color="text-green-600"
      />
      <StatCard
        title="Total Members"
        value={analytics.totalMembers}
        icon={MessageCircle}
        color="text-orange-600"
      />
    </div>
  );
};

export default MyStudyGroup;
