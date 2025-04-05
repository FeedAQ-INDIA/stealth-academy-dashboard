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
  ArrowLeft,
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
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Undo2, UserRound,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge.jsx";
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
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axiosConn from "@/axioscon.js";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {useAuthStore} from "@/zustland/store.js";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";

function StakeholderComment({ commentSource,  recordId, workspaceId }) {
  const CommentSchema = z.object({
    comment: z.string().min(3, "Comment cannot be empty"),
  });

  const {userDetail} = useAuthStore();
  const form = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues: { comment: "" },
  });

  const [commentList, setCommentList] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addCommentView, setAddCommentView] = useState(false);

  useEffect(() => {
    console.log("Commement Src : "+commentSource)
    fetchComments();
  }, [recordId]);

  const fetchComments = () => {
    axiosConn
        .post("http://localhost:3000/searchRecord",  {
          limit: 10,
          offset: 0,
          getThisData: {
            datasource: commentSource,
            order: [[commentSource=='Comment'?"comm_created_at":"stkhldcomm_created_at", "DESC"]],
            attributes: [],
            where: {
              orgId: localStorage.getItem("currentOrg"),
              workspaceId: workspaceId,
              ...(commentSource=='Comment' && {recordId: recordId}),
              ...(commentSource=='StakeholderComment' && {stakeholderId: recordId}),          },
            include: [
              {
                datasource: "User",
                as: "commentedbyprofile",
                required: true,
                order: [],
                attributes: [],
              },
            ],
          },
        } )
        .then((res) => {
          console.log(res.data)
          setCommentList(res.data.data.results);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  function onCommentSubmit(data) {

    axiosConn
        .post("http://localhost:3000/createComment" , {
          workspaceId: workspaceId,
          orgId: localStorage.getItem("currentOrg"),
          commentType: commentSource,
          comment: data.comment,
          ...(commentSource=='Comment' && {recordId: recordId}),
          ...(commentSource=='StakeholderComment' && {stakeholderId: recordId}),
        })
        .then((res) => {
          console.log(res);
          fetchComments();
          form.reset();
        })
        .catch((err) => {
          console.log(err);
        });
  }

  const deleteComment = (item) => {
    axiosConn
        .post("http://localhost:3000/deleteComment" , {
          workspaceId: workspaceId,
          orgId: localStorage.getItem("currentOrg"),
          commentType: commentSource,
          comment: item.comment,
          ...(commentSource=='Comment' && {recordId: recordId}),
          ...(commentSource=='StakeholderComment' && {stakeholderId: recordId}),
          commentId : item.commentId
        })
        .then((res) => {
          console.log(res);
          toast({
            title: "Comment deleted successfully"
          })
          fetchComments();
        })
        .catch((err) => {
          console.log(err);
        });
  }

  function onCommentUpdate(data) {
    console.log(data);
    axiosConn
        .post("http://localhost:3000/editComment" , {
          workspaceId: workspaceId,
          orgId: localStorage.getItem("currentOrg"),
          commentType: commentSource,
          comment: data.comment,
          ...(commentSource=='Comment' && {recordId: recordId}),
          ...(commentSource=='StakeholderComment' && {stakeholderId: recordId}),
          commentId : data.id,
        })
        .then((res) => {
          console.log(res);
          setEditDialogOpen(false)
          toast({
            title: "Comment updated successfully"
          })
          fetchComments();
          editCommentForm.reset();
        })
        .catch((err) => {
          console.log(err);
        });
  }


  const editCommentSchema = z.object({
    id: z.number(),
    comment: z.string().min(3, "Comment cannot be empty"),
  });

  const editCommentForm = useForm({
    resolver: zodResolver(editCommentSchema),
    defaultValues: { id: "", comment: "" },
  });

  return (
      <div>
        <Card className="overflow-hidden my-4 rounded-none  shadow-md">
          <CardHeader className="flex flex-row  items-center  bg-muted/50  ">

            <div className=" ">
              <CardTitle className="text-lg">Comments</CardTitle>
            </div>
            <div className=" md:ml-auto flex items-center gap-1">
              <Button
                  className="h-8 gap-1 "
                  disabled={addCommentView}
                  onClick={() => setAddCommentView(true)}
              >  Add Comment/Note  </Button>
            </div>
          </CardHeader>
          <CardContent className="">
            <div className="text-base">
              <div
                  className={`transition-all duration-500 ease-in-out mt-4 overflow-hidden   rounded ${
                      addCommentView ? "max-h-fit opacity-100 p-4" : "max-h-0 opacity-0 p-0"
                  }`}
              >
                <Form {...form}>
                  <form
                      onSubmit={form.handleSubmit(onCommentSubmit)}
                      className="w-full space-y-6"
                  >
                    <div>
                      <FormField
                          control={form.control}
                          name="comment"
                          render={({field}) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                      placeholder="Type your comment here."
                                      {...field}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                          )}
                      />
                    </div>
                    <div className="flex gap-2">

                      <Button type="button" size="sm" onClick={() => {
                        setAddCommentView(false);
                        form.reset();
                      }}>
                        Close New Comment/Note Window
                      </Button>
                      <Button size="sm" type="button" onClick={() => form.reset()}>
                        Reset
                      </Button>
                      <Button size="sm" type="submit">Publish Comment</Button>
                    </div>
                  </form>
                </Form>
              </div>



              <ol className="mt-4  ">
                {commentList.map((a) => (
                    <li className="" key={a.commentId}>

                      <div className="flex items-start  hover:bg-muted/50 rounded-lg py-3 px-4">
                        <div  className="mr-2">
                          <AssigneeModule intialValue={a?.commentedbyprofile} uiType={'Avatar'}  isEditable={false}/>

                        </div>
                        <div>
                          <p className="font-semibold my-2 text-md">
                            {a.commentedbyprofile?.firstName}{" "}
                            {a?.commentedbyprofile?.lastName}
                            <span className="ms-2 text-sm font-normal	 text-muted-foreground">
                              {a?.created_date} {a?.created_time}
                        </span>
                          </p>
                          <p>{a.comment}</p>
                          {a?.commentedBy == userDetail?.userId ? <div className="flex gap-2 mt-2">
                            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                              <DialogTrigger asChild>
                                <p onClick={()=>{editCommentForm.reset({id: a?.commentId, comment: a?.comment})}} className=" text-blue-600 cursor-pointer">Edit</p>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Comment</DialogTitle>
                                  <DialogDescription>
                                    Commented By -  {a?.commentedbyprofile?.lastName}
                                  </DialogDescription>
                                </DialogHeader>

                                <Form {...editCommentForm}>
                                  <form
                                      onSubmit={editCommentForm.handleSubmit(onCommentUpdate)}
                                      className="w-full space-y-6"
                                  >
                                    <div>
                                      <FormField
                                          control={editCommentForm.control}
                                          name="comment"
                                          render={({field}) => (
                                              <FormItem>
                                                <FormControl>
                                                  <Textarea
                                                      placeholder="Type your comment here."
                                                      {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage/>
                                              </FormItem>
                                          )}
                                      />
                                    </div>

                                    <DialogFooter>

                                      <Button type="button" variant="secondary" onClick={() => editCommentForm.reset()} >Reset</Button>
                                      <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                          Close
                                        </Button>
                                      </DialogClose>
                                      <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                  </form>
                                </Form>

                              </DialogContent>
                            </Dialog>
                            <p className=" text-red-600 cursor-pointer" onClick={()=>deleteComment(a)}>Delete</p>
                          </div> : <></>}
                        </div>
                      </div>

                    </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

export default StakeholderComment;
