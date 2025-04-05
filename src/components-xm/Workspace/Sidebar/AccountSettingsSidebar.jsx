import * as React from "react";
import {useEffect, useState} from "react";

import VersionSwitcher from "./version-switcher.jsx";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar.jsx";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import {ArrowLeft, ChevronRight} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {Button} from "@/components/ui/button.jsx";


function AccountSettingsSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    // Helper function to get the current tab from the URL query params
    const getTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get("tab") || "overview"; // Default to 'overview' tab
    };

    const [selectedTab, setSelectedTab] = useState(getTabFromURL);


    // Update the state when the URL changes
    useEffect(() => {
        const currentTab = getTabFromURL();
        console.log(currentTab)
        setSelectedTab(currentTab);
    }, [location.search]);

    // Change the URL when the tab changes
    const handleTabChange = (value) => {
        setSelectedTab(value);
        navigate(`?tab=${value}`); // Update the URL without reloading the page
    };


    const settingsData = {
        navMain: [ {
            title: "PERSONAL SETTINGS", url: "#", items: [

                {
                    title: "Personal Profile",
                    url: `/account-settings/personal-profile?tab=personal-profile`,
                    isActive: selectedTab === 'personal-profile',
                },
                // {
                //     title: "Sessions",
                //     url: ` `,
                //     isActive: selectedTab === 'teams',
                // }, {
                //     title: "Activity History",
                //     url: ` `,
                //     isActive: selectedTab === 'teams',
                // },


                {
                    title: "Sign Out",
                    url: `http://localhost:3000/auth/logout`,
                    isActive: selectedTab === 'users',
                },
            ]
        },
            {
                title: "ORGANIZATION SETTINGS", url: "#", items: [

                    {
                        title: "Organization Profile",
                        url: `/account-settings/organization-profile?tab=organization-profile`,
                        isActive: selectedTab === 'organization-profile',
                    },
                    {
                        title: "Users",
                        url: `/account-settings/organization-users`,
                        isActive: selectedTab === 'organization-users',
                    },
                    // {
                    //     title: "Billing",
                    //     url: ` `,
                    //     isActive: selectedTab === 'teams',
                    // },
                     ]
            },
            {
                title: "PERSONAL SETTINGS", url: "#", items: [

                    {
                        title: "Organization Sign Out",
                        url: `/organization`,
                        isActive: selectedTab === 'users',
                    },
                    {
                        title: "Account Sign Out",
                        url: `http://localhost:3000/auth/logout`,
                        isActive: selectedTab === 'users',
                    },
                ]
            },]
    };


    return (
        <>
        <SidebarHeader className="text-center font-medium">
            ACCOUNT SETTINGS
        </SidebarHeader>
        <Separator/>
        <SidebarContent>

            {settingsData.navMain.map((item) => (<SidebarGroup key={item.title}>
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {item?.items?.map((item) => (item?.subItems?.length > 0 ? (<Collapsible key={item.title}>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title} className="py-5 rounded-1">

                                            <span>{item.title}</span>
                                            <ChevronRight
                                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item?.subItems?.map((subItem) => (

                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton asChild isActive={subItem.isActive}
                                                                          className="py-5 rounded-1">
                                                        <Link to={subItem.url}>{subItem.title}</Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>))}


                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>) : (<SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={item.isActive} className="py-5 rounded-1">
                                    <Link to={item.url}>{item.title}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>)

                        ))}

                    </SidebarMenu>

                </SidebarGroupContent>
            </SidebarGroup>))}


        </SidebarContent>
        <SidebarFooter>

        </SidebarFooter>
    </ >);
}

export default AccountSettingsSidebar;
