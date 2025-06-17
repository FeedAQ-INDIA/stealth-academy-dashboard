import {Input} from "@/components/ui/input.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useState} from "react";
import {SheetClose, SheetFooter} from "@/components/ui/sheet.jsx";
import {Button} from "@/components/ui/button.jsx";


export function LetsConnectForm() {

    const [isSubmitting, setIsSubmitting] = useState(false);


    const createLetsConnectSchema = z.object({

        name: z.string().min(3,{message: "Invalid Name"}),
        email: z.string().min(3,{message: "Invalid Email"}),
        countryCode: z.string(),
        phone: z.string().min(10,{message: "Invalid Number"}),
    });


    const createLetsConnectForm = useForm({
        resolver: zodResolver(createLetsConnectSchema),
        defaultValues: {
            name: "",
            email: "",
            countryCode: "+91",
            phone: "",
        },
    });

    function onSubmit(data) {
        setIsSubmitting(true);
        console.log("Submitting mock interview:", data);

    }

    return (
        <div className="">

            <Form {...createLetsConnectForm}>
                <form onSubmit={createLetsConnectForm.handleSubmit(onSubmit)} className="w-full space-y-6 ">
                    <div>

                        <div className="mt-2">

                            <FormField
                                control={createLetsConnectForm.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name*</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter Name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-2">

                            <FormField
                                control={createLetsConnectForm.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email*</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter Email" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="mt-2 ">
                            <FormLabel>Phone*</FormLabel>
                            <div className="flex gap-2 mt-1">
                                <FormField
                                    control={createLetsConnectForm.control}
                                    name="countryCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={String(field.value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Country Code" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['+91', '+1', '+44', '+61', '+966'].map((min) => (
                                                            <SelectItem key={min} value={min}>
                                                                {min}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={createLetsConnectForm.control}
                                    name="phone"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input type="tel" placeholder="Enter Phone"  {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>


                        </div>


                        <SheetFooter className="mt-4">
                            <Button type="submit">Submit</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>

                    </div>
                </form>
            </Form>
        </div>
    );
}
