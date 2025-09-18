import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Building, Users, UserPlus, Settings, ChevronLeft, ChevronRight} from "lucide-react";

function OrganizationLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Navigation items for organization section
    const navigationItems = [
        { 
            id: "register", 
            label: "Register as Org", 
            icon: Building, 
            description: "Register your organization",
            path: "/account-settings/organization"
        },
        { 
            id: "profile", 
            label: "Org Profile", 
            icon: Settings, 
            description: "View and edit organization profile",
            path: "/account-settings/organization/profile"
        },
        { 
            id: "add-members", 
            label: "Add Members to Org", 
            icon: UserPlus, 
            description: "Add members to organization",
            path: "/account-settings/organization/add-members"
        }
    ];

    // Get current active item based on pathname
    const getCurrentActiveItem = () => {
        const currentPath = location.pathname;
        return navigationItems.find(item => item.path === currentPath) || navigationItems[0];
    };

    const activeItem = getCurrentActiveItem();

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
            scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    // Check scroll position on mount and resize
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScrollPosition();
            container.addEventListener("scroll", checkScrollPosition);
            window.addEventListener("resize", checkScrollPosition);

            return () => {
                container.removeEventListener("scroll", checkScrollPosition);
                window.removeEventListener("resize", checkScrollPosition);
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
                            <BreadcrumbPage className="truncate max-w-[30ch]">Organization Management</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <div className="p-4 mx-auto">
 

                {/* Content Area */}
                <div  >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default OrganizationLayout;
