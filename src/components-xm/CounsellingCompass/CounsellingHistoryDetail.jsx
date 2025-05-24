import {Search,} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx"
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";

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

export default function CounsellingHistoryDetail() {


    const {CounsellingId} = useParams();

    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
    const navigate = useNavigate()
 


    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [counsellingHistoryData, setCounsellingHistoryData] = useState(null);

    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "Counselling", attributes: [], where: {userId: userDetail?.userId,
                counsellingId: CounsellingId},
        },
    });

    useEffect(() => {
        fetchMockCounsellingHistory();
    }, [apiQuery]);

    const fetchMockCounsellingHistory = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
            .then((res) => {
                console.log(res.data);
                setCounsellingHistoryData(res.data.data?.results?.[0]);
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
                        <BreadcrumbPage className="truncate max-w-[30ch]">Counselling History  </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="truncate max-w-[30ch]"  >Counselling Id #{CounsellingId}</BreadcrumbPage>
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
                                    Counselling History Detail
                                </CardTitle>
                            </div>
                            <div className="ml-auto ">

                            </div>
                        </div>

                    </CardHeader>


                </Card>
                </section>


                {counsellingHistoryData && (
                    <Card className=" bg-muted/50 border-none mt-4 p-4 ">
                        <CardHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-4 w-full ">

                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Counselling ID: </span>
                                {counsellingHistoryData.counsellingId}
                            </p>


                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Counselling Date: </span>
                                {counsellingHistoryData.counsellingDate}
                            </p>
                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium"> Counselling Time: </span>
                                {counsellingHistoryData.counsellingTime}
                            </p>


                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Cost: </span>
                               {counsellingHistoryData.counsellingCost? `Rs.${counsellingHistoryData.counsellingCost}/-` : 'FREE'}
                            </p>

                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Status: </span>
                                {counsellingHistoryData.counsellingStatus}
                            </p>
                            {counsellingHistoryData.counsellingStatus === 'CANCELLED' && (
                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Cancel Reason: </span>
                                    {counsellingHistoryData.counsellingCancelReason || "N/A"}
                                </p>
                            )}

                            <p className="text-base tracking-wide text-left mt-2">
                                <span className="text-black font-medium">Mode: </span>
                                {counsellingHistoryData.counsellingMode}
                            </p>


                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Counselling Language: </span>
                                    {counsellingHistoryData.counsellingLanguage}
                                </p>
                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Counselling Background: </span>
                                    {counsellingHistoryData.counsellingBackground}
                                </p>

                            <p className="text-base tracking-wide text-left mt-2 md:col-span-2  lg:col-span-3">
                                <span className="text-black font-medium">Join URL: </span>
                                <a href={counsellingHistoryData.counsellingUrl} target="_blank" className="text-blue-600 underline ml-1">
                                    {counsellingHistoryData.counsellingUrl}
                                </a>
                            </p>

                                <p className="text-base tracking-wide text-left mt-2 md:col-span-2 lg:col-span-3">
                                    <span className="text-black font-medium">Topic: </span>
                                    <span className="whitespace-pre-wrap">{counsellingHistoryData.counsellingTopic || "N/A"}</span>
                                </p>

                            <p className="text-base tracking-wide text-left mt-2 md:col-span-2 lg:col-span-3">
                                <span className="text-black font-medium">Note: </span>
                                <span className="whitespace-pre-wrap">{counsellingHistoryData.counsellingNote || "N/A"}</span>
                            </p>




 


                            </div>
                            <div className="flex flex-wrap justify-between gap-4  ">
                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Created Date: </span>
                                    {counsellingHistoryData.created_date}
                                </p>
                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Created Time: </span>
                                    {counsellingHistoryData.created_time}
                                </p>

                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Updated Date: </span>
                                    {counsellingHistoryData.updated_date}
                                </p>
                                <p className="text-base tracking-wide text-left mt-2">
                                    <span className="text-black font-medium">Updated Time: </span>
                                    {counsellingHistoryData.updated_time}
                                </p>

                            </div>

                        </CardHeader>
                    </Card>
                )}

                {/*<Accordion type="single" collapsible className="w-full">*/}
                {/*    <AccordionItem value="item-1"  className=" bg-muted/50 border-none mt-4 px-4 rounded-lg">*/}
                {/*        <AccordionTrigger className="text-2xl">Instructions</AccordionTrigger>*/}
                {/*        <AccordionContent className="bg-muted/50 p-4">*/}
                {/*            <div dangerouslySetInnerHTML={{ __html: counsellingHistoryData?.interviewInstruct }} >*/}
                
                {/*            </div>*/}
                {/*        </AccordionContent>*/}
                {/*    </AccordionItem>*/}
                
                {/*</Accordion>*/}


            </div></>
    );
}
