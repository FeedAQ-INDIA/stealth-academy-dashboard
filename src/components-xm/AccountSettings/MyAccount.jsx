import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useAuthStore} from "@/zustland/store.js";
import axiosConn from "@/axioscon.js";
import {useToast} from "@/hooks/use-toast.js";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {User, Settings, RotateCcw, AlertCircle} from "lucide-react";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {Alert, AlertDescription} from "@/components/ui/alert.jsx";
import { ContentLoader, InlineLoader } from "@/components/ui/loading-components";
 
// Enhanced schema for account settings with better validation
const createAccountSchema = z.object({
    firstName: z.string()
        .min(1, "First name is required")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "First name should only contain letters and spaces"),
    lastName: z.string()
        .max(50, "Last name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]*$/, "Last name should only contain letters and spaces")
        .optional(),
    number: z.string()
        .regex(/^\d{10,15}$/, "Phone number must be 10-15 digits")
        .optional()
        .or(z.literal("")),
});


function MyAccount() {
    const {userDetail, fetchUserDetail, loading: authLoading} = useAuthStore();
    const { toast } = useToast();
    
    // Local state management
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const createAccountForm = useForm({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {firstName: "", lastName: "", number: ''},
    });

    // Watch form values to detect changes
    const watchedValues = createAccountForm.watch();
    
    // Check if form has changes compared to original user data
    useEffect(() => {
        if (userDetail) {
            const hasFormChanges = 
                watchedValues.firstName !== userDetail.firstName ||
                watchedValues.lastName !== (userDetail.lastName || '') ||
                watchedValues.number !== (userDetail.number || '');
            setHasChanges(hasFormChanges);
        }
    }, [watchedValues, userDetail]);

    // Initialize form with user data
    useEffect(() => {
        if (userDetail) {
            createAccountForm.reset({
                firstName: userDetail.firstName || '',
                lastName: userDetail.lastName || '',
                number: userDetail.number || '',
            });
            setError(null);
        }
    }, [userDetail, createAccountForm]);

    // Submit handler with improved error handling
    const onSubmit = async (data) => {
        if (!hasChanges) {
            toast({
                title: "No changes detected",
                description: "Make some changes before saving.",
            });
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axiosConn.post(import.meta.env.VITE_API_URL + '/saveUserDetail', {
                firstName: data.firstName,
                lastName: data.lastName,
                number: data.number,
            });

            // Success handling
            toast({
                title: "Profile updated successfully!",
                description: "Your account information has been saved.",
            });
            
            // Refresh user data
            await fetchUserDetail();
            setHasChanges(false);
            
        } catch (error) {
            console.error("Error updating user details:", error);
            const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
            
            setError(errorMessage);
            toast({
                title: "Update failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form to original values
    const handleReset = () => {
        if (userDetail) {
            createAccountForm.reset({
                firstName: userDetail.firstName || '',
                lastName: userDetail.lastName || '',
                number: userDetail.number || '',
            });
            setHasChanges(false);
            setError(null);
        }
    };

    // Loading state
    if (authLoading || !userDetail) {
        return (
            <div className="h-full ">
                <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="truncate max-w-[30ch]">Account Settings</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <ContentLoader message="Loading your profile..." size="lg" className="min-h-[400px]" />
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-br ">
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">Account Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <div className="p-4 mx-auto">
       

                {/* Profile Information Card */}
                <Card className="mb-6 border-0 shadow-lg   bg-gradient-to-r from-rose-600 via-rose-700 to-rose-900  rounded-2xl   ">
                    <CardHeader className="p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                                <div className="relative flex-shrink-0">
                                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-rose-200 shadow-xl">
                                        <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-r from-rose-300 to-rose-800 text-white font-bold">
                                            {userDetail?.nameInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0 ">
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight text-white">
                                        WELCOME, {userDetail?.derivedUserName}
                                    </h1>
                                    <p className="text-white text-base sm:text-lg flex items-center gap-2 flex-wrap">
                                        <User className="w-4 h-4 flex-shrink-0" />
                                        <span className="break-words">Member since {userDetail?.created_date}</span>
                                    </p>
                                 </div>
                            </div>
                             
                        </div>
                    </CardHeader>
              
 
                </Card>

                {/* Form Section */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Form {...createAccountForm}>
                            <form
                                onSubmit={createAccountForm.handleSubmit(onSubmit)}
                                className="w-full space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid w-full items-center gap-1.5">
                                        <FormField
                                            control={createAccountForm.control}
                                            name="firstName"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="First Name" 
                                                            {...field} 
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <FormField
                                            control={createAccountForm.control}
                                            name="lastName"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Last Name" 
                                                            {...field} 
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input 
                                            type="email" 
                                            id="email" 
                                            value={userDetail.email} 
                                            readOnly 
                                            className="bg-gray-50"
                                        />
                                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <FormField
                                            control={createAccountForm.control}
                                            name="number"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Phone Number"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            disabled={isSubmitting}
                                                            onChange={(e) => {
                                                                const cleaned = e.target.value.replace(/\D/g, "");
                                                                field.onChange(cleaned);
                                                            }}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="language">Language</Label>
                                        <Input 
                                            type="text" 
                                            id="language" 
                                            value="English" 
                                            readOnly 
                                            className="bg-gray-50"
                                        />
                                        <p className="text-xs text-gray-500">Language preference cannot be changed</p>
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="country">Country</Label>
                                        <Input 
                                            type="text" 
                                            id="country" 
                                            value="India" 
                                            readOnly 
                                            className="bg-gray-50"
                                        />
                                        <p className="text-xs text-gray-500">Country cannot be changed</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 pt-6">
                                    <Button 
                                        type="button"
                                        onClick={handleReset} 
                                        variant="outline" 
                                        className="border-gray-300"
                                        disabled={isSubmitting || !hasChanges}
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reset
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        disabled={isSubmitting || !hasChanges}
                                    >
                                        {isSubmitting ? (
                                            <InlineLoader message="Saving..." size="sm" />
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </div>
                                
                                {hasChanges && (
                                    <p className="text-sm text-amber-600 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        You have unsaved changes
                                    </p>
                                )}
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

}


export default MyAccount;