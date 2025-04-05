import {CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {toast, useToast} from "@/components/hooks/use-toast.js";
import {Button} from "@/components/ui/button.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import MultiSelectTagComponent from "@/components-xm/Workspace/Modules/MultiSelectTagComponent.jsx";
import {Label} from "@/components/ui/label.jsx";
import UserSearchModule from "@/components-xm/Workspace/Modules/UserSearchModule.jsx";
import LayoutSearchModule from "@/components-xm/Workspace/Modules/LayoutSearchModule.jsx";
import UserStatusSearchModule from "@/components-xm/Workspace/Modules/UserStatusSearchModule.jsx";




function CreateUserStatusGroup() {
    const {toast} = useToast();
    const navigate = useNavigate();
    const { WorkspaceId } = useParams();
    const [selectedMembers, setSelectedMembers] = useState([]);

    const userStatusGroupSchema = z.object({
        name: z.string()
            .min(1, "Name must be at least one character long.")
            .max(63, "Name must be less than 64 characters."),
        statusList: z.array(z.number()).min(1, "At least one layout must be added"),
    });
    const form = useForm({
        resolver: zodResolver(userStatusGroupSchema),
        defaultValues: {name: "", statusList: []},
    });

    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createEditUserStatusGroup', {
            userStatusGroupName: data.name,
            userStatusList: data.statusList,
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId,
        }).then(res => {
            toast({
                title: res?.data?.data,
            });
            form.reset();

        }).catch(err => {
            toast({
                title: "User Status creation/editing failed!",
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
                                                <FormLabel>User Status Group Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="User Status Group name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full   items-center gap-3 my-4">
                                    <FormField
                                        control={form.control}
                                        name="statusList"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Select User Status</FormLabel>
                                                <FormControl>
                                                     <UserStatusSearchModule value={field.value}  onChange={  field.onChange }  />

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

export default CreateUserStatusGroup;
