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
import {startOfToday, subMonths} from "date-fns";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import {ArrowLeft, ChevronRight} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {Button} from "@/components/ui/button.jsx";


function ViewsSidebar({workspaceDetail}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {WorkspaceId} = useParams();

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


    const viewsData = {
        navMain: [{
            title: "Views", url: "#", items: [{
                title: "All Records",
                url: `/workspace/${WorkspaceId}/views?tab=views`,
                isActive: selectedTab === 'views',
            },

                {
                    title: "Assigned to me",
                    url: `/workspace/${WorkspaceId}/views?tab=views`,
                    isActive: selectedTab === 'views',
                },

                // {
                //     title: "Assigned Records", url: `/workspace/${WorkspaceId}/views/assigned-views?tab=assigned-views`, isActive: selectedTab === 'assigned-views',
                // },
                // {
                //     title: "Unassigned Records", url: `/workspace/${WorkspaceId}/views/unassigned-views?tab=unassigned-views`, isActive: selectedTab === 'unassigned-views',
                // },
            ],
        }]
    };


    const [urlEndpoint, setUrlEndpoint] = React.useState("");

    useEffect(() => {
        if (location.pathname.includes("/settings")) setUrlEndpoint('/settings/'); else if (location.pathname.includes("/views")) setUrlEndpoint('/views/'); else setUrlEndpoint('/default/');
    }, [location.pathname]);


    return (<>

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
                        RECORD VIEWS
                    </div>
                </SidebarHeader>
                <Separator/>
                <SidebarContent>


                    {viewsData.navMain.map((item) => (<SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (item?.subItems?.length > 0 ? (<Collapsible key={item.title}>
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
                                    </Collapsible>) : (<SidebarMenuItem key={item.title} className="my-1">
                                        <SidebarMenuButton asChild isActive={item.isActive} className="py-5 rounded-1">
                                            <Link to={item.url}>{item.title}</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>)

                                ))}
                                <Separator/>

                            </SidebarMenu>

                        </SidebarGroupContent>
                    </SidebarGroup>))}


                </SidebarContent>
                <SidebarFooter>

                </SidebarFooter>
         </>);
}

export default ViewsSidebar;
