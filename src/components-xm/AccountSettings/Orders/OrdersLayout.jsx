import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {ShoppingBag, CheckCircle, Clock, XCircle} from "lucide-react";
import { useOrderStore } from "@/zustland/store.js";

function OrdersLayout() {
    const location = useLocation();
    
    // Get orders data from Zustand store
    const { 
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
    } = useOrderStore();

    // Content tabs for orders section
    const orderTabs = [
        { 
            id: "all", 
            label: "All Orders", 
            icon: ShoppingBag, 
            description: "View all your orders",
            path: "/account-settings/orders"
        },
        { 
            id: "completed", 
            label: "Completed", 
            icon: CheckCircle, 
            description: "Successfully completed orders",
            path: "/account-settings/orders/completed"
        },
        { 
            id: "pending", 
            label: "Pending", 
            icon: Clock, 
            description: "Orders awaiting processing",
            path: "/account-settings/orders/pending"
        },
        { 
            id: "cancelled", 
            label: "Cancelled", 
            icon: XCircle, 
            description: "Cancelled orders",
            path: "/account-settings/orders/cancelled"
        },
    ];

    return (
        <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">My Orders</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <div className="p-4 mx-auto max-w-7xl">
                {/* Header Section */}
                <Card className="w-full rounded-xl border-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-700 text-white shadow-2xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
                            <ShoppingBag className="w-8 h-8" />
                            My Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-white/90 text-lg mb-6">
                            Track your orders, view purchase history, and manage your transactions
                        </p>
                        <div className="flex items-center justify-center gap-8 text-center mb-6">
                            <div>
                                <p className="text-3xl font-bold">{totalOrders}</p>
                                <p className="text-white/80">Total Orders</p>
                            </div>
                            <Separator orientation="vertical" className="h-12 bg-white/30" />
                            <div>
                                <p className="text-3xl font-bold text-green-300">{completedOrders}</p>
                                <p className="text-white/80">Completed</p>
                            </div>
                            <Separator orientation="vertical" className="h-12 bg-white/30" />
                            <div>
                                <p className="text-3xl font-bold text-yellow-300">{pendingOrders}</p>
                                <p className="text-white/80">Pending</p>
                            </div>
                        </div>
                        
                        {/* Navigation Tabs */}
                        <div className="">
                            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border">
                                {orderTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = location.pathname === tab.path;
                                    
                                    return (
                                        <Link
                                            key={tab.id}
                                            to={tab.path}
                                            className={`flex items-center gap-2 px-2 py-1 rounded-lg font-medium transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                            }`}
                                        >
                                            <Icon size={18} />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tab Content */}
                <div className="w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default OrdersLayout;
