import * as React from "react";
import { useEffect, useState, useCallback } from "react";

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
  SelectValue,
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
  User,
  BellIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator.jsx";
import { useOrganizationStore } from "@/zustland/store.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function AccountSidebar({ ...props }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Organization status from zustand store
  const {
    fetchUserOrganizations,
    organizationsLoading,
    organizationsError,
    organizations,
    setSelectedOrganization,
    selectedOrganization,
  } = useOrganizationStore();

  // Fetch organization status on component mount
  useEffect(() => {
    console.log("AccountSidebar: Fetching organizations on mount");
    fetchUserOrganizations();
  }, [fetchUserOrganizations]); // Include fetchUserOrganizations in dependencies

  // Debug logging
  useEffect(() => {
    console.log(
      "AccountSidebar Debug - organizationsLoading:",
      organizationsLoading
    );
    console.log("AccountSidebar Debug - organizations:", organizations);
    console.log(
      "AccountSidebar Debug - selectedOrganization:",
      selectedOrganization
    );
  }, [organizationsLoading, organizations, selectedOrganization]);

  // Dynamic organization menu items based on organization status
  const getOrganizationItems = useCallback(() => {
    console.log(
      "getOrganizationItems called - organizationsLoading:",
      organizationsLoading,
      "organizations:",
      organizations
    );

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

    // Check for errors
    if (organizationsError) {
      items.push({
        title: "Error loading organizations",
        url: "#",
        isActive: false,
        icon: Shield, // Using Shield as error icon
      });
      return items;
    }

    // If user has organizations, show additional management options
    if (organizations && organizations.length > 0) {
      items.push(
        {
          title: "Organization Profile",
          url: `/account-settings/organization/profile`,
          isActive:
            location.pathname === "/account-settings/organization/profile",
          icon: SettingsIcon,
        },
        {
          title: "Manage Members",
          url: `/account-settings/organization/add-members`,
          isActive:
            location.pathname === "/account-settings/organization/add-members",
          icon: UserPlus,
        }
      );
    } else {
      // No organizations found
      // items.push({
      //   title: "No organizations found",
      //   url: `/account-settings/register-organization`,
      //   isActive: false,
      //   icon: Building,
      // });
    }

    return items;
  }, [
    organizationsLoading,
    organizationsError,
    organizations,
    location.pathname,
  ]);

  // Get navigation items based on selected profile
  const getNavigationItems = useCallback(() => {
    const accountItems = [
      {
        title: "Profile",
        url: `/account-settings/profile`,
        isActive:
          location.pathname === "/account-settings/profile" ||
          location.pathname === "/account-settings",
        icon: User,
      },
      {
        title: "Billing",
        url: `/account-settings/billing`,
        isActive: location.pathname?.includes(
          "/account-settings/billing"
        ),
        icon: CreditCard,
      },

            {
        title: "Transaction History",
        url: `/account-settings/transaction-history`,
        isActive: location.pathname?.includes(
          "/account-settings/transaction-history"
        ),
        icon: CreditCard,
      },
      {
        title: "Notification",
        url: `/account-settings/notification`,
        isActive: location.pathname?.includes(
          "/account-settings/notification"
        ),
        icon: BellIcon,
      },
      // {
      //   title: "My Goals",
      //   url: `/account-settings/my-goals`,
      //   isActive: location.pathname?.includes("/account-settings/my-goals"),
      //   icon: CreditCard,
      // },
      // {
      //   title: "My Learning Schedule",
      //   url: `/account-settings/my-learning-schedule`,
      //   isActive: location.pathname?.includes(
      //     "/account-settings/my-learning-schedule"
      //   ),
      //   icon: CreditCard,
      // },
      //       {
      //   title: "Study Group",
      //   url: `/account-settings/my-study-group`,
      //   isActive: location.pathname?.includes(
      //     "/account-settings/my-study-group"
      //   ),
      //   icon: CreditCard,
      // },
    ];

    // If general profile is selected (selectedOrganization is null), show register organization option
    if (selectedOrganization === null) {
      // accountItems.push({
      //   title: "Register Organization",
      //   url: `/account-settings/register-organization`,
      //   isActive: location.pathname === "/account-settings/register-organization",
      //   icon: Building,
      // });
    }

    return accountItems;
  }, [selectedOrganization, location.pathname]);

  // Memoized data object that updates when dependencies change
  const data = React.useMemo(() => {
    const navSections = [
      {
        title: "Account",
        url: "#",
        items: getNavigationItems(),
      },
    ];

    // Only show Organization section if user has selected an organization profile (selectedOrganization is not null)
    if (
      selectedOrganization !== null &&
      organizations &&
      organizations.length > 0
    ) {
      navSections.push({
        title: "Organization",
        url: "#",
        items: getOrganizationItems(),
      });
    }

    navSections.push({
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
    });

    return { navMain: navSections };
  }, [
    organizations,
    selectedOrganization,
    getOrganizationItems,
    getNavigationItems,
  ]);

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
        {/* Profile Selector - Only show if user has organizations */}
        {!organizationsLoading && organizations && organizations.length > 0 && (
          <div className="px-3 py-3 border-b">
            <div className="mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Profile
              </span>
            </div>
            <Select
              value={
                selectedOrganization === null
                  ? "GENERAL"
                  : selectedOrganization.orgId?.toString()
              }
              onValueChange={(profileId) => {
                console.log("Profile changed to:", profileId);
                if (profileId === "GENERAL") {
                  setSelectedOrganization(null);
                } else {
                  const org = organizations.find(
                    (org) => org.orgId?.toString() === profileId
                  );
                  setSelectedOrganization(org || null);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">GENERAL</SelectItem>
                {organizations
                  .map((org) => {
                    // Add more robust validation
                    if (!org || !org.orgId || !org.orgName) {
                      console.warn("Invalid organization data:", org);
                      return null;
                    }

                    return (
                      <SelectItem
                        key={`org-${org.orgId}`}
                        value={org.orgId.toString()}
                      >
                        {org.orgName}
                      </SelectItem>
                    );
                  })
                  .filter(Boolean)}
                {organizationsError && (
                  <SelectItem disabled value="error">
                    Error: {organizationsError}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
        {/* <Separator/> */}
        <SidebarContent>
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
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
                          className={`flex items-center gap-2 py-2 rounded-1 h-fit transition-all duration-200 ${
                            item?.isLocked
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          } ${
                            item.isActive
                              ? "bg-gradient-to-r from-rose-100 to-rose-200 border-l-4 border-rose-600 shadow-md transform scale-[1.02]"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <Link to={item.url}>
                            {item.icon && (
                              <Avatar className="border shadow-md">
                                <AvatarFallback className="">
                                  <item.icon strokeWidth={2} color="#000000" />
                                </AvatarFallback>
                              </Avatar>
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
