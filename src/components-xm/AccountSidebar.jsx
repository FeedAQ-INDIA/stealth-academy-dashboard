import * as React from "react";
import {useEffect, useState} from "react";

 import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem, useSidebar,
} from "@/components/ui/sidebar.jsx";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import {ArrowLeft, ChevronRight, Clock, Loader} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {Button} from "@/components/ui/button.jsx";


function AccountSidebar({...props}) {
    const location = useLocation();
    const navigate = useNavigate();

    // Helper function to get the current tab from the URL query params
    const getTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get("tab") || "overview"; // Default to 'overview' tab
    };


    const data = {
        navMain: [
            {
                title: "GENERAL", url: "#", items: [{
                    title: "Profile",
                    url: `/account-settings/profile`,
                    isActive: location.pathname === '/account-settings/profile',
                },
                    {
                        title: "Sign out",
                        url: `http://localhost:3000/auth/logout`,
                        isActive: location.pathname === 'http://localhost:3000/auth/logout',

                    },

                ],
            },  ]
    };


    const [urlEndpoint, setUrlEndpoint] = React.useState("");

    useEffect(() => {
        console.log("Updated urlEndpoint:", urlEndpoint);
    }, [urlEndpoint]);


    return (< >
        <Sidebar className="top-[4rem] h-[calc(100svh-4em)]   " style={{borderRadius: '0px', overflowY: 'auto'}}
                 variant="inset">

            <SidebarHeader>
                <h2 className="text-lg font-medium">MY ACCOUNT</h2>

            </SidebarHeader>
            <Separator/>
            <SidebarContent>


                {data.navMain.map((item) => (<SidebarGroup key={item.title}>
                    <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {item.items.map((item) => (item?.subItems?.length > 0 ? (<Collapsible key={item.title}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}
                                                               className="py-5 rounded-1">

                                                <span>{item.title}</span>
                                                <ChevronRight
                                                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item?.subItems?.map((subItem) => (

                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuSubButton asChild
                                                                              isActive={subItem.isActive}
                                                                              className="py-5 rounded-1">
                                                            <Link to={subItem.url}>{subItem.title}</Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>))}

                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>) : (<SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.isActive}
                                                       className="py-5 rounded-1">
                                        <Link to={item.url}>{item.title}</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>)

                            ))}

                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>))}


            </SidebarContent>


        </Sidebar>
    </ >);

}

export default AccountSidebar;
