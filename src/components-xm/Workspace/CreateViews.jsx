import React, { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import {
    ArrowDownUp,
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    File,
    Filter,
    Home,
    IdCard,
    LineChart,
    ListFilter,
    MoreVertical,
    Package,
    Package2,
    PackagePlus,
    PanelLeft,
    Plus,
    RadioTower,
    Search,
    Settings,
    ShieldCheck,
    ShieldX,
    ShoppingCart,
    Truck,
    Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge.jsx";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.jsx";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.jsx";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useState } from "react";
import {Link, NavLink, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import lodash from "lodash";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {useToast} from "@/components/hooks/use-toast.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";

function CreateViews() {
    const { WorkspaceId } = useParams();


    const {toast} = useToast();
    const navigate = useNavigate();

    const createViewSchema = z.object({
        viewName: z.string().min(3, "View name is required"),
        viewDescription: z.string().optional(),
        viewRule: z.string().min(3, "View Rule is required"),
    });
    const createViewForm = useForm({
        resolver: zodResolver(createViewSchema),
        defaultValues: {viewName: "", viewDescription: "", viewRule: ""},
    });

    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createView', {
            viewName: data.viewName,
            viewDescription: data.viewDescription,
            viewRule: data.viewRule,
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId
        }).then(res => {
            toast({
                title: "View created successfully!",
            });
            navigate(`/workspace/${WorkspaceId}/view?tab=view`);
        }).catch(err => {
            toast({
                title: "View creation failed!",

            });
        });

    }

    return (
        <div>
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
                                <Link to={`/workspace/${WorkspaceId}/view?tab=view`}>View</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block"/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create View</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">
                <div className=" ">
                    <CardTitle className="text-lg">Create View</CardTitle>
                    <CardDescription>Reach to mass audience</CardDescription>
                </div>

            </CardHeader>

            <div className="flex flex-col gap-4 p-4 ">

                <img className="h-1/2 w-1/2 mx-auto" src={`https://jira-frontend-bifrost.prod-east.frontend.public.atl-paas.net/assets/generic.28da7925.svg`}/>
                <Form {...createViewForm}>
                    <form
                        onSubmit={createViewForm.handleSubmit(onSubmit)}
                        className="w-full space-y-6"
                    >
                        <div>
                            <div className="py-4">
                                <div className="grid w-full   items-center gap-3 my-4">
                                    <FormField
                                        control={createViewForm.control}
                                        name="viewName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>View Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="View name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full   items-center gap-3 my-4">
                                    <FormField
                                        control={createViewForm.control}
                                        name="viewDescription"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>View Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Type your View description here."
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
                                        control={createViewForm.control}
                                        name="viewRule"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>View Rule</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Type your View rule here."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-2">
                                <Button type="button" onClick={() => form.reset()}>
                                    Reset
                                </Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </div>
                    </form>
                </Form>

            </div>
        </div>
    );
}

export default CreateViews;
