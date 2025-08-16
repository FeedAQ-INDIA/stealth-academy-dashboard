import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {ShoppingBag, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight} from "lucide-react";
import { useOrderStore } from "@/zustland/store.js";

function OrdersLayout() {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    
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
                                {orderTabs.map((tab, index) => {
                                    const Icon = tab.icon;
                                    const isActive = location.pathname === tab.path;
                                    const isHovered = hoveredItem === tab.id;
                                    
                                    return (
                                        <Link
                                            key={tab.id}
                                            to={tab.path}
                                            onMouseEnter={() => setHoveredItem(tab.id)}
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
                                            aria-label={`Navigate to ${tab.label}`}
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
                                              <span className="hidden xs:inline">{tab.label}</span>
                                              <span className="xs:hidden">
                                                {tab.label.split(' ')[0]}
                                              </span>
                                            </span>
                                          </div>
                                          
                                          {/* Animated border for active state */}
                                          {isActive && (
                                            <div className="absolute inset-0 rounded-lg border border-yellow-300 animate-pulse-subtle"></div>
                                          )}
                                        </Link>
                                    );
                                })}
                              </div>
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
