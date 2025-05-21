import {Search,} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx"
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import {CreateMockInterview} from "@/components-xm/MockInterview/CreateMockInterview.jsx";
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Badge} from "@/components/ui/badge.jsx";


export default function MockInterviewHistoryDetail() {


    const {MockInterviewId} = useParams();

    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
    const navigate = useNavigate()

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState(null);


    const [exploreCourseText, setExploreCourseText] = useState("");


    return (
        <>       <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">

            <Breadcrumb>
                <BreadcrumbList>

                    <BreadcrumbItem>
                        <BreadcrumbPage className="truncate max-w-[30ch]">Mock Interview History </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="truncate max-w-[30ch]"  >{MockInterviewId}</BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial">

            </div>
        </header>


            <div className="p-6   h-screen">

                <section className="my-6 grid grid-cols-1 ">

                <Card className="  bg-muted/50 border-none">
                    <CardHeader>

                        <div className="flex flex-wrap gap-2 w-full mb-3 items-center">
                            <div className=" ">
                                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                                   #nkcf
                                </CardTitle>
                            </div>
                            <div className="ml-auto ">

                            </div>
                        </div>

                    </CardHeader>


                </Card>
                </section>



            </div></>
    );
}
