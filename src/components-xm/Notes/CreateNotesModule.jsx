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
import {Save, RotateCcw, FileText, Loader2} from "lucide-react";

function CreateNotesModule({courseId, courseContentId, handleNotesSave, handleGetCurrentTime}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const {isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus} = useCourse();

    const createNotesSchema = z.object({
        noteContent: z.string()
            .min(3, "Notes must be at least 3 characters long"),
    });

    const createNotesForm = useForm({
        resolver: zodResolver(createNotesSchema),
        defaultValues: {noteContent: ""},
    });

    const watchedNotesText = createNotesForm.watch("noteContent");

    // Update counters and unsaved changes state
    useEffect(() => {
        const text = watchedNotesText || "";
        setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
        setCharCount(text.length);
        setHasUnsavedChanges(text.trim().length > 0);
    }, [watchedNotesText]);

    async function onSubmit(data) {
        setIsSubmitting(true);
        try {
            const response = await axiosConn.post(
                import.meta.env.VITE_API_URL + "/saveNote",
                {
                    courseId,
                    courseContentId,
                    noteContent: data.noteContent,
                    noteRefTimestamp: handleGetCurrentTime()
                }
            );

            console.log(response.data);
            toast({
                title: "Notes Saved Successfully",
                description: "Your notes have been saved and are now available.",
            });

            createNotesForm.reset();
            setHasUnsavedChanges(false);
            handleNotesSave();
        } catch (err) {
            console.log(err);
            toast({
                title: "Error Saving Notes",
                description: "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleReset = () => {
        createNotesForm.reset();
        setHasUnsavedChanges(false);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Create Notes</h3>
                </div>
                <div className="text-sm text-gray-500">
                    {wordCount} words 
                    {/* • {charCount} characters */}
                </div>
            </div>

            {/* Form */}
            <Form {...createNotesForm}>
                <form
                    onSubmit={createNotesForm.handleSubmit(onSubmit)}
                    className="flex flex-col h-full p-4"
                >
                    <div className="flex-1 min-h-[200px]">
                        <FormField
                            control={createNotesForm.control}
                            name="noteContent"
                            render={({field}) => (
                                <FormItem className="flex-1 w-full h-full">
                                    <FormControl>
                                        <Textarea
                                            placeholder="Start typing your notes here... You can organize your thoughts, key points, or any important information."
                                            {...field}
                                            className="flex-1 w-full h-full min-h-[180px] lg:resize-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400 text-gray-700 leading-relaxed"
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Status Indicator */}
                    {hasUnsavedChanges && !isSubmitting && (
                        <div className="flex items-center gap-2 text-amber-600 text-sm mt-2 mb-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            Unsaved changes
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap w-full gap-3 mt-4 pt-4 border-t border-gray-100">
                        <Button
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={handleReset}
                            disabled={isSubmitting || !hasUnsavedChanges}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>

                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            size="sm"
                            disabled={isSubmitting || !hasUnsavedChanges}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Notes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CreateNotesModule;