import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
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
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import CreateProduct from "@/components-xm/Workspace/CreateProduct.jsx";
import ProductsTable from "@/components-xm/Workspace/ProductsTable.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {ChevronLeft, ChevronRight, Terminal} from "lucide-react";
import PortalGroup from "@/components-xm/Workspace/Channel/Portal/PortalGroup.jsx";
import PortalConfiguration from "@/components-xm/Workspace/Channel/Portal/PortalConfiguration.jsx";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import CreateEditPortalGroup from "@/components-xm/Workspace/Channel/Portal/CreateEditPortalGroup.jsx";
import axiosConn from "@/axioscon.js";
 import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Pagination, PaginationContent, PaginationItem} from "@/components/ui/pagination.jsx";
import StakeholderDetail from "@/components-xm/Workspace/StakeholderDetail.jsx";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

function Portal() {
    const { WorkspaceId } = useParams();
    const [portalDetail, setPortalDetail] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        fetchPortalDetail();
    }, []);

    const fetchPortalDetail = () => {
        axiosConn.post('http://localhost:3000/searchRecord', {
            limit: 5, offset: 0, getThisData: {
                datasource: "WorkspacePortal", attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                },
                include: [
                    {datasource: 'PortalGroup', as: 'portalgroupdetail'}
                ]
            },
        }).then(res => {
            console.log(res)
            const resVal = res?.data?.data?.results?.[0]
            setPortalDetail(resVal || null);
            if(resVal){
                navigate(`/workspace/${WorkspaceId}/settings/channel/portal/portal-configuration?tab=portal`)
            }

        }).catch(err => {
            console.log(err)
        });
    }


    return (
        <><div  className="h-[calc(100svh-4em)]" style={{overflowY: 'hidden'}}>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>Portal</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>


            {/*<CardHeader className="flex md:flex-row sm:flex-col gap-4 items-center bg-muted/50">*/}
            {/*    <CardTitle className="text-lg">Portal</CardTitle>*/}
            {/*    <div className="ml-auto sm:flex-initial">*/}


            {/*    </div>*/}
            {/*</CardHeader>*/}

            {true   &&   <ResizablePanelGroup
                direction="horizontal"
                className="h-full  rounded-none border w-full"
            >
                <ResizablePanel defaultSize={20}>
                    <div className="col-span-1 bg-muted/50 border-r h-[calc(100svh-7em)] overflow-y-auto p-3">
                        <div className="mt-4 flex flex-col gap-2">
                            <Card className={`hover:shadow-md rounded-1 cursor-pointer  border-2 `}
                                  onClick={()=>navigate(`/workspace/${WorkspaceId}/settings/channel/portal/portal-configuration?tab=portal`)}>
                                <CardHeader className="p-3"><h3 className="text-sm font-medium">Configuration</h3>
                                </CardHeader>

                            </Card>


                            <Card className={`hover:shadow-md rounded-1 cursor-pointer  border-2  `}
                                  onClick={()=>navigate(`/workspace/${WorkspaceId}/settings/channel/portal/portal-group?tab=portal`)}>
                                <CardHeader className="p-3"><h3 className="text-sm font-medium">Group</h3>
                                </CardHeader>

                            </Card>


                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={80}>
                    <div  className="col-span-4 h-[calc(100svh-7em)] overflow-y-auto">
                        <Outlet/>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            }

            <div className="flex flex-col gap-4 p-4">


                {!portalDetail   &&     <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Portal Does Not Exist for this Workspace!</AlertTitle>
                    <AlertDescription>
                        You can add <Link to={`/workspace/${WorkspaceId}/settings/channel/portal/portal-configuration/create?tab=portal`}>click here</Link> to setup a portal
                    </AlertDescription>
                </Alert>  }
            </div>
        </div>
        </>)

}


export default Portal;