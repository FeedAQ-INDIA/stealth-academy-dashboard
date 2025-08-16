import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState, useRef, useMemo} from "react";
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
import {BookOpen, CircleArrowLeft, CircleArrowRight, User, Settings, Shield, CreditCard, Bell, UserCircle, LogOut, ShoppingBag, ChevronLeft, ChevronRight} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router-dom";


function MyAccount() {
    const {userDetail, fetchUserDetail} = useAuthStore()
    const location = useLocation();
    const navigate = useNavigate();
    const [hoveredItem, setHoveredItem] = useState(null);
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Navigation items for account settings tabs
    const navigationItems = useMemo(() => [
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
    ], []);

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

    // Check scroll position and update arrow visibility
    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    // Scroll functions
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    // Check scroll position on mount and resize
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScrollPosition();
            container.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('resize', checkScrollPosition);
            
            return () => {
                container.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
            };
        }
    }, []);

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
                         <div className="relative">
                            {/* Left Arrow */}
                            {showLeftArrow && (
                              <button
                                onClick={scrollLeft}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-purple-700 rounded-full p-1 shadow-lg transition-all duration-300 sm:hidden"
                                aria-label="Scroll left"
                              >
                                <ChevronLeft size={16} />
                              </button>
                            )}
                            
                            {/* Right Arrow */}
                            {showRightArrow && (
                              <button
                                onClick={scrollRight}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-purple-700 rounded-full p-1 shadow-lg transition-all duration-300 sm:hidden"
                                aria-label="Scroll right"
                              >
                                <ChevronRight size={16} />
                              </button>
                            )}
                            
                            <div 
                              ref={scrollContainerRef}
                              className="overflow-x-auto scrollbar-hide"
                              onScroll={checkScrollPosition}
                            >
                              <div className="flex gap-1.5 p-1 min-w-max sm:flex-wrap sm:justify-center sm:min-w-0 sm:gap-2">
                                {navigationItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path || (item.path === '/account-settings/profile' && location.pathname === '/account-settings');
                                    const isHovered = hoveredItem === item.id;
                                    
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => navigate(item.path)}
                                            onMouseEnter={() => setHoveredItem(item.id)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            className={`group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 flex-shrink-0 
                                              px-2 py-1.5 sm:px-3 sm:py-2 ${
                                              isActive
                                                ? 'bg-orange-600 text-white shadow-lg ring-1 ring-orange/50'
                                                : 'bg-white/10 hover:bg-white/20 text-orange-800 backdrop-blur-sm border border-orange/20 hover:border-orange/40'
                                            }`}
                                            style={{
                                              animationDelay: `${index * 50}ms`
                                            }}
                                            aria-label={`Navigate to ${item.label}`}
                                        >
                                          {/* Animated background for active state */}
                                          {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-lg"></div>
                                          )}
                                          
                                          {/* Hover effect background */}
                                          <div className={`absolute inset-0 bg-gradient-to-br from-orange/20 to-yellow/10 rounded-lg transition-opacity duration-300 ${isHovered && !isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                                          
                                          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                                            <div className={`p-1 sm:p-1.5 rounded transition-all duration-300 ${
                                              isActive 
                                                ? 'bg-yellow-100 text-orange-700' 
                                                : isHovered 
                                                  ? 'bg-orange/20 text-orange-800 scale-110' 
                                                  : 'bg-orange/10 text-orange-800'
                                            }`}>
                                              <Icon size={14} className="sm:w-4 sm:h-4" />
                                            </div>
                                            
                                            <span className={`font-medium whitespace-nowrap transition-colors duration-300 
                                              text-[10px] sm:text-xs ${
                                              isActive ? 'text-white' : 'text-orange-800'
                                            }`}>
                                              <span className="hidden xs:inline">{item.label}</span>
                                              <span className="xs:hidden">
                                                {item.label.split(' ')[0]}
                                              </span>
                                            </span>
                                          </div>
                                          
                                          {/* Animated border for active state */}
                                          {isActive && (
                                            <div className="absolute inset-0 rounded-lg border border-yellow-300 animate-pulse-subtle"></div>
                                          )}
                                        </button>
                                    );
                                })}
                              </div>
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