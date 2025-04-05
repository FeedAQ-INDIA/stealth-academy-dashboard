import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
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
import {Link, useNavigate, useParams} from "react-router-dom";
import CreateProduct from "@/components-xm/Workspace/CreateProduct.jsx";
import ProductsTable from "@/components-xm/Workspace/ProductsTable.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Info, Pencil, Terminal, Trash2} from "lucide-react";
import {toast, useToast} from "@/components/hooks/use-toast.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axiosConn from "@/axioscon.js";
 import ContextConfigSearchModule from "@/components-xm/Workspace/Modules/ContextConfigSearchModule.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import CreateEditPortalGroup from "@/components-xm/Workspace/Channel/Portal/CreateEditPortalGroup.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";

function PortalGroup() {
    const { WorkspaceId } = useParams();
    const [portalGroupDetail, setPortalGroupDetail] = useState([]);
    const [portalDetail, setPortalDetail] = useState([]);

    useEffect(() => {
        fetchPortalGroupDetail();
    }, [WorkspaceId]);

    useEffect(() => {
        fetchPortalDetail();
    }, []);

    const fetchPortalDetail= () => {
        axiosConn.post('http://localhost:3000/searchRecord', {
            limit: 5, offset: 0, getThisData: {
                datasource: "WorkspacePortal", attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                }
            },
        }).then(res => {
            console.log(res)
            const resVal = res?.data?.data?.results?.[0]

            setPortalDetail(resVal || {})

        }).catch(err => {
            console.log(err)
        });
    }

    const fetchPortalGroupDetail = async () => {
        try {
            const res = await axiosConn.post('http://localhost:3000/searchRecord', {
                limit: 30,
                offset: 0,
                getThisData: {
                    datasource: "PortalGroup",
                    attributes: [],
                    where: {
                        workspaceId: WorkspaceId,
                        orgId: localStorage.getItem("currentOrg"),
                    },
                },
            });

            setPortalGroupDetail(res?.data?.data?.results || []);
        } catch (error) {
            console.error("Error fetching portal group details:", error);
        }
    };

    const deletePortalGroup =   (portalGroupId) => {
        axiosConn.post('http://localhost:3000/deletePortalGroup',
                { workspaceId: WorkspaceId,
                    orgId: localStorage.getItem("currentOrg"),
                    portalId : portalDetail.portalId, portalGroupId: portalGroupId})
    .then(res => {
console.log(res.data)
        toast({
            title: 'Portal Group Deleted Successfully'
        });
        fetchPortalGroupDetail()
             }).catch(err => {
                 console.log(err)
             })


    };


    return (
        <>
            {/*<header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">*/}
            {/*    <SidebarTrigger className="-ml-1"/>*/}
            {/*    <Separator orientation="vertical" className="mr-2 h-4"/>*/}
            {/*    <Breadcrumb>*/}
            {/*        <BreadcrumbList>*/}
            {/*            <BreadcrumbItem>*/}
            {/*                <BreadcrumbPage>Portal</BreadcrumbPage>*/}
            {/*            </BreadcrumbItem>*/}
            {/*        </BreadcrumbList>*/}
            {/*    </Breadcrumb>*/}
            {/*    <div className="ml-auto sm:flex-initial">*/}


            {/*    </div>*/}
            {/*</header>*/}

            <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-center bg-muted/50">
                <CardTitle className="text-lg">Portal Group</CardTitle>
                <div className="ml-auto sm:flex-initial">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button >
                                Create Portal Group
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Create Portal Group</SheetTitle>

                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <CreateEditPortalGroup portalId={portalDetail.portalId}  />
                            </div>

                        </SheetContent>
                    </Sheet>

                </div>
            </CardHeader>

            <div className="flex flex-col gap-4 p-4">
                <Alert className="shadow-sm my-4">
                    <Info className="h-4 w-4"/>
                    <AlertDescription>
                        Help customers find the right forms quickly by organizing your portal groups.
                    </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 gap-6">
                    <Table className="border shadow-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead>PORTAL GROUP</TableHead>
                                <TableHead>DESCRIPTION</TableHead>
                                <TableHead className="text-right">ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {portalGroupDetail?.map((a) => (
                                <TableRow key={a.portalGroupId}>
                                    <TableCell className="font-medium">{a.portalGroupName}</TableCell>
                                    <TableCell className="font-medium">{a?.portalGroupDescription}</TableCell>
                                    <TableCell className="flex gap-2 justify-end">
                                        {/* Edit Button & Modal */}
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="outline"><Pencil /></Button>
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>Edit Portal Group</SheetTitle>
                                                    <SheetDescription>
                                                        Make changes to your profile here. Click save when you're done.
                                                    </SheetDescription>
                                                </SheetHeader>
                                                <div className="grid gap-4 py-4">
                                                    <CreateEditPortalGroup
                                                        portalId={portalDetail.portalId}
                                                        groupId={a.portalGroupId}
                                                    />
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                        {/* Delete Button */}
                                        <Button variant="outline" onClick={()=>deletePortalGroup(a.portalGroupId)}><Trash2 /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </div>
            </div>
        </>
    );
}

export default PortalGroup

