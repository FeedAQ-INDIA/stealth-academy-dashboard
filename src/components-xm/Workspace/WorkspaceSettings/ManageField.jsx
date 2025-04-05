import React from "react";
import {Search,} from "lucide-react";

import {Badge} from "@/components/ui/badge.jsx";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Link, useParams} from "react-router-dom";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";

function ManageField() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {WorkspaceId} = useParams();

    const InviteMemberSchema = z.object({
        email: z.string().refine((value) => value.split(",").every((email) => emailRegex.test(email)), // Simplified email validation
            {message: "One or more emails are invalid"}),
    });

    const form = useForm({
        resolver: zodResolver(InviteMemberSchema), defaultValues: {email: ""},
    });

    const onInviteSubmit = (data) => {

    }

    return (<div>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                            <Link to={`/ws/${WorkspaceId}`}>Workspace</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Manage Field</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial"></div>
        </header>

        <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">
            <div className=" ">
                <CardTitle className="text-lg">Workspace Manage Field</CardTitle>
                <CardDescription>Reach to mass audience</CardDescription>
            </div>
            <div className=" md:ml-auto flex items-center gap-1">
          <Button>Add Field</Button>
              </div>
        </CardHeader>

        <div className="flex flex-col gap-4 p-4 ">

            <div className="  w-full">
                <div className="flex items-center py-4">
                    <div className="relative ml-auto flex-1 md:grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full  bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                    </div>
                </div>
                <a className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent bg-white">
                    <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center">
                            <div className="flex items-center gap-2">
                                <div className="font-semibold line-clamp-2 ">
                                    avikumarshooters@gmail.com
                                </div>
                            </div>
                            <div className="ml-auto w-fit text-xs text-foreground whitespace-nowrap">
                                21-02-2024 12:00:30
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex items-center gap-2">
                                <div className="text-xs font-light">
                      <span>
                        <span className="font-light">Invited By{" - "}</span>
                        R. Madhavan
                      </span>
                                </div>
                            </div>
                            <div className="ml-auto text-xs text-foreground">
                                <div className="text-xs font-medium text-muted-foreground  whitespace-nowrap">
                                    User Id #989898
                                </div>
                                {" "}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground"></div>
                    <div className="flex items-center gap-2">
                        <Badge>Member</Badge>
                    </div>
                </a>
            </div>
        </div>
    </div>);
}

export default ManageField;
