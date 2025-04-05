import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {createBrowserRouter, Link, RouterProvider} from "react-router-dom";
import ErrorPage from "./components-xm/error-page.jsx";
import {DashboardSample} from "./components-xm/DashboardSample.jsx";
import Stakeholder from "./components-xm/Workspace/Stakeholder.jsx";
import IdentityDetail from "./components-xm/Workspace/StakeholderDetail.jsx";
import SignInPage from "./components-xm/SignInPage.jsx";
import SetupAccount from "./components-xm/SetupAccount.jsx";
import CreateWorkspace from "./components-xm/Workspace/CreateWorkspace.jsx";
import {Toaster} from "./components/ui/toaster.jsx";
import Workspace from "./components-xm/Workspace/Workspace.jsx";
import {Provider} from "react-redux";
 import {refreshToken} from "./utils/refreshTokenUtils";
 import ManageOrg from "./components-xm/ManageOrg.jsx";
import WorkspaceGeneralSettings from "@/components-xm/Workspace/WorkspaceSettings/WorkspaceGeneralSettings.jsx";
import PersonalGeneralSettings from "@/components-xm/MyAccountSettings/PersonalGeneralSettings.jsx";
import OrganizationGeneralSettings from "@/components-xm/OrgSettings/OrganizationGeneralSettings.jsx";
import OrganizationUsers from "@/components-xm/OrgSettings/OrganizationUsers.jsx";
import {WorkspaceDashboard} from "@/components-xm/Workspace/WorkspaceDashboard.jsx";
import Record from "@/components-xm/Workspace/Record.jsx";

import WorkspaceUser from "@/components-xm/Workspace/WorkspaceSettings/WorkspaceUser.jsx";
 import ManageField from "@/components-xm/Workspace/WorkspaceSettings/ManageField.jsx";
 import RecordDetail from "@/components-xm/Workspace/RecordDetail.jsx";
 import CreateViews from "@/components-xm/Workspace/CreateViews.jsx";
import StakeholderDetail from "./components-xm/Workspace/StakeholderDetail.jsx";
import WorkspaceTeams from "@/components-xm/Workspace/WorkspaceSettings/WorkspaceTeams.jsx";
import WorkspaceStatusFlow from "@/components-xm/Workspace/WorkspaceSettings/WorkspaceStatusFlow.jsx";
import Tags from "@/components-xm/Workspace/Tags.jsx";
import EditWorkspaceGeneralSettings from "@/components-xm/Workspace/WorkspaceSettings/EditWorkspaceGeneral.jsx";
import EditPersonalGeneralSettings from "@/components-xm/MyAccountSettings/EditPersonalGeneralSettings.jsx";
import EditOrganizationGeneralSettings from "@/components-xm/OrgSettings/EditOrganizationGeneralSettings.jsx";
import Products from "@/components-xm/Workspace/Products.jsx";
import EditProduct from "@/components-xm/Workspace/EditProduct.jsx";
import ProductDetail from "@/components-xm/Workspace/ProductDetail.jsx";
import EditTags from "@/components-xm/Workspace/EditTags.jsx";
import EditTeam from "@/components-xm/Workspace/WorkspaceSettings/EditTeam.jsx";
import TeamDetail from "@/components-xm/Workspace/WorkspaceSettings/TeamDetail.jsx";
import CustomFieldConfiguration from "@/components-xm/Workspace/WorkspaceSettings/CustomFieldConfiguration.jsx";

import EditCustomFieldConfiguration from "@/components-xm/Workspace/WorkspaceSettings/EditCustomFieldConfiguration.jsx";
import CustomFieldConfigurationDetail
    from "@/components-xm/Workspace/WorkspaceSettings/CustomFieldConfigurationDetail.jsx";
import StatusFlow from "@/components-xm/Workspace/WorkspaceSettings/StatusFlow.jsx";
import StatusConfiguration from "@/components-xm/Workspace/WorkspaceSettings/StatusConfiguration.jsx";
import CreateEditStatusFlowConfiguration
    from "@/components-xm/Workspace/WorkspaceSettings/CreateEditStatusFlowConfiguration.jsx";
