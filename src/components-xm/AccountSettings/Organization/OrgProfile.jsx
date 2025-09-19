import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
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
  CheckCircle,
} from "lucide-react";
import { toast } from "@/components/hooks/use-toast.js";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import axiosConn from "@/axioscon.js";
import { useOrganizationStore } from "@/zustland/store.js";
import { useNavigate } from "react-router-dom";

function OrgProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  // Organization store to get selected organization and status
  const {
    canCreateOrganization,
    fetchOrganizationStatus,
    loading: orgStatusLoading,
    selectedOrganization,
    organizations,
    organizationsLoading,
    hasOrganization,
    setSelectedOrganization,
  } = useOrganizationStore();

  // Form validation schema
  const profileSchema = z.object({
    name: z
      .string()
      .min(3, "Organization name must be at least 3 characters long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    type: z.enum(
      ["company", "educational", "non_profit", "government", "startup"],
      {
        required_error: "Please select an organization type",
      }
    ),
    industry: z.string().min(2, "Industry is required"),
    size: z.string().min(1, "Organization size is required"),
    website: z
      .string()
      .url("Please enter a valid website URL")
      .optional()
      .or(z.literal("")),
    address: z.string().min(5, "Address must be at least 5 characters long"),
    contactEmail: z.string().email("Please enter a valid email address"),
    contactPhone: z
      .string()
      .min(10, "Please enter a valid phone number")
      .optional(),
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

  // Load selected organization data into form
  useEffect(() => {
    if (selectedOrganization) {
      form.reset({
        name: selectedOrganization.orgName || "",
        description: selectedOrganization.orgDescription || "",
        type: selectedOrganization.orgType || "",
        industry: selectedOrganization.orgIndustry || "",
        size: selectedOrganization.orgSize || "",
        website: selectedOrganization.orgWebsite || "",
        address: selectedOrganization.orgAddress || "",
        contactEmail: selectedOrganization.orgEmail || "",
        contactPhone: selectedOrganization.orgContactNo || "",
      });
    }
  }, [selectedOrganization, form]);

  // Redirect if user hasn't registered an organization yet
  useEffect(() => {
    if (!orgStatusLoading && canCreateOrganization) {
      toast({
        title: "No Organization Found",
        description:
          "You need to register an organization first. Redirecting to registration page...",
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
        setSelectedOrganization(firstOrg);
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
    const orgData = organizations.find((o) => o.organization?.orgId === orgId);
    setSelectedOrganization(orgData?.organization);
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
        orgIndustry: data.industry,
        orgSize: data.size,
        orgWebsite: data.website,
        orgAddress: data.address,
        orgEmail: data.contactEmail,
        orgContactNo: data.contactPhone,
      };

      const response = await axiosConn.put(
        `/organization/${selectedOrganization.orgId}`,
        apiData
      );

      toast({
        title: "Success!",
        description: "Organization profile updated successfully!",
        variant: "default",
      });

      // Update the selected organization in store
      setSelectedOrganization({ ...selectedOrganization, ...apiData });
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating organization:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to update organization. Please try again.",
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
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "?"
    );
  };

  // Show loading if checking organization status
  if (orgStatusLoading || organizationsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading organization profile...</p>
        </div>
      </div>
    );
  }

  // Don't render the form if user doesn't have an organization
  if (canCreateOrganization || !hasOrganization) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No organization found. Redirecting to registration...
          </p>
        </div>
      </div>
    );
  }

  if (!selectedOrganization) {
    return (
      <div className="space-y-6">
        <Alert>
          <Building2 className="h-4 w-4" />
          <AlertDescription>
            Please select an organization from the sidebar to view and edit its
            profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentUserRole = organizations.find(
    (org) => org.organization.orgId === selectedOrganization.orgId
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
            <Button
              variant="outline"
              onClick={() => navigate("/account-settings/organization/profile")}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organization Profile */}
      <Card>
 
        <CardHeader>
          {!isEditMode ? (
            // View Mode
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Organization Type
                    </Label>
                    <div className="mt-1">
                      <Badge variant="secondary" className="capitalize">
                        {selectedOrganization.orgType?.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Industry
                    </Label>
                    <p className="mt-1 text-sm">
                      {selectedOrganization.industry || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Organization Size
                    </Label>
                    <p className="mt-1 text-sm">
                      {selectedOrganization.size || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedOrganization.website && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Website
                      </Label>
                      <a
                        href={selectedOrganization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-sm text-blue-600 hover:underline"
                      >
                        {selectedOrganization.website}
                      </a>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Contact Email
                    </Label>
                    <p className="mt-1 text-sm">
                      {selectedOrganization.contactEmail || "Not specified"}
                    </p>
                  </div>

                  {selectedOrganization.contactPhone && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        Contact Phone
                      </Label>
                      <p className="mt-1 text-sm">
                        {selectedOrganization.contactPhone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                  {selectedOrganization.orgDescription}
                </p>
              </div>

              {/* Address */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <p className="mt-1 text-sm text-gray-700">
                  {selectedOrganization.address || "Not specified"}
                </p>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Organization ID
                    </Label>
                    <p className="mt-1 text-sm">{selectedOrganization.orgId}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Status
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          selectedOrganization.orgStatus === "ACTIVE"
                            ? "success"
                            : "secondary"
                        }
                        className="flex items-center gap-1 w-fit"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {selectedOrganization.orgStatus || "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="educational">
                              Educational Institution
                            </SelectItem>
                            <SelectItem value="non_profit">
                              Non-Profit
                            </SelectItem>
                            <SelectItem value="government">
                              Government
                            </SelectItem>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">
                              11-50 employees
                            </SelectItem>
                            <SelectItem value="51-200">
                              51-200 employees
                            </SelectItem>
                            <SelectItem value="201-500">
                              201-500 employees
                            </SelectItem>
                            <SelectItem value="501-1000">
                              501-1000 employees
                            </SelectItem>
                            <SelectItem value="1000+">
                              1000+ employees
                            </SelectItem>
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
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}

export default OrgProfile;
