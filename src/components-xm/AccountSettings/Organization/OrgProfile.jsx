import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
    Building2, 
    Edit,
    Save,
    X,
    Loader2,
    Globe,
    MapPin,
    Users,
    Calendar,
    Mail,
    Phone,
    Settings,
    Shield,
    CheckCircle
} from "lucide-react";
import { toast } from "@/components/hooks/use-toast.js";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import axiosConn from "@/axioscon.js";
import { useOrganizationStore } from "@/zustland/store.js";
import { useNavigate } from "react-router-dom";

function OrgProfile() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrgId, setSelectedOrgId] = useState("");
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();
    
    // Organization store to check registration status
    const { 
        canCreateOrganization,
        fetchOrganizationStatus,
        loading: orgStatusLoading
    } = useOrganizationStore();

    // Form validation schema
    const profileSchema = z.object({
        name: z.string().min(3, "Organization name must be at least 3 characters long"),
        description: z.string().min(10, "Description must be at least 10 characters long"),
        type: z.enum(["company", "educational", "non_profit", "government", "startup"], {
            required_error: "Please select an organization type",
        }),
        industry: z.string().min(2, "Industry is required"),
        size: z.string().min(1, "Organization size is required"),
        website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
        address: z.string().min(5, "Address must be at least 5 characters long"),
        contactEmail: z.string().email("Please enter a valid email address"),
        contactPhone: z.string().min(10, "Please enter a valid phone number").optional(),
    });

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            description: "",
            type: "",
            industry: "",
            size: "",
            website: "",
            address: "",
            contactEmail: "",
            contactPhone: "",
        },
    });

    // Check organization status on component mount
    useEffect(() => {
        fetchOrganizationStatus();
    }, [fetchOrganizationStatus]);

    // Fetch user's organizations
    useEffect(() => {
        if (!canCreateOrganization) {
            fetchOrganizations();
        }
    }, [canCreateOrganization]);

    // Load selected organization data into form
    useEffect(() => {
        if (selectedOrg) {
            form.reset({
                name: selectedOrg.orgName || "",
                description: selectedOrg.orgDescription || "",
                type: selectedOrg.orgType || "",
                industry: selectedOrg.industry || "",
                size: selectedOrg.size || "",
                website: selectedOrg.website || "",
                address: selectedOrg.address || "",
                contactEmail: selectedOrg.contactEmail || "",
                contactPhone: selectedOrg.contactPhone || "",
            });
        }
    }, [selectedOrg, form]);

    // Redirect if user hasn't registered an organization yet
    useEffect(() => {
        if (!orgStatusLoading && canCreateOrganization) {
            toast({
                title: "No Organization Found",
                description: "You need to register an organization first. Redirecting to registration page...",
                variant: "default",
            });
            setTimeout(() => {
                navigate("/account-settings/organization");
            }, 2000);
        }
    }, [canCreateOrganization, orgStatusLoading, navigate]);

    const fetchOrganizations = async () => {
        try {
            setIsFetching(true);
            const response = await axiosConn.get("/user/organizations");
            setOrganizations(response.data.data || []);
            
            // Auto-select first organization if available
            if (response.data.data && response.data.data.length > 0) {
                const firstOrgData = response.data.data[0];
                const firstOrg = firstOrgData.organization;
                setSelectedOrgId(firstOrg.orgId);
                setSelectedOrg(firstOrg);
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

    const handleOrgChange = (orgId) => {
        setSelectedOrgId(orgId);
        const orgData = organizations.find(o => o.organization?.orgId === orgId);
        setSelectedOrg(orgData?.organization);
        setIsEditMode(false);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Map form fields to API expected fields
            const apiData = {
                orgName: data.name,
                orgDescription: data.description,
                orgType: data.type,
                industry: data.industry,
                size: data.size,
                website: data.website,
                address: data.address,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone,
            };
            
            const response = await axiosConn.put(`/organization/${selectedOrgId}`, apiData);
            
            toast({
                title: "Success!",
                description: "Organization profile updated successfully!",
                variant: "default",
            });
            
            // Update local state
            setSelectedOrg({ ...selectedOrg, ...apiData });
            setIsEditMode(false);
            
            // Refresh organizations list
            await fetchOrganizations();
        } catch (error) {
            console.error("Error updating organization:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update organization. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase() || '?';
    };

    // Show loading if checking organization status
    if (orgStatusLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Checking organization status...</p>
                </div>
            </div>
        );
    }

    // Don't render the form if user doesn't have an organization
    if (canCreateOrganization) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No organization found. Redirecting to registration...</p>
                </div>
            </div>
        );
    }

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
                        You don't have any organizations yet. Register your organization to get started.
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
                        <Building2 className="h-6 w-6 text-blue-600" />
                        Select Organization
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedOrgId} onValueChange={handleOrgChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an organization to view profile" />
                        </SelectTrigger>
                        <SelectContent>
                            {organizations.map((orgData) => (
                                <SelectItem key={orgData.organization.orgId} value={orgData.organization.orgId}>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(orgData.organization.orgName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{orgData.organization.orgName}</span>
                                        <Badge variant="outline" className="ml-2">
                                            {orgData.organization.orgType}
                                        </Badge>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Organization Profile */}
            {selectedOrg && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                        {getInitials(selectedOrg.orgName)}
                                    </AvatarFallback>
                                </Avatar>
                                {selectedOrg.orgName}
                            </CardTitle>
                            {!isEditMode ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditMode(true)}
                                    className="flex items-center gap-1"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setIsEditMode(false);
                                            form.reset();
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent>
                        {!isEditMode ? (
                            // View Mode
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Organization Type</Label>
                                            <div className="mt-1">
                                                <Badge variant="secondary" className="capitalize">
                                                    {selectedOrg.orgType?.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Industry</Label>
                                            <p className="mt-1 text-sm">{selectedOrg.industry || 'Not specified'}</p>
                                        </div>
                                        
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                Organization Size
                                            </Label>
                                            <p className="mt-1 text-sm">{selectedOrg.size || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {selectedOrg.website && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                                    <Globe className="h-4 w-4" />
                                                    Website
                                                </Label>
                                                <a 
                                                    href={selectedOrg.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="mt-1 text-sm text-blue-600 hover:underline"
                                                >
                                                    {selectedOrg.website}
                                                </a>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                Contact Email
                                            </Label>
                                            <p className="mt-1 text-sm">{selectedOrg.contactEmail || 'Not specified'}</p>
                                        </div>
                                        
                                        {selectedOrg.contactPhone && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                                    <Phone className="h-4 w-4" />
                                                    Contact Phone
                                                </Label>
                                                <p className="mt-1 text-sm">{selectedOrg.contactPhone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                    <p className="mt-1 text-sm text-gray-700 leading-relaxed">{selectedOrg.orgDescription}</p>
                                </div>

                                {/* Address */}
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        Address
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-700">{selectedOrg.address || 'Not specified'}</p>
                                </div>

                                {/* Metadata */}
                                <div className="pt-4 border-t">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                Organization ID
                                            </Label>
                                            <p className="mt-1 text-sm">{selectedOrg.orgId}</p>
                                        </div>
                                        
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                            <div className="mt-1">
                                                <Badge 
                                                    variant={selectedOrg.orgStatus === 'ACTIVE' ? 'success' : 'secondary'} 
                                                    className="flex items-center gap-1 w-fit"
                                                >
                                                    <CheckCircle className="h-3 w-3" />
                                                    {selectedOrg.orgStatus || 'Active'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Organization Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Organization Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="company">Company</SelectItem>
                                                            <SelectItem value="educational">Educational Institution</SelectItem>
                                                            <SelectItem value="non_profit">Non-Profit</SelectItem>
                                                            <SelectItem value="government">Government</SelectItem>
                                                            <SelectItem value="startup">Startup</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea rows={3} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="industry"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Industry</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="size"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Organization Size</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1-10">1-10 employees</SelectItem>
                                                            <SelectItem value="11-50">11-50 employees</SelectItem>
                                                            <SelectItem value="51-200">51-200 employees</SelectItem>
                                                            <SelectItem value="201-500">201-500 employees</SelectItem>
                                                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                                            <SelectItem value="1000+">1000+ employees</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Website</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="contactEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contact Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="contactPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Phone</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Textarea rows={2} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default OrgProfile;
