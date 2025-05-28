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
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";


export function CreateMockInterview() {
    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore();
    const [exploreCourseText, setExploreCourseText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


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
        attachmentLink: z.string()
            .optional()
            .refine(val => !val || /^https?:\/\/\S+$/.test(val), {
                message: "Invalid attachment URL",
            }),
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
        setIsSubmitting(true);
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


        // Step 3: Launch Razorpay Checkout
        const options = {
            key: 'rzp_test_1F67LLEd7Qzk1u',
            amount: 1,
            currency: 'INR',
            name: 'FeedAQ Academy',
            description: 'Test Transaction',
            order_id: data.orderId,
            handler: async function (response) {
                const verifyRes = await axios.post('http://localhost:5000/api/verify', {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });

                if (verifyRes.data.success) {
                    alert('Payment successful!');
                } else {
                    alert('Payment verification failed');
                }
            },
            prefill: {
                name: 'bksb',
                email: 'test@example.com',
                contact: '9631045873',
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        setIsSubmitting(false);
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
            <Form {...createMockInterviewForm}>
                <form onSubmit={createMockInterviewForm.handleSubmit(onSubmit)} className="w-full space-y-6 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0 bg-muted/50  py-6 ">

                    <CardContent>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


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
                </div>

<div className="mt-2">
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
                </div>
                        <div className="mt-2">

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
                        </div>

                        <div className="mt-2">

                        {/*/!* Attachment Link *!/*/}
                                <FormField
                                    control={createMockInterviewForm.control}
                                    name="attachmentLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Attachment Link (optional)</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Enter Attachment URL" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                        </div>

                        <div className="mt-2">

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
                        </div>




                    </CardContent>

                </Card>
                <Card className="border-0 bg-muted/50 ">

                    <CardHeader>
                        <CardTitle className="tracking-wider">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                    <CardFooter>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "PROCEEDING" : "PROCEED"}
                        </Button>
                    </CardFooter>

                </Card>

            </div>
</form>
</Form>
        </div>
    );
}
