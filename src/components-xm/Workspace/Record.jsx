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
import {Link, NavLink, useParams} from "react-router-dom";
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

function Record() {
  const { WorkspaceId, RepositoryId } = useParams();

  const chartData = [
    { browser: "Backlog", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "Planned", visitors: 200, fill: "var(--color-safari)" },
    { browser: "Progress", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "Completed", visitors: 173, fill: "var(--color-edge)" },
    { browser: "Closed", visitors: 90, fill: "var(--color-other)" },
  ];
  const chartConfig = {
    visitors: {
      label: "Record Status",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  };

  return (<div>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1"/>
          <Separator orientation="vertical" className="mr-2 h-4"/>
          <Breadcrumb>
            <BreadcrumbList>
              {/*<BreadcrumbItem className="hidden md:block">*/}
              {/*  <BreadcrumbLink href="#">*/}
              {/*    <Link to={`/ws/${WorkspaceId}/Repository/${RepositoryId}/record?tab=record`}></Link> Repository*/}
              {/*  </BreadcrumbLink>*/}
              {/*</BreadcrumbItem>*/}

              {/*<BreadcrumbSeparator className="hidden md:block"/>*/}
              <BreadcrumbItem>
                <BreadcrumbPage>Record</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto sm:flex-initial"></div>
        </header>

        <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">
          <div className=" ">
            <CardTitle className="text-lg">Record</CardTitle>
            <CardDescription>Reach to mass audience</CardDescription>
          </div>
          <div className=" md:ml-auto flex items-center gap-1">
            {/*<Button*/}
            {/*    className="h-8 gap-1 "*/}
            {/*>Add Record</Button>*/}
          </div>
        </CardHeader>

        <div className="flex flex-col gap-4 p-4 ">
          <RecordTable/>

        </div>
      </div>
  );
}

export default Record;
