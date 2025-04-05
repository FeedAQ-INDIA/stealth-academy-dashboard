import * as React from "react";
import {useEffect, useState} from "react";

import VersionSwitcher from "./version-switcher.jsx";
import {
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


function MainSidebar({workspaceDetail}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {WorkspaceId} = useParams();

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
        navMain: [{
            title: "GENERAL SETTINGS", url: "#", items: [{
                title: "Workspace General",
                url: `/workspace/${WorkspaceId}/settings/general?tab=general`,
                isActive: selectedTab === 'general',
            },],
        }, {
            title: "AUTOMATION & WORKFLOWS", url: "#", items: [{
                title: "Automation Workflow",
                url: `/workspace/${WorkspaceId}/settings/automation-workflow?tab=automation-workflow`,
                isActive: selectedTab === 'automation-workflow',
            },]
        }, {
            title: "CUSTOMIZATION", url: "#", items: [
                {
                    title: "User Status",
                    url: `/workspace/${WorkspaceId}/settings/user-status-setup?tab=user-status-setup`,
                    isActive: selectedTab === 'user-status-setup',
                },
                {
                    title: "User Status Group",
                    url: `/workspace/${WorkspaceId}/settings/user-status-group?tab=user-status-group`,
                    isActive: selectedTab === 'user-status-group',
                },{
                title: "Custom Field",
                url: `/workspace/${WorkspaceId}/settings/field-configuration?tab=field-configuration`,
                isActive: selectedTab === 'field-configuration',
            }, {
                title: "Status Workflow",
                url: `/workspace/${WorkspaceId}/settings/status-flow?tab=status-flow`,
                isActive: selectedTab === 'status-flow',
            }, {
                title: "Layout",
                url: `/workspace/${WorkspaceId}/settings/layout?tab=layout`,
                isActive: selectedTab === 'layout',
            }]
        }, {
            title: "USER MANAGEMENT", url: "#", items: [{
                title: "Users",
                url: `/workspace/${WorkspaceId}/settings/users?tab=users`,
                isActive: selectedTab === 'users',
            }, {
                title: "Teams",
                url: `/workspace/${WorkspaceId}/settings/teams?tab=teams`,
                isActive: selectedTab === 'teams',
            },

            ]
        }, {
            title: "CHANNELS", url: "#", items: [
                {
                    title: "Portal",
                    url: `/workspace/${WorkspaceId}/settings/channel/portal?tab=portal`,
                    isActive: selectedTab === 'portal',
                    // subItems:[
                        // {
                        //     title: "Configuration",
                        //     url: `/workspace/${WorkspaceId}/settings/channel/portal/portal-configuration?tab=portal`,
                        //     isActive: selectedTab === 'portal-configuration',
                        // },
                        // {
                        //     title: "Groups",
                        //     url: `/workspace/${WorkspaceId}/settings/channel/portal/portal-group?tab=portal`,
                        //     isActive: selectedTab === 'portal-group',
                        // }
                    // ]
                },
                {
                title: "API Builder",
                url: `/workspace/${WorkspaceId}/settings/channel/api-builder?tab=api-builder&limit=10&offset=0`,
                isActive: selectedTab === 'api-builder',
            },]
        },


        ]
    };


    return (< >
        <SidebarHeader>
            {workspaceDetail && <VersionSwitcher
                workspaceDetail={workspaceDetail}
            />}
            <Link
                to={`/workspace/${WorkspaceId}/overview?tab=overview`}>
                <Button className="  font-semibold w-full items-center " variant="outline">
                    <ArrowLeft/>
                    Back to Workspace
                </Button></Link>
            <Separator/>
            <div className="text-center font-medium">
                WORKSPACE SETTINGS
            </div>
        </SidebarHeader>
        <Separator/>
        <SidebarContent>

            {settingsData.navMain.map((item) => (<SidebarGroup key={item.title}>
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {item.items.map((item) => (item?.subItems?.length > 0 ? (<Collapsible key={item.title}>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title} className="py-5 rounded-1">

                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />

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

export default MainSidebar;
