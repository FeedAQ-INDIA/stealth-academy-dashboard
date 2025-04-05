import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/hooks/use-toast.js";
import { Button } from "@/components/ui/button.jsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.jsx";
import React, {useEffect} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosConn from "@/axioscon.js";
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import LayoutSearchModule from "@/components-xm/Workspace/Modules/LayoutSearchModule.jsx";

function CreateAPIChannel() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { WorkspaceId, APIChannelId } = useParams();

    // ✅ Updated Schema with better error messages
    const APIchema = z.object({
        name: z.string().min(3, "API name must be at least 3 characters"),
        description: z.string().optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
        layoutAdded: z.array(z.number()).min(1, "At least one layout must be added"),
    });

    const form = useForm({
        resolver: zodResolver(APIchema),
        defaultValues: { name: "", description: "", status: "ACTIVE", layoutAdded: [] },
    });

    // ✅ Using async/await for better readability
    const onSubmit = async (data) => {
        try {
            const response = await axiosConn.post("http://localhost:3000/createEditAPIChannel", {
                apiChannelName: data.name,
                apiChannelDescription: data.description,
                apiChannelStatus: data.status,
                ...(APIChannelId && { apiChannelId: APIChannelId }),
                orgId: localStorage.getItem("currentOrg"),
                layoutId: data.layoutAdded?.[0],
                workspaceId: WorkspaceId,
            });

            toast({
                title: response?.data?.data || "API channel created successfully",
            });

            form.reset({ name: "", description: "", status: "ACTIVE", layoutAdded: [] });
        } catch (err) {
            toast({
                title: err.response?.data?.message || "API creation/editing failed!",
                variant: "destructive",
            });
        }
    };


    useEffect(() => {
        console.log(form.getValues())
    },[])

    return (
        <div>
            <header className="flex h-12 items-center gap-2 border-b px-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink>
                                <Link to={`/workspace/${WorkspaceId}/settings/channel/api-builder?tab=api-builder&limit=10&offset=0`}>
                                    API Builder
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create API Channel</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <CardHeader className="flex items-start bg-muted/50">
                <CardTitle className="text-lg">Create API Channel</CardTitle>
            </CardHeader>

            <div className="p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <CardContent>
                            <div className="py-4">
                                <div className="grid gap-3 my-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>API Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="API name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3 my-4">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>API Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Type your API description here." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3 my-4">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select API Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3 my-4">
                                    <FormField
                                        control={form.control}
                                        name="layoutAdded"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Layout Added</FormLabel>
                                                <FormControl>
                                                    <LayoutSearchModule value={field.value}  onChange={  field.onChange }  />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <div className="flex gap-2">
                                <Button type="button" onClick={() => form.reset({ name: "", description: "", status: "ACTIVE", layoutAdded: [] })}>
                                    Reset
                                </Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </CardFooter>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default CreateAPIChannel;
