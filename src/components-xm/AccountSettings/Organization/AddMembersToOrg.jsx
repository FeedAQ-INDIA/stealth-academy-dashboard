import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
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
    X
} from "lucide-react";
import { toast } from "@/components/hooks/use-toast.js";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import axiosConn from "@/axioscon.js";

function AddMembersToOrg() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrgId, setSelectedOrgId] = useState("");
    const [members, setMembers] = useState([]);
    const [pendingInvitations, setPendingInvitations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);

    // Form validation schema for adding single member
    const addMemberSchema = z.object({
        email: z.string().email("Please enter a valid email address"),
        role: z.enum(["member", "admin", "moderator"], {
            required_error: "Please select a role",
        }),
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
    });

    // Form validation schema for bulk adding members
    const bulkAddSchema = z.object({
        emails: z.string().min(1, "Please enter at least one email address"),
        defaultRole: z.enum(["member", "admin", "moderator"], {
            required_error: "Please select a default role",
        }),
    });

    const addMemberForm = useForm({
        resolver: zodResolver(addMemberSchema),
        defaultValues: {
            email: "",
            role: "member",
            firstName: "",
            lastName: "",
        },
    });

    const bulkAddForm = useForm({
        resolver: zodResolver(bulkAddSchema),
        defaultValues: {
            emails: "",
            defaultRole: "member",
        },
    });

    // Fetch user's organizations
    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Fetch members when organization is selected
    useEffect(() => {
        if (selectedOrgId) {
            fetchMembers();
            fetchPendingInvitations();
        }
    }, [selectedOrgId]);

    const fetchOrganizations = async () => {
        try {
            setIsFetching(true);
            const response = await axiosConn.get("/user/organizations");
            setOrganizations(response.data.data || []);
            
            // Auto-select first organization if available
            if (response.data.data && response.data.data.length > 0) {
                setSelectedOrgId(response.data.data[0].id);
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

    const fetchMembers = async () => {
        try {
            const response = await axiosConn.get(`/organization/${selectedOrgId}/users`);
            setMembers(response.data.data || []);
        } catch (error) {
            console.error("Error fetching members:", error);
            toast({
                title: "Error",
                description: "Failed to fetch organization members",
                variant: "destructive",
            });
        }
    };

    const fetchPendingInvitations = async () => {
        try {
            const response = await axiosConn.get(`/org/${selectedOrgId}/invitations/pending`);
            setPendingInvitations(response.data.data || []);
        } catch (error) {
            console.error("Error fetching pending invitations:", error);
        }
    };

    const onSubmitAddMember = async (data) => {
        setIsLoading(true);
        try {
            await axiosConn.post(`/organization/${selectedOrgId}/invite`, {
                email: data.email,
                userRole: data.role.toUpperCase()
            });
            
            toast({
                title: "Success!",
                description: "Member invitation sent successfully!",
                variant: "default",
            });
            
            setIsAddModalOpen(false);
            addMemberForm.reset();
            fetchPendingInvitations();
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

            await axiosConn.post(`/org/${selectedOrgId}/invite-members-bulk`, {
                emails: emails,
                defaultRole: data.defaultRole
            });
            
            toast({
                title: "Success!",
                description: `${emails.length} invitation(s) sent successfully!`,
                variant: "default",
            });
            
            setIsBulkAddModalOpen(false);
            bulkAddForm.reset();
            fetchPendingInvitations();
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
            await axiosConn.delete(`/org/${selectedOrgId}/members/${memberId}`);
            
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
                description: "Failed to remove member",
                variant: "destructive",
            });
        }
    };

    const updateMemberRole = async (memberId, newRole) => {
        try {
            await axiosConn.put(`/org/${selectedOrgId}/members/${memberId}/role`, {
                role: newRole
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
                description: "Failed to update member role",
                variant: "destructive",
            });
        }
    };

    const cancelInvitation = async (invitationId) => {
        try {
            await axiosConn.delete(`/org/${selectedOrgId}/invitations/${invitationId}`);
            
            toast({
                title: "Success!",
                description: "Invitation cancelled successfully",
                variant: "default",
            });
            
            fetchPendingInvitations();
        } catch (error) {
            console.error("Error cancelling invitation:", error);
            toast({
                title: "Error",
                description: "Failed to cancel invitation",
                variant: "destructive",
            });
        }
    };

    const resendInvitation = async (invitationId) => {
        try {
            await axiosConn.post(`/org/${selectedOrgId}/invitations/${invitationId}/resend`);
            
            toast({
                title: "Success!",
                description: "Invitation resent successfully",
                variant: "default",
            });
        } catch (error) {
            console.error("Error resending invitation:", error);
            toast({
                title: "Error",
                description: "Failed to resend invitation",
                variant: "destructive",
            });
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin':
                return <Crown className="h-4 w-4" />;
            case 'moderator':
                return <Shield className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'moderator':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const filteredMembers = members.filter(member =>
        member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredInvitations = pendingInvitations.filter(invitation =>
        invitation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        You don't have any organizations yet. Register your organization to start adding members.
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
                        <UserCog className="h-6 w-6 text-blue-600" />
                        Add Members to Organization
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
                                        placeholder="Search members..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="flex items-center gap-2">
                                                <UserPlus className="h-4 w-4" />
                                                Add Member
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Add New Member</DialogTitle>
                                            </DialogHeader>
                                            <Form {...addMemberForm}>
                                                <form onSubmit={addMemberForm.handleSubmit(onSubmitAddMember)} className="space-y-4">
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
                                                                        <SelectItem value="member">Member</SelectItem>
                                                                        <SelectItem value="moderator">Moderator</SelectItem>
                                                                        <SelectItem value="admin">Admin</SelectItem>
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
                                                            onClick={() => setIsAddModalOpen(false)}
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
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog open={isBulkAddModalOpen} onOpenChange={setIsBulkAddModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                Bulk Add
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Bulk Add Members</DialogTitle>
                                            </DialogHeader>
                                            <Form {...bulkAddForm}>
                                                <form onSubmit={bulkAddForm.handleSubmit(onSubmitBulkAdd)} className="space-y-4">
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
                                                                        <SelectItem value="member">Member</SelectItem>
                                                                        <SelectItem value="moderator">Moderator</SelectItem>
                                                                        <SelectItem value="admin">Admin</SelectItem>
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
                                                            onClick={() => setIsBulkAddModalOpen(false)}
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
                                        </DialogContent>
                                    </Dialog>
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
                                                <TableRow key={member.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={member.avatar} />
                                                                <AvatarFallback>
                                                                    {member.firstName?.[0]}{member.lastName?.[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">{member.firstName} {member.lastName}</p>
                                                                <p className="text-sm text-gray-500">{member.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1 w-fit">
                                                            {getRoleIcon(member.role)}
                                                            {member.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(member.joinedAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => updateMemberRole(member.id, 'member')}>
                                                                    Change to Member
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => updateMemberRole(member.id, 'moderator')}>
                                                                    Change to Moderator
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => updateMemberRole(member.id, 'admin')}>
                                                                    Change to Admin
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    onClick={() => removeMember(member.id)}
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
                                                <TableRow key={invitation.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback>
                                                                    <Mail className="h-4 w-4" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">{invitation.firstName} {invitation.lastName}</p>
                                                                <p className="text-sm text-gray-500">{invitation.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getRoleBadgeVariant(invitation.role)} className="flex items-center gap-1 w-fit">
                                                            {getRoleIcon(invitation.role)}
                                                            {invitation.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(invitation.sentAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex gap-1 justify-end">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => resendInvitation(invitation.id)}
                                                                className="text-blue-600 hover:text-blue-700"
                                                            >
                                                                <Send className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => cancelInvitation(invitation.id)}
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
                </>
            )}
        </div>
    );
}

export default AddMembersToOrg;
