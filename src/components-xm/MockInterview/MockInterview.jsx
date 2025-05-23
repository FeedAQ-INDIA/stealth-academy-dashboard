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
import mockinterview from "@/assets/mock-interview.png";


export function MockInterview() {
    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
    const navigate = useNavigate()



    return (
   <>   <PublicHeader/>
        <div className="p-3 md:p-6 overflow-y-auto h-[calc(100svh-4em)]">

            <Card className="border-0 bg-muted/50 bg-[#ffdd00]   py-6">
                <CardHeader className="flex flex-col md:flex-row gap-4 justify-between py-0 items-center ">
                    <img
                        src={mockinterview}
                        alt="Compass"
                        className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />     <div>
                    <CardTitle className="text-center tracking-widest text-3xl font-bold ">
                       VAULT THE PRACTICE. ACE THE PERFORMANCE WITH MOCK INTERVIEW.
                    </CardTitle>
                    <CardDescription className="text-center text-black">
                        Your personal space to rehearse real-world interviews securely and sharpen your responses.
                    </CardDescription>
                </div>
                    <img
                        src={mockinterview}
                        alt="Compass"
                        className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />


                </CardHeader>

            </Card>



            <section className="my-6 grid grid-cols-1 ">
                <Card className="border-0 bg-muted/50  py-3  ">

                    <CardContent>
                        <div className="flex gap-2 flex-col md:flex-row items-center">
                            <img src={"https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/hero.png"} className="h-44"/>
                            <div>
                                <CardHeader className="flex flex-col items-center gap-2 sm:gap-6">
                                    <CardTitle className="tracking-wider text-cyan-600 text-3xl font-bold text-center">
                                        Why practice mock interviews with our experts?
                                    </CardTitle>

                                    <div>
                                        {/* Optional content */}
                                    </div>
                                </CardHeader>

                                <CardContent>
                                  <div className="flex gap-4 justify-items-center">
                                      <div className="flex flex-col items-center text-center">
                                          <img
                                              src="https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/target.svg"
                                              className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                              alt="Mock Interview Target"
                                          />
                                          <p className="mt-2 font-bold text-lg">Hands-on experience</p>
                                          <p className="mt-1  text-lg">
                                              Learn how to answer interview questions professionally to the hiring panel.
                                          </p>
                                      </div>

                                      <div className="flex flex-col items-center text-center">
                                          <img
                                              src="https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/chat.svg"
                                              className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                              alt="Mock Interview Target"
                                          />
                                          <p className="mt-2 font-bold  text-lg">Detailed feedback
                                          </p>
                                          <p className="mt-1  text-lg">
                                              Get actionable feedback on what you need to work on to land your next job.

                                          </p>
                                      </div>

                                      <div className="flex flex-col items-center text-center">
                                          <img
                                              src="https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/star.svg"
                                              className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                               alt="Mock Interview Target"
                                          />
                                          <p className="mt-2 font-bold  text-lg">Confidence boost
                                          </p>
                                          <p className="mt-1  text-lg">
                                              Gain confidence practicing with coaches who match your learning style.

                                          </p>
                                      </div>

                                  </div>

                                </CardContent>
                            </div>


                        </div>
                    </CardContent>
                </Card>
            </section>


            <section className="my-6 grid grid-cols-1 ">
                <Card className="border-0 bg-muted/50  py-6  ">


                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                            <img src={"https://d2b1cooxpkirg1.cloudfront.net/publicAssets/mock-interviews/how-it-works-3.png"}/>

                            <div>
                                <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <CardTitle className="text-lg sm:text-2xl font-semibold">
                                        How it works ?
                                    </CardTitle>
                                    <div className="sm:ml-auto">
                                        <Link to={`/schedule-mock-interview`}>
                                        <Button
                                            className=" gap-1 "
                                        >Schedule Interview</Button>
                                        </Link>
                                    </div>
                                </CardHeader>

                                <div className=" mt-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-center text-lg">Choose Your Role & Level</CardTitle>
                                            </CardHeader>

                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-center text-lg">Book a Slot
                                                </CardTitle>
                                            </CardHeader>

                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-center text-lg">Attend the Interview  </CardTitle>
                                            </CardHeader>

                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-center text-lg">Get Detailed Feedback </CardTitle>
                                            </CardHeader>

                                        </Card>

                                    </div>
                                </div>
                            </div>


                        </div>
                    </CardContent>
                </Card>
            </section>


        </div></>
);
}
