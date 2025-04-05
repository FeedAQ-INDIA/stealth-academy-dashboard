import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import React, {useEffect, useState} from "react";
import TagsTable from "@/components-xm/Workspace/TagsTable.jsx";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import CreateTags from "@/components-xm/Workspace/CreateTags.jsx";
import {Link, useParams} from "react-router-dom";
import CreateProduct from "@/components-xm/Workspace/CreateProduct.jsx";
import ProductsTable from "@/components-xm/Workspace/ProductsTable.jsx";
import axiosConn from "@/axioscon.js";
import StatusFlow from "@/components-xm/Workspace/WorkspaceSettings/StatusFlow.jsx";
import StatusFlowDetail from "@/components-xm/Workspace/WorkspaceSettings/StatusFlowDetail.jsx";
import CreateEditStatusFlowConfiguration
    from "@/components-xm/Workspace/WorkspaceSettings/CreateEditStatusFlowConfiguration.jsx";

function StatusConfigurationDetail() {
    const {WorkspaceId,StatusConfigurationId} = useParams();

    const [statusConfigDetail, setStatusConfigDetail] = useState(null);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 1, offset: 0, getThisData: {
                    datasource: "StatusConfiguration", order: [ ], attributes: [], where: {
                        workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                            ...(StatusConfigurationId && {statusConfigurationId: StatusConfigurationId})
                    }, include: [{
                        datasource: "Statuses", as: "statuslist", order: [], attributes: [], where: {},
                    },]
                },
            })
            .then((res) => {
                console.log(res.data);
                setStatusConfigDetail(res.data?.data?.results?.[0]);

            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                <Link to={ `/workspace/${WorkspaceId}/views?tab=views`}>Workspace</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block"/>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                <Link to={`/workspace/${WorkspaceId}/settings/status-flow?tab=status-flow`}>Status Config</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block"/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>{statusConfigDetail?.statusConfigurationName}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">
                    {/*<Link to={`/workspace/${WorkspaceId}/settings/status-flow/${StatusConfigurationId}/edit?tab=status-flow`}>*/}
                    {/*    <Button*/}
                    {/*        className="h-8 gap-1 "*/}
                    {/*    >Edit</Button>*/}
                    {/*</Link>*/}
                </div>
            </header>

            <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start  bg-muted/50">
                <div>
                    <CardTitle className="text-lg">{statusConfigDetail?.statusConfigurationName} - #{statusConfigDetail?.statusConfigurationId}</CardTitle>
                    <CardDescription>Status Config Detail</CardDescription>
                </div>

                <div className="ml-auto sm:flex-initial">
                    <Link to={`/workspace/${WorkspaceId}/settings/status-flow/create`}>
                        <Button
                            className="h-8 gap-1 "

                        >Edit Status Flow</Button>
                    </Link>
                </div>
            </CardHeader>


            <div className="flex flex-col gap-4 p-4">
                <div className=" ">

                    <Card className=" rounded-none  shadow-md  my-4">
                        <CardHeader  className="bg-muted/50 ">
                            <CardTitle className="text-lg font-normal">General Information</CardTitle>
                        </CardHeader>
                        <Separator className="mb-3"/>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-3">
                                    <p className="text-muted-foreground">Name</p>
                                    <h5>{statusConfigDetail?.statusConfigurationName || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-3">
                                    <p className="text-muted-foreground">Description</p>
                                    <h5>{statusConfigDetail?.statusConfigurationDescription || "N/A"}</h5>
                                </div>

                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Status</p>
                                    <h5>{statusConfigDetail?.statusConfigurationStatus || "N/A"}</h5>
                                </div>

                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Created at</p>
                                    <h5>{statusConfigDetail?.statusconf_created_at ? new Date(statusConfigDetail.statusconf_created_at).toLocaleString() : "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Last updated at</p>
                                    <h5>{statusConfigDetail?.statusconf_updated_at ? new Date(statusConfigDetail.statusconf_updated_at).toLocaleString() : "N/A"}</h5>
                                </div>
                            </div>

                        </CardContent>
                    </Card>


                    <Card className=" rounded-none  shadow-md  my-4">
                        <CardHeader className="bg-muted/50">
                            <CardTitle className="text-lg font-normal">Status Flows</CardTitle>
                        </CardHeader>
                        <Separator className="mb-3"/>
                        <CardContent>
<StatusFlowDetail />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </>)

}


export default StatusConfigurationDetail;