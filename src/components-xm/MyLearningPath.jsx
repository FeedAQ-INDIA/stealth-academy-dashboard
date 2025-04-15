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
  ShoppingCart, Terminal,
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
import {useAuthStore} from "@/zustland/store.js";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Link} from "react-router-dom";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";


export function MyLearningPath() {

  const {userDetail} = useAuthStore()
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [courseList, setCourseList] = useState({});
  const [apiQuery, setApiQuery] = useState({
    limit: limit, offset: offset, getThisData: {
      datasource: "User",  attributes: [], where : {userId: userDetail?.userId},
      include: [{
        datasource: "Course", as: "courses", required: false, order: [], attributes: [], where: {},
      },
      ],
    },
  });

  useEffect(() => {
    fetchCourses();
  }, [apiQuery]);

  const fetchCourses = () => {
    axiosConn
        .post(import.meta.env.VITE_API_URL+"/searchCourse", apiQuery)
        .then((res) => {
          console.log(res.data);
          setCourseList(res.data.data?.results?.[0]);
          setTotalCount(res.data.data.totalCount);
          setOffset(res.data.data.offset);
          setLimit(res.data.data.limit);
        })
        .catch((err) => {
          console.log(err);
        });
  };



  const disroll = (courseId) => {
    axiosConn
        .post(import.meta.env.VITE_API_URL+"/disroll", {
          courseId: courseId
        })
        .then((res) => {
          console.log(res.data);
          toast({
            title: 'Disrollment is successfull'
          });
          fetchCourses()
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: 'Error occured while Disrollment'
          })
        });
  }
  return (
    <div  className="p-6">
      <Card className="border-0 bg-muted/50  my-6">
        <CardHeader>
          <CardTitle>
            My Enrolled Courses
          </CardTitle>


        </CardHeader>
        <CardContent>
          <div className="my-2">
            {courseList?.length > 0 ?

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10 items-center">
              {courseList?.courses?.map(a => (
                  <Card className=" border shadow-sm hover:shadow-md cursor-pointer ">
                    <CardHeader>
                      {/* Badge row - wraps on smaller screens */}
                      <div className="flex flex-wrap gap-2 w-full mb-3">
                        <Badge className="animate-blink bg-green-600 text-white">FREE</Badge>
                        <Badge variant="outline">Course</Badge>
                        <Badge variant="outline">Beginner</Badge>
                      </div>

                      {/* Title with responsive spacing */}
                      <div className=" ">
                        <CardTitle className="text-lg sm:text-xl  font-semibold">
                          {a?.courseTitle}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 line-clamp-3">{a?.courseDescription}</p>
                      {/*<p className="my-2 animate-blink text-blue-800 font-medium"> Registration Started</p>*/}
                      <div className="font-medium  ">
                        <div className="flex gap-2 items-center">
                          <Clock size={18}/>                                             {`${Math.floor(+(a?.courseDuration) / 60)}hr ${+(a?.courseDuration) % 60}min`}
                        </div>
                        {/*<div className="flex flex-row gap-2 items-center mt-2">*/}
                        {/*  <span>16% complete</span>*/}
                        {/*  <Progress value={66} /></div>*/}



                      </div>
                    </CardContent>

             
                    <CardFooter className="flex w-full flex-wrap gap-2">
                      <Button className=" flex-1 " variant="destructive"
                              onClick={() => disroll(a?.courseId)}>Leave Course</Button>
                      <Link to={`/course/${a?.courseId}`} className="  flex-1 "><Button
                          className="  w-full ">Learn More</Button>
                      </Link>
                    </CardFooter>
                  </Card>
              ))}
            </div>
            :
            <Alert>   <Terminal className="h-4 w-4" />
              <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
                <div>
                  <AlertTitle>No Enrollment found</AlertTitle>
                  <AlertDescription>
                    <p>You are not enrolled in any course</p>

                  </AlertDescription>
                </div>

                <div className="md:ml-auto">
                  <Link to='/explore'>
                    <Button className="mt-2 flex-1" size={'sm'}>Start your journey today</Button>
                  </Link>

                </div>
              </div>

            </Alert>}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