import StatusConfigurationDetail from "@/components-xm/Workspace/WorkspaceSettings/StatusConfigurationDetail.jsx";
import UserProfile from "@/components-xm/OrgSettings/UserProfile.jsx";
import RecordDetailView from "@/components-xm/Workspace/RecordDetailView.jsx";
import StakeholderDetailView from "@/components-xm/Workspace/StakeholderDetailView.jsx";
import API from "@/components-xm/Workspace/Channel/API.jsx";
import APIDetailView from "@/components-xm/Workspace/Channel/APIDetailView.jsx";
import CreateAPIChannel from "@/components-xm/Workspace/Channel/CreateAPIChannel.jsx";
import CreateLayout from "@/components-xm/Workspace/WorkspaceSettings/Layout/CreateLayout.jsx";
import Layout from "@/components-xm/Workspace/WorkspaceSettings/Layout/Layout.jsx";
import LayoutDetail from "@/components-xm/Workspace/WorkspaceSettings/Layout/LayoutDetail.jsx";
import AutomationWorkflow from "@/components-xm/Workspace/AutomationWorkflow.jsx";
import Wrapper from "@/components-xm/Wrapper.jsx";
import {useAuthStore  } from "@/zustland/store.js";
import Portal from "@/components-xm/Workspace/Channel/Portal/Portal.jsx";
import PortalConfiguration from "@/components-xm/Workspace/Channel/Portal/PortalConfiguration.jsx";
import PortalGroup from "@/components-xm/Workspace/Channel/Portal/PortalGroup.jsx";
import {useRBAC} from "@/RBACContext.jsx";
import {SidebarProvider} from "@/components/ui/sidebar.jsx";
import EditUserProfile from "@/components-xm/OrgSettings/EditUserProfile.jsx";
import UserStatusGroup from "@/components-xm/Workspace/WorkspaceSettings/UserStatusGroup.jsx";
import UserStatus from "@/components-xm/Workspace/WorkspaceSettings/UserStatus.jsx";
import CreateUserStatus from "@/components-xm/Workspace/WorkspaceSettings/CreateUserStatus.jsx";
import CreateUserStatusGroup from "@/components-xm/Workspace/WorkspaceSettings/CreateUserStatusGroup.jsx";
 import MyQueueView from "@/components-xm/Workspace/MyQueue/MyQueueView.jsx";
import CreateEditPortalGroup from "@/components-xm/Workspace/Channel/Portal/CreateEditPortalGroup.jsx";
 
// const ProtectedRoute = ({ permission, children }) => {
//     const { hasPermission } = useRBAC();
//     return hasPermission(permission) ? children : <Link to="/dashboard" />;
// };

