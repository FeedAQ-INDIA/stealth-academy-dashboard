import React, {useEffect, useState} from "react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import axiosConn from "@/axioscon.js";
import {useToast} from "@/components/hooks/use-toast.js";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {HiBuildingOffice2} from "react-icons/hi2";
import {Link} from "react-router-dom";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import UserProfileContext from "@/components-xm/OrgSettings/UserProfileContext.jsx";

function OrganizationGeneralSettings() {
    const [orgDetail, setOrgDetail] = useState([]);
    const {toast} = useToast();


    useEffect(() => {
        fetchorgDetail();
    }, []);

    const fetchorgDetail = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 20, offset: 0, getThisData: {
                    datasource: "Org", order: [], attributes: [], where: {
                        orgId: localStorage.getItem("currentOrg"),
                    },
                },
            })
            .then((res) => {
                console.log(res?.data?.data?.results?.[0]);
                setOrgDetail(res?.data?.data?.results?.[0]);
                const orgDetail = res?.data?.data?.results?.[0];

            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (<div>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/><Breadcrumb>
                <BreadcrumbList>
                    {/*<BreadcrumbItem className="hidden md:block">*/}
                    {/*    <BreadcrumbLink href="#">*/}
                    {/*        Repository*/}
                    {/*    </BreadcrumbLink>*/}
                    {/*</BreadcrumbItem>*/}
                    {/*<BreadcrumbSeparator className="hidden md:block"/>*/}
                    <BreadcrumbItem>
                        <BreadcrumbPage>Organization Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            {/*<div className="h-[calc(100svh-4em-4em)]" style={{overflowY: "auto"}}>*/}

            {/*    <div className="p-4 w-3/5 mx-auto ">*/}
            {/*        <div className="items-center my-12">*/}
            {/*            <Avatar className="mx-auto h-16 w-16 md:h-28 md:w-28 shadow-md">*/}
            {/*                <AvatarFallback className="text-lg md:text-3xl">*/}
            {/*                    <HiBuildingOffice2/>*/}
            {/*                </AvatarFallback>*/}
            {/*            </Avatar>*/}
            {/*        </div>*/}

            {/*        <div>*/}

            {/*            <Card className="rounded-1 my-2">*/}
            {/*                <CardHeader>*/}
            {/*                    <div>*/}
            {/*                        <CardTitle className="text-xl text-center">{orgDetail?.orgName}  </CardTitle>*/}
            {/*                    </div>*/}
            {/*                </CardHeader>*/}
            {/*            </Card>*/}

            {/*            <Card className="rounded-1 my-2">*/}
            {/*                <CardHeader>*/}
            {/*                    <CardTitle className="text-lg font-normal">Personal Information</CardTitle>*/}
            {/*                </CardHeader>*/}
            {/*                <Separator className="mb-3"/>*/}
            {/*                <CardContent>*/}

            {/*                    <div className="grid grid-cols-2 gap-4">*/}
            {/*                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">*/}
            {/*                            <p className="text-muted-foreground">Phone Number</p>*/}
            {/*                            <h5>{orgDetail?.orgNumber || "N/A"}</h5>*/}
            {/*                        </div>*/}
            {/*                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">*/}
            {/*                            <p className="text-muted-foreground">Email</p>*/}
            {/*                            <h5>{orgDetail?.orgEmail || "N/A"}</h5>*/}
            {/*                        </div>*/}
            {/*                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">*/}
            {/*                            <p className="text-muted-foreground">Head Count</p>*/}
            {/*                            <h5>{orgDetail?.orgHeadCount || "N/A"}</h5>*/}
            {/*                        </div>*/}
            {/*                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">*/}
            {/*                            <p className="text-muted-foreground">Website Url</p>*/}
            {/*                            <h5>{orgDetail?.orgDomain || "N/A"}</h5>*/}
            {/*                        </div>*/}
            {/*                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">*/}
            {/*                            <p className="text-muted-foreground">Created at</p>*/}
            {/*                            <h5>{orgDetail?.org_created_at ? new Date(orgDetail.org_created_at).toLocaleString() : "N/A"}</h5>*/}
            {/*                        </div>*/}
            {/*                        <div className="border-none rounded-1 hover:bg-muted/50 p-2">*/}
            {/*                            <p className="text-muted-foreground">Last updated at</p>*/}
            {/*                            <h5>{orgDetail?.org_updated_at ? new Date(orgDetail.org_updated_at).toLocaleString() : "N/A"}</h5>*/}
            {/*                        </div>*/}


            {/*                    </div>*/}

            {/*                </CardContent>*/}
            {/*            </Card>*/}

            {/*        </div>*/}
            {/*        <Separator className="my-12"/>*/}
            {/*        <div className="my-4">*/}
            {/*            <CardHeader className="p-0">*/}
            {/*                <CardTitle className="text-lg">Disable your account</CardTitle>*/}
            {/*                <CardDescription>When you delete your account, you lose access to FeedAQ account services,*/}
            {/*                    and we permanently delete your personal data. You can cancel the deletion within 14 days*/}
            {/*                    by logging in.*/}

            {/*                </CardDescription>*/}
            {/*            </CardHeader>*/}

            {/*            <CardContent className="flex gap-2 mt-6 p-0">*/}
            {/*                <Button>Disable your Account</Button>*/}

            {/*                <Button>Delete your Account</Button> </CardContent>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*</div>*/}

        <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="flex items-center gap-3">
                <Avatar className="mx-auto h-14 w-14   shadow-md">
                    <AvatarFallback className="text-xl   ">
                        <HiBuildingOffice2/>
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="group flex items-center gap-2 text-lg">

                        {orgDetail?.orgName} - <span
                        className="text-muted-foreground">#{orgDetail?.orgId}</span>

                    </CardTitle>
                    <CardDescription>
                        Organization
                    </CardDescription>
                </div>


            </div>
            <div className="ml-auto sm:flex-initial">
                <Link to={`/account-settings/organization-profile/edit`}> <Button size="sm">Edit</Button></Link>
            </div>

        </CardHeader>

        <div className="p-4">

                 <div className=" ">
                    <Card className="rounded-none my-4 shadow-md">
                        <CardHeader className="flex flex-row items-center bg-muted/50">

                            <CardTitle className="text-lg font-normal">General Information</CardTitle>

                             <div className="ml-auto sm:flex-initial">
                             </div>

                        </CardHeader>
                        <Separator className="mb-3"/>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Phone Number</p>
                                    <h5>{orgDetail?.orgNumber || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Email</p>
                                    <h5>{orgDetail?.orgEmail || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Head Count</p>
                                    <h5>{orgDetail?.orgHeadCount || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Website Url</p>
                                    <h5>{orgDetail?.orgDomain || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Created at</p>
                                    <h5>{orgDetail?.org_created_at ? new Date(orgDetail.org_created_at).toLocaleString() : "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Last updated at</p>
                                    <h5>{orgDetail?.org_updated_at ? new Date(orgDetail.org_updated_at).toLocaleString() : "N/A"}</h5>
                                </div>


                            </div>

                        </CardContent>
                    </Card>



                </div>




        </div>

    </div>);
}

export default OrganizationGeneralSettings;
