import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.jsx"

import {Outlet, useNavigate, useParams} from "react-router-dom";

import AccountSidebar from "@/components-xm/AccountSettings/AccountSidebar.jsx";


const HEADER_HEIGHT = "4rem";

export function AccountDetail() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <SidebarProvider className="p-0">
                <AccountSidebar/>
                <SidebarInset
                    className="min-h-[calc(100svh-4em)]" style={{borderRadius: '0px', margin: '0px'}}>
                    <div className="h-[calc(100svh-4em)] overflow-y-auto">
                        <Outlet/>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