const router = createBrowserRouter([
    {
        path: "/signin",
        element: <SignInPage/>,
    },

    {
        path: "/sample",
        element: <DashboardSample/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: "/hello",
        element: <div>Hello</div>,
        errorElement: <ErrorPage/>,
    },
    {
        path: "/",
        element: <Wrapper/>,
        errorElement: <ErrorPage/>,
        children:[
            {
                path: "/",
                element: <App/>,
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: "/workspace/:WorkspaceId",
                        element: <WorkspaceDashboard/>  ,
                        errorElement: <ErrorPage/>,
                        children: [

                            {
                                path: "/workspace/:WorkspaceId/overview",
                                element: <></>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/record",
                                element: <Record/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/my-queue",
                                element: <MyQueueView/>,
                                children:[
                                    {
                                        path: "/workspace/:WorkspaceId/my-queue/:RecordId",
                                        element: <RecordDetail/>,
                                    },
                                ]
                            },


                            {
                                path: "/workspace/:WorkspaceId/tags",
                                element: <Tags/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/tags/:TagsId/edit",
                                element: <EditTags/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/record/:RecordId",
                                element: <RecordDetailView/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/general",
                                element: <WorkspaceGeneralSettings/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/general/edit",
                                element: <EditWorkspaceGeneralSettings/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/user-status-setup",
                                element: <UserStatus/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/user-status-setup/create",
                                element: <CreateUserStatus/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/user-status-group",
                                element: <UserStatusGroup/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/user-status-group/create",
                                element: <CreateUserStatusGroup/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/status-flow",
                                element: <StatusConfiguration/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/status-flow/create",
                                element: <CreateEditStatusFlowConfiguration/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/status-flow/:StatusConfigurationId/edit",
                                element: <CreateEditStatusFlowConfiguration/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/status-flow/:StatusConfigurationId",
                                element: <StatusConfigurationDetail/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/status-flow",
                                element: <StatusFlow/>,
                            },

                            {
                                path: "/workspace/:WorkspaceId/settings/field-configuration",
                                element: <CustomFieldConfiguration/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/field-configuration/create",
                                element: <EditCustomFieldConfiguration/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/field-configuration/:ContextConfigurationId/edit",
                                element: <EditCustomFieldConfiguration/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/field-configuration/:ContextConfigurationId",
                                element: <CustomFieldConfigurationDetail/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/Layout",
                                element: <Layout/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/layout/create",
                                element: <CreateLayout/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/layout/:LayoutId/edit",
                                element: <CreateLayout/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/layout/:LayoutId",
                                element: <LayoutDetail/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/users",
                                element: <WorkspaceUser/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/automation-workflow",
                                element: <AutomationWorkflow/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/teams",
                                element: <WorkspaceTeams/>,
                            },

                            {
                                path: "/workspace/:WorkspaceId/settings/teams/:TeamId",
                                element: <TeamDetail/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/teams/:TeamId/edit",
                                element: <EditTeam/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/manage-field",
                                element: <ManageField/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/status-flow",
                                element: <WorkspaceStatusFlow/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/channel/portal",
                                element: <Portal />,
                                children:[

                                    {
                                        path: "/workspace/:WorkspaceId/settings/channel/portal/portal-configuration",
                                        element: <PortalConfiguration />,
                                    },
                                    {
                                        path: "/workspace/:WorkspaceId/settings/channel/portal/portal-group",
                                        element: <PortalGroup />,
                                    },
                                ]
                            },

                            {
                                path: "/workspace/:WorkspaceId/settings/channel/api-builder/",
                                element: <APIDetailView />,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/channel/api-builder/create",
                                element: <CreateAPIChannel/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/settings/channel/api-builder/:APIChannelId",
                                element: <APIDetailView />,
                            },

                            {
                                path: "/workspace/:WorkspaceId/stakeholder",
                                element: <Stakeholder/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/stakeholder/:StakeholderId",
                                element: <StakeholderDetailView/>,
                            },




                            {
                                path: "/workspace/:WorkspaceId/views",
                                element: <Record/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/products",
                                element: <Products/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/products/create",
                                element: <Products/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/products/:ProductId/edit",
                                element: <EditProduct/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/products/:ProductId",
                                element: <ProductDetail/>,
                            },
                            {
                                path: "/workspace/:WorkspaceId/views/create-views",
                                element: <CreateViews/>,
                            },

                        ],
                    },
                    {
                        path: "/workspace",
                        element: <Workspace/>,
                    },

                    {
                        path: "/account-settings",
                        element: <WorkspaceDashboard/>,
                        errorElement: <ErrorPage/>,
                        children: [
                            {
                                path: "/account-settings/personal-profile",
                                element: <UserProfile/>,
                            },
                            {
                                path: "/account-settings/personal-profile/edit",
                                element: <EditPersonalGeneralSettings/>,
                            },
                            {
                                path: "/account-settings/organization-profile",
                                element: <OrganizationGeneralSettings/>,
                            },
                            {
                                path: "/account-settings/organization-profile/edit",
                                element: <EditOrganizationGeneralSettings/>,
                            },
                            {
                                path: "/account-settings/organization-users",
                                element: <OrganizationUsers/>,
                            },

                        ]
                    },

                    {
                        path: "/user/:UserId",
                        element:      <UserProfile/>  ,
                    },
                    {
                        path: "/user/:UserId/edit",
                        element:      <EditUserProfile/>  ,
                    },
                    {
                        path: "/createWorkspace",
                        element: <CreateWorkspace/>,
                    },

                ]
            },
            {
                path: "/setupaccount",
                element: <SetupAccount/>,
            },
            {
                path: "/organization",
                element: <ManageOrg/>,
            },
        ]
    },





]);


try {
    if (window.location.pathname != "/signin") {
        await refreshToken();
    }
} catch (err) {
    console.log(err);
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/*<Provider store={store} >*/}
            {" "}
            {/* Wrap with Provider */}
            <RouterProvider router={router}/>
            <Toaster/>
        {/*</Provider>*/}
    </StrictMode>
);
