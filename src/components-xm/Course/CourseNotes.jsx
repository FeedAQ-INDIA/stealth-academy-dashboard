import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.jsx";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Check,
  CircleArrowLeft,
  CircleArrowRight,
  Clock,
  FileText,
  CheckCircle2,
  Undo2,
  Zap,
  Play,
  NotebookPen,
  AlertCircle,
  Terminal,
  MessageCircle,
  Calendar,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import NotesModule from "@/components-xm/Notes/NotesModule.jsx";
import { toast } from "@/components/hooks/use-toast.js";
import CreateNotesModule from "@/components-xm/Notes/CreateNotesModule.jsx";
import { useAuthStore } from "@/zustland/store.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.jsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.jsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "postcss";
import NotesCard from "../Modules/NotesCard";

function CourseNotes() {
  const { userDetail } = useAuthStore();

  const { CourseId } = useParams();
  const {
    userCourseEnrollment,
    userCourseContentProgress,
    fetchUserCourseContentProgress,
    fetchUserCourseEnrollment,
    courseList,
  } = useCourse();

  const [courseNotesDetail, setCourseNotesDetail] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseList) {
      fetchCourseNotes();
    }
  }, [courseList, userCourseEnrollment]);

  const fetchCourseNotes = () => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 10,
        offset: 0,
        getThisData: {
          datasource: "Notes",
          attributes: [],
          where: { courseId: CourseId, userId: userDetail.userId },
          include: [
            {
              datasource: "CourseContent",
              as: "courseContent",
              required: true,
              where: { courseId: CourseId },
            },
          ],
        },
      })
      .then((res) => {
        console.log(res.data);
        const result = res.data.data?.results;
        setCourseNotesDetail(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [triggerNotesRefresh, setTriggerNotesRefresh] = useState(false);

  const handleNotesSave = () => {
    setTriggerNotesRefresh((prev) => !prev);
  };

  const formatDuration = (totalMinutes) => {
    const minutes = +totalMinutes || 0;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  // Check enrollment access
  const isUserEnrolled =
    userCourseEnrollment && userCourseEnrollment.length > 0;
  const enrollmentStatus = userCourseEnrollment?.[0]?.enrollmentStatus;
  const hasContentAccess =
    isUserEnrolled &&
    ["ENROLLED", "IN_PROGRESS", "COMPLETED", "CERTIFIED"].includes(
      enrollmentStatus
    );

  const editNotesSchema = z.object({
    id: z.number(),
    noteContent: z.string().min(3, "Notes cannot be empty"),
  });

  const editNotesForm = useForm({
    resolver: zodResolver(editNotesSchema),
    defaultValues: { id: 0, noteContent: "" },
  });

  const deleteComment = (notesId) => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/deleteNote", {
        notesId,
      })
      .then((res) => {
        console.log(res);
        toast({
          title: "Notes deleted successfully",
        });
        fetchCourseNotes();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  function onCommentUpdate(data) {
    console.log(data);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/saveNote", {
        notesId: data.id,
        courseId: CourseId,
        // courseContentId: CourseContentId,
        noteContent: data.noteContent,
      })
      .then((res) => {
        console.log(res);
        setEditDialogOpen(false);
        toast({
          title: "Comment updated successfully",
        });
        fetchCourseNotes();
        editNotesForm.reset();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // If not enrolled, show access denied
  if (!hasContentAccess) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Content Locked
            </h2>
            <p className="text-gray-600">
              You need to be enrolled in this course to access this content.
            </p>
          </div>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[30ch] font-medium text-muted-foreground">
                {"Course Notes"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Enhanced Content */}
      <div className=" ">
        <div className="  p-4 space-y-4">
          <Card className="border-0  bg-gradient-to-r from-rose-600 via-rose-700 to-rose-900 rounded-sm text-white shadow-md  overflow-hidden relative">
            <CardHeader className=" ">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-300 to-rose-500 rounded-lg flex items-center justify-center">
                    <NotebookPen className="text-white" size={20} />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold ">
                    {"Course Notes"}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Phone Number Alert */}
          {!userDetail?.number && (
            <section className="my-6 animate-slide-in">
              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50 rounded-sm"
              >
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                  <div className="flex-1">
                    <AlertTitle className="text-red-800 font-semibold">
                      Phone number missing
                    </AlertTitle>
                    <AlertDescription className="text-red-700">
                      Please update your phone number 
                    </AlertDescription>
                  </div>
                  <div>
                    <Link to="/account-settings/profile">
                      <Button
                        className="bg-red-600 hover:bg-red-700 transition-colors"
                        size="sm"
                      >
                        Update Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Alert>
            </section>
          )}

          <div className="space-y-4">
            {courseNotesDetail?.length > 0 ? (
              <div className="space-y-4">
                {courseNotesDetail?.map((a, index) => (
                  <NotesCard a={a} index={index} fetchCourseNotes={fetchCourseNotes} />
                  // <div
                  //   key={a.noteId}
                  //   className="group relative space-y-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-sm p-3 hover:border-violet-300/60  hover:shadow-violet-100/20 transition-all duration-300 transform hover:-translate-y-1"
                  //   style={{
                  //     animationDelay: `${index * 100}ms`,
                  //     animation: "slideInUp 0.5s ease-out forwards",
                  //   }}
                  // >
                  //   <div className=" ">
                  //     <div className="relative">
                  //       <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
                  //       <p className="ml-2 text-black leading-relaxed whitespace-pre-wrap break-words text-base font-bold">
                  //         {a?.courseContent?.courseContentTitle}
                  //       </p>
                  //     </div>
                  //   </div>

                  //   {/* Note Header */}
                  //   <div className="flex items-center justify-between  ">
                  //     <div className="flex items-center gap-2 text-sm text-gray-500">
                  //       <Calendar className="h-4 w-4 text-violet-500" />
                  //       <span className="font-medium">{a?.v_created_date}</span>
                  //       <Clock className="h-4 w-4 text-violet-500 ml-2" />
                  //       <span>{a?.v_created_time}</span>
                  //       {a.v_note_ref_timestamp && (
                  //         <>
                  //           <Clock className="h-4 w-4 text-violet-500 ml-2" />
                  //           <span>{a?.v_note_ref_timestamp}</span>
                  //         </>
                  //       )}
                  //     </div>
                  //   </div>

                  //   {/* Note Content */}

                  //   <div className="mb-3">
                  //     <div className="relative">
                  //       <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-gray-100 to-gray-100 rounded-full"></div>
                  //       <p className="ml-2 text-black-400 leading-relaxed whitespace-pre-wrap break-words text-base ">
                  //         {a?.noteContent}
                  //       </p>
                  //     </div>
                  //   </div>

                  //   {/* Action Buttons */}
                  //   <div className="flex gap-3 pt-3 border-t border-gray-100">
                  //     <Dialog
                  //       open={editDialogOpen}
                  //       onOpenChange={setEditDialogOpen}
                  //     >
                  //       <DialogTrigger asChild>
                  //         <Button
                  //           variant="ghost"
                  //           size="sm"
                  //           onClick={() => {
                  //             editNotesForm.reset({
                  //               id: a?.noteId,
                  //               noteContent: a?.noteContent,
                  //             });
                  //           }}
                  //           className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                  //         >
                  //           <Edit3 className="h-4 w-4" />
                  //           <span className="font-medium">Edit</span>
                  //         </Button>
                  //       </DialogTrigger>
                  //       <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  //         <DialogHeader>
                  //           <DialogTitle className="flex items-center gap-2 text-xl text-blue-800">
                  //             <Edit3 className="h-5 w-5 text-blue-600" />
                  //             Edit Your Note
                  //           </DialogTitle>
                  //           <DialogDescription className="text-blue-600/70">
                  //             Make changes to your note below. Click save when
                  //             you're done.
                  //           </DialogDescription>
                  //         </DialogHeader>

                  //         <Form {...editNotesForm}>
                  //           <form
                  //             onSubmit={editNotesForm.handleSubmit(
                  //               onCommentUpdate,
                  //               (errors) => {
                  //                 console.error(
                  //                   "Form validation errors:",
                  //                   errors
                  //                 );
                  //               }
                  //             )}
                  //             className="w-full space-y-6"
                  //           >
                  //             <div>
                  //               <FormField
                  //                 control={editNotesForm.control}
                  //                 name="noteContent"
                  //                 render={({ field }) => (
                  //                   <FormItem>
                  //                     <FormControl>
                  //                       <Textarea
                  //                         placeholder="Type your note here..."
                  //                         className="min-h-[120px] resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                  //                         {...field}
                  //                       />
                  //                     </FormControl>
                  //                     <FormMessage />
                  //                   </FormItem>
                  //                 )}
                  //               />

                  //               {/* <FormField
                  //                       control={editNotesForm.control}
                  //                       name="id"
                  //                       render={({ field }) => (
                  //                         <input
                  //                           type="number"
                  //                           hidden
                  //                           value={field.value ?? 0}
                  //                           onChange={field.onChange}
                  //                           name={field.name}
                  //                           ref={field.ref}
                  //                         />
                  //                       )}
                  //                     /> */}
                  //             </div>

                  //             <DialogFooter className="gap-2">
                  //               <Button
                  //                 type="button"
                  //                 variant="outline"
                  //                 onClick={() => editNotesForm.reset()}
                  //                 className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  //               >
                  //                 Reset
                  //               </Button>
                  //               <DialogClose asChild>
                  //                 <Button
                  //                   type="button"
                  //                   variant="outline"
                  //                   className="border-gray-300"
                  //                 >
                  //                   Cancel
                  //                 </Button>
                  //               </DialogClose>
                  //               <Button
                  //                 type="submit"
                  //                 className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  //               >
                  //                 Save Changes
                  //               </Button>
                  //             </DialogFooter>
                  //           </form>
                  //         </Form>
                  //       </DialogContent>
                  //     </Dialog>

                  //     <AlertDialog>
                  //       <AlertDialogTrigger asChild>
                  //         <Button
                  //           variant="ghost"
                  //           size="sm"
                  //           className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                  //         >
                  //           <Trash2 className="h-4 w-4" />
                  //           <span className="font-medium">Delete</span>
                  //         </Button>
                  //       </AlertDialogTrigger>
                  //       <AlertDialogContent className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                  //         <AlertDialogHeader>
                  //           <AlertDialogTitle className="flex items-center gap-2 text-red-800">
                  //             <Trash2 className="h-5 w-5 text-red-600" />
                  //             Delete Note
                  //           </AlertDialogTitle>
                  //           <AlertDialogDescription className="text-red-700/80">
                  //             This action cannot be undone. This will
                  //             permanently delete your note from our servers.
                  //           </AlertDialogDescription>
                  //         </AlertDialogHeader>
                  //         <AlertDialogFooter>
                  //           <AlertDialogCancel className="border-gray-300">
                  //             Cancel
                  //           </AlertDialogCancel>
                  //           <AlertDialogAction
                  //             onClick={() => deleteComment(a?.noteId)}
                  //             className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  //           >
                  //             Delete Forever
                  //           </AlertDialogAction>
                  //         </AlertDialogFooter>
                  //       </AlertDialogContent>
                  //     </AlertDialog>
                  //   </div>
                  // </div>
                ))}
              </div>
            ) : (
              <Alert className="my-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <MessageCircle className="h-5 w-5 text-amber-600" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 rounded-full animate-bounce"></div>
                  </div>
                  <div>
                    <AlertTitle className="text-amber-800 font-semibold">
                      No Notes Yet
                    </AlertTitle>
                    <AlertDescription className="text-amber-700/80">
                      Start taking notes to capture your thoughts and key
                      insights from this content.
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseNotes;
