import React, {useEffect, useState} from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Button} from "@/components/ui/button";
import {CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import axiosConn from "@/axioscon";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Link} from "react-router-dom";
import {useToast} from "@/components/hooks/use-toast.js";

function EditPersonalGeneralSettings() {
    const [userDetail, setUserDetail] = useState([]);
    const {toast} = useToast();

    const accountSchema = z.object({
        userId: z.string().min(1, "User ID is required"),
        firstName: z.string().min(1, "First Name is required"),
        lastName: z.string().optional(),
        email: z.string().email("Invalid email address"),
        number: z.string().optional(),
        jobTitle: z.string().optional(),
        departmentName: z.string().optional(),
        baseLocation: z.string().optional(),
        language: z.string().optional(),
        timezone: z.string().optional(),
        u_created_at: z.string().optional(),
        u_updated_at: z.string().optional(),
    });

    const accountForm = useForm({
        resolver: zodResolver(accountSchema), defaultValues: {
            userId: "",
            firstName: "",
            lastName: "",
            email: "",
            number: "",
            jobTitle: "",
            departmentName: "",
            baseLocation: "",
            language: "",
            timezone: "",

        },
    });

    useEffect(() => {
        fetchUserDetail();
    }, []);

    const fetchUserDetail = () => {
        axiosConn
            .post("http://localhost:3000/getUser", {orgId: localStorage.getItem("currentOrg")})
            .then((res) => {
                console.log(res?.data?.data);
                setUserDetail(res?.data?.data);
                const userDetail = res?.data?.data;
                if (userDetail) {
                    accountForm.reset({
                        userId: userDetail?.userId || "",
                        firstName: userDetail?.firstName || "",
                        lastName: userDetail?.lastName || "",
                        email: userDetail?.email || "",
                        number: userDetail?.number || "",
                        jobTitle: userDetail?.userOrgData?.jobTitle || "",
                        departmentName: userDetail?.userOrgData?.department || "",
                        baseLocation: userDetail?.userOrgData?.baseLocation || "",
                        language: userDetail?.userOrgData?.language || "",
                        timezone: userDetail?.userOrgData?.timezone || "",
                        u_created_at: userDetail?.u_created_at || "",
                        u_updated_at: userDetail?.u_updated_at || "",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };



    function onAccountUpdateSubmit(data) {
        console.log("triggered")
        axiosConn.post("http://localhost:3000/updateUser", {
            orgId: localStorage.getItem("currentOrg"),
            firstName: data.firstName,
            lastName: data.lastName,
            nameInitial: data.nameInitial,
            email: data.email,
            number: data.number,
            profilePic: data.profilePic,
            jobTitle: data.jobTitle,
            department: data.department,
            baseLocation: data.baseLocation,
            language: data.language,
            timezone: data.timezone
        })
            .then((res) => {
                console.log(res?.data);
                toast({
                    title: "User Updated Successfully", description: " User Updated Successfully",
                });
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "You submitted the following values:", description: "Error occured while updating"
                });
            });
    };



    return (<div>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink>
                            <Link to={`/account-settings/personal-profile?tab=personal-profile`}>Personal Profile
                            </Link> </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit Personal Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial"></div>
        </header>
        <div className="h-[calc(100svh-4em-4em)]" style={{overflowY: "auto"}}>

            <div className="p-4 w-3/5 mx-auto ">
                <div className="items-center my-12">
                    <Avatar className="mx-auto h-16 w-16 md:h-28 md:w-28 shadow-md">
                        <AvatarFallback className="text-lg md:text-3xl">
                            {userDetail?.nameInitial}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <Form  {...accountForm} className="my-6">
                    <form
                        onSubmit={accountForm.handleSubmit(onAccountUpdateSubmit)}
                        className="w-full space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">


                            <div className="grid w-full   items-center gap-3 ">
                                <FormField
                                    control={accountForm.control}
                                    name="firstName"
                                    render={({field}) => (<FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="First Name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3 ">
                                <FormField
                                    control={accountForm.control}
                                    name="lastName"
                                    render={({field}) => (<FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Last Name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3 ">
                                <FormField
                                    control={accountForm.control}
                                    name="email"
                                    render={({field}) => (<FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3 ">
                                <FormField
                                    control={accountForm.control}
                                    name="number"
                                    render={({field}) => (<FormItem>
                                            <FormLabel>Contact</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contact" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3  ">
                                <FormField
                                    control={accountForm.control}
                                    name="jobTitle"
                                    render={({field}) => (<FormItem>
                                            <FormLabel>Job Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Job Title" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3  ">
                                <FormField
                                    control={accountForm.control}
                                    name="departmentName"
                                    render={({field}) => (<FormItem>
                                            <FormLabel>Department Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Department Name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3  ">
                                <FormField
                                    control={accountForm.control}
                                    name="baseLocation"
                                    render={({field}) => (<FormItem>
                                            <FormLabel>Base Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Base Location" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3  ">
                                <FormField
                                    control={accountForm.control}
                                    name="language"
                                    render={({field}) => (<FormItem>
                                            <FormLabel>Language</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Language" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3  ">
                                <FormField
                                    control={accountForm.control}
                                    name="timezone"
                                    render={({field}) => (<FormItem>
                                            <FormLabel>Timezone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Timezone" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3 ">
                                <Label>Created at</Label>
                                <Input
                                    placeholder="Created at"
                                    value={userDetail?.u_created_at}
                                    readonly
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3 ">
                                <Label>Updated at</Label>
                                <Input
                                    placeholder="Updated at"
                                    value={userDetail?.u_updated_at}
                                    readonly
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 ">
                            <Button
                                onClick={() => accountForm.reset()}
                            >
                                Reset
                            </Button>
                            <Button type="submit">Update</Button>
                        </div>

                    </form>
                </Form>

                <Separator className="my-12"/>
                <div className="my-4">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg">Disable your account</CardTitle>
                        <CardDescription>When you delete your account, you lose access to FeedAQ account services, and
                            we permanently delete your personal data. You can cancel the deletion within 14 days by
                            logging in.

                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex gap-2 mt-6 p-0">
                        <Button>Disable your Account</Button>

                        <Button>Delete your Account</Button> </CardContent>
                </div>
            </div>

        </div>
    </div>);
}

export default EditPersonalGeneralSettings;
