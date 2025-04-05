import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.jsx"
import CourseSidebar from "@/components-xm/CourseSidebar.jsx";

import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import AccountSidebar from "@/components-xm/AccountSidebar.jsx";


const HEADER_HEIGHT = "4rem";

export function AccountDetail() {


    return (<>
            <SidebarProvider className="p-0">
                <AccountSidebar/>
                <SidebarInset
                    className=" min-h-[calc(100svh-4em)]  " style={{borderRadius: '0px', margin: '0px'}}>

                    <div className="h-[calc(100svh-4em)] overflow-y-auto  ">
                        <Outlet/>
                    </div>


                </SidebarInset>
            </SidebarProvider>
        </>

    );
}
