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
import RecordTable from "./RecordTable.jsx";

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

function Product() {
    const { WorkspaceId } = useParams();


    const {toast} = useToast();
    const navigate = useNavigate();

    const createProductSchema = z.object({
        productName:  z.string()
                .min(1, "Name must be at least one character long.")
                .max(63, "Name must be less than 64 characters.")
                .regex(/^[A-Z]([-A-Z0-9]*[A-Z0-9])?$/, "Invalid name format."),
        productDescription: z.string().optional(),
        productCode: z.string().regex(/^\S*$/, "String must not contain spaces").optional(),
        productStatus: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"])

    });
    const createProductForm = useForm({
        resolver: zodResolver(createProductSchema),
        defaultValues: {productName: "", productDescription: "", productCode: "", productStatus:"ACTIVE"},
    });

    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createEditProduct', {
            productName: data.productName,
            productDescription: data.productDescription,
            productCode: data.productCode,
            productStatus: data.productStatus,
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId
        }).then(res => {
            toast({
                title: "Product created successfully!",
            });
            navigate(`/workspace/${WorkspaceId}/products?tab=products`);
        }).catch(err => {
            toast({
                title: "Product creation failed!",
            });
        });

    }

    return (
        <div>

            <div className="flex flex-col gap-4 p-4 ">

                 <Form {...createProductForm}>
                    <form
                        onSubmit={createProductForm.handleSubmit(onSubmit)}
                        className="w-full space-y-6"
                    >
                        <div>
                            <div className="py-4">
                                <div className="grid w-full   items-center gap-3 my-4">
                                    <FormField
                                        control={createProductForm.control}
                                        name="productName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Product Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Product name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full   items-center gap-3 my-4">
                                    <FormField
                                        control={createProductForm.control}
                                        name="productDescription"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Product Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Type your Product description here."
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
                                        control={createProductForm.control}
                                        name="productCode"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Product Code</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Type your Product rule here."
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
                                        control={createProductForm.control}
                                        name="productStatus"
                                        render={({field}) => (<FormItem>
                                            <FormLabel>Product Status</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a Product Status"/>
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
                                <Button type="button" onClick={() => createProductForm.reset()}>
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

export default Product;
