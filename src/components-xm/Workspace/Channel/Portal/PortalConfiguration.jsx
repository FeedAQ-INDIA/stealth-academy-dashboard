import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
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
import {Terminal} from "lucide-react";
import {useToast} from "@/components/hooks/use-toast.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import ContextConfigSearchModule from "@/components-xm/Workspace/Modules/ContextConfigSearchModule.jsx";
import axiosConn from "@/axioscon.js";

function PortalConfiguration() {
    const {toast} = useToast();
    const navigate = useNavigate();
    const { WorkspaceId, LayoutId } = useParams();
    const [portalDetail, setPortalDetail] = useState({});

    const fieldConfigSchema = z.object({
         portalName: z.string().min(3, "Portal Group Name is required"),
        portalDescription: z.string().optional(),
     })

    const form = useForm({
        resolver: zodResolver(fieldConfigSchema),
        defaultValues: {portalName: "", portalDescription: "", },
    });

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
            form.reset({

                portalName: resVal?.portalName || "",
                portalDescription:resVal?.portalDescription || "",

            });
            setPortalDetail(resVal || {})

        }).catch(err => {
            console.log(err)
        });
    }

    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createEditPortal', {
            ...(portalDetail && portalDetail.portalId && {portalId : portalDetail.portalId}),
            portalName : data.portalName,
            portalDescription: data.portalDescription,
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId,
        }).then(res => {
            console.log(res)
            toast({
                title: res.data.data,
            });
            form.reset();
            fetchPortalDetail();
        }).catch(err => {
            toast({
                title: "Request failed!",
            });
        });
    }



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
                <CardTitle className="text-lg">Portal Configuration</CardTitle>
                <div className="ml-auto sm:flex-initial">


                </div>
            </CardHeader>

            <div className="flex flex-col gap-4 p-4">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6"
                    >
                        <div className="grid w-full   items-center gap-3 my-4">
                            <FormField
                                control={form.control}
                                name="portalName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Portal Group Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Portal Group Name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid w-full   items-center gap-3 my-4">
                            <FormField
                                control={form.control}
                                name="portalDescription"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Portal Group Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type your Portal Group description here."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid w-full   items-center gap-3 my-4">
                            <div className="flex gap-2">
                                <Button type="button" onClick={()=> form.reset()}>
                                    Reset
                                </Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </div>
                    </form>
                </Form>



            </div>
        </>)

}


export default PortalConfiguration;