import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
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
import { toast } from "@/components/hooks/use-toast.js";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import {
  Edit3,
  Trash2,
  Clock,
  FileText,
  Sparkles,
  MessageCircle,
  Calendar,
} from "lucide-react";

function NotesModule({ userId, courseId, courseContentId, refreshTrigger }) {
  const { isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus } =
    useCourse();

  const createNotesSchema = z.object({
    noteContent: z.string().min(3, "Notes cannot be empty"),
  });
  const createNotesForm = useForm({
    resolver: zodResolver(createNotesSchema),
    defaultValues: { noteContent: "" },
  });

  const editNotesSchema = z.object({
    id: z.number(),
    noteContent: z.string().min(3, "Notes cannot be empty"),
  });

  const editNotesForm = useForm({
    resolver: zodResolver(editNotesSchema),
    defaultValues: { id: 0, noteContent: "" },
  });

  const [notesList, setNotesList] = useState([]);

  useEffect(() => {
    console.log(courseId, courseContentId);
    if (courseContentId) {
      fetchNotesModule();
    }
  }, [courseContentId, refreshTrigger]);

  const fetchNotesModule = () => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 10,
        offset: 0,
        getThisData: {
          datasource: "Notes",
          attributes: [],
          where: { courseContentId: courseContentId, userId: userId },
        },
      })
      .then((res) => {
        console.log(res.data);
        setNotesList(res.data.data?.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function onSubmit(data) {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/saveNote", {
        courseId,
        courseContentId,
        noteContent: data.noteContent,
      })
      .then((res) => {
        console.log(res.data);
        toast({
          title: "Notes Saved Successfully",
        });
        fetchNotesModule();
        createNotesForm.reset();
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
        fetchNotesModule();
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
        courseId,
        courseContentId,
        noteContent: data.noteContent,
      })
      .then((res) => {
        console.log(res);
        setEditDialogOpen(false);
        toast({
          title: "Comment updated successfully",
        });
        fetchNotesModule();
        editNotesForm.reset();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Card className="my-8 bg-gradient-to-br from-violet-50/50 to-purple-50/30 border-violet-200/50 shadow-lg shadow-violet-100/20 hover:shadow-xl hover:shadow-violet-100/30 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="relative">
              <FileText className="h-6 w-6" />
              <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            Your Notes
            {notesList.length > 0 && (
              <span className="ml-auto bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {notesList.length} note{notesList.length !== 1 ? "s" : ""}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        {/* <CardContent className="p-6">
                    {notesList.length > 0 ? (
                        <div className="space-y-4">
                            {notesList.map((a, index) => (
                                <div
                                    key={a.notesId}
                                    className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 hover:border-violet-300/60 hover:shadow-lg hover:shadow-violet-100/20 transition-all duration-300 transform hover:-translate-y-1"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animation: 'slideInUp 0.5s ease-out forwards'
                                    }}
                                >
                                     <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 text-violet-500" />
                                            <span className="font-medium">{a?.v_created_date}</span>
                                            <Clock className="h-4 w-4 text-violet-500 ml-2" />
                                            <span>{a?.v_created_time}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="h-2 w-2 bg-violet-400 rounded-full animate-pulse"></div>
                                            <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                    </div>

                                     <div className="mb-4">
                                        <div className="relative">
                                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
                                            <p className="ml-4 text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-base">
                                                {a.noteContent}
                                            </p>
                                        </div>
                                    </div>

                                     <div className="flex gap-3 pt-3 border-t border-gray-100">
                                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {editNotesForm.reset({id: a?.notesId, noteContent: a?.noteContent})}}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                    <span className="font-medium">Edit</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2 text-xl text-blue-800">
                                                        <Edit3 className="h-5 w-5 text-blue-600" />
                                                        Edit Your Note
                                                    </DialogTitle>
                                                    <DialogDescription className="text-blue-600/70">
                                                        Make changes to your note below. Click save when you're done.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <Form {...editNotesForm}>
                                                    <form
                                                        onSubmit={editNotesForm.handleSubmit(onCommentUpdate)}
                                                        className="w-full space-y-6"
                                                    >
                                                        <div>
                                                            <FormField
                                                                control={editNotesForm.control}
                                                                name="noteContent"
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Type your note here..."
                                                                                className="min-h-[120px] resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
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
                                                                <Button type="button" variant="outline" className="border-gray-300">
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
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="font-medium">Delete</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="flex items-center gap-2 text-red-800">
                                                        <Trash2 className="h-5 w-5 text-red-600" />
                                                        Delete Note
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-red-700/80">
                                                        This action cannot be undone. This will permanently delete your note from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => deleteComment(a?.notesId)}
                                                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                                                    >
                                                        Delete Forever
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
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
                                    <AlertTitle className="text-amber-800 font-semibold">No Notes Yet</AlertTitle>
                                    <AlertDescription className="text-amber-700/80">
                                        Start taking notes to capture your thoughts and key insights from this content.
                                    </AlertDescription>
                                </div>
                            </div>
                        </Alert>
                    )}
                </CardContent> */}
      </Card>
      {notesList.length > 0 ? (
        <div className="space-y-4">
          {notesList.map((a, index) => (
            <div
              key={a.notesId}
              className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-3 hover:border-violet-300/60 hover:shadow-lg hover:shadow-violet-100/20 transition-all duration-300 transform hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "slideInUp 0.5s ease-out forwards",
              }}
            >
              {/* Note Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 text-violet-500" />
                  <span className="font-medium">{a?.v_created_date}</span>
                  <Clock className="h-4 w-4 text-violet-500 ml-2" />
                  <span>{a?.v_created_time}</span>
                  {a.v_note_ref_timestamp && (
                    <>
                      <Clock className="h-4 w-4 text-violet-500 ml-2" />
                      <span>{a?.v_note_ref_timestamp}</span>
                    </>
                  )}
                </div>
                {/* <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="h-2 w-2 bg-violet-400 rounded-full animate-pulse"></div>
                  <div
                    className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div> */}
              </div>

              {/* Note Content */}
              <div className="mb-3">
                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
                  <p className="ml-4 text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-base">
                    {a.noteContent}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        editNotesForm.reset({
                          id: a?.notesId,
                          noteContent: a?.noteContent,
                        });
                      }}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span className="font-medium">Edit</span>
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
                        onSubmit={editNotesForm.handleSubmit(onCommentUpdate)}
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
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="font-medium">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-800">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        Delete Note
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-red-700/80">
                        This action cannot be undone. This will permanently
                        delete your note from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-300">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteComment(a?.notesId)}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                      >
                        Delete Forever
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
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
                Start taking notes to capture your thoughts and key insights
                from this content.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .group:hover .group-hover\\:animate-pulse {
          animation: pulse 1s infinite;
        }
      `}</style>
    </>
  );
}

export default NotesModule;
