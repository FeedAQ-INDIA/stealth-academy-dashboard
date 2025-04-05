import {
  ChevronLeft,
  ChevronRight, Clock,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Link} from "react-router-dom";


export function Dashboard() {
  return (
    <div  className="p-6">
      <Card className="border-0 bg-[#ffdd00]">
        <CardHeader>
          <div className="flex flex-sm justify-items-center gap-4 items-center">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-xl">TS</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-medium">Welcome TECHFUSION STUDIO</h1>
              <p>Member since 2021</p>
            </div>
          </div>


        </CardHeader>
        <CardContent>

        </CardContent>
      </Card>

      <Card className="border-0 bg-muted/50  my-6">
        <CardHeader>
          <CardTitle>
            My Learning Journey
          </CardTitle>


        </CardHeader>
        <CardContent>
          <div className="my-2">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10 items-center">
              <Card className=" border shadow-sm hover:shadow-md cursor-pointer ">
                <CardHeader>
                  {/* Badge row - wraps on smaller screens */}
                  <div className="flex flex-wrap gap-2 w-full mb-3">
                    <Badge variant="outline">Course</Badge>
                    <Badge variant="outline">Beginner</Badge>
                  </div>

                  {/* Title with responsive spacing */}
                  <div className=" ">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                      Basic/Core Java
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 line-clamp-3">A beginner-friendly course covering core Java concepts,
                    including
                    syntax, object-oriented programming, data structures, exception handling, and file
                    handling. Ideal for
                    those starting their Java programming journey.</p>
                  {/*<p className="my-2 animate-blink text-blue-800 font-medium"> Registration Started</p>*/}
                  <div className="font-medium  ">
                    <div className="flex gap-2 items-center">
                      <Clock size={18}/>  3 hours 30 minutes</div>
                    <div className="flex flex-row gap-2 items-center mt-2">
                      <span>16% complete</span>
                      <Progress value={66} /></div>



                  </div>
                </CardContent>

                <CardFooter className="flex gap-2 ">
                  <Link to={`/course/20`} className="  w-full "><Button className="  w-full ">Learn More</Button>
                  </Link>   {/*<Button className="  w-full  ">Learn More</Button>*/}
                </CardFooter>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
