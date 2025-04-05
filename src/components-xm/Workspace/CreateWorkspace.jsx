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
import {useNavigate} from "react-router-dom";

function CreateWorkspace() {
    const {toast} = useToast();
    const navigate = useNavigate();

    const workspaceSchema = z.object({
        name: z.string().min(3, "Workspace name is required"),
        description: z.string().optional(),
        status: z.enum(["active", "inactive", "archived"]),
    });
    const form = useForm({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {name: "", description: "", status: "active"},
    });

    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createWorkspace', {
            name: data.name,
            description: data.description,
            status: data.status,
            orgId: localStorage.getItem("currentOrg")
        }).then(res => {
            toast({
                title: "Workspace created successfully!",
            });
            navigate("/workspace");
        }).catch(err => {
            toast({
                title: "Workspace creation failed!",

            });
        });

    }

    return (
        <div className=" ">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                 <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>Create Workspace</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>
            <div>
                <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                        <CardTitle className="text-lg">Create Workspace</CardTitle>
                        <CardDescription>Reach to mass audience</CardDescription>
                    </div>
                </CardHeader>
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
                                                <FormLabel>Workspace Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Workspace name" {...field} />
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
                                                <FormLabel>Workspace Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Type your Workspace description here."
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
                                                            <SelectValue placeholder="Select a Workspace Status"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                            <SelectItem value="archived">Archived</SelectItem>
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

export default CreateWorkspace;
