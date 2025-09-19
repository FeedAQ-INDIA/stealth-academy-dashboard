import React, { useState, useEffect } from "react";
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
    CheckCircle,
    X,
    Users,
    Calendar,
    Activity
} from "lucide-react";
import { toast } from "@/components/hooks/use-toast.js";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import { useOrganizationStore } from "@/zustland/store.js";
import axiosConn from "@/axioscon.js";

function AddMembersToOrg() {
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [pendingInvitations, setPendingInvitations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [isBulkAddSheetOpen, setIsBulkAddSheetOpen] = useState(false);
    
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

    // Fetch members when organization is selected
    useEffect(() => {
        if (selectedOrganization?.orgId) {
            fetchMembers();
        }
    }, [selectedOrganization]);

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const response = await axiosConn.get(`/organization/${selectedOrganization.orgId}/users`);
            
            if (response.data.success) {
                // Parse the response according to the backend structure
                const allUsers = response.data.data.users || [];
                setMembers(allUsers.filter(user => user.status === 'ACTIVE'));
                setPendingInvitations(allUsers.filter(user => user.status === 'PENDING'));
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
    };

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
            fetchMembers(); // This will now fetch both active and pending users
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
            fetchMembers(); // This will now fetch both active and pending users
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

    const filteredInvitations = pendingInvitations.filter(invitation =>
        invitation.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (organizationsLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading member management...</span>
            </div>
        );
    }

    if (!hasOrganization || !selectedOrganization) {
        return (
            <div className="space-y-6">
                <Alert>
                    <Building2 className="h-4 w-4" />
                    <AlertDescription>
                        {!hasOrganization 
                            ? "You don't have any organizations yet. Register your organization to start adding members."
                            : "Please select an organization from the sidebar to manage members."
                        }
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const currentUserRole = organizations.find(
        org => org.organization.orgId === selectedOrganization.orgId
    )?.userRole;

    return (
        <div className="space-y-6">
      {/* Organization Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                  {selectedOrganization.orgName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedOrganization.orgName}
                </h1>

                <div className="flex items-center gap-3 mt-3">
                  <Badge>{selectedOrganization.orgStatus || "Active"}</Badge>
                  <Badge variant="secondary">
                    {selectedOrganization.orgType}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {currentUserRole}
                  </Badge>
                </div>
              </div>
            </div>
          
          </div>
        </CardContent>
      </Card>
                    {/* Actions */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search members..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
                                        <SheetTrigger asChild>
                                            <Button className="flex items-center gap-2">
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
                                                        <Button type="submit" disabled={isLoading}>
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
                                            <Button variant="outline" className="flex items-center gap-2">
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
                                                        <Button type="submit" disabled={isLoading}>
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
                        </CardContent>
                    </Card>

                    {/* Current Members */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Current Members ({filteredMembers.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>

                    {/* Pending Invitations */}
                    {filteredInvitations.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Pending Invitations ({filteredInvitations.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Sent</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredInvitations.map((invitation) => (
                                                <TableRow key={invitation.userId}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback>
                                                                    <Mail className="h-4 w-4" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">{invitation.user?.firstName} {invitation.user?.lastName}</p>
                                                                <p className="text-sm text-gray-500">{invitation.user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getRoleBadgeVariant(invitation.userRole)} className="flex items-center gap-1 w-fit">
                                                            {getRoleIcon(invitation.userRole)}
                                                            {invitation.userRole}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(invitation.orgUserCreatedAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex gap-1 justify-end">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => resendInvitation(invitation.user?.email)}
                                                                className="text-blue-600 hover:text-blue-700"
                                                            >
                                                                <Send className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => cancelInvitation(invitation.userId)}
                                                                className="text-red-600 hover:text-red-700"
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
                            </CardContent>
                        </Card>
                    )}
        </div>
    );
}

export default AddMembersToOrg;
