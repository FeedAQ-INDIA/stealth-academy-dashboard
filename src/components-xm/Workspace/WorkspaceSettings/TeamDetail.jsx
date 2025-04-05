import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";

function TeamDetail() {
    const {WorkspaceId, TeamId} = useParams();

    const [teamDetail, setTeamDetail] = useState(null);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 5, offset: 0, getThisData: {
                    datasource: "Team", attributes: [], where: {
                        workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"), teamId: TeamId
                    }, include: [{
                        datasource: "User", as: "users", order: [], attributes: [], where: {},
                    },]
                },
            })
            .then((res) => {
                console.log(res.data);
                setTeamDetail(res.data?.data?.results?.[0]);

            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (<>
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
                            <Link to={`/workspace/${WorkspaceId}/settings/teams?tab=teams`}>Teams</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{teamDetail?.teamName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial">
                <Link to={`/workspace/${WorkspaceId}/settings/teams/${TeamId}/edit`}>
                    <Button
                        className="h-8 gap-1 "
                    >Edit</Button>
                </Link>
            </div>
        </header>

        <CardHeader className="   bg-muted/50">
            <CardTitle className="text-lg">{teamDetail?.teamName} - #{teamDetail?.teamId}</CardTitle>
            <CardDescription>Team Detail</CardDescription>
        </CardHeader>

        <div className="flex flex-col gap-4 p-4">
            <div className=" ">

                <Card className="rounded-none my-4 shadow-md">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg font-normal">General Information</CardTitle>
                    </CardHeader>
                    <Separator className="mb-3"/>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-3">
                                <p className="text-muted-foreground">Description</p>
                                <h5>{teamDetail?.teamDescription || "N/A"}</h5>
                            </div>

                            <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                <p className="text-muted-foreground">Status</p>
                                <h5>{teamDetail?.teamStatus || "N/A"}</h5>
                            </div>

                            <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                <p className="text-muted-foreground">Created at</p>
                                <h5>{teamDetail?.team_created_at ? new Date(teamDetail.team_created_at).toLocaleString() : "N/A"}</h5>
                            </div>
                            <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                <p className="text-muted-foreground">Last updated at</p>
                                <h5>{teamDetail?.team_updated_at ? new Date(teamDetail.team_updated_at).toLocaleString() : "N/A"}</h5>
                            </div>
                        </div>

                    </CardContent>
                </Card>


                <Card className="rounded-none my-4 shadow-md">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg font-normal">Members</CardTitle>
                    </CardHeader>
                    <Separator className="mb-3"/>
                    <CardContent>
                        <div className="flex flex-col gap-4">

                            {teamDetail?.users?.map(a => (
                                     <div className="line-clamp-1 flex gap-2 p-4 items-center hover:bg-muted/50 border"
                                         title={a?.firstName}>
                                        <div
                                            className="  ">

                                            <AssigneeModule intialValue={a} uiType={'Avatar'} isEditable={false}/>

                                        </div>
                                        <div className="flex flex-col gap-0.5 leading-none  "
                                             title={a?.firstName}>
                                            <span>{a?.firstName}</span>
                                        </div>
                                        <div className="ml-auto">
                                           <p className="text-muted-foreground italic text-right">Since</p>  {a.created_date}  {a.created_time}
                                        </div>

                                </div>))}


                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    </>)

}


export default TeamDetail;