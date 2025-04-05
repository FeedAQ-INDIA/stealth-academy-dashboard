import {CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useToast} from "@/components/hooks/use-toast.js";
import {Button} from "@/components/ui/button.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import axiosConn from "../../axioscon.js";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";




function CreateTags() {
    const {toast} = useToast();
    const navigate = useNavigate();
    const { WorkspaceId } = useParams();

    const tagsSchema = z.object({
        name: z.string().min(3, "Tags name is required"),
        description: z.string().optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
    });
    const form = useForm({
        resolver: zodResolver(tagsSchema),
        defaultValues: {name: "", description: "", status: "ACTIVE"},
    });

    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createEditTags', {
            tagName: data.name,
            tagDescription: data.description,
            tagStatus: data.status,
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId
        }).then(res => {
            toast({
                title: res?.data?.data,
            });
            form.reset();

        }).catch(err => {
            toast({
                title: "Tags creation/editing failed!",
            });
        });

    }

    return (
        <div className=" ">

            <div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6"
                    >
                        <CardContent>
                            <div className="py-4">
                                <div className="grid w-full   items-center gap-3 my-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Tags Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Tags name" {...field} />
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
                                                <FormLabel>Tags Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Type your Tags description here."
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
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Tags Status"/>
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
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-2">
                                <Button type="button" onClick={() => form.reset()}>
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

export default CreateTags;
