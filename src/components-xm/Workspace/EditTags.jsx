import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {useToast} from "@/components/hooks/use-toast.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Label} from "@/components/ui/label.jsx";


function EditTags() {
    const {WorkspaceId, TagsId} = useParams();
    const [tagDetail, setTagDetail] = useState({});

    const {toast} = useToast();
    const navigate = useNavigate();

    const createTagsSchema = z.object({
         tagDescription: z.string().optional(),
        tagStatus: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
    });
    const createTagsForm = useForm({
        resolver: zodResolver(createTagsSchema),
        defaultValues: {  tagDescription: "", tagStatus: ""},
    });

    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createEditTags', {
            ...(TagsId && {tagId: TagsId}),
            tagDescription: data.tagDescription,
            tagStatus: data.tagStatus,
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId
        }).then(res => {
            toast({
                title: "Tags updated successfully!",
            });
            navigate(`/workspace/${WorkspaceId}/tags?tab=tags`);
        }).catch(err => {
            toast({
                title: "Tags updation failed!",
            });
        });

    }

    useEffect(() => {
        fetchTagsDetail();
    }, []);

    const fetchTagsDetail = () => {
        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 1, offset: 0, getThisData: {
                datasource: "Tags", order: [], attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"), tagId: TagsId
                }, include: [{
                    datasource: "User", as: "createdby", required: false, order: [], attributes: [], where: {},
                },],
            },
        }).then(res => {
            console.log(res.data)
            setTagDetail(res?.data?.data?.results?.[0]);
            const tagsDetail = res?.data?.data?.results?.[0];
            if (tagsDetail) {
                createTagsForm.reset({
                    tagDescription: tagsDetail?.tagDescription,
                    tagStatus: tagsDetail?.tagStatus,
                });
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (<div>
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
                            <Link to={`/workspace/${WorkspaceId}/tags?tab=tags`}>Tags & Services</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/>

                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit Tags</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial"></div>
        </header>

        {/*<CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">*/}
        {/*    <div className=" ">*/}
        {/*        <CardTitle className="text-lg">Edit Tags & Services</CardTitle>*/}
        {/*        <CardDescription>Reach to mass audience</CardDescription>*/}
        {/*    </div>*/}

        {/*</CardHeader>*/}

        <CardHeader className=" flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">
            <div>
                <CardTitle className="text-lg">Edit Tag</CardTitle>
                <CardDescription>#{tagDetail?.tagId} - {tagDetail?.tagName}</CardDescription>
            </div>


            <div className="ml-auto sm:flex-initial">
                {/*<Link to={`/workspace/${WorkspaceId}/tags/${TagsId}`}>*/}
                {/*    <Button size="sm">*/}
                {/*        View Detail*/}
                {/*    </Button>*/}
                {/*</Link>*/}
            </div>

        </CardHeader>


        <div className="flex flex-col gap-4 p-4 ">

            <Form {...createTagsForm}>
                <form
                    onSubmit={createTagsForm.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                >
                    <div>
                        <div className="py-4">
                            <div className="grid w-full   items-center gap-3 my-4">

                                <Label>Tag Name</Label>
                                <Input placeholder="Tag name" value={tagDetail?.tagName} disabled/>
                            </div>

                            <div className="grid w-full   items-center gap-3 my-4">
                                <FormField
                                    control={createTagsForm.control}
                                    name="tagDescription"
                                    render={({field}) => (<FormItem>
                                        <FormLabel>Tag Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type your Tag description here."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3 my-4">
                                <FormField
                                    control={createTagsForm.control}
                                    name="tagStatus"
                                    render={({field}) => (<FormItem>
                                        <FormLabel>Tag Status</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Tag Status"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-2">
                            <Button type="button" onClick={() => createTagsForm.reset()}>
                                Reset
                            </Button>
                            <Button type="submit">Update</Button>
                        </div>
                    </div>
                </form>
            </Form>

        </div>
    </div>);
}

export default EditTags;
