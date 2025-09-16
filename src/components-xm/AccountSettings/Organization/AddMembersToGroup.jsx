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
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
    Users, 
    UserPlus, 
    UserMinus, 
    Search, 
    Loader2,
    AlertCircle,
    MoreHorizontal,
    UsersIcon,
    Building2,
    Calendar,
    User,
    Settings,
    Eye,
    CheckCircle,
    X,
    Plus
} from "lucide-react";
import { toast } from "@/components/hooks/use-toast.js";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import axiosConn from "@/axioscon.js";

function AddMembersToGroup() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrgId, setSelectedOrgId] = useState("");
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [orgMembers, setOrgMembers] = useState([]);
    const [availableMembers, setAvailableMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Fetch user's organizations
    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Fetch groups when organization is selected
    useEffect(() => {
        if (selectedOrgId) {
            fetchGroups();
            fetchOrgMembers();
        }
    }, [selectedOrgId]);

    // Fetch group members and calculate available members when group is selected
    useEffect(() => {
        if (selectedGroupId) {
            const group = groups.find(g => g.id === selectedGroupId);
            setSelectedGroup(group);
            fetchGroupMembers();
        }
    }, [selectedGroupId, groups]);

    // Calculate available members (org members not in the selected group)
    useEffect(() => {
        if (orgMembers.length > 0 && groupMembers.length >= 0) {
            const groupMemberIds = groupMembers.map(member => member.id);
            const available = orgMembers.filter(member => !groupMemberIds.includes(member.id));
            setAvailableMembers(available);
        }
    }, [orgMembers, groupMembers]);

    const fetchOrganizations = async () => {
        try {
            setIsFetching(true);
            const response = await axiosConn.get("/org/user-organizations");
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

    const fetchGroups = async () => {
        try {
            const response = await axiosConn.get(`/org/${selectedOrgId}/groups`);
            setGroups(response.data.data || []);
            
            // Reset group selection when org changes
            setSelectedGroupId("");
            setSelectedGroup(null);
            setGroupMembers([]);
        } catch (error) {
            console.error("Error fetching groups:", error);
            toast({
                title: "Error",
                description: "Failed to fetch groups",
                variant: "destructive",
            });
        }
    };

    const fetchOrgMembers = async () => {
        try {
            const response = await axiosConn.get(`/org/${selectedOrgId}/members`);
            setOrgMembers(response.data.data || []);
        } catch (error) {
            console.error("Error fetching organization members:", error);
            toast({
                title: "Error",
                description: "Failed to fetch organization members",
                variant: "destructive",
            });
        }
    };

    const fetchGroupMembers = async () => {
        try {
            const response = await axiosConn.get(`/org/${selectedOrgId}/groups/${selectedGroupId}/members`);
            setGroupMembers(response.data.data || []);
        } catch (error) {
            console.error("Error fetching group members:", error);
            toast({
                title: "Error",
                description: "Failed to fetch group members",
                variant: "destructive",
            });
        }
    };

    const addMembersToGroup = async () => {
        if (selectedMembers.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one member to add",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await axiosConn.post(`/org/${selectedOrgId}/groups/${selectedGroupId}/members`, {
                memberIds: selectedMembers
            });
            
            toast({
                title: "Success!",
                description: `${selectedMembers.length} member(s) added to group successfully!`,
                variant: "default",
            });
            
            setIsAddModalOpen(false);
            setSelectedMembers([]);
            fetchGroupMembers();
        } catch (error) {
            console.error("Error adding members to group:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to add members to group",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const removeMemberFromGroup = async (memberId) => {
        try {
            await axiosConn.delete(`/org/${selectedOrgId}/groups/${selectedGroupId}/members/${memberId}`);
            
            toast({
                title: "Success!",
                description: "Member removed from group successfully",
                variant: "default",
            });
            
            fetchGroupMembers();
        } catch (error) {
            console.error("Error removing member from group:", error);
            toast({
                title: "Error",
                description: "Failed to remove member from group",
                variant: "destructive",
            });
        }
    };

    const handleMemberSelection = (memberId, isSelected) => {
        if (isSelected) {
            setSelectedMembers(prev => [...prev, memberId]);
        } else {
            setSelectedMembers(prev => prev.filter(id => id !== memberId));
        }
    };

    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            const allAvailableIds = filteredAvailableMembers.map(member => member.id);
            setSelectedMembers(allAvailableIds);
        } else {
            setSelectedMembers([]);
        }
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

    const filteredGroupMembers = groupMembers.filter(member =>
        member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAvailableMembers = availableMembers.filter(member =>
        member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        You don't have any organizations yet. Register your organization to start managing groups.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Organization & Group Selector */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                        Add Members to Group
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
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
                        
                        <div>
                            <Label htmlFor="group-select">Select Group</Label>
                            <Select value={selectedGroupId} onValueChange={setSelectedGroupId} disabled={!selectedOrgId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((group) => (
                                        <SelectItem key={group.id} value={group.id}>
                                            <div className="flex items-center gap-2">
                                                {getGroupTypeIcon(group.type)}
                                                {group.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Group Info */}
                    {selectedGroup && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {getGroupTypeIcon(selectedGroup.type)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{selectedGroup.name}</h3>
                                        <Badge 
                                            variant="secondary" 
                                            className={`${getGroupTypeColor(selectedGroup.type)} text-xs`}
                                        >
                                            {selectedGroup.type}
                                        </Badge>
                                        {selectedGroup.isPrivate && (
                                            <Badge variant="outline" className="text-xs">
                                                Private
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">{selectedGroup.description}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{groupMembers.length}</span>
                                        {selectedGroup.maxMembers && (
                                            <span>/ {selectedGroup.maxMembers}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedGroupId && (
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
                                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button 
                                            className="flex items-center gap-2"
                                            disabled={availableMembers.length === 0}
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            Add Members
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Add Members to Group</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label>Available Members ({filteredAvailableMembers.length})</Label>
                                                {filteredAvailableMembers.length > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={
                                                                filteredAvailableMembers.length > 0 && 
                                                                filteredAvailableMembers.every(member => 
                                                                    selectedMembers.includes(member.id)
                                                                )
                                                            }
                                                            onCheckedChange={handleSelectAll}
                                                        />
                                                        <Label className="text-sm">Select All</Label>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {filteredAvailableMembers.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-500">
                                                        {availableMembers.length === 0 
                                                            ? "All organization members are already in this group"
                                                            : "No members found matching your search"
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="max-h-96 overflow-y-auto">
                                                    <div className="space-y-2">
                                                        {filteredAvailableMembers.map((member) => (
                                                            <div
                                                                key={member.id}
                                                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                                                            >
                                                                <Checkbox
                                                                    checked={selectedMembers.includes(member.id)}
                                                                    onCheckedChange={(checked) => 
                                                                        handleMemberSelection(member.id, checked)
                                                                    }
                                                                />
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={member.avatar} />
                                                                    <AvatarFallback>
                                                                        {member.firstName?.[0]}{member.lastName?.[0]}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <p className="font-medium">
                                                                        {member.firstName} {member.lastName}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">{member.email}</p>
                                                                </div>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {member.role}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="flex justify-between items-center pt-4 border-t">
                                                <p className="text-sm text-gray-500">
                                                    {selectedMembers.length} member(s) selected
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setIsAddModalOpen(false);
                                                            setSelectedMembers([]);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button 
                                                        onClick={addMembersToGroup} 
                                                        disabled={isLoading || selectedMembers.length === 0}
                                                    >
                                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                        Add Selected Members
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Group Members */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Group Members ({filteredGroupMembers.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {filteredGroupMembers.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">
                                        {searchTerm ? "No members found matching your search" : "No members in this group yet"}
                                    </p>
                                    {!searchTerm && availableMembers.length > 0 && (
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={() => setIsAddModalOpen(true)}
                                        >
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Add First Member
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Member</TableHead>
                                                <TableHead>Role in Org</TableHead>
                                                <TableHead>Added to Group</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredGroupMembers.map((member) => (
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
                                                        <Badge variant="outline" className="text-xs">
                                                            {member.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4" />
                                                            {member.joinedGroupAt 
                                                                ? new Date(member.joinedGroupAt).toLocaleDateString()
                                                                : "Recently"
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeMemberFromGroup(member.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <UserMinus className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

export default AddMembersToGroup;
