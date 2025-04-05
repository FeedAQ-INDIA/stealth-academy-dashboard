import * as React from "react";
import {useEffect, useState} from "react";

import VersionSwitcher from "./version-switcher.jsx";
import {
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
    SidebarMenuSubItem,
} from "@/components/ui/sidebar.jsx";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {startOfToday, subMonths} from "date-fns";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import {ArrowLeft, ChevronRight} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {Button} from "@/components/ui/button.jsx";


function WorkspaceSidebar({workspaceDetail}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {WorkspaceId} = useParams();

    // const [workspaceDetail, setWorkspaceDetail] = useState({});
    const [repositoryDetail, setRepositoryDetail] = useState({});
    // Helper function to get the current tab from the URL query params
    const getTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get("tab") || "overview"; // Default to 'overview' tab
    };

    const [selectedTab, setSelectedTab] = useState(getTabFromURL);

    const [date, setDate] = useState({
        from: subMonths(startOfToday(), 1), to: startOfToday(),
    });

    useEffect(() => {
        localStorage.setItem("searchStartwindow", date.from);
        localStorage.setItem("searchEndwindow", date.to);
        const event = new CustomEvent('dateChanged', {detail: date});
        window.dispatchEvent(event);

    }, [date])

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

    const data = {
        navMain: [//     {
            //     title: "GETTING STARTED", url: "/", items: [{
            //         title: "Overview", url:  `/workspace/${WorkspaceId}/views?tab=views`,
            //     },],
            // },
            {
                title: "WORK ARENA", url: "#", items: [{
                    title: "Record",
                    url: `/workspace/${WorkspaceId}/views?tab=views`,
                    isActive: selectedTab === 'views',
                },
                    {
                        title: "My Queue",
                        url: `/workspace/${WorkspaceId}/my-queue?tab=my-queue`,
                        isActive: selectedTab === 'my-queue',
                    },
                    {
                    title: "Stakeholder",
                    url: `/workspace/${WorkspaceId}/stakeholder?tab=stakeholder`,
                    isActive: selectedTab === 'stakeholder',
                },

                    {
                        title: "Tags", url: `/workspace/${WorkspaceId}/tags?tab=tags`, isActive: selectedTab === 'tags',
                    }, {
                        title: "Products & Services",
                        url: `/workspace/${WorkspaceId}/products?tab=products`,
                        isActive: selectedTab === 'products',
                    },

                ],
            }, {
                title: "MANAGE WORKSPACE", url: "#", items: [{
                    title: "Settings",
                    url: `/workspace/${WorkspaceId}/settings/general?tab=general`,
                    isActive: selectedTab === 'general',
                },

                ],
            }]
    };

    return (<>

        <SidebarHeader>
            {workspaceDetail && <VersionSwitcher
                workspaceDetail={workspaceDetail}
            />}

            {location.pathname.includes("/views") ? (<> <Link
                to={`/workspace/${WorkspaceId}/overview?tab=overview`}>
                <Button className="  font-semibold w-full items-center " variant="ghost">
                    <ArrowLeft/>
                    Back to Workspace
                </Button></Link>
            </>) : <></>}
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


    </>);
}

export default WorkspaceSidebar;
