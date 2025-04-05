import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {useToast} from "@/components/hooks/use-toast.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Label} from "@/components/ui/label.jsx";

function EditUserProfile() {
    const [userDetail, setUserDetail] = useState([]);
    const {toast} = useToast();
    const {WorkspaceId, UserId} = useParams();

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
        if(!UserId) {
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

        }else {
            axiosConn
                .post("http://localhost:3000/searchRecord",
                    {
                        limit: 20,
                        offset: 0,
                        getThisData: {
                            datasource: "User",
                            order: [],
                            attributes: [],
                            where: {
                                userId: UserId
                            },

                            include: [
                                {
                                    datasource: "Org",
                                    as: "organizations",
                                    required: true,
                                    where: {
                                        orgId: localStorage.getItem("currentOrg"),

                                    }
                                },
                                {
                                    datasource: "UserContext",
                                    as: "usercontext",
                                    required: false,
                                    include: [
                                        {
                                            datasource: "WorkspaceField",
                                            as: "fielddetail",
                                            required: false,

                                        }
                                    ]
                                }
                            ]
                        },
                    })
                .then((res) => {
                    console.log(res?.data?.data);
                    setUserDetail(res.data?.data?.results?.[0]);
                    const userDetail = res.data?.data?.results?.[0];
                    if (userDetail) {
                        accountForm.reset({
                            userId: userDetail?.userId || "",
                            firstName: userDetail?.firstName || "",
                            lastName: userDetail?.lastName || "",
                            email: userDetail?.email || "",
                            number: userDetail?.number || "",
                            jobTitle: userDetail?.organizations?.jobTitle || "",
                            departmentName: userDetail?.organizations?.department || "",
                            baseLocation: userDetail?.organizations?.baseLocation || "",
                            language: userDetail?.organizations?.language || "",
                            timezone: userDetail?.organizations?.timezone || "",
                            u_created_at: userDetail?.u_created_at || "",
                            u_updated_at: userDetail?.u_updated_at || "",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };



    function accountSubmit(data) {
        console.log("triggered")
        axiosConn.post("http://localhost:3000/updateUser", {
            orgId: localStorage.getItem("currentOrg"),
            userId: userDetail?.userId || null,
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
                            <Link to={`/user/${UserId}`}>User Profile
                            </Link> </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit User Profile</BreadcrumbPage>
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
                    </Avatar> <div className="mt-4 text-center">
                    <Link to={`/user/${UserId}`}>
                        <Button size="sm" variant="outline" className="shadow-sm">Back to User Profile</Button>
                    </Link>
                </div>
                </div>

                <Form  {...accountForm} className="my-6">
                    <form
                        onSubmit={accountForm.handleSubmit(accountSubmit) }
                        className="w-full space-y-6"
                    >
                        <div>
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

                        <div className="flex gap-2 mt-4 ">
                            <Button
                                onClick={() => accountForm.reset()}
                            >
                                Reset
                            </Button>
                            <Button type="submit">Update</Button>
                        </div>
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

export default EditUserProfile;
