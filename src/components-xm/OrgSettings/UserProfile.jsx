import React, {useEffect, useState} from "react";

import {Badge} from "@/components/ui/badge.jsx";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import RecordComment from "@/components-xm/Workspace/RecordComment.jsx";
import {useAuthStore} from "@/zustland/store.js";
import TagSearchModule from "@/components-xm/Workspace/Modules/TagSearchModule.jsx";
import ProductsSearchModule from "@/components-xm/Workspace/Modules/ProductsSearchModule.jsx";
import StatusModule from "@/components-xm/Workspace/Modules/StatusModule.jsx";
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import TeamSearchModule from "@/components-xm/Workspace/Modules/TeamSearchModule.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import MultiSelectField from "@/components-xm/Workspace/Modules/MultiSelectField.jsx";
import {Button} from "@/components/ui/button.jsx";
import * as _ from "lodash";
import WatcherSearchModule from "@/components-xm/Workspace/Modules/WatcherSearchModule.jsx";
import UserProfileContext from "@/components-xm/OrgSettings/UserProfileContext.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";

function UserProfile() {
    const navigate = useNavigate();

    const {WorkspaceId, UserId} = useParams();

    const [profileDetail, setUserProfile] = useState({});


    useEffect(() => {
        fetchRecord();
    }, [ ]);

    const fetchRecord = () => {
        if(!UserId) {
            axiosConn
                .post("http://localhost:3000/getUser",
                    {orgId: localStorage.getItem("currentOrg")})
                .then((res) => {
                    console.log(res.data?.data);

                    setUserProfile(res.data?.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }else{
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

                                include:[
                                    {
                                        datasource: "Org",
                                        as: "organizations",
                                        required: true,
                                         where:{
                                             orgId: localStorage.getItem("currentOrg"),

                                         }
                                    },
                                    {
                                        datasource: "UserContext",
                                        as: "usercontext",
                                        required: false,
                                        include:[
                                            {
                                                datasource:  "WorkspaceField",
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
                        setUserProfile(res.data?.data?.results?.[0]);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
         }
    };




    return (
        <div className="max-h-[calc(100svh-4em)] overflow-y-auto">
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
            {/*<SidebarTrigger*/}
            {/*    className="-ml-1"/>*/}
            {/*<Separator orientation="vertical" className="mr-2 h-4"/>*/}
            <Breadcrumb>
                <BreadcrumbList>
                    {WorkspaceId && <> <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                            <Link to={ `/workspace/${WorkspaceId}/views?tab=views`}>Workspace</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/> </>}


                    <BreadcrumbItem>
                        <BreadcrumbPage>User Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial"></div>
        </header>
        <CardHeader className="flex flex-row items-center bg-muted/50">
            <div className="flex items-center gap-3">
                <Avatar className="mx-auto h-14 w-14   shadow-md">
                    <AvatarFallback className="text-xl   ">
                        {profileDetail?.nameInitial}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="group flex items-center gap-2 text-lg">

                        {profileDetail?.derivedUserName} - <span
                        className="text-muted-foreground">#{profileDetail?.userId}</span>

                    </CardTitle>
                    <CardDescription>
                        {UserId?'User Profile' : 'Personal Profile' }
                    </CardDescription>
                </div>

            </div>
            <div className="ml-auto sm:flex-initial">
                {UserId && <Link to={`/user/${UserId}/edit`}>
                    <Button>Edit Profile</Button>
                </Link>}
            </div>

        </CardHeader>

        <div className="p-4">

            <div className="grid grid-cols-1 md:grid-cols-6  gap-4">
                <div className="col-span-4">
                    <Card className="rounded-none my-4 shadow-md">
                        <CardHeader className="flex flex-row items-center bg-muted/50">

                            <CardTitle className="text-lg font-normal">General Information</CardTitle>

                            {!UserId && <div className="ml-auto sm:flex-initial">
                                <Link to={`/account-settings/personal-profile/edit`}> <Button size="sm">Edit</Button></Link>

                            </div>}

                        </CardHeader>
                        <Separator className="mb-3"/>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div
                                    className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-1 md:col-span-2 lg:col-span-3">
                                    <p className="text-muted-foreground">Full Name</p>
                                    <h5>{profileDetail?.firstName +' '+  profileDetail?.lastName  || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">First Name</p>
                                    <h5>{profileDetail?.firstName || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Last Name</p>
                                    <h5>{profileDetail?.lastName || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Email</p>
                                    <h5>{profileDetail?.email || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Contact</p>
                                    <h5>{profileDetail?.number || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Job Title</p>
                                    <h5>{profileDetail?.userOrgData?.jobTitle || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Department Name</p>
                                    <h5>{profileDetail?.userOrgData?.department || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Base Location</p>
                                    <h5>{profileDetail?.userOrgData?.baseLocation || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Language</p>
                                    <h5>{profileDetail?.userOrgData?.language || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Time zone</p>
                                    <h5>{profileDetail?.userOrgData?.timeZone || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Created at</p>
                                    <h5>{profileDetail?.u_created_at ? new Date(profileDetail?.u_created_at).toLocaleString() : "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Last updated at</p>
                                    <h5>{profileDetail?.u_updated_at ? new Date(profileDetail?.u_updated_at).toLocaleString() : "N/A"}</h5>
                                </div>



                            </div>

                        </CardContent>
                    </Card>

                    {!UserId &&
                        <>       <Separator className="my-12"/>
                            <div className="my-4">
                                <CardHeader className="p-0" >
                                    <CardTitle className="text-lg">Disable your account</CardTitle>
                                    <CardDescription>When you delete your account, you lose access to FeedAQ account services, and we permanently delete your personal data. You can cancel the deletion within 14 days by logging in.

                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex gap-2 mt-6 p-0">
                                    <Button>Disable your Account</Button>
                                    <Button>Delete your Account</Button>
                                </CardContent>
                            </div>

                        </>}


                </div>

                <div className={`col-span-2 ${UserId && 'pointer-events-none'}`}>
                    <UserProfileContext/>

                </div>

            </div>


        </div>

    </div>);
}

export default UserProfile;
