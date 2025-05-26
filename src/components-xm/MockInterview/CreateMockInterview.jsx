import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuthStore} from "@/zustland/store.js";
import axiosConn from "@/axioscon.js";
import {toast} from "@/components/hooks/use-toast.js";
import React, {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";


export function CreateMockInterview() {
    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore();
    const [exploreCourseText, setExploreCourseText] = useState("");


    const createMockInterviewSchema = z.object({
        date: z.string().refine(val => {
            const parsedDate = Date.parse(val);
            return !isNaN(parsedDate) && new Date(parsedDate) > new Date();
        }, {
            message: "Date must be a valid future date",
        }),
        time: z.string().refine(val => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
            message: "Time must be in HH:mm format",
        }),
        duration: z.number().positive({ message: "Duration must be a positive number" }),
        resumeLink: z.string().url({ message: "Invalid resume URL" }),
        attachmentLink: z.string().url({ message: "Invalid attachment URL" }).optional(),
        note: z.string().optional(),
    });



    const createMockInterviewForm = useForm({
        resolver: zodResolver(createMockInterviewSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0], // Pre-fill today's date
            time: "",
            duration: 10,
            resumeLink: "",
            attachmentLink: "",
            note: "",
        },
    });

    function onSubmit(data) {
        console.log("Submitting mock interview:", data);

        axiosConn.post('/raiseInterviewRequest', data)
            .then(res => {
                toast({
                     title:  res.data?.data?.message ,
                })
                createMockInterviewForm.reset();
            })
            .catch(err => {
                toast({ title: "Failed to schedule mock interview." });
            });
    }

    return (
        <div className="p-4 flex flex-col gap-4 h-[calc(100svh-4em)] overflow-y-auto">
            <Card className="border-0 bg-muted/50   ">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-semibold  tracking-wider">
                        SCHEDULE MOCK INTERVIEW VAULT SESSION
                    </CardTitle>
                </CardHeader>


            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0 bg-muted/50  py-6 ">

                    <CardContent>
                        <Form {...createMockInterviewForm}>
                            <form onSubmit={createMockInterviewForm.handleSubmit(onSubmit)} className="w-full space-y-6 ">

                                {/* Interview Date */}
                                <FormField
                                    control={createMockInterviewForm.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Interview Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Interview Time */}
                                <FormField
                                    control={createMockInterviewForm.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Interview Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Interview Duration */}
                                <FormField
                                    control={createMockInterviewForm.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Interview Duration</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={val => field.onChange(parseInt(val))}
                                                    value={String(field.value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Interview Duration" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[5, 10, 15, 20, 25, 30, 45].map(min => (
                                                            <SelectItem key={min} value={String(min)}>
                                                                {min} min
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Resume Link */}
                                <FormField
                                    control={createMockInterviewForm.control}
                                    name="resumeLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resume Link</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Enter Resume URL" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/*/!* Attachment Link *!/*/}
                                {/*<FormField*/}
                                {/*    control={createMockInterviewForm.control}*/}
                                {/*    name="attachmentLink"*/}
                                {/*    render={({ field }) => (*/}
                                {/*        <FormItem>*/}
                                {/*            <FormLabel>Attachment Link (optional)</FormLabel>*/}
                                {/*            <FormControl>*/}
                                {/*                <Input type="text" placeholder="Enter Attachment URL" {...field} />*/}
                                {/*            </FormControl>*/}
                                {/*            <FormMessage />*/}
                                {/*        </FormItem>*/}
                                {/*    )}*/}
                                {/*/>*/}

                                {/* Note */}
                                <FormField
                                    control={createMockInterviewForm.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Notes</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Any notes to the interviewer..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />




                                <Button type="submit">SCHEDULE</Button>
                            </form>
                        </Form>
                    </CardContent>

                </Card>
                <Card className="border-0 bg-muted/50 ">

                    <CardHeader>
                        <CardTitle className="tracking-wider">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
}
