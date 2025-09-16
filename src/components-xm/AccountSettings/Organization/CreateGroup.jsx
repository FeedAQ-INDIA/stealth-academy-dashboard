import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
    Users, 
    Plus, 
    Search, 
    Edit,
    Trash2,
    Loader2,
    AlertCircle,
    MoreHorizontal,
    UsersIcon,
    Building2,
    Calendar,
    User,
    Settings,
    Eye,
    CheckCircle
} from "lucide-react";
import { toast } from "@/components/hooks/use-toast.js";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import axiosConn from "@/axioscon.js";

function CreateGroup() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrgId, setSelectedOrgId] = useState("");
    const [groups, setGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Form validation schema for creating/editing groups
    const groupSchema = z.object({
        name: z.string().min(3, "Group name must be at least 3 characters long"),
        description: z.string().min(10, "Description must be at least 10 characters long"),
        type: z.enum(["department", "team", "project", "course", "custom"], {
            required_error: "Please select a group type",
        }),
        maxMembers: z.string().optional(),
        isPrivate: z.boolean().default(false),
    });

    const createForm = useForm({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: "",
            description: "",
            type: "team",
            maxMembers: "",
            isPrivate: false,
        },
    });

    const editForm = useForm({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: "",
            description: "",
            type: "team",
            maxMembers: "",
            isPrivate: false,
        },
    });

    // Fetch user's organizations
    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Fetch groups when organization is selected
    useEffect(() => {
        if (selectedOrgId) {
            fetchGroups();
        }
    }, [selectedOrgId]);

    // Load selected group data into edit form
    useEffect(() => {
        if (selectedGroup) {
            editForm.reset({
                name: selectedGroup.name || "",
                description: selectedGroup.description || "",
                type: selectedGroup.type || "team",
                maxMembers: selectedGroup.maxMembers?.toString() || "",
                isPrivate: selectedGroup.isPrivate || false,
            });
        }
    }, [selectedGroup, editForm]);

    const fetchOrganizations = async () => {
        try {
            setIsFetching(true);
            const response = await axiosConn.get("/user/organizations");
            setOrganizations(response.data.data || []);
            
            // Auto-select first organization if available
            if (response.data.data && response.data.data.length > 0) {
                setSelectedOrgId(response.data.data[0].organization.orgId);
            }
        } catch (error) {
            console.error("Error fetching organizations:", error);
            toast({
                title: "Error",
                description: "Failed to fetch organizations",
                variant: "destructive",
            });
        } finally {
            setIsFetching(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await axiosConn.get(`/organization/${selectedOrgId}/groups`);
            setGroups(response.data.data.groups || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
            toast({
                title: "Error",
                description: "Failed to fetch groups",
                variant: "destructive",
            });
        }
    };

    const onSubmitCreate = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                groupName: data.name,
                description: data.description,
                metadata: {
                    type: data.type,
                    maxMembers: data.maxMembers ? parseInt(data.maxMembers) : null,
                    isPrivate: data.isPrivate
                }
            };

            await axiosConn.post(`/organization/${selectedOrgId}/groups`, payload);
            
            toast({
                title: "Success!",
                description: "Group created successfully!",
                variant: "default",
            });
            
            setIsCreateModalOpen(false);
            createForm.reset();
            fetchGroups();
        } catch (error) {
            console.error("Error creating group:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create group",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitEdit = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                maxMembers: data.maxMembers ? parseInt(data.maxMembers) : null,
            };

            await axiosConn.put(`/org/${selectedOrgId}/groups/${selectedGroup.id}`, payload);
            
            toast({
                title: "Success!",
                description: "Group updated successfully!",
                variant: "default",
            });
            
            setIsEditModalOpen(false);
            setSelectedGroup(null);
            editForm.reset();
            fetchGroups();
        } catch (error) {
            console.error("Error updating group:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update group",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const deleteGroup = async (groupId) => {
        if (!confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
            return;
        }

        try {
            await axiosConn.delete(`/org/${selectedOrgId}/groups/${groupId}`);
            
            toast({
                title: "Success!",
                description: "Group deleted successfully",
                variant: "default",
            });
            
            fetchGroups();
        } catch (error) {
            console.error("Error deleting group:", error);
            toast({
                title: "Error",
                description: "Failed to delete group",
                variant: "destructive",
            });
        }
    };

    const openEditModal = (group) => {
        setSelectedGroup(group);
        setIsEditModalOpen(true);
    };

    const getGroupTypeColor = (type) => {
        const colors = {
            department: "bg-blue-100 text-blue-800",
            team: "bg-green-100 text-green-800",
            project: "bg-purple-100 text-purple-800",
            course: "bg-orange-100 text-orange-800",
            custom: "bg-gray-100 text-gray-800",
        };
        return colors[type] || colors.custom;
    };

    const getGroupTypeIcon = (type) => {
        switch (type) {
            case 'department':
                return <Building2 className="h-4 w-4" />;
            case 'team':
                return <Users className="h-4 w-4" />;
            case 'project':
                return <Settings className="h-4 w-4" />;
            case 'course':
                return <User className="h-4 w-4" />;
            default:
                return <UsersIcon className="h-4 w-4" />;
        }
    };

    const filteredGroups = groups.filter(group =>
        group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading organizations...</span>
            </div>
        );
    }

    if (organizations.length === 0) {
        return (
            <div className="space-y-6">
                <Alert>
                    <Building2 className="h-4 w-4" />
                    <AlertDescription>
                        You don't have any organizations yet. Register your organization to start creating groups.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Organization Selector */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UsersIcon className="h-6 w-6 text-blue-600" />
                        Create Groups
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="org-select">Select Organization</Label>
                            <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an organization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations.map((org) => (
                                        <SelectItem key={org.id} value={org.id}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedOrgId && (
                <>
                    {/* Actions */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search groups..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            Create Group
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Create New Group</DialogTitle>
                                        </DialogHeader>
                                        <Form {...createForm}>
                                            <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4">
                                                <FormField
                                                    control={createForm.control}
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
                                                    control={createForm.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Description</FormLabel>
                                                            <FormControl>
                                                                <Textarea 
                                                                    placeholder="Describe the purpose and goals of this group"
                                                                    rows={3}
                                                                    {...field} 
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={createForm.control}
                                                        name="type"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Group Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="department">Department</SelectItem>
                                                                        <SelectItem value="team">Team</SelectItem>
                                                                        <SelectItem value="project">Project</SelectItem>
                                                                        <SelectItem value="course">Course</SelectItem>
                                                                        <SelectItem value="custom">Custom</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={createForm.control}
                                                        name="maxMembers"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Max Members</FormLabel>
                                                                <FormControl>
                                                                    <Input 
                                                                        type="number" 
                                                                        placeholder="No limit"
                                                                        {...field} 
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={createForm.control}
                                                    name="isPrivate"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Private Group</FormLabel>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Members need invitation to join
                                                                </div>
                                                            </div>
                                                            <FormControl>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.value}
                                                                    onChange={field.onChange}
                                                                    className="h-4 w-4"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="flex justify-end gap-2 pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setIsCreateModalOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" disabled={isLoading}>
                                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                        Create Group
                                                    </Button>
                                                </div>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Groups List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Groups ({filteredGroups.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {filteredGroups.length === 0 ? (
                                <div className="text-center py-8">
                                    <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">
                                        {searchTerm ? "No groups found matching your search" : "No groups created yet"}
                                    </p>
                                    {!searchTerm && (
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={() => setIsCreateModalOpen(true)}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Your First Group
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Group</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Members</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredGroups.map((group) => (
                                                <TableRow key={group.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback>
                                                                    {getGroupTypeIcon(group.type)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium flex items-center gap-2">
                                                                    {group.name}
                                                                    {group.isPrivate && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            Private
                                                                        </Badge>
                                                                    )}
                                                                </p>
                                                                <p className="text-sm text-gray-500 line-clamp-1">
                                                                    {group.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant="secondary" 
                                                            className={`${getGroupTypeColor(group.type)} flex items-center gap-1 w-fit`}
                                                        >
                                                            {getGroupTypeIcon(group.type)}
                                                            {group.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-4 w-4 text-gray-400" />
                                                            <span>{group.memberCount || 0}</span>
                                                            {group.maxMembers && (
                                                                <span className="text-gray-400">/ {group.maxMembers}</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(group.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => openEditModal(group)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Group
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    onClick={() => deleteGroup(group.id)}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete Group
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Edit Group Modal */}
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Group</DialogTitle>
                            </DialogHeader>
                            <Form {...editForm}>
                                <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
                                    <FormField
                                        control={editForm.control}
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
                                        control={editForm.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="Describe the purpose and goals of this group"
                                                        rows={3}
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={editForm.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Group Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="department">Department</SelectItem>
                                                            <SelectItem value="team">Team</SelectItem>
                                                            <SelectItem value="project">Project</SelectItem>
                                                            <SelectItem value="course">Course</SelectItem>
                                                            <SelectItem value="custom">Custom</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={editForm.control}
                                            name="maxMembers"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Max Members</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            placeholder="No limit"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={editForm.control}
                                        name="isPrivate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Private Group</FormLabel>
                                                    <div className="text-sm text-muted-foreground">
                                                        Members need invitation to join
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        className="h-4 w-4"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditModalOpen(false);
                                                setSelectedGroup(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Update Group
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
}

export default CreateGroup;
