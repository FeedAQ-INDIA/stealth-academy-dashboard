import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { 
    Building2, 
    Users, 
    UserPlus, 
    Settings,
    BarChart3,
    Activity,
    Eye,
    Edit,
    Trash2,
    Plus,
    Globe,
    MapPin,
    Mail,
    Phone
} from "lucide-react";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";

// Import other organization components
import RegisterAsOrg from "./RegisterAsOrg.jsx";
import AddMembersToOrg from "./AddMembersToOrg.jsx";
import OrgProfile from "./OrgProfile.jsx";

function OrganizationDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [orgStats, setOrgStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserOrganizations();
    }, []);

    useEffect(() => {
        if (selectedOrg) {
            fetchOrgStats(selectedOrg.orgId);
        }
    }, [selectedOrg]);

    const fetchUserOrganizations = async () => {
        try {
            setIsLoading(true);
            const response = await axiosConn.get("/user/organizations");
            const orgs = response.data.data || [];
            setOrganizations(orgs);
            
            if (orgs.length > 0) {
                setSelectedOrg(orgs[0].organization);
            }
        } catch (error) {
            console.error("Error fetching organizations:", error);
            toast({
                title: "Error",
                description: "Failed to fetch organizations",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrgStats = async (orgId) => {
        try {
            const response = await axiosConn.get(`/organization/${orgId}/stats`);
            setOrgStats(response.data.data || {});
        } catch (error) {
            console.error("Error fetching organization stats:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const OrganizationOverview = () => (
        <div className="space-y-6">
            {/* Organization Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Organization Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {organizations.length === 0 ? (
                        <div className="text-center py-8">
                            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Organizations Found</h3>
                            <p className="text-gray-600 mb-4">You are not a member of any organization yet.</p>
                            <Button onClick={() => setActiveTab("register")}>
                                <Plus className="h-4 w-4 mr-2" />
                                Register Organization
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Organization Selector */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {organizations.map((orgUser) => (
                                    <Card 
                                        key={orgUser.organization.orgId}
                                        className={`cursor-pointer transition-all ${
                                            selectedOrg?.orgId === orgUser.organization.orgId 
                                                ? 'ring-2 ring-blue-500 bg-blue-50' 
                                                : 'hover:shadow-md'
                                        }`}
                                        onClick={() => setSelectedOrg(orgUser.organization)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-lg mb-1">
                                                        {orgUser.organization.orgName}
                                                    </h4>
                                                    <Badge className={`mb-2 ${getStatusColor(orgUser.organization.orgStatus)}`}>
                                                        {orgUser.organization.orgStatus || 'Active'}
                                                    </Badge>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {orgUser.organization.orgDescription || 'No description available'}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary">{orgUser.userRole}</Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {orgUser.organization.orgType}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Selected Organization Details */}
                            {selectedOrg && (
                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{selectedOrg.orgName} Details</span>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setActiveTab("profile")}
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm">{selectedOrg.orgEmail}</span>
                                                </div>
                                                {selectedOrg.orgContactNo && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-gray-500" />
                                                        <span className="text-sm">{selectedOrg.orgContactNo}</span>
                                                    </div>
                                                )}
                                                {selectedOrg.orgWebsite && (
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-gray-500" />
                                                        <a 
                                                            href={selectedOrg.orgWebsite} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            {selectedOrg.orgWebsite}
                                                        </a>
                                                    </div>
                                                )}
                                                {selectedOrg.orgAddress && (
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <span className="text-sm">{selectedOrg.orgAddress}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Statistics */}
                                            <div className="space-y-3">
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <BarChart3 className="h-4 w-4" />
                                                    Statistics
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-blue-50 p-3 rounded-lg">
                                                        <div className="text-2xl font-bold text-blue-600">
                                                            {orgStats.totalUsers || 0}
                                                        </div>
                                                        <div className="text-sm text-blue-800">Total Users</div>
                                                    </div>
                                                    <div className="bg-green-50 p-3 rounded-lg">
                                                        <div className="text-2xl font-bold text-green-600">
                                                            {orgStats.totalMembers || 0}
                                                        </div>
                                                        <div className="text-sm text-green-800">Active Members</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            {organizations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setActiveTab("members")}
                                className="h-auto p-4 flex flex-col items-center gap-2"
                            >
                                <UserPlus className="h-6 w-6" />
                                <span>Manage Members</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setActiveTab("profile")}
                                className="h-auto p-4 flex flex-col items-center gap-2"
                            >
                                <Settings className="h-6 w-6" />
                                <span>Organization Settings</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading organizations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="register">Register Org</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <OrganizationOverview />
                </TabsContent>

                <TabsContent value="register">
                    <RegisterAsOrg />
                </TabsContent>

                <TabsContent value="profile">
                    <OrgProfile />
                </TabsContent>

                <TabsContent value="members">
                    <AddMembersToOrg />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default OrganizationDashboard;
