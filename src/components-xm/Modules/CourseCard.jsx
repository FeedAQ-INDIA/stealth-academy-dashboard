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

export function CourseCard({userEnrolledCourseIdList,a }) {
    const navigate = useNavigate()

    const {userDetail} = useAuthStore();


    return (
        <Card className=" border shadow-sm hover:shadow-md cursor-pointer ">
            <CardHeader className="pb-2">
                {/* Horizontally scrollable badge row with auto-scroll */}
                <div className="w-full overflow-hidden">
                    <div className="flex w-max gap-2 mb-3 animate-scroll-x-5 whitespace-nowrap">
                        {/* Duplicate the badge set to create a seamless loop */}
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-2">
                                <Badge className="animate-blink bg-green-600 text-white">
                                    {a?.courseCost == 0 ? 'FREE' : `Rs.${a?.courseCost}/-`}
                                </Badge>
                                 {a?.courseSource && <Badge variant="outline">{a?.courseSource}</Badge>}
                                {a?.courseLevel && <Badge variant="outline">{a?.courseLevel}</Badge>}
                                {a?.courseMode && <Badge variant="outline">{a?.courseMode}</Badge>}
                                {a?.deliveryMode && <Badge variant="outline">{a?.deliveryMode}</Badge>}
                                {a?.courseDuration && <Badge variant="outline">
                                    <div className="flex gap-1 items-center">
                                                <Clock size={18}/>
                                                {`${Math.floor(+(a?.courseDuration) / 60)}hr ${+(a?.courseDuration) % 60}min`}
                                          </div>
                                </Badge>}
                            </div>
                        ))}
                    </div>
                </div>

                 <img src={a?.courseImageUrl?.[0]} className="w-full h-36 " />


                {/* Course Title */}
                <div>
                    <CardTitle className="text-lg sm:text-xl font-semibold line-clamp-2">
                        {a?.courseTitle?.toUpperCase()}
                    </CardTitle>
                </div>
            </CardHeader>

            {/*<CardContent className="hidden md:block">*/}
            {/*    <p className=" line-clamp-2">*/}
            {/*        {a?.courseDescription}*/}
            {/*    </p>*/}

            {/*</CardContent>*/}

            <CardFooter className="flex w-full flex-wrap gap-2 items-center">
                {/*{userEnrolledCourseIdList?.find(m => m.courseId == a.courseId && (m.enrollmentStatus != 'COMPLETED' && m.enrollmentStatus != 'CERTIFIED')) ?*/}
                {/*    <Button className=" flex-1 " variant="destructive"*/}
                {/*            onClick={() => disroll(a?.courseId)}><LogOut />Leave Course</Button> :<></>}*/}
                {/*{userEnrolledCourseIdList?.find(m => m.courseId == a.courseId && ( m.enrollmentStatus == 'CERTIFIED')) ?*/}
                {/*    <Button className=" flex-1 " variant="outline"*/}
                {/*    ><GraduationCap />Download Certificate</Button> :<></>}*/}
                <div  className=" items-center">
                    {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId) ?  <div className="  items-center">
                        {/*<p className="completed-stamp text-base text-black ">Enrolled</p>*/}
                        <p className="completed-stamp text-base">{userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus }</p>
                    </div>
                    : <></>}
                </div>
                <Link to={`/${userDetail?  (userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus ? 'course' : 'explore' ) : 'explore' }/${a?.courseId}`} className="  flex-1 " target={'_self'}>
                    <Button
                    className="  w-full "><ExternalLink />  EXPLORE</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
