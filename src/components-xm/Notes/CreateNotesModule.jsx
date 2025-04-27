import React, {useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.jsx";
import {toast} from "@/components/hooks/use-toast.js";


function CreateNotesModule({courseId, courseTopicId, courseTopicContentId, handleNotesSave}) {

    const {isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus} = useCourse();

    const createNotesSchema = z.object({
        notesText: z.string()
            .min(3, "Notes cannot be empty"),

    });
    const createNotesForm = useForm({
        resolver: zodResolver(createNotesSchema),
        defaultValues: {notesText: ""},
    });



    function onSubmit(data) {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/saveNote", {
                courseTopicId,
                courseId,
                courseTopicContentId,
                notesText: data.notesText,
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: "Notes Saved Successfully"
                });
                createNotesForm.reset();
                handleNotesSave()
            })
            .catch((err) => {
                console.log(err);
            });
    }



    return (
        <>
            <Form {...createNotesForm}
                  >
                <form
                    onSubmit={createNotesForm.handleSubmit(onSubmit)}  className="flex flex-col h-full "
                 >
                    <div className="flex-1 ">
                        <FormField
                            control={createNotesForm.control}
                            name="notesText"
                            render={({field}) => (
                                <FormItem  className="flex-1 w-full h-full  ">
                                    <FormControl>
                                        <Textarea placeholder="Type your notes here." {...field}
                                                  className="flex-1 w-full h-full lg:resize-none  "
s                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button className="w-full" variant="outline" size="sm" type="button"
                                onClick={() => createNotesForm.reset()}>Reset</Button>
                        <Button type="submit" className="w-full" size="sm">Save</Button>
                    </div>
                </form>
            </Form>
        </>)

}


export default CreateNotesModule;