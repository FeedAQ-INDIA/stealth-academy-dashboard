import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.jsx"

import {Outlet, useNavigate, useParams} from "react-router-dom";

import AccountSidebar from "@/components-xm/AccountSettings/AccountSidebar.jsx";


const HEADER_HEIGHT = "4rem";

export function AccountDetail() {
    return (
        <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <SidebarProvider className="p-0">
                <AccountSidebar/>
                <SidebarInset
                    className="h-full" style={{borderRadius: '0px', margin: '0px'}}>
                    <Outlet/>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
