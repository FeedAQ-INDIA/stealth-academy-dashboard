import {Card, CardHeader} from "@/components/ui/card.jsx";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {useAuthStore} from "@/zustland/store.js";
import axiosConn from "@/axioscon.js";
import {toast} from "@/components/hooks/use-toast.js";


function MyAccount() {
    const {userDetail, fetchUserDetail} = useAuthStore()

    const createAccountSchema = z.object({
        firstName: z.string()
            .min(1, "Name must be at least one character long."),
        lastName: z.string().optional(),
        number: z
            .string()
            .length(10, "Phone number must be 10 digits.")
     });
    const createAccountForm = useForm({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {firstName: "", lastName: "", number: ''},
    });

    useEffect(() => {
        if (userDetail) {
            createAccountForm.reset({
                firstName: userDetail.firstName,
                lastName: userDetail.lastName,
                number: userDetail.number,
            });
        }
    }, [userDetail]);

    function onSubmit(data) {
        axiosConn.post(import.meta.env.VITE_API_URL + '/saveUserDetail', {
            firstName: data.firstName,
            lastName: data.lastName,
            number: data.number,
        }).then(res => {
            toast({
                title: "User updated successfully!",
            });
            fetchUserDetail()
        }).catch(err => {
            toast({
                title: "User updation failed!",
            });
        });
    }

    return (
        <>


            <div className="p-6">
                <Card className="border-0 bg-[#ffdd00]">
                    <CardHeader>
                        <div className="flex flex-sm justify-items-center gap-4 items-center">
                            <Avatar className="w-12 h-12">
                                <AvatarFallback className="text-xl">{userDetail?.nameInitial}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-xl font-medium">Welcome {userDetail?.derivedUserName}</h1>
                                <p>Member since {userDetail?.created_date}</p>
                            </div>
                        </div>


                    </CardHeader>
                </Card>
                <div className="my-16">
                    <Form {...createAccountForm}>
                        <form
                            onSubmit={createAccountForm.handleSubmit(onSubmit)}
                            className="w-full space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid w-full   items-center gap-1.5">
                                    <FormField
                                        control={createAccountForm.control}
                                        name="firstName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="First Name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="grid w-full  items-center gap-1.5">
                                    <FormField
                                        control={createAccountForm.control}
                                        name="lastName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Last Name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="grid w-full  items-center gap-1.5">

                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" id="email" value={userDetail.email} readOnly/>
                                </div>
                                <div className="grid w-full  items-center gap-1.5">
                                    <FormField
                                        control={createAccountForm.control}
                                        name="number"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>

                                                    <Input
                                                        {...field}
                                                        type="text" // change to text to allow better control
                                                        placeholder="Phone Number"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        onChange={(e) => {
                                                            const cleaned = e.target.value.replace(/\D/g, ""); // remove non-digits
                                                            field.onChange(cleaned);
                                                        }}
                                                        value={field.value}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="grid w-full  items-center gap-1.5">
                                    <Label htmlFor="language">Language</Label>
                                    <Input type="text" id="language" value="English" readOnly/>
                                </div>
                                <div className="grid w-full  items-center gap-1.5">
                                    <Label htmlFor="country">Country</Label>
                                    <Input type="text" id="country" value="India" readOnly/>
                                </div>
                            </div>
                            <div className="flex gap-4 my-6">
                                <Button onClick={()=> createAccountForm.reset()} variant="outline">Reset</Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

        </>)

}


export default MyAccount;