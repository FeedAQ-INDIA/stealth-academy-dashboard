import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
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
  Loader2,
  Globe,
  MapPin,
  Users,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import { toast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

function RegisterAsOrg() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Form validation schema
  const registrationSchema = z.object({
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
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required").default("India"),
    pincode: z.string().min(4, "Valid pincode is required"),
    contactEmail: z.string().email("Please enter a valid email address"),
    contactPhone: z
      .string()
      .min(10, "Please enter a valid phone number")
      .optional(),
    adminName: z
      .string()
      .min(2, "Admin name must be at least 2 characters long"),
    adminEmail: z.string().email("Please enter a valid admin email address"),
  });

  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      industry: "",
      size: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      contactEmail: "",
      contactPhone: "",
      adminName: "",
      adminEmail: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Transform data to match backend expected format
      const payload = {
        orgName: data.name,
        orgEmail: data.contactEmail,
        orgContactNo: data.contactPhone,
        orgAddress: data.address,
        orgCity: data.city,
        orgState: data.state,
        orgCountry: data.country,
        orgPincode: data.pincode,
        orgType: data.type,
        orgIndustry: data.industry,
        orgSize: data.size,
        orgWebsite: data.website,
        orgDescription: data.description,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
      };

      // API call to register organization
      const response = await axiosConn.post("/registerOrg", payload);

      toast({
        title: "Success!",
        description: "Organization registered successfully!",
        variant: "default",
      });

      // Navigate to org profile page
      setTimeout(() => {
        navigate("/account-settings/organization/profile");
      }, 2000);

      form.reset();
    } catch (error) {
      console.error("Error registering organization:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to register organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" ">
              <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b  px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="truncate max-w-[30ch]">
                         Register Organization
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
              </header>
        
           <div className="p-4 mx-auto  "> 
      <Card className="w-full rounded-lg border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
            <Building className="w-8 h-8" />
            Register Your Organization
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter organization name"
                            {...field}
                          />
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
                        <FormLabel>Organization Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization type" />
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
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your organization's mission and goals"
                          rows={3}
                          {...field}
                        />
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
                        <FormLabel>Industry *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Technology, Healthcare"
                            {...field}
                          />
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
                        <FormLabel>Organization Size *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
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
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          Website
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Contact Phone
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="contact@organization.com"
                          {...field}
                        />
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
                      <FormLabel className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Address *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter organization address"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode *</FormLabel>
                        <FormControl>
                          <Input placeholder="123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Admin Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Administrator Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="adminName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter admin name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adminEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="admin@organization.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isLoading}
                >
                  Reset Form
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register Organization
                </Button>
              </div>
            </form>
          </Form>
        </CardHeader>
      </Card>

      </div>
    </div>
  );
}

export default RegisterAsOrg;
