import {ChevronLeft, ChevronRight, Clock, ExternalLink, GraduationCap, LogOut, Search,} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination"
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import {toast} from "@/components/hooks/use-toast.js";

export function CourseCard({userEnrolledCourseIdList,a }) {
    const navigate = useNavigate()



    return (
        <Card className=" border shadow-sm hover:shadow-md cursor-pointer ">
            <CardHeader>
                {/* Badge row - wraps on smaller screens */}
                <div className="flex flex-wrap gap-2 w-full mb-3">
                    <Badge className="animate-blink bg-green-600 text-white">FREE</Badge>
                    {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId) ?   <Badge  variant="outline">{userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus }</Badge>
                        : <></>}
                    <Badge variant="outline">Course</Badge>
                    <Badge variant="outline">Beginner</Badge>
                </div>

                {/* Title with responsive spacing */}
                <div className=" ">
                    <CardTitle className="text-lg sm:text-xl  font-semibold line-clamp-2 ">
                        {a?.courseTitle}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className=" line-clamp-3">
                    {a?.courseDescription}
                </p>
                {/*<p className="my-2 animate-blink text-blue-800 font-medium"> Registration Started</p>*/}
                <div className="font-medium  mt-6">
                    <div className="flex gap-2 items-center">
                        <Clock size={18}/>
                        {`${Math.floor(+(a?.courseDuration) / 60)}hr ${+(a?.courseDuration) % 60}min`}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex w-full flex-wrap gap-2">
                {/*{userEnrolledCourseIdList?.find(m => m.courseId == a.courseId && (m.enrollmentStatus != 'COMPLETED' && m.enrollmentStatus != 'CERTIFIED')) ?*/}
                {/*    <Button className=" flex-1 " variant="destructive"*/}
                {/*            onClick={() => disroll(a?.courseId)}><LogOut />Leave Course</Button> :<></>}*/}
                {/*{userEnrolledCourseIdList?.find(m => m.courseId == a.courseId && ( m.enrollmentStatus == 'CERTIFIED')) ?*/}
                {/*    <Button className=" flex-1 " variant="outline"*/}
                {/*    ><GraduationCap />Download Certificate</Button> :<></>}*/}

                <Link to={`/course/${a?.courseId}`} className="  flex-1 "><Button
                    className="  w-full "><ExternalLink /> Learn More</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
