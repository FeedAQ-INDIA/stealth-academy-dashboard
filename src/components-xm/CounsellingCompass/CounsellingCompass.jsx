import {Search,} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx"
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import {CreateMockInterview} from "@/components-xm/MockInterview/CreateMockInterview.jsx";
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
import compass from "@/assets/compass.png";
import professions from '@/assets/professions.png'

export function CounsellingCompass() {
    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
    const navigate = useNavigate()



    return (
        <>   <PublicHeader/>
            <div className="p-3 md:p-6 overflow-y-auto h-[calc(100svh-4em)]">


                <Card className="border-0 bg-muted/50 bg-[#ffdd00]   py-6">
                    <CardHeader className="flex flex-col md:flex-row gap-4 justify-between py-0 items-center ">
                        <img
                            src={compass}
                            alt="Compass"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />     <div>
                            <CardTitle className="text-center tracking-widest text-3xl font-bold ">
                                FIND YOUR TRUE NORTH WITH COUNSELLING COMPASS
                            </CardTitle>
                            <CardDescription className="text-center text-black">
                                COUNSELLING COMPASS is your personalized career counseling guide — designed to help students and professionals discover, plan, and achieve their true potential with expert guidance.
                            </CardDescription>
                        </div>
                        <img
                            src={compass}
                            alt="Compass"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />


                    </CardHeader>

                </Card>


                <section className="my-12 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">
                    <img
                        src={professions}
                        alt="Professions"
                        className="w-84 h-72 object-cover rounded-xl border-0 bg-muted/50  "
                    />
                    <Card className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-84 flex flex-col justify-center items-center text-center px-4">
                        <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold">
                            Unsure About Your <strong>Short-Term</strong> and <strong>Long-Term</strong> Career Goals?
                        </CardTitle>
                        <CardDescription className="text-black text-md mt-4">
                            Create a career plan by evaluating your skills. Find suitable courses or certifications to develop your skills from well researched options. Seek guidance from our experts to build your professional network.
                        </CardDescription>
                        <div className="mt-4">
                            <Link to={`/schedule-counselling-compass`}>
                                <Button className="h-8 gap-1">SCHEDULE A SESSION NOW</Button>
                            </Link>
                        </div>
                    </Card>

                </section>

                <section className="my-12 flex flex-col md:flex-row gap-6 justify-center items-center">
                    <img
                        src="https://setmycareer.com/img/end_to_end_pc.webp"
                        alt="Professions"
                        className="w-full md:w-1/2 object-cover rounded-xl"
                    />
                    <img
                        src="https://www.eccetra.com/standingman.svg"
                        alt="Professions"
                        className="w-full md:w-1/3 h-auto object-cover rounded-xl hidden  md:block"
                    />
                </section>




            </div></>
    );
}
