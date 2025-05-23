import {ChevronLeft, ChevronRight, Clock, ExternalLink, GraduationCap, LogOut, Search,} from "lucide-react";

import {Badge} from "@/components/ui/badge.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination.jsx"
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import {toast} from "@/components/hooks/use-toast.js";

export function WebinarCard({userEnrolledCourseIdList,a }) {
    const navigate = useNavigate()



    return (
        <Card className=" border shadow-sm hover:shadow-md cursor-pointer ">
            <CardHeader className="pb-2">
                {/* Horizontally scrollable webinar badge row with auto-scroll */}
                <div className="w-full overflow-hidden">
                    <div className="flex w-max gap-2 mb-3 animate-scroll-x whitespace-nowrap">
                        {/* Duplicate badge row for seamless scrolling */}
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-2">
                                <Badge className="animate-blink bg-green-600 text-white">
                                    {a?.webinarCost == 0 ? 'FREE' : `Rs.${a?.webinarCost}/-`}
                                </Badge>
                                <Badge variant="outline">WEBINAR</Badge>
                                {a?.webinarSource && <Badge variant="outline">{a?.webinarSource}</Badge>}
                                {a?.webinarLevel && <Badge variant="outline">{a?.webinarLevel}</Badge>}
                                {a?.webinarDuration && <Badge variant="outline">

                                <div className="flex gap-1 items-center">
                                    <Clock size={18}/>
                                    {`${Math.floor(+(a?.webinarDuration) / 60)}hr ${+(a?.webinarDuration) % 60}min`}
                                </div></Badge>}
                            </div>
                        ))}
                    </div>
                </div>

                <img src={a?.webinarImageUrl?.[0]} className="w-full h-36 " />


                {/* Title with responsive spacing */}
                <div>
                    <CardTitle className="text-lg sm:text-xl font-semibold line-clamp-2">
                        {a?.webinarTitle}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent>
                <p className=" line-clamp-2">
                    {a?.webinarDescription}
                </p>


            </CardContent>

            <CardFooter className="flex w-full flex-wrap gap-2 items-center">
                {/*{userEnrolledCourseIdList?.find(m => m.webinarId == a.webinarId && (m.enrollmentStatus != 'COMPLETED' && m.enrollmentStatus != 'CERTIFIED')) ?*/}
                {/*    <Button className=" flex-1 " variant="destructive"*/}
                {/*            onClick={() => disroll(a?.webinarId)}><LogOut />Leave Course</Button> :<></>}*/}
                {/*{userEnrolledCourseIdList?.find(m => m.webinarId == a.webinarId && ( m.enrollmentStatus == 'CERTIFIED')) ?*/}
                {/*    <Button className=" flex-1 " variant="outline"*/}
                {/*    ><GraduationCap />Download Certificate</Button> :<></>}*/}
                <div  className=" items-center">
                    {userEnrolledCourseIdList?.find(m => m.webinarId == a.webinarId) ?  <div className="  items-center">
                        {/*<p className="completed-stamp text-base text-black ">Enrolled</p>*/}
                        <p className="completed-stamp text-base">{userEnrolledCourseIdList?.find(m => m.webinarId == a.webinarId)?.enrollmentStatus }</p>
                    </div>
                    : <></>}
                </div>
                <Link to={`/webinar/${a?.webinarId}`} className="  flex-1 "><Button
                    className="  w-full "><ExternalLink />  Learn More</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
