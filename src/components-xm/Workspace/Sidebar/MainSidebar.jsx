import * as React from "react";
import {useEffect, useState} from "react";

import VersionSwitcher from "./version-switcher.jsx";
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
    SidebarMenuSubItem,
} from "@/components/ui/sidebar.jsx";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {startOfToday, subMonths} from "date-fns";
import axiosConn from "@/axioscon.js";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import {ArrowLeft, ChevronRight} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {Button} from "@/components/ui/button.jsx";
import ViewsSidebar from "@/components-xm/Workspace/Sidebar/ViewsSidebar.jsx";
import SettingsSidebar from "@/components-xm/Workspace/Sidebar/WorkspaceSettingsSidebar.jsx";
import AccountSettingsSidebar from "@/components-xm/Workspace/Sidebar/AccountSettingsSidebar.jsx";
import WorkspaceSidebar from "@/components-xm/Workspace/Sidebar/WorkspaceSidebar.jsx";
import {useAuthStore} from "@/zustland/store.js";
import StakeholderSidebar from "@/components-xm/Workspace/Sidebar/StakeholderSidebar.jsx";


function MainSidebar({...props}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {WorkspaceId} = useParams();

    const [workspaceDetail, setWorkspaceDetail] = useState({});
    const {
        workspaceData,

    } = useAuthStore();

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

    const [urlEndpoint, setUrlEndpoint] = React.useState("");

    useEffect(() => {
        console.log("Current Path:", location.pathname);

        if (location.pathname.includes("/settings")) setUrlEndpoint("/settings/");
        else if (location.pathname.includes("/views")) setUrlEndpoint("/views/");
        else if (location.pathname.includes("/stakeholder")) setUrlEndpoint("/stakeholder/");
        else if (location.pathname.includes("/account-settings")) setUrlEndpoint("/account-settings/");
        else if (location.pathname.includes("/workspace")) setUrlEndpoint("/default/");
        else setUrlEndpoint("/default/");
    }, [location.pathname]);

    useEffect(() => {
        console.log("Updated urlEndpoint:", urlEndpoint);
    }, [urlEndpoint]);

    return (< >
        <Sidebar className="top-[4rem] h-[calc(100svh-4em)]   " style={{borderRadius: '0px', overflowY: 'auto'}}
                 variant="inset">
            {urlEndpoint == ("/settings/") ? <SettingsSidebar workspaceDetail={workspaceData}/> : <></>}
            {urlEndpoint == ("/views/") ? <ViewsSidebar workspaceDetail={workspaceData}/> : <></>}
            {urlEndpoint == ("/stakeholder/") ? <StakeholderSidebar workspaceDetail={workspaceData}/> : <></>}
            {urlEndpoint == ("/account-settings/") ? <AccountSettingsSidebar  /> : <></>}
            {urlEndpoint == ("/default/") ?
                <WorkspaceSidebar  workspaceDetail={workspaceData} key={urlEndpoint}/> : <></>}

        </Sidebar>
        </ >);
}

export default MainSidebar;
