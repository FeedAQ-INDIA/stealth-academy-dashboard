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
  CardDescription,
  CardFooter,
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
  Paperclip,
  Download,
  Volume2,
  File,
  Image,
  Video,
  Archive,
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

function NotesCard({ a, index, fetchCourseNotes }) {
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

  // Helper function to get file icon based on mime type
  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('audio/')) return Volume2;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.includes('pdf')) return FileText;
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return Archive;
    return File;
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-purple-500" />

        <div className=" p-4">

       
          <CardHeader className="p-0">
          {a?.courseContent?.courseContentTitle && (  <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base font-semibold">
                  {a?.courseContent?.courseContentTitle}
                </CardTitle>
              </div>
            </div>)}
                  <div className="space-y-2">
            {/* Note Header */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3 text-violet-500" />
              <span className="font-medium">{a?.v_created_date}</span>
              <Clock className="h-3 w-3 text-violet-500 ml-1" />
              <span>{a?.v_created_time}</span>
              {a.v_note_ref_timestamp && (
                <>
                  <Clock className="h-3 w-3 text-violet-500 ml-1" />
                  <span>{a?.v_note_ref_timestamp}</span>
                </>
              )}
            </div>

            <Separator />

            {/* Note Content */}
            <div className="mb-2">
              <div className="relative">
                {/* <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-gray-100 to-gray-100 rounded-full"></div> */}
                <p className=" text-black leading-snug whitespace-pre-wrap break-words text-sm">
                  {a?.noteContent}
                </p>
              </div>
            </div>

            {/* File Attachments */}
            {a?.metadata?.attachments && a.metadata.attachments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Attachments ({a.metadata.attachments.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {a.metadata.attachments.map((file, fileIndex) => {
                    const FileIcon = getFileIcon(file.mimeType);
                    return (
                      <div
                        key={fileIndex}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.originalName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.fileSize)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-200"
                          onClick={() => window.open(file.fileUrl, '_blank')}
                          title="Download or view file"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          </CardHeader>
  

        <CardFooter className="p-0 pt-3">
          <div className="flex justify-end space-x-1 w-full">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    editNotesForm.reset({
                      id: a?.noteId,
                      noteContent: a?.noteContent,
                    });
                  }}
                  className="h-7 px-3 text-xs"
                >
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl text-blue-800">
                    <Edit3 className="h-5 w-5 text-blue-600" />
                    Edit Your Note
                  </DialogTitle>
                  <DialogDescription className="text-blue-600/70">
                    Make changes to your note below. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>

                <Form {...editNotesForm}>
                  <form
                    onSubmit={editNotesForm.handleSubmit(
                      onCommentUpdate,
                      (errors) => {
                        console.error("Form validation errors:", errors);
                      }
                    )}
                    className="w-full space-y-6"
                  >
                    <div>
                      <FormField
                        control={editNotesForm.control}
                        name="noteContent"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Type your note here..."
                                className="min-h-[120px] resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter className="gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => editNotesForm.reset()}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        Reset
                      </Button>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-gray-300"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="xs"
                  className="h-7 px-3 text-xs"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-800">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    Delete Note
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-red-700/80">
                    This action cannot be undone. This will permanently delete
                    your note from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-300">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteComment(a?.noteId)}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    Delete Forever
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter> </div>
      </Card>
    </>
  );
}

export default NotesCard;
