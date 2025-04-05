import React, {useEffect, useState} from "react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,} from "@/components/ui/breadcrumb";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import axiosConn from "@/axioscon";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Link} from "react-router-dom";

function PersonalGeneralSettings() {
    const [userDetail, setUserDetail] = useState([]);


    useEffect(() => {
        fetchUserDetail();
    }, []);

    const fetchUserDetail = () => {
        axiosConn
            .post("http://localhost:3000/getUser",
                {orgId : localStorage.getItem("currentOrg")})
            .then((res) => {
                console.log(res?.data?.data);
                setUserDetail(res?.data?.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/><Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>Personal Profile</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">
                    <Link to={`/account-settings/personal-profile/edit`}> <Button size="sm">Edit</Button></Link>

                </div>
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

                    <div >

                        <Card className="rounded-1 my-2">
                            <CardHeader>
                                <div>

                                    <CardTitle className="text-xl text-center">{userDetail?.firstName} {userDetail?.lastName}</CardTitle>
                                    {/*<CardDescription className="mt-4">{orgDetail.description}</CardDescription>*/}

                                </div>



                            </CardHeader>

                        </Card>

                        <Card className="rounded-1 my-2">
                            <CardHeader>
                                <CardTitle  className="text-lg font-normal">Personal Information</CardTitle>
                            </CardHeader>
                            <Separator className="mb-3"/>
                            <CardContent>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">First Name</p>
                                        <h5>{userDetail?.firstName || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Last Name</p>
                                        <h5>{userDetail?.lastName || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Email</p>
                                    <h5>{userDetail?.email || "N/A"}</h5>
                                </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Contact</p>
                                        <h5>{userDetail?.number || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Job Title</p>
                                        <h5>{userDetail?.userOrgData?.jobTitle || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Department Name</p>
                                        <h5>{userDetail?.userOrgData?.department || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Base Location</p>
                                        <h5>{userDetail?.userOrgData?.baseLocation || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Language</p>
                                        <h5>{userDetail?.userOrgData?.language || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Time zone</p>
                                        <h5>{userDetail?.userOrgData?.timeZone || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Created at</p>
                                        <h5>{userDetail?.u_created_at ? new Date(userDetail.u_created_at).toLocaleString() : "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Last updated at</p>
                                        <h5>{userDetail?.u_updated_at ? new Date(userDetail.u_updated_at).toLocaleString() : "N/A"}</h5>
                                    </div>


                                </div>

                            </CardContent>
                        </Card>

                    </div>
         <Separator className="my-12"/>
                    <div className="my-4">
                        <CardHeader className="p-0" >
                            <CardTitle className="text-lg">Disable your account</CardTitle>
                            <CardDescription>When you delete your account, you lose access to FeedAQ account services, and we permanently delete your personal data. You can cancel the deletion within 14 days by logging in.

                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex gap-2 mt-6 p-0">
                            <Button>Disable your Account</Button>

                            <Button>Delete your Account</Button>                        </CardContent>
                    </div>
                </div>

            </div>
        </div>);
}

export default PersonalGeneralSettings;
