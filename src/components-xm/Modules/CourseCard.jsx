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
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-yellow-50/50 hover:from-white hover:to-yellow-700/30 hover:-translate-y-1 cursor-pointer">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-yellow-300/5 group-hover:to-yellow-700/10 transition-all duration-300" />

            <CardHeader className="pb-3 relative z-10">
                {/* Enhanced scrollable badge row */}
                <div className="w-full overflow-hidden mb-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-2">
                    <div className="flex w-max gap-2 animate-scroll-x-5 whitespace-nowrap">
                        {/* Duplicate the badge set to create a seamless loop */}
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-2">
                                <Badge className="animate-pulse bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg transition-shadow font-medium px-3 py-1">
                                    {a?.courseCost == 0 ? 'FREE' : `Rs.${a?.courseCost}/-`}
                                </Badge>
                                {a?.courseSource && <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors font-medium">{a?.courseSource}</Badge>}
                                {a?.courseLevel && <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors font-medium">{a?.courseLevel}</Badge>}
                                {a?.courseMode && <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors font-medium">{a?.courseMode}</Badge>}
                                {a?.deliveryMode && <Badge variant="outline" className="border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors font-medium">{a?.deliveryMode}</Badge>}
                                {a?.courseDuration && <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors font-medium">
                                    <div className="flex gap-1 items-center">
                                        <Clock size={16} className="text-indigo-600"/>
                                        {`${Math.floor(+(a?.courseDuration) / 60)}hr ${+(a?.courseDuration) % 60}min`}
                                    </div>
                                </Badge>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced image with overlay effects */}
                <div className="relative overflow-hidden rounded-xl group/image mb-2">
                    <img
                        src={a?.courseImageUrl?.[0]}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover/image:scale-105"
                        alt={a?.courseTitle}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />

                    {/* Floating enrollment status badge */}
                    {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId) && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-gradient-to-r from-yellow-700 to-black-600 text-white shadow-lg backdrop-blur-sm border-0 font-semibold">
                                {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Enhanced Course Title */}
                <div>
                    <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-900 group-hover:to-purple-700 transition-all duration-300">
                        {a?.courseTitle?.toUpperCase()}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardFooter className="flex w-full flex-wrap gap-3 items-center pt-4 border-t border-gray-100 relative z-10">
                {/* Enhanced enrollment status display */}
                <div className="items-center">
                    {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId) ? (
                        <div className="items-center">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                <p className="text-sm font-semibold text-gray-700">
                                    {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
{/*<br/>*/}
                {/* Enhanced explore button */}
                <Link
                    to={`/${userDetail ? (userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus ? 'course' : 'explore') : 'explore'}/${a?.courseId}`}
                    className="flex-1"
                    target={'_self'}
                >
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-black-700 hover:to-black-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold  rounded-sm group/button">
                        <ExternalLink className="mr-2 h-5 w-5 transition-transform group-hover/button:rotate-12" />
                        EXPLORE COURSE
                    </Button>
                </Link>
            </CardFooter>

            {/* Subtle border glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{filter: 'blur(20px)', zIndex: -1}} />
        </Card>
    );
}