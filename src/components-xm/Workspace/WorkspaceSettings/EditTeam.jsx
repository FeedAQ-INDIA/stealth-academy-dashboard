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
 import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import MultiSelectTagComponent from "@/components-xm/Workspace/Modules/MultiSelectTagComponent.jsx";
import {Label} from "@/components/ui/label.jsx";
import UserSearchModule from "@/components-xm/Workspace/Modules/UserSearchModule.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";




function EditTeam() {
    const {toast} = useToast();
    const navigate = useNavigate();
    const { WorkspaceId, TeamId } = useParams();
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [teamDetail, setTeamDetail] = useState({});

    const teamSchema = z.object({
        name: z.string().min(3, "Team name is required"),
        description: z.string().optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
    });
    const form = useForm({
        resolver: zodResolver(teamSchema),
        defaultValues: {name: "", description: "", status: ""},
    });

    useEffect(() => {
        fetchTeamDetail();
    }, []);

    const fetchTeamDetail = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 5, offset: 0, getThisData: {
                    datasource: "Team",  attributes: [], where: {
                        workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                        teamId: TeamId
                    }, include: [{
                        datasource: "User", as: "users", order: [], attributes: [], where: {},
                    },]
                },
            })
            .then((res) => {
                console.log(res.data);
                setTeamDetail(res.data?.data?.results?.[0]);
                setSelectedMembers(res.data?.data?.results?.[0]?.users);
                const teamDetail = res?.data?.data?.results?.[0];
                if (teamDetail) {
                    form.reset({
                        name:teamDetail.teamName || "",
                        status: teamDetail?.teamStatus || "",
                        description: teamDetail.teamDescription || "",
                    });
                }
                console.log(form)
            })
            .catch((err) => {
                console.log(err);
            });
    };


    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createEditTeam', {
            teamId: teamDetail?.teamId,
            teamName: data.name,
            teamDescription: data.description,
            teamStatus: data.status,
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId,
            teamMembers : selectedMembers.map(a => a.userId)
        }).then(res => {
            toast({
                title: res?.data?.data,
            });
            form.reset()
            fetchTeamDetail();
        }).catch(err => {
            toast({
                title: "Team creation/editing failed!",
            });
        });

    }

    return (
        <div className=" ">
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
                                <Link to={`/workspace/${WorkspaceId}/settings/teams?tab=teams`}>Teams</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block"/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Edit Team</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            {/*<CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">*/}
            {/*    <div className=" ">*/}
            {/*        <CardTitle className="text-lg">Edit Product & Services</CardTitle>*/}
            {/*        <CardDescription>Reach to mass audience</CardDescription>*/}
            {/*    </div>*/}

            {/*</CardHeader>*/}

            <CardHeader className=" flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">
                <div>
                    <CardTitle className="text-lg">{teamDetail?.teamName} - <span className="text-muted-foreground">#{teamDetail?.teamId}  </span></CardTitle>
                    <CardDescription>Edit Team</CardDescription>
                </div>


            </CardHeader>

            <div className="flex flex-col gap-4 p-4 ">

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full "
                    >
                        <CardContent>
                            <div className="py-4">
                                <div className="grid w-full   items-center gap-3 my-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Team Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Team name" {...field} />
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
                                                <FormLabel>Team Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Type your Team description here."
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
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Team Status"/>
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
<Label>User/Members</Label>
                                <UserSearchModule initialValue={teamDetail?.users} onChange={(updatedLabels) => setSelectedMembers(updatedLabels)} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-2">
                                <Button type="button" onClick={() => form.reset()}>
                                    Reset
                                </Button>
                                <Button type="submit">Update</Button>
                            </div>
                        </CardFooter>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default EditTeam;
