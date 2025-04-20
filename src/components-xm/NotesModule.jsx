import React, {useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useCourse} from "@/components-xm/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog"
import {Card, CardHeader} from "@/components/ui/card.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Terminal} from "lucide-react";
import {Link} from "react-router-dom";


function NotesModule({userId, courseId, courseTopicId, courseTopicContentId, refreshTrigger}) {

    const {isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus} = useCourse();

    const createNotesSchema = z.object({
        notesText: z.string()
            .min(3, "Notes cannot be empty"),

    });
    const createNotesForm = useForm({
        resolver: zodResolver(createNotesSchema),
        defaultValues: {notesText: ""},
    });

    const editNotesSchema = z.object({
        id: z.number(),
        notesText: z.string().min(3, "Notes cannot be empty"),
    });

    const editNotesForm = useForm({
        resolver: zodResolver(editNotesSchema),
        defaultValues: {id: 0, notesText: ""},
    });

    const [notesList, setNotesList] = useState([]);

    useEffect(() => {
        console.log(courseId, courseTopicId, courseTopicContentId)
        if (courseTopicContentId) {
            fetchNotesModule();
        }
    }, [courseTopicContentId, refreshTrigger]);

    const fetchNotesModule = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "Notes", attributes: [], where: {courseTopicContentId: courseTopicContentId, userId:userId},
                },
            })
            .then((res) => {
                console.log(res.data);
                setNotesList(res.data.data?.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function onSubmit(data) {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/saveNote", {
                courseTopicId,
                courseId,
                courseTopicContentId,
                notesText : data.notesText,
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: "Notes Saved Successfully"
                });
                fetchNotesModule();
                createNotesForm.reset()
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const deleteComment = (notesId) => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/deleteNote", {
               notesId
            })
            .then((res) => {
                console.log(res);
                toast({
                    title: "Notes deleted successfully"
                })
                fetchNotesModule();
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    function onCommentUpdate(data) {
        console.log(data);
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/saveNote", {
                notesId:data.id,
                courseTopicId,
                courseId,
                courseTopicContentId,
                notesText : data.notesText,
            })
            .then((res) => {
                console.log(res);
                setEditDialogOpen(false)
                toast({
                    title: "Comment updated successfully"
                })
                fetchNotesModule();
                editNotesForm.reset();
            })
            .catch((err) => {
                console.log(err);
            });
    }



    return (
        <>


            <Card className="my-8 bg-muted/50 rounded-none border-none">
                <CardHeader>
                <h1 className="text-lg   font-medium ">Note Book</h1>

                    {notesList.length > 0 ?
                <ol className="mt-4  ">
                    {notesList.map((a) => (
                        <li className="" key={a.notesId}>

                            <div className="flex items-start  rounded-lg py-3  ">


                                <div>
                                    <p className=" my-2 text-sm font-normal	 text-muted-foreground">

                               {a?.created_date} {a?.created_time}
                                     </p>
                                    <p>{a.notesText}</p>
                                      <div className="flex gap-2 mt-2">
                                        <Dialog  open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                            <DialogTrigger asChild>
                                                <p onClick={()=>{editNotesForm.reset({id:a?.notesId, notesText: a?.notesText})}} className=" text-blue-600 cursor-pointer">Edit</p>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Comment</DialogTitle>

                                                </DialogHeader>

                                                <Form {...editNotesForm}>
                                                    <form
                                                        onSubmit={editNotesForm.handleSubmit(onCommentUpdate)}
                                                        className="w-full space-y-6"
                                                    >
                                                        <div>
                                                            <FormField
                                                                control={editNotesForm.control}
                                                                name="notesText"
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

                                                            <Button type="button" variant="secondary" onClick={() => editNotesForm.reset()} >Reset</Button>
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
                                          <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                  <p className=" text-red-600 cursor-pointer"  >Delete</p>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                  <AlertDialogHeader>
                                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                      <AlertDialogDescription>
                                                          This action cannot be undone. This will permanently delete this notes from our servers.
                                                      </AlertDialogDescription>
                                                  </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                      <AlertDialogAction onClick={()=>
                                                          deleteComment(a?.notesId)
                                                      }>Continue</AlertDialogAction>
                                                  </AlertDialogFooter>
                                              </AlertDialogContent>
                                          </AlertDialog>
                                    </div>
                                </div>
                            </div>

                        </li>
                    ))}


                </ol> :
                    <Alert className="my-4">   <Terminal className="h-4 w-4 " />
                             <div>
                                <AlertTitle>No Notes Present</AlertTitle>
                                <AlertDescription>
                                    <p>You can take down notes</p>

                                </AlertDescription>
                            </div>



                    </Alert>}
            </CardHeader>
            </Card>

        </>)

}


export default NotesModule;