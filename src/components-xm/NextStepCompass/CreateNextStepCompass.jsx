import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/zustland/store.js";
import axiosConn from "@/axioscon.js";
import { toast } from "@/components/hooks/use-toast.js";

import {
    Button,
} from "@/components/ui/button.jsx";
import {
    Input,
} from "@/components/ui/input.jsx";
import {
    Textarea,
} from "@/components/ui/textarea.jsx";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select.jsx";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form.jsx";
import {
    Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card.jsx";

// Zod schema
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
    note: z.string().optional(),
    background: z.string().optional(),
    customBackground: z.string().optional(),
    counsellingTopic: z.string().optional(),
    languagePreference: z.string().optional(),
    customLanguagePreference: z.string().optional(),
});

export function CreateNextStepCompass() {
    const { userDetail } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(createMockInterviewSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            time: "",
            note: "",
            background: "",
            customBackground: "",
            counsellingTopic: "",
            languagePreference: "",
            customLanguagePreference: "",
        },
    });

    const watchBackground = form.watch("background");
    const watchLanguagePreference = form.watch("languagePreference");

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const res = await axiosConn.post("/raiseNextStepCompassRequest", data);
            toast({ title: res.data?.data?.message || "Scheduled successfully!" });
            form.reset();
        } catch (err) {
            toast({ title: "Failed to schedule mock interview." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4 h-[calc(100svh-4em)] overflow-y-auto">
            <Card className="border-0 bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-semibold tracking-wider">
                        SCHEDULE NEXT STEP COMPASS SESSION
                    </CardTitle>
                </CardHeader>
            </Card>

            <Card className="border-0 bg-muted/50 py-6">
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">

                            {/* Date */}
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Session Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Time */}
                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Session Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" placeholder="e.g. 14:30" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Background */}
                            <FormField
                                control={form.control}
                                name="background"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Educational/Professional Background</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your background" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[
                                                        "High School Student",
                                                        "Undergraduate (B.Tech, B.Sc, B.Com, etc.)",
                                                        "Postgraduate",
                                                        "Working Professional",
                                                        "Career Switcher",
                                                        "Other"
                                                    ].map(option => (
                                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {watchBackground === "Other" && (
                                <FormField
                                    control={form.control}
                                    name="customBackground"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specify your background</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Freelancer, Gap Year, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Counselling Topic */}
                            <FormField
                                control={form.control}
                                name="counsellingTopic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Counselling Topic</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Resume review, Career path advice, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Language Preference */}
                            <FormField
                                control={form.control}
                                name="languagePreference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Language Preference</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {["English", "Hindi", "Regional Language (specify below)"].map(option => (
                                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {watchLanguagePreference === "Regional Language (specify below)" && (
                                <FormField
                                    control={form.control}
                                    name="customLanguagePreference"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specify the regional language</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Tamil, Bengali, Marathi..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Notes */}
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Additional Notes</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Any notes to the counsellor..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Scheduling..." : "SCHEDULE"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
