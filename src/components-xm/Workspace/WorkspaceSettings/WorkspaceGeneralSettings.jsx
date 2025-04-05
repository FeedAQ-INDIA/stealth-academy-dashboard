import React, {useEffect, useState} from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import axiosConn from "@/axioscon.js";
import {useToast} from "@/components/hooks/use-toast.js";

import {Link, useParams} from "react-router-dom";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";

function WorkspaceGeneralSettings() {
    const {WorkspaceId} = useParams();
    const [workspaceDetail, setWorkspaceDetail] = useState([]);
    const {toast} = useToast();


    useEffect(() => {
        fetchWorkspaceDetail();
    }, []);

    const fetchWorkspaceDetail = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 20, offset: 0, getThisData: {
                    datasource: "Workspace", order: [], attributes: [], where: {
                        workspaceId: WorkspaceId,
                    }, include: [{
                        datasource: "User", as: "createdby", required: false, order: [], attributes: [], where: {},
                    }, {
                        datasource: "User", as: "managedby", required: false, order: [], attributes: [], where: {},
                    }, {
                        datasource: "User",
                        as: "defaultassignee",
                        required: false,
                        order: [],
                        attributes: [],
                        where: {},
                    },]
                },
            })
            .then((res) => {
                console.log(res?.data?.data?.results?.[0]);
                setWorkspaceDetail(res?.data?.data?.results?.[0]);

            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (<div>
        <div className="max-h-[calc(100svh-4em)] overflow-y-auto">
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger
                    className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        {WorkspaceId && <> <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                <Link to={`/workspace/${WorkspaceId}/views?tab=views`}>Workspace</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/> </>}


                        <BreadcrumbItem>
                            <BreadcrumbPage>User Profile</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="flex items-center gap-3">

                    <div>
                        <CardTitle className="group flex items-center gap-2 text-lg">

                            {workspaceDetail.name} - <span
                            className="text-muted-foreground">#{workspaceDetail?.workspaceId}</span>

                        </CardTitle>
                        <CardDescription>
                            Workspace Profile
                        </CardDescription>
                    </div>


                </div>
                <div className="ml-auto sm:flex-initial">

                    <Link to={`/workspace/${WorkspaceId}/settings/general/edit`}>
                        <Button
                            className="h-8 gap-1 "
                        >Edit</Button>
                    </Link>
                </div>
            </CardHeader>

            <div className="p-4"><Card className="rounded-none my-2">
                <CardHeader>

                    <CardTitle className="text-lg font-normal">General Information</CardTitle>
                </CardHeader>
                <Separator className="mb-3"/>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-2">
                            <p className="text-muted-foreground">Description</p>
                            <h5>{workspaceDetail?.description || "N/A"}</h5>
                        </div>
                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                            <p className="text-muted-foreground">Status</p>
                            <h5>{workspaceDetail?.status || "N/A"}</h5>
                        </div>
                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                            <p className="text-muted-foreground">Website url</p>
                            <h5>{workspaceDetail?.url || "N/A"}</h5>
                        </div>
                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                            <p className="text-muted-foreground">Created at</p>
                            <h5>{workspaceDetail?.w_created_at ? new Date(workspaceDetail.w_created_at).toLocaleString() : "N/A"}</h5>
                        </div>
                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                            <p className="text-muted-foreground">Last updated at</p>
                            <h5>{workspaceDetail?.w_updated_at ? new Date(workspaceDetail.w_updated_at).toLocaleString() : "N/A"}</h5>
                        </div>
                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                            <p className="text-muted-foreground">Created By</p>
                            <h5>{workspaceDetail?.createdby?.firstName || "N/A"}</h5>
                        </div>
                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                            <p className="text-muted-foreground">Managed By</p>
                            <h5>{workspaceDetail?.managedby?.firstName || "N/A"}</h5>
                        </div>
                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                            <p className="text-muted-foreground">Default Assignee</p>
                            <h5>{workspaceDetail?.defaultassignee?.firstName || "N/A"}</h5>
                        </div>
                    </div>

                </CardContent>
            </Card>
            </div>
        </div>


    </div>);
}

export default WorkspaceGeneralSettings;
