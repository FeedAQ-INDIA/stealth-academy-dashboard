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
import CreateTeam from "@/components-xm/Workspace/WorkspaceSettings/CreateTeam.jsx";
import TeamTable from "@/components-xm/Workspace/WorkspaceSettings/TeamTable.jsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axiosConn from "@/axioscon.js";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Label} from "@/components/ui/label.jsx";
import UserSearchModule from "@/components-xm/Workspace/Modules/UserSearchModule.jsx";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {  useToast} from "@/components/hooks/use-toast.js";
import {useNavigate, useParams} from "react-router-dom";
import EditCustomField from "@/components-xm/Workspace/WorkspaceSettings/EditCustomField.jsx";
import ContextConfigModule from "@/components-xm/Workspace/Modules/ContextConfigModule.jsx";
import StatusConfigModule from "@/components-xm/Workspace/Modules/StatusConfigModule.jsx";
import ContextConfigSearchModule from "@/components-xm/Workspace/Modules/ContextConfigSearchModule.jsx";
import EditRecordDataField from "@/components-xm/Workspace/WorkspaceSettings/Layout/EditRecordDataField.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter} from "@/components/ui/table.jsx";
import {Pencil, Trash2} from "lucide-react";


function CreateLayout() {
    const {toast} = useToast();
    const navigate = useNavigate();
    const { WorkspaceId, LayoutId } = useParams();
     const [layoutDetail, setLayoutDetail] = useState({});

    const fieldConfigSchema = z.object({
        name: z.string().min(3, "Layout Name is required"),
        description: z.string().optional(),
        contextConfigId:  z.array(z.number()).min(1, "At least one layout must be added"),
        statusConfigId: z.number().nullable(),
        layoutType: z.enum(["RECORD", "STAKEHOLDER"]),

        status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
    })

    const form = useForm({
        resolver: zodResolver(fieldConfigSchema),
        defaultValues: {name: "", description: "", status: "ACTIVE",contextConfigId:[], statusConfigId:null, layoutType:"RECORD"},
    });

    useEffect(() => {
             fetchLayoutDetail()
     }, []);

    const fetchLayoutDetail = () => {
        if(LayoutId) {

            axiosConn.post('http://localhost:3000/searchRecord', {
                limit: 5, offset: 0, getThisData: {
                    datasource: "Layout", attributes: [], where: {
                        workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                        layoutId: LayoutId
                    },
                    include:[
                        {datasource: "ContextConfiguration", as: "configdetail"},
                     ]
                },
            }).then(res => {
                console.log(res)
                const resVal = res?.data?.data?.results?.[0]
                form.reset({

                    name: resVal?.layoutName || "",
                    description:resVal?.layoutDescription || "",
                    contextConfigId: resVal?.configdetail?.map(a => a?.contextConfigurationId) || [],
                    statusConfigId: resVal?.statusConfigurationId || null,
                    layoutType: resVal?.layoutType || "",
                     status: resVal?.layoutStatus || "",
                });
                setLayoutDetail(resVal)

            }).catch(err => {
                console.log(err)
            });
        }
    }

    function onSubmit(data) {
        console.log(data)
         axiosConn.post('http://localhost:3000/createLayout', {
            contextConfigurationIdList: data?.contextConfigId,
            layoutStatus : data.status,
            layoutName: data.name,
            layoutDescription : data.description,
            layoutType: data.layoutType,
            statusConfigurationId: data.statusConfigId,
             orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId,
         ...(LayoutId && {layoutId:LayoutId}),
         }).then(res => {
            console.log(res)
            toast({
                title: res.data.data,
            });
            form.reset();
             fetchLayoutDetail();
        }).catch(err => {
            toast({
                title: "Request failed!",
            });
        });
    }


    const layoutType = form.watch('layoutType')
    useEffect(()=>{
        if(layoutType != 'RECORD'){
             form.setValue('statusConfigId',null)
         }
    },[layoutType])

    return (
        <>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>{ LayoutId ?  'Edit Layout' : 'Create Layout'}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <CardHeader className="   bg-muted/50">
                <CardTitle className="text-lg">{ LayoutId ?  layoutDetail?.layoutName : 'Create Layout'}</CardTitle>
                <CardDescription>{ LayoutId ?  'Edit Layout' : 'Create Layout'}</CardDescription>
            </CardHeader>

            <div className="flex flex-col gap-4  ">

                <div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full space-y-6"
                        >
                            <CardContent>
                                <div className="py-4">

                                    <Card className="rounded-none shadow-md my-4">
                                        <CardHeader className="bg-muted/50">
                                            <CardTitle className="text-lg font-normal">General Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid w-full   items-center gap-3 my-4">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Layout Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Layout name" {...field} />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid w-full   items-center gap-3 my-4">
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Layout Description</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Type your Layout description here."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid w-full   items-center gap-3 my-4">
                                                <FormField
                                                    control={form.control}
                                                    name="status"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Layout Status</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a Layout Status"/>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid w-full   items-center gap-3 my-4">
                                                <FormField
                                                    control={form.control}
                                                    name="layoutType"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Layout Type</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a Layout Type"/>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="RECORD">Record</SelectItem>
                                                                        <SelectItem value="STAKEHOLDER">Stakeholder</SelectItem>
                                                                     </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid w-full   items-center gap-3 my-4">
                                                <FormField
                                                    control={form.control}
                                                    name="contextConfigId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Layout Context Config</FormLabel>
                                                            <FormControl>
                                                                <ContextConfigSearchModule value={field.value} onChange={field.onChange} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {layoutType == 'RECORD' &&

                                                <div className="grid w-full   items-center gap-3 my-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="statusConfigId"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Layout Record Status Config</FormLabel>
                                                                <FormControl>
                                                                    <StatusConfigModule value={field.value} onChange={field.onChange} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                            }


                                        </CardContent>
                                    </Card>



                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex gap-2">
                                    <Button type="button" onClick={()=>fetchLayoutDetail()}>
                                        Reset
                                    </Button>
                                    <Button type="submit">Create</Button>
                                </div>
                            </CardFooter>
                        </form>
                    </Form>


                </div>
            </div>
        </>)

}


export default CreateLayout;