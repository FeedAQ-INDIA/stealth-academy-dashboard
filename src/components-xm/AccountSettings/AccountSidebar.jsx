import * as React from "react";
import { useEffect, useState } from "react";

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
  useSidebar,
} from "@/components/ui/sidebar.jsx";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select.jsx";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Loader,
  UserCircle,
  Shield,
  CreditCard,
  Bell,
  LogOut,
  ShoppingBag,
  Building,
  Users,
  UserPlus,
  Settings as SettingsIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator.jsx";
import { useOrganizationStore } from "@/zustland/store.js";

function AccountSidebar({ ...props }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Organization status from zustand store
  const { 
    fetchUserOrganizations, 
    organizationsLoading,
    organizations,
    setSelectedOrganization,
    selectedOrganization
  } = useOrganizationStore();

  // Fetch organization status on component mount
  useEffect(() => {
    console.log("AccountSidebar: Fetching organizations on mount");
    fetchUserOrganizations();
  }, []); // Empty dependency array since fetchUserOrganizations should be stable

  // Debug logging
  useEffect(() => {
    console.log("AccountSidebar Debug - organizationsLoading:", organizationsLoading);
    console.log("AccountSidebar Debug - organizations:", organizations);
    console.log("AccountSidebar Debug - selectedOrganization:", selectedOrganization);
  }, [organizationsLoading, organizations, selectedOrganization]);

  // Helper function to get the current tab from the URL query params
  const getTabFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "overview"; // Default to 'overview' tab
  };

  // Dynamic organization menu items based on organization status
  const getOrganizationItems = () => {
    console.log("getOrganizationItems called - organizationsLoading:", organizationsLoading, "organizations:", organizations);
    
    // Always show the main organization dashboard
    const items = [];

    // Check if we're still loading
    if (organizationsLoading) {
      items.push({
        title: "Loading organizations...",
        url: "#",
        isActive: false,
        icon: Loader,
      });
      return items;
    }

    // If user has organizations, show additional management options
    if (organizations && organizations.length > 0) {
      items.push(
        {
          title: "Organization Profile",
          url: `/account-settings/organization/profile`,
          isActive: location.pathname === "/account-settings/organization/profile",
          icon: SettingsIcon,
        },
        {
          title: "Manage Members",
          url: `/account-settings/organization/add-members`,
          isActive: location.pathname === "/account-settings/organization/add-members",
          icon: UserPlus,
        },
      );
    } else {
      // No organizations found
      items.push({
        title: "No organizations found",
        url: `/account-settings/register-organization`,
        isActive: false,
        icon: Building,
      });
    }

    return items;
  };

  // Memoized data object that updates when dependencies change
  const data = React.useMemo(() => ({
    navMain: [
      {
        title: "Account",
        url: "#",
        items: [
          {
            title: "Profile",
            url: `/account-settings/profile`,
            isActive:
              location.pathname === "/account-settings/profile" ||
              location.pathname === "/account-settings",
            icon: UserCircle,
          },
          // {
          //     title: "Security",
          //     url: `/account-settings/security`,
          //     isActive: location.pathname === '/account-settings/security',
          //     icon: Shield,
          // },
          {
            title: "Credit & Orders",
            url: `/account-settings/credit-and-order`,
            isActive: location.pathname?.includes(
              "/account-settings/credit-and-order"
            ),
            icon: CreditCard,
          },
          {
            title: "My Goals",
            url: `/account-settings/my-goals`,
            isActive: location.pathname?.includes("/account-settings/my-goals"),
            icon: CreditCard,
          },
          {
            title: "My Learning Schedule",
            url: `/account-settings/my-learning-schedule`,
            isActive: location.pathname?.includes(
              "/account-settings/my-learning-schedule"
            ),
            icon: CreditCard,
          },
           {
        title: "Register Organization",
        url: `/account-settings/register-organization`,
        isActive: location.pathname === "/account-settings/register-organization",
        icon: Building,
      },
        ],
      },
      {
        title: "Organization",
        url: "#",
        items: getOrganizationItems(),
        // Add organization selector for organizations section
        hasSelector: organizations && organizations.length > 0,
        selectorComponent: organizations && organizations.length > 0 ? (
          <div className="px-2 py-2">
            <Select 
              value={selectedOrganization?.orgId?.toString() || ""} 
              onValueChange={(orgId) => {
                const org = organizations.find(o => o.organization.orgId.toString() === orgId);
                if (org) {
                  setSelectedOrganization(org.organization);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((orgUser) => (
                  <SelectItem 
                    key={orgUser.organization.orgId} 
                    value={orgUser.organization.orgId.toString()}
                  >
                    {orgUser.organization.orgName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null,
      },
      {
        title: "Actions",
        url: "#",
        items: [
          {
            title: "Sign out",
            url: `${import.meta.env.VITE_API_URL}/auth/logout`,
            isActive: false,
            icon: LogOut,
          },
        ],
      },
    ],
  }), [organizations, organizationsLoading, selectedOrganization, location.pathname]);

  const [urlEndpoint, setUrlEndpoint] = React.useState("");

  useEffect(() => {
    console.log("Updated urlEndpoint:", urlEndpoint);
  }, [urlEndpoint]);

  return (
    <>
      <Sidebar
        className="top-[4rem] h-[calc(100svh-4em)] border-r shadow-md px-0"
        style={{ borderRadius: "0px" }}
        variant="inset"
      >
        {/* <SidebarHeader>
                <h2 className="text-lg font-medium text-center">MY ACCOUNT</h2>

            </SidebarHeader> */}
        {/* <Separator/> */}
        <SidebarContent>
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              {/* Render organization selector if it exists */}
              {item.selectorComponent && item.selectorComponent}
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) =>
                    item?.subItems?.length > 0 ? (
                      <Collapsible key={item.title}>
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              className="py-5 rounded-1"
                            >
                              {item.icon && (
                                <item.icon className="mr-2 h-4 w-4" />
                              )}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item?.subItems?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={subItem.isActive}
                                    className="py-5 rounded-1"
                                  >
                                    <Link to={subItem.url}>
                                      {subItem.icon && (
                                        <subItem.icon className="mr-2 h-4 w-4" />
                                      )}
                                      {subItem.title}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.isActive}
                          className="py-5 rounded-1"
                        >
                          <Link to={item.url}>
                            {item.icon && (
                              <item.icon className="mr-2 h-4 w-4" />
                            )}
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </>
  );
}

export default AccountSidebar;
