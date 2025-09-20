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
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb.jsx";

function OrgProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Organization store to get selected organization and status
  const {
    fetchUserOrganizations,
    organizationsLoading,
    selectedOrganization,
    organizations,
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
    fetchUserOrganizations();
  }, [fetchUserOrganizations]);

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
        .toUpperCase() || "ORG"
    );
  };

  // Show loading if checking organization status
  if (organizationsLoading) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1"/>
          <Separator orientation="vertical" className="mr-2 h-4"/>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[30ch]">Organization Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto sm:flex-initial"></div>
        </header>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading organization profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no organization is selected
  if (!selectedOrganization) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1"/>
          <Separator orientation="vertical" className="mr-2 h-4"/>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[30ch]">Organization Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto sm:flex-initial"></div>
        </header>
        <div className="p-4 mx-auto">
          <Alert>
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              Please select an organization from the sidebar to view and edit its profile.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const currentUserRole = organizations.find(
    (org) => org.organization.orgId === selectedOrganization.orgId
  )?.userRole;

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1"/>
        <Separator orientation="vertical" className="mr-2 h-4"/>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[30ch]">Organization Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto sm:flex-initial"></div>
      </header>

      <div className="p-4 mx-auto">
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
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                      {selectedOrganization.orgStatus || "Active"}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 capitalize">
                      {selectedOrganization.orgType?.replace("_", " ")}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {currentUserRole}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white"
                >
                  {isEditMode ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Organization Profile */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {isEditMode ? "Edit Organization Information" : "Organization Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditMode ? (
              // View Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label>Organization Name</Label>
                  <Input value={selectedOrganization.orgName || ""} readOnly className="bg-gray-50"/>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Organization Type</Label>
                  <Input value={selectedOrganization.orgType?.replace("_", " ") || ""} readOnly className="bg-gray-50 capitalize"/>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Industry</Label>
                  <Input value={selectedOrganization.orgIndustry || "Not specified"} readOnly className="bg-gray-50"/>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Organization Size</Label>
                  <Input value={selectedOrganization.orgSize || "Not specified"} readOnly className="bg-gray-50"/>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Website</Label>
                  <Input value={selectedOrganization.orgWebsite || "Not specified"} readOnly className="bg-gray-50"/>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Contact Email</Label>
                  <Input value={selectedOrganization.orgEmail || "Not specified"} readOnly className="bg-gray-50"/>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Contact Phone</Label>
                  <Input value={selectedOrganization.orgContactNo || "Not specified"} readOnly className="bg-gray-50"/>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Status</Label>
                  <Input value={selectedOrganization.orgStatus || "Active"} readOnly className="bg-gray-50"/>
                </div>
                <div className="col-span-full grid w-full items-center gap-1.5">
                  <Label>Description</Label>
                  <Textarea value={selectedOrganization.orgDescription || "No description provided"} readOnly className="bg-gray-50" rows={3}/>
                </div>
                <div className="col-span-full grid w-full items-center gap-1.5">
                  <Label>Address</Label>
                  <Textarea value={selectedOrganization.orgAddress || "Not specified"} readOnly className="bg-gray-50" rows={2}/>
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

                <div className="flex gap-4 pt-6">
                  <Button onClick={() => form.reset()} variant="outline" className="border-gray-300">
                    Reset
                  </Button>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OrgProfile;
