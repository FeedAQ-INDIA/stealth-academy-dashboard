import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect} from "react";
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
import {toast} from "@/components/hooks/use-toast.js";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {BookOpen, CircleArrowLeft, CircleArrowRight, User, Settings, Shield, CreditCard, Bell, UserCircle, LogOut, ShoppingBag} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router-dom";


function MyAccount() {
    const {userDetail, fetchUserDetail} = useAuthStore()
    const location = useLocation();
    const navigate = useNavigate();

    // Navigation items for account settings tabs
    const navigationItems = [
        { 
            id: "profile", 
            label: "Profile", 
            icon: UserCircle, 
            path: "/account-settings/profile",
            description: "Manage your personal information"
        },
        { 
            id: "security", 
            label: "Security", 
            icon: Shield, 
            path: "/account-settings/security",
            description: "Password and security settings"
        },
        { 
            id: "billing", 
            label: "Billing", 
            icon: CreditCard, 
            path: "/account-settings/billing",
            description: "Payment methods and billing history"
        },
        { 
            id: "orders", 
            label: "Orders", 
            icon: ShoppingBag, 
            path: "/account-settings/orders",
            description: "View and manage your order history"
        },
        { 
            id: "notifications", 
            label: "Notifications", 
            icon: Bell, 
            path: "/account-settings/notifications",
            description: "Configure your notification preferences"
        },
    ];

    const createAccountSchema = z.object({
        firstName: z.string()
            .min(1, "Name must be at least one character long."),
        lastName: z.string().optional(),
        number: z
            .string()
            .length(10, "Phone number must be 10 digits.")
     });
    const createAccountForm = useForm({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {firstName: "", lastName: "", number: ''},
    });

    useEffect(() => {
        if (userDetail) {
            createAccountForm.reset({
                firstName: userDetail.firstName,
                lastName: userDetail.lastName,
                number: userDetail.number || '',
            });
        }
    }, [userDetail]);

    function onSubmit(data) {
        axiosConn.post(import.meta.env.VITE_API_URL + '/saveUserDetail', {
            firstName: data.firstName,
            lastName: data.lastName,
            number: data.number,
        }).then(res => {
            toast({
                title: "User updated successfully!",
            });
            fetchUserDetail()
        }).catch(err => {
            toast({
                title: "User updation failed!",
            });
        });
    }

    return (
        <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
                <Card className="mb-6 border-0 shadow-lg  bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-700  ">
                    <CardHeader className="p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                                <div className="relative flex-shrink-0">
                                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 shadow-xl">
                                        <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
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
                    <CardContent>
                         <div className="">
                            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => navigate(item.path)}
                                            className={`flex items-center gap-2 px-2 py-1 rounded-lg font-medium transition-all duration-200 ${
                                                isActive || (item.path === '/account-settings/profile' && location.pathname === '/account-settings')
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                            }`}
                                        >
                                            <Icon size={18} />
                                            <span className="hidden sm:inline">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </CardContent>
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
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="First Name" {...field} />
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
                                                        <Input placeholder="Last Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input type="email" id="email" value={userDetail.email} readOnly className="bg-gray-50"/>
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
                                        <Input type="text" id="language" value="English" readOnly className="bg-gray-50"/>
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="country">Country</Label>
                                        <Input type="text" id="country" value="India" readOnly className="bg-gray-50"/>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <Button onClick={() => createAccountForm.reset()} variant="outline" className="border-gray-300">
                                        Reset
                                    </Button>
                                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

}


export default MyAccount;