import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    BreadcrumbItem, BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Label} from "@/components/ui/label.jsx";
import axiosConn from "@/axioscon.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.jsx";
import {useToast} from "@/components/hooks/use-toast.js";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaProjectDiagram } from "react-icons/fa";
import {Link, useParams} from "react-router-dom";
import {Textarea} from "@/components/ui/textarea.jsx";
import {CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useAuthStore} from "@/zustland/store.js";
import ContextConfigSearchModule from "@/components-xm/Workspace/Modules/ContextConfigSearchModule.jsx";
import UserSearchModule from "@/components-xm/Workspace/Modules/UserSearchModule.jsx";

function EditWorkspaceGeneralSettings() {
    const { WorkspaceId} = useParams();
    const [workspaceDetail, setWorkspaceDetail] = useState([]);
    const {toast} = useToast();
    const {
        workspaceData,
        setWorkspaceData,
 
    } = useAuthStore();

    const workspaceSchema = z.object({
        workspaceName: z.string().min(3, "Workspace name is required"),
        workspaceStatus: z.string().min(3, "Workspace status is required"),
        workspaceUrl: z.string().min(3, "Workspace url is required"),
        workspaceDescription: z.string().optional(),
        workspaceCreatedBy: z.string().optional(),
        workspaceDefaultAssignee: z.string().optional(),
        workspaceManagedBy: z.string().optional(),
     });

    const workspaceForm = useForm({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            workspaceName: "",
            workspaceStatus: "",
            workspaceUrl: "",
            workspaceDescription: "",
            workspaceCreatedBy: "",
            workspaceDefaultAssignee: "",
            workspaceManagedBy: "",
        },
    });

    const {watch, reset, handleSubmit, control, formState} = workspaceForm;

    useEffect(() => {
        fetchWorkspaceDetail();
    }, []);

    const fetchWorkspaceDetail = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 20,
                offset: 0,
                getThisData: {
                    datasource: "Workspace",
                    order: [],
                    attributes: [],
                    where: {
                        workspaceId: WorkspaceId,
                    },
                },
            })
            .then((res) => {
                console.log(res?.data?.data?.results?.[0]);
                setWorkspaceDetail(res?.data?.data?.results?.[0]);
                const workspaceDetail = res?.data?.data?.results?.[0];
                if (workspaceDetail) {
                    workspaceForm.reset({
                        workspaceName:workspaceDetail.name || "",
                        workspaceStatus: workspaceDetail.status || "",
                        workspaceUrl:workspaceDetail.url || "",
                        workspaceDescription: workspaceDetail.description || "",
                        workspaceCreatedBy:workspaceDetail?.createdBy   || "",
                        workspaceDefaultAssignee: workspaceDetail?.defaultAssignee  || "",
                        workspaceManagedBy: workspaceDetail?.managedBy  || "",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const watchedValues = watch();

    // Compare current form values with userDetail to determine if they are different
    const isFormChanged =
        workspaceDetail &&
        Object.keys(watchedValues).some(
            (key) => watchedValues[key] !== (workspaceDetail[key] || "")
        );

    const onSubmit = (data) => {
        axiosConn
            .post("http://localhost:3000/editWorkspace", {
                workspaceId: workspaceData?.workspaceId,
                name: data.workspaceName,
               status: data.workspaceStatus ,
                url:data.workspaceUrl,
                description: data.workspaceDescription,
                createdBy: data.workspaceCreatedBy,
                defaultAssignee: data.workspaceDefaultAssignee,
                managedBy:data?.workspaceManagedBy,
             })
            .then((res) => {
                console.log(res?.data);
                toast({
                    title: "Workspace Updated Successfully",
                    description:
                        " Workspace Updated Successfully",
                });
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "You submitted the following values:",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(err, null, 2)}</code>
            </pre>
                    ),
                });
            });
    };

    return (<div>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                <Link to={`/workspace/${WorkspaceId}/settings/general?tab=general`}>Workspace Profile</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block"/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Edit Workspace Profile</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">
                    <Button
                        size="sm"
                    >EDIT</Button>
                </div>
            </header>

            <div className="p-4">
                <div>

                    <div className="p-4 w-4/6 mx-auto ">
                        {/*<div className="items-center my-6">*/}
                        {/*    <Avatar className="mx-auto h-16 w-16 md:h-28 md:w-28 shadow-md">*/}
                        {/*        <AvatarFallback className="text-lg md:text-3xl">*/}
                        {/*            <FaProjectDiagram/>*/}
                        {/*        </AvatarFallback>*/}
                        {/*    </Avatar>*/}
                        {/*</div>*/}
                        <Form {...workspaceForm}>
                            <form
                                onSubmit={workspaceForm.handleSubmit(onSubmit)}
                                className="w-full"
                            >
                                {" "}
                                <div className=" py-4 grid grid-cols-1 gap-6">


                                    <div className="grid w-full items-center gap-3  ">
                                        <FormField
                                            control={workspaceForm.control}
                                            name="workspaceName"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Workspace Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter Workspace Name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-3  ">
                                        <FormField
                                            control={workspaceForm.control}
                                            name="workspaceUrl"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Workspace Url</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter Workspace Url"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-3  ">
                                        <FormField
                                            control={workspaceForm.control}
                                            name="workspaceDefaultAssignee"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Workspace Default Assignee</FormLabel>
                                                    <FormControl>

                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}

                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a Default Assignee"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {workspaceUsers.map(m => (<SelectItem key={m.userId} value={`${m.userId}`}>{m.firstName}</SelectItem>))}
                                                             </SelectContent>
                                                        </Select>
                                                    </FormControl>

                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-3  ">
                                        <FormField
                                            control={workspaceForm.control}
                                            name="workspaceManagedBy"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Workspace Managed By</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a Default Assignee"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {workspaceUsers.map(m => (<SelectItem key={m.userId} value={`${m.userId}`}>{m.firstName}</SelectItem>))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-3  ">
                                        <FormField
                                            control={workspaceForm.control}
                                            name="workspaceCreatedBy"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Workspace Created By</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a Default Assignee"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {workspaceUsers.map(m => (<SelectItem key={m.userId} value={`${m.userId}`}>{m.firstName}</SelectItem>))}
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
                                            control={workspaceForm.control}
                                            name="workspaceCreatedBy"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Layout Context Config</FormLabel>
                                                    <FormControl>
                                                        {/*<UserSearchModule initialValue={teamDetail?.users} onChange={(updatedLabels) => setSelectedMembers(updatedLabels)} />*/}
                                                        <UserSearchModule initialValue={field.value} onChange={(updatedLabels) => field.onChange(updatedLabels?.[0] || '')} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-3  ">
                                        <FormField
                                            control={workspaceForm.control}
                                            name="workspaceDescription"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Workspace Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Enter Workspace Description"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid w-full   items-center gap-3 ">
                                        <Label>Created at</Label>
                                        <Input
                                            placeholder="Created at"
                                            value={workspaceDetail?.w_created_at}
                                            readonly
                                        />
                                    </div>
                                    <div className="grid w-full   items-center gap-3 ">
                                        <Label>Updated at</Label>
                                        <Input
                                            placeholder="Updated at"
                                            value={workspaceDetail?.w_updated_at}
                                            readonly
                                        />
                                    </div>


                                </div>
                                {isFormChanged && (
                                    <div className="flex gap-2 ">
                                        <Button
                                            onClick={() =>
                                                workspaceForm.reset({
                                                    workspaceName: orgDetail.workspaceName || "",
                                                    orgEmail: orgDetail.orgEmail || "",
                                                    orgNumber: orgDetail.orgNumber || "",
                                                    orgHeadCount: orgDetail.orgHeadCount || "",
                                                    orgDomain: orgDetail.orgDomain || "",
                                                })
                                            }
                                        >
                                            Reset
                                        </Button>
                                        <Button type="submit">Update</Button>
                                    </div>
                                )}
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditWorkspaceGeneralSettings;
