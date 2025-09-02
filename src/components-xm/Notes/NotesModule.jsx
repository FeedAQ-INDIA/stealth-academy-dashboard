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
import NotesCard from "../Modules/NotesCard";

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
      <Card className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">Your Notes</h3>
        </div>
        <div className="text-sm text-gray-500">
          {notesList.length > 0 && (
            <span className="ml-auto bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {notesList.length} note{notesList.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </Card>

      {notesList.length > 0 ? (
        <div className="space-y-4">
          {notesList.map((a, index) => (
              <NotesCard key={index} a={a} index={index} fetchCourseNotes={fetchNotesModule} />
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
