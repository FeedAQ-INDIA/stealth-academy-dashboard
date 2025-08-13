import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb.jsx";
import CreditWidget from '@/components/CreditWidget.jsx';

// Example header component showing credit integration
const DashboardHeader = ({ title, breadcrumbs = [] }) => {
    return (
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/>
            
            {/* Breadcrumbs */}
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                        <BreadcrumbItem key={index}>
                            <BreadcrumbPage className="truncate max-w-[30ch]">
                                {crumb}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    ))}
                    <BreadcrumbItem>
                        <BreadcrumbPage className="truncate max-w-[30ch]">
                            {title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            {/* Credit Widget - Compact mode for header */}
            <div className="ml-auto">
                <CreditWidget 
                    compact={true} 
                    showQuickPurchase={true}
                    className="bg-white border shadow-sm rounded-lg px-3 py-2"
                />
            </div>
        </header>
    );
};

export default DashboardHeader;
