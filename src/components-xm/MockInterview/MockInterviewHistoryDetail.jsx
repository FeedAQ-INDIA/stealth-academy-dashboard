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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";

export default function MockInterviewHistoryDetail() {


    const {MockInterviewId} = useParams();

    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
    const navigate = useNavigate()
 


    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [mockInterviewHistoryData, setMockInterviewHistoryData] = useState([]);

    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "InterviewReq", attributes: [], where: {userId: userDetail?.userId,
                interviewReqId: MockInterviewId},
        },
    });

    useEffect(() => {
        fetchMockInterviewHistory();
    }, [apiQuery]);

    const fetchMockInterviewHistory = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
            .then((res) => {
                console.log(res.data);
                setMockInterviewHistoryData(res.data.data?.results?.[0]);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <>       <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">

            <Breadcrumb>
                <BreadcrumbList>

                    <BreadcrumbItem>
                        <BreadcrumbPage className="truncate max-w-[30ch]">Mock Interview History  </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="truncate max-w-[30ch]"  >Interview Id #{MockInterviewId}</BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial">

            </div>
        </header>


            <div className="p-3 md:p-6">

                <section className=" grid grid-cols-1 ">

                <Card className="  bg-muted/50 border-none">
                    <CardHeader>

                        <div className="flex flex-wrap gap-2 w-full mb-3 items-center">
                            <div className=" ">
                                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
                                   Mock Interview History Detail
                                </CardTitle>
                            </div>
                            <div className="ml-auto ">

                            </div>
                        </div>

                    </CardHeader>


                </Card>
                </section>


                {mockInterviewHistoryData && (
                    <Card className=" bg-muted/50 border-none mt-4 p-4 ">
                        <CardHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-4 w-full ">

                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Interview ID: </span>
                                {mockInterviewHistoryData.interviewReqId}
                            </p>


                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Interview Date: </span>
                                {mockInterviewHistoryData.interviewReqDate}
                            </p>
                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium"> Interview Time: </span>
                                {mockInterviewHistoryData.interviewReqTime}
                            </p>

                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Duration (mins): </span>
                                {mockInterviewHistoryData.interviewReqDuration}
                            </p>
                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Cost: </span>
                               {mockInterviewHistoryData.interviewReqCost? `Rs.${mockInterviewHistoryData.interviewReqCost}/-` : 'FREE'}
                            </p>

                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Status: </span>
                                {mockInterviewHistoryData.interviewReqStatus}
                            </p>
                            {mockInterviewHistoryData.interviewReqStatus === 'CANCELLED' && (
                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Cancel Reason: </span>
                                    {mockInterviewHistoryData.interviewReqCancelReason || "N/A"}
                                </p>
                            )}

                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Mode: </span>
                                {mockInterviewHistoryData.interviewReqMode}
                            </p>
                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Interview Medium: </span>
                                {mockInterviewHistoryData.interviewReqMedium}
                            </p>
                                <p className="text-base tracking-wide text-left mt-2 md:col-span-2  lg:col-span-3">
                                    <span className="text-black font-medium">CV: </span>
                                     <a href={mockInterviewHistoryData.interviewReqCV} target="_blank" className="text-blue-600 underline ml-1">
                                        {mockInterviewHistoryData.interviewReqCV}
                                    </a>
                                </p>
                            <p className="text-base tracking-wide text-left mt-2 md:col-span-2  lg:col-span-3">
                                <span className="text-black font-medium">Join URL: </span>
                                <a href={mockInterviewHistoryData.interviewReqUrl} target="_blank" className="text-blue-600 underline ml-1">
                                    {mockInterviewHistoryData.interviewReqUrl}
                                </a>
                            </p>

                            <p className="text-base tracking-wide text-left mt-2 md:col-span-2  lg:col-span-3">
                                <span className="text-black font-medium">Tags: </span>
                                {mockInterviewHistoryData.interviewReqTags?.length > 0
                                    ? mockInterviewHistoryData.interviewReqTags.join(", ")
                                    : "None"}
                            </p>

                            <p className="text-base tracking-wide text-left mt-2 md:col-span-2 lg:col-span-3">
                                <span className="text-black font-medium">Note: </span>
                                <span className="whitespace-pre-wrap">{mockInterviewHistoryData.interviewReqNote || "N/A"}</span>
                            </p>



                                {mockInterviewHistoryData.interviewReqAttach && <p className="text-base tracking-wide text-left mt-2 md:col-span-2  lg:col-span-3">
                                <span className="text-black font-medium">Attachments: </span>
                                 {JSON.stringify(mockInterviewHistoryData.interviewReqAttach, null, 2)}

                            </p>}

                                {mockInterviewHistoryData.courseId && <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Course ID: </span>
                                    {mockInterviewHistoryData.courseId}
                                </p>}

                                {mockInterviewHistoryData.courseTopicId &&
                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Course Topic ID: </span>
                                {mockInterviewHistoryData.courseTopicId}
                            </p>}


                            </div>
                            <div className="flex flex-wrap justify-between gap-4  ">
                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Created Date: </span>
                                    {mockInterviewHistoryData.v_created_date}
                                </p>
                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Created Time: </span>
                                    {mockInterviewHistoryData.v_created_time}
                                </p>

                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Updated Date: </span>
                                    {mockInterviewHistoryData.v_updated_date}
                                </p>
                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Updated Time: </span>
                                    {mockInterviewHistoryData.v_updated_time}
                                </p>

                            </div>

                        </CardHeader>
                    </Card>
                )}

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1"  className=" bg-muted/50 border-none mt-4 px-4 rounded-lg">
                        <AccordionTrigger className="text-2xl">Instructions</AccordionTrigger>
                        <AccordionContent className="bg-muted/50 p-4">
                            <div dangerouslySetInnerHTML={{ __html: mockInterviewHistoryData?.interviewInstruct }} >

                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>


            </div></>
    );
}
