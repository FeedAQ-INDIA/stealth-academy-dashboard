import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet.jsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
    UserPlus, 
    UserMinus, 
    Search, 
    Mail, 
    User, 
    Shield, 
    Crown,
    Loader2,
    AlertCircle,
    MoreHorizontal,
    UserCog,
    Building2,
    Send,
    X,
    Users,
    Calendar
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import { useOrganizationStore } from "@/zustland/store.js";
import axiosConn from "@/axioscon.js";
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb.jsx";

function AddMembersToOrg() {
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [pendingInvitations, setPendingInvitations] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [isBulkAddSheetOpen, setIsBulkAddSheetOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("members");
    
    // Get organization data from Zustand store
    const { 
        selectedOrganization,
        organizations,
        organizationsLoading,
        hasOrganization 
    } = useOrganizationStore();

    // Form validation schema for adding single member
    const addMemberSchema = z.object({
        email: z.string().email("Please enter a valid email address"),
        role: z.enum(["MEMBER", "ADMIN", "MANAGER", "INSTRUCTOR"], {
            required_error: "Please select a role",
        }),
        firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
        lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
    });

    // Form validation schema for bulk adding members
    const bulkAddSchema = z.object({
        emails: z.string().min(1, "Please enter at least one email address"),
        defaultRole: z.enum(["MEMBER", "ADMIN", "MANAGER", "INSTRUCTOR"], {
            required_error: "Please select a default role",
        }),
    });

    const addMemberForm = useForm({
        resolver: zodResolver(addMemberSchema),
        defaultValues: {
            email: "",
            role: "MEMBER",
            firstName: "",
            lastName: "",
        },
    });

    const bulkAddForm = useForm({
        resolver: zodResolver(bulkAddSchema),
        defaultValues: {
            emails: "",
            defaultRole: "MEMBER",
        },
    });

    // Fetch active members when organization is selected
    const fetchMembers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axiosConn.get(`/organization/${selectedOrganization.orgId}/users`, {
                params: { status: 'ACTIVE' }
            });
            
            if (response.data.success) {
                // Parse the response according to the backend structure
                const activeMembers = response.data.data || [];
                setMembers(activeMembers);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
            toast({
                title: "Error",
                description: "Failed to fetch organization members",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [selectedOrganization?.orgId]);

    // Fetch invited users separately
    const fetchInvitedUsers = useCallback(async () => {
            setIsLoading(true);
            await axiosConn.post(import.meta.env.VITE_API_URL +`/searchCourse`, {
    limit: 10,
    offset: 0,
    getThisData: {
      datasource: "OrganizationUserInvites",
      attributes: [], 
        where: {
            orgId: selectedOrganization.orgId,
          },
    },
  }).then((response) => {
     const pendingUsers = response.data.data.results || [];
     console.log(pendingUsers)
                setPendingInvitations(pendingUsers);
                setInvitedUsers(pendingUsers);
  })
  .catch((error) => {
    console.error("Error fetching invited users:", error);
            toast({
                title: "Error",
                description: "Failed to fetch invited users",
                variant: "destructive",
            });
  }).finally(() => {
    setIsLoading(false);
  });
            
   
    }, [selectedOrganization?.orgId]);

    useEffect(() => {
        if (selectedOrganization?.orgId) {
            fetchMembers();
            fetchInvitedUsers();
        }
    }, [selectedOrganization, fetchMembers, fetchInvitedUsers]);

    const onSubmitAddMember = async (data) => {
        setIsLoading(true);
        try {
            await axiosConn.post(`/organization/${selectedOrganization.orgId}/invite`, {
                email: data.email,
                userRole: data.role // Already uppercase from the form
            });
            
            toast({
                title: "Success!",
                description: "Member invitation sent successfully!",
                variant: "default",
            });
            
            setIsAddSheetOpen(false);
            addMemberForm.reset();
            fetchMembers(); // Refresh active members
            fetchInvitedUsers(); // Refresh invited users
        } catch (error) {
            console.error("Error inviting member:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to send invitation",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitBulkAdd = async (data) => {
        setIsLoading(true);
        try {
            const emails = data.emails
                .split('\n')
                .map(email => email.trim())
                .filter(email => email && email.includes('@'));
            
            if (emails.length === 0) {
                toast({
                    title: "Error",
                    description: "Please enter valid email addresses",
                    variant: "destructive",
                });
                return;
            }

            // Create users array as expected by backend
            const users = emails.map(email => ({ email }));

            await axiosConn.post(`/organization/${selectedOrganization.orgId}/bulk-invite`, {
                users: users,
                defaultRole: data.defaultRole
            });
            
            toast({
                title: "Success!",
                description: `${emails.length} invitation(s) sent successfully!`,
                variant: "default",
            });
            
            setIsBulkAddSheetOpen(false);
            bulkAddForm.reset();
            fetchMembers(); // Refresh active members
            fetchInvitedUsers(); // Refresh invited users
        } catch (error) {
            console.error("Error sending bulk invitations:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to send invitations",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const removeMember = async (memberId) => {
        try {
            await axiosConn.delete(`/organization/${selectedOrganization.orgId}/users/${memberId}`);
            
            toast({
                title: "Success!",
                description: "Member removed successfully",
                variant: "default",
            });
            
            fetchMembers();
            fetchInvitedUsers();
        } catch (error) {
            console.error("Error removing member:", error);
     
            
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to remove member",
                variant: "destructive",
            });
        }
    };

    const updateMemberRole = async (memberId, newRole) => {
        try {
            await axiosConn.put(`/organization/${selectedOrganization.orgId}/users/${memberId}/role`, {
                userRole: newRole
            });
            
            toast({
                title: "Success!",
                description: "Member role updated successfully",
                variant: "default",
            });
            
            fetchMembers();
            fetchInvitedUsers();
        } catch (error) {
            console.error("Error updating member role:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update member role",
                variant: "destructive",
            });
        }
    };

    const cancelInvitation = async (userId) => {
        try {
            // Cancel invitation by removing the user from organization
            await axiosConn.delete(`/organization/${selectedOrganization.orgId}/users/${userId}`);
            
            toast({
                title: "Success!",
                description: "Invitation cancelled successfully",
                variant: "default",
            });
            
            fetchMembers(); // Refresh the list
            fetchInvitedUsers(); // Refresh invited users
        } catch (error) {
            console.error("Error cancelling invitation:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to cancel invitation",
                variant: "destructive",
            });
        }
    };

    const resendInvitation = async (email) => {
        try {
            // Find the user's role from the pending invitations
            const pendingUser = pendingInvitations.find(inv => inv.user?.email === email);
            if (!pendingUser) {
                toast({
                    title: "Error",
                    description: "User not found in pending invitations",
                    variant: "destructive",
                });
                return;
            }

            await axiosConn.post(`/organization/${selectedOrganization.orgId}/invite`, {
                email: email,
                userRole: pendingUser.userRole
            });
            
            toast({
                title: "Success!",
                description: "Invitation resent successfully",
                variant: "default",
            });
        } catch (error) {
            console.error("Error resending invitation:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to resend invitation",
                variant: "destructive",
            });
        }
    };

    const getRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return <Crown className="h-4 w-4" />;
            case 'manager':
            case 'instructor':
                return <Shield className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const getRoleBadgeVariant = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'destructive';
            case 'manager':
            case 'instructor':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const filteredMembers = members.filter(member =>
        member.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredInvitedUsers = invitedUsers.filter(user =>
        user.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        return (
            name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase() || "ORG"
        );
    };

    if (organizationsLoading || isLoading) {
        return (
            <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="truncate max-w-[30ch]">Member Management</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto sm:flex-initial"></div>
                </header>
                <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading member management...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedOrganization) {
        return (
            <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="truncate max-w-[30ch]">Member Management</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto sm:flex-initial"></div>
                </header>
                <div className="p-4 mx-auto">
                    <Alert>
                        <Building2 className="h-4 w-4" />
                        <AlertDescription>
                            Please select an organization from the sidebar to manage members.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    const currentUserRole = organizations.find(
        org => org.orgId === selectedOrganization.orgId
    )?.userRole;

    return (
        <div className="  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">Member Management</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <div className="p-4 mx-auto ">
                {/* Organization Header Card */}
                <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700">
                    <CardHeader className="p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                                <div className="relative flex-shrink-0">
                                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 shadow-xl">
                                        <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                                            {getInitials(selectedOrganization.orgName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight text-white">
                                        {selectedOrganization.orgName}
                                    </h1>
                                    <p className="text-white text-base sm:text-lg flex items-center gap-2 flex-wrap">
                                        <Users className="w-4 h-4 flex-shrink-0" />
                                        <span className="break-words">Manage organization members and permissions</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                    {selectedOrganization.orgStatus || "Active"}
                                </Badge>
                                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 capitalize">
                                    {selectedOrganization.orgType?.replace("_", " ")}
                                </Badge>
                                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    {currentUserRole}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="space-y-6">
                    {/* Combined Member Management with Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col gap-4">
                                    {/* Title and Actions Row */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Member Management
                                        </CardTitle>
                                        <div className="flex gap-2">
                                            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
                                                <SheetTrigger asChild>
                                                    <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                        <UserPlus className="h-4 w-4" />
                                                        Add Member
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="sm:max-w-md">
                                                    <SheetHeader>
                                                        <SheetTitle>Add New Member</SheetTitle>
                                                        <SheetDescription>
                                                            Send an invitation to add a new member to your organization.
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <Form {...addMemberForm}>
                                                        <form onSubmit={addMemberForm.handleSubmit(onSubmitAddMember)} className="space-y-4 mt-6">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <FormField
                                                                    control={addMemberForm.control}
                                                                    name="firstName"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>First Name</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="John" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={addMemberForm.control}
                                                                    name="lastName"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Last Name</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="Doe" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                            <FormField
                                                                control={addMemberForm.control}
                                                                name="email"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Email Address</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="john.doe@example.com" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={addMemberForm.control}
                                                                name="role"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Role</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                <SelectItem value="MEMBER">Member</SelectItem>
                                                                                <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                                                                <SelectItem value="MANAGER">Manager</SelectItem>
                                                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <div className="flex justify-end gap-2 pt-4">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => setIsAddSheetOpen(false)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                    <Send className="mr-2 h-4 w-4" />
                                                                    Send Invitation
                                                                </Button>
                                                            </div>
                                                        </form>
                                                    </Form>
                                                </SheetContent>
                                            </Sheet>

                                            <Sheet open={isBulkAddSheetOpen} onOpenChange={setIsBulkAddSheetOpen}>
                                                <SheetTrigger asChild>
                                                    <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                                                        <Mail className="h-4 w-4" />
                                                        Bulk Add
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="sm:max-w-md">
                                                    <SheetHeader>
                                                        <SheetTitle>Bulk Add Members</SheetTitle>
                                                        <SheetDescription>
                                                            Add multiple members at once by entering their email addresses.
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <Form {...bulkAddForm}>
                                                        <form onSubmit={bulkAddForm.handleSubmit(onSubmitBulkAdd)} className="space-y-4 mt-6">
                                                            <FormField
                                                                control={bulkAddForm.control}
                                                                name="emails"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Email Addresses</FormLabel>
                                                                        <FormControl>
                                                                            <textarea
                                                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                                placeholder="Enter email addresses (one per line)&#10;john@example.com&#10;jane@example.com"
                                                                                rows={4}
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={bulkAddForm.control}
                                                                name="defaultRole"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Default Role</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                <SelectItem value="MEMBER">Member</SelectItem>
                                                                                <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                                                                <SelectItem value="MANAGER">Manager</SelectItem>
                                                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <div className="flex justify-end gap-2 pt-4">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => setIsBulkAddSheetOpen(false)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                    <Send className="mr-2 h-4 w-4" />
                                                                    Send Invitations
                                                                </Button>
                                                            </div>
                                                        </form>
                                                    </Form>
                                                </SheetContent>
                                            </Sheet>
                                        </div>
                                    </div>
                                    
                                    {/* Tabs and Search Row */}
                                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                        <TabsList className="grid w-full sm:w-auto grid-cols-2">
                                            <TabsTrigger value="members" className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span className="hidden sm:inline">Current Members</span>
                                                <Badge variant="secondary" className="ml-1">
                                                    {filteredMembers.length}
                                                </Badge>
                                            </TabsTrigger>
                                            <TabsTrigger value="invited" className="flex items-center gap-2">
                                                <Send className="w-4 h-4" />
                                                <span className="hidden sm:inline">Invited Users</span>
                                                <Badge variant="secondary" className="ml-1">
                                                    {filteredInvitedUsers.length}
                                                </Badge>
                                            </TabsTrigger>
                                        </TabsList>
                                        <div className="relative flex-1 max-w-sm">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                placeholder="Search members..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                                {/* Current Members Tab */}
                                <TabsContent value="members" className="mt-0">
                                    {filteredMembers.length === 0 ? (
                                        <div className="text-center py-8">
                                            <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">No members found</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Member</TableHead>
                                                        <TableHead>Role</TableHead>
                                                        <TableHead>Joined</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredMembers.map((member) => (
                                                        <TableRow key={member.userId}>
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarImage src={member.user?.profilePicture} />
                                                                        <AvatarFallback>
                                                                            {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="font-medium">{member.user?.firstName} {member.user?.lastName}</p>
                                                                        <p className="text-sm text-gray-500">{member.user?.email}</p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={getRoleBadgeVariant(member.userRole)} className="flex items-center gap-1 w-fit">
                                                                    {getRoleIcon(member.userRole)}
                                                                    {member.userRole}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {new Date(member.orgUserCreatedAt).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => updateMemberRole(member.userId, 'MEMBER')}>
                                                                            Change to Member
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => updateMemberRole(member.userId, 'INSTRUCTOR')}>
                                                                            Change to Instructor
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => updateMemberRole(member.userId, 'MANAGER')}>
                                                                            Change to Manager
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => updateMemberRole(member.userId, 'ADMIN')}>
                                                                            Change to Admin
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem 
                                                                            onClick={() => removeMember(member.userId)}
                                                                            className="text-red-600"
                                                                        >
                                                                            Remove Member
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
                                </TabsContent>

                                {/* Invited Users Tab */}
                                <TabsContent value="invited" className="mt-0">
                                    {filteredInvitedUsers.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Send className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">No invited users found</p>
                                            <p className="text-sm text-gray-400 mt-1">Users you invite will appear here</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Invited User</TableHead>
                                                        <TableHead>Role</TableHead>
                                                        <TableHead>Invited Date</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredInvitedUsers.map((invitedUser) => (
                                                        <TableRow key={invitedUser.userId}>
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative">
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                                                                <Mail className="h-4 w-4" />
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white flex items-center justify-center">
                                                                            <Send className="h-1.5 w-1.5 text-white" />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium">
                                                                            {invitedUser.user?.firstName && invitedUser.user?.lastName
                                                                                ? `${invitedUser.user.firstName} ${invitedUser.user.lastName}`
                                                                                : 'Invited User'
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-500">{invitedUser.user?.email}</p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={getRoleBadgeVariant(invitedUser.userRole)} className="flex items-center gap-1 w-fit">
                                                                    {getRoleIcon(invitedUser.userRole)}
                                                                    {invitedUser.userRole}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {new Date(invitedUser.orgUserCreatedAt).toLocaleDateString()}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50">
                                                                    Pending
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => resendInvitation(invitedUser.user?.email)}
                                                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                                                        title="Resend invitation"
                                                                    >
                                                                        <Send className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => cancelInvitation(invitedUser.userId)}
                                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                                                                        title="Cancel invitation"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </TabsContent>
                            </CardContent>
                        </Card>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default AddMembersToOrg;
