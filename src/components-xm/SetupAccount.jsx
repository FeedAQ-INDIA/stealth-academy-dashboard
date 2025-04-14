import {Input} from "@/components/ui/input";
import {Label} from "@radix-ui/react-dropdown-menu";
import React, {useEffect, useState} from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axiosConn from "../axioscon";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {data} from "autoprefixer";
import {useToast} from "@/components/hooks/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {useDispatch} from "react-redux";
 import {
    Card,
    CardContent,
    CardDescription, CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useAuthStore} from "@/zustland/store.js";
import backgroundImage from '../assets/LOGIN_BACKGROUND.jpg'
import logo from '../assets/logo.png'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {Separator} from "@/components/ui/separator.jsx";


function SetupAccount() {
     const location = useLocation();
    const {  setUserDetail, userDetail, accessToken, setAccessToken  } = useAuthStore();

    const [currentScreen, setCurrentScreen] = useState(0);
    const navigate = useNavigate();
    const {toast} = useToast();

    const orgSchema = z.object({
        name: z.string().min(3, "Repository name is required"),
        email: z.string().email({message: "Invalid email address"}),
        contact: z
            .string()
            .length(10, {message: "Must be exactly 5 characters long"}),
        headCount: z.enum(["1-10", "11-50", "51-100", "101-500", "500+"]),
        domain: z.enum([
            "technology",
            "healthcare",
            "finance",
            "education",
            "retail",
        ]),
    });


    const joinOrgSchema = z.object({
        inviteCode: z
            .string()
            .regex(/^\d{6}$/, "Invalid Code! Must be a 6-digit number."),
    });

    const form = useForm({
        resolver: zodResolver(orgSchema),
        defaultValues: {
            name: "",
            email: "",
            contact: "",
            headCount: "1-10",
            domain: "technology",
        },
    });

    const joinOrgForm = useForm({
        resolver: zodResolver(joinOrgSchema),
        defaultValues: {
            inviteCode: ''
        },
    });

    const onSubmit = (data) => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/createOrg", {
                orgName: data.name,
                orgEmail: data.email,
                orgNumber: data.contact,
                metadata: null,
                orgHeadCount: data.headCount,
                orgDomain: data.domain,
            })
            .then((res) => {
                console.log(res?.data);
                setAccessToken(res.data.accessToken);
                toast({
                    title: "Organization Created Successfully",
                    description:
                        " Organization Created Successfully and Account is linked",
                });
                navigate("/organization");
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "You submitted the following values:",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(err, null, 2)}</code>
            </pre>
                    ),
                });
            });
    };

    const handleJoinOrg = (data) => {
        console.log('calling handle org join')
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/joinOrg", {
                joinCode: data.inviteCode,
             })
            .then((res) => {
                console.log(res?.data);
                joinOrgForm.reset()
                toast({
                    title: res?.data?.data?.message,
                });
                if(res?.data?.data?.type == 'S'){
                    console.log('org')
                    setAccessToken(res.data.accessToken);
                    navigate("/organization");
                }
             })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "Failed to join",
                });
            });
    };


    return (
        <div>
            <section className=" h-screen w-full  px-4  text-white  "  style={{ backgroundImage: `url(${backgroundImage})` }}>
                {currentScreen == 0 ? (

                    <div className="flex text-center items-center justify-center h-screen">
                        <Card className="mx-auto h-[calc(100svh-8em)] w-100 lg:w-2/5 md:w-1/2 rounded-none p-5 flex flex-col">
                            <CardHeader>
                                <CardTitle>
                                    <img src={logo} className="size-8 w-fit mx-auto" alt="logo" />
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Understand Your User. Every Experience Counts
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-5 flex-grow">
                                <div className="flex flex-col justify-center gap-6">
                                    <div>
                                        <p className="text-base text-muted-foreground">
                                            Be the owner and build your CX workspace
                                        </p>
                                        <Button variant="outline" className="w-full mt-2" size="lg" onClick={() => setCurrentScreen(1)}>
                                            Create an Organisation Account
                                        </Button>
                                    </div>
                                    <div className="relative flex items-center">
                                        <hr className="flex-grow border-t border-gray-300" />
                                        <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
                                        <hr className="flex-grow border-t border-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-base text-muted-foreground">
                                            Collaborate with an existing setup
                                        </p>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full mt-2" size="lg">
                                                    Join an Organisation
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium leading-none">Join Organization</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Enter the invite code sent on your email.
                                                        </p>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Form {...joinOrgForm}>
                                                            <form onSubmit={joinOrgForm.handleSubmit(handleJoinOrg)} className="w-full space-y-6">
                                                                <div className="items-center gap-4">
                                                                    <FormField
                                                                        control={joinOrgForm.control}
                                                                        name="inviteCode"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <InputOTP maxLength={6} {...field}>
                                                                                        <InputOTPGroup className="mx-auto">
                                                                                            <InputOTPSlot index={0} />
                                                                                            <InputOTPSlot index={1} />
                                                                                            <InputOTPSlot index={2} />
                                                                                            <InputOTPSlot index={3} />
                                                                                            <InputOTPSlot index={4} />
                                                                                            <InputOTPSlot index={5} />
                                                                                        </InputOTPGroup>
                                                                                    </InputOTP>
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <Button type="submit">Join</Button>
                                                            </form>
                                                        </Form>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <div className="w-full">
                                    <Link to={`${import.meta.env.VITE_API_URL}/auth/logout`}>
                                        <Button size="sm" variant="ghost" className="text-center w-full mt-2">
                                            Sign Out
                                        </Button>
                                    </Link>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>


                ) : (
                    ""
                )}

                {currentScreen == 1 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div></div>
                        <div
                            className="bg-white min-h-screen col-span-2 shadow-xl shadow-inner text-black p-6 md:px-10">
                {/*            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-center text-3xl font-extrabold text-transparent sm:text-5xl">*/}
                {/*                Welcome to XM Dyno*/}
                {/*                <span className="block text-2xl mt-6 text-black">*/}
                {/*  Fill in the details to proceed with account setup*/}
                {/*</span>*/}
                {/*            </h1>*/}
                            <h1 className="text-2xl font-semibold text-center">COMPLETE ACCOUNT SETUP TO PROCEED</h1>

                            <div className="my-14">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="w-full space-y-6"
                                    >
                                        <div className="grid w-full items-center gap-1.5 my-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Organisation Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter Organisation Name"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid w-full items-center gap-1.5 my-6">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Organisation Secondary Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter Secondary Email"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid w-full items-center gap-1.5 my-6">
                                            <FormField
                                                control={form.control}
                                                name="contact"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Organisation Contact</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter Contact Number"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid w-full items-center gap-1.5 my-6">
                                            <FormField
                                                control={form.control}
                                                name="headCount"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Organisation Head Count</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                id="orgHeadCount"
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select a Head Count"/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectItem value="1-10">1-10</SelectItem>
                                                                        <SelectItem value="11-50">11-50</SelectItem>
                                                                        <SelectItem value="51-100">
                                                                            51-100
                                                                        </SelectItem>
                                                                        <SelectItem value="101-500">
                                                                            101-500
                                                                        </SelectItem>
                                                                        <SelectItem value="500+">500+</SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid w-full items-center gap-1.5 my-6">
                                            <FormField
                                                control={form.control}
                                                name="domain"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Organisation Domain</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                id="orgDomain"
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue
                                                                        placeholder="Select Organisation Domain"/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectItem value="technology">
                                                                            Technology
                                                                        </SelectItem>
                                                                        <SelectItem value="healthcare">
                                                                            Healthcare
                                                                        </SelectItem>
                                                                        <SelectItem value="finance">
                                                                            Finance
                                                                        </SelectItem>
                                                                        <SelectItem value="education">
                                                                            Education
                                                                        </SelectItem>
                                                                        <SelectItem value="retail">
                                                                            Retail
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex gap-2 my-6">
                                            <Button onClick={() => {
                                                form.reset();
                                                setCurrentScreen(0)
                                            }}>Back</Button>
                                            <Button onClick={() => form.reset()}>Reset</Button>
                                            <Button type="submit">Continue</Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>

                        <div></div>
                    </div>
                ) : (
                    ""
                )}
            </section>
        </div>
    );
}

export default SetupAccount;
