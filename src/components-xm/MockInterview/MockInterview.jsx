import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {useAuthStore} from "@/zustland/store.js";
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
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
                        />
                        <div>
                            <CardTitle className="text-center tracking-widest text-3xl font-bold ">
                                VAULT THE PRACTICE. ACE THE PERFORMANCE WITH MOCK INTERVIEW.
                            </CardTitle>
                            <CardDescription className="text-center text-black">
                                Your personal space to rehearse real-world interviews securely and sharpen your
                                responses.
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
                                {/*<img*/}
                                {/*    src={"https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/hero.png"}*/}
                                {/*    className="h-44"/>*/}
                                <div>
                                    <CardHeader className="flex flex-col items-center gap-2 sm:gap-6">
                                        <CardTitle
                                            className="tracking-wider text-cyan-600 text-3xl font-bold text-center">
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
                                                    Learn how to answer interview questions professionally to the hiring
                                                    panel.
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
                                                    Get actionable feedback on what you need to work on to land your
                                                    next job.

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
                                                    Gain confidence practicing with coaches who match your learning
                                                    style.

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

                    <Card className="border-0 bg-muted/50 bg-muted/50   py-6">
                        <CardHeader className="flex flex-col md:flex-row gap-4 justify-between py-0 items-center ">
                            <img
                                src={`https://www.pramp.com/img/use-case/person.svg`}
                                alt="Compass"
                                className=" h-44 "
                            />
                            <div>
                                <CardTitle className="text-center tracking-widest text-3xl font-extrabold ">
                                    Ace your next interview
                                </CardTitle>
                                <CardDescription className="text-center tracking-wide mt-2 text-md   ">
                                    Get insider tips and practical advice from industry experts.


                                </CardDescription>
                                <div className="text-center text-black items-center mt-4">
                                    <Link to={`/schedule-mock-interview`}>
                                        <Button
                                            className="  gap-1 "
                                        >SCHEDULE NOW</Button>
                                    </Link>
                                </div>

                            </div>
                            <img
                                src={`https://www.pramp.com/img/use-case/person-03.png`}
                                alt="Compass"
                                className=" h-44 "
                            />


                        </CardHeader>

                    </Card>

                </section>

                <section className="my-6 grid grid-cols-1 ">

                    <Card className="border-0 bg-muted/50 bg-muted/50   py-6">
                        <CardHeader className="flex flex-col md:flex-row gap-4 justify-between py-0 items-center ">

                            <div>
                                <CardTitle className="text-center tracking-wide text-3xl font-bold ">
                                    Practice Interviews in Safe Virtual Sessions
                                </CardTitle>
                                <CardDescription className="text-center tracking-wide mt-2 text-md   ">
                                    We’re a team of seasoned professionals passionate about helping candidates shine in their interviews. Whether you’re applying for your first job, transitioning careers, or aiming for a leadership role, our mock interview services provide the confidence and preparation you need to succeed.

                                </CardDescription>


                            </div>

                            <img
                                src={`https://mockinterview.co/wp-content/uploads/2024/11/DALL%C2%B7E-2024-11-16-12.57.19-A-futuristic-tech-themed-hero-image-for-a-landing-page.-A-confident-candidate-sits-at-a-virtual-interview-table-facing-an-AI-enabled-human-interview-1.webp`}
                                alt="Compass"
                                className=" h-44 "
                            />

                        </CardHeader>

                    </Card>

                </section>

                <section className="my-6 grid grid-cols-1 ">

                    <Card className="border-0 bg-muted/50 bg-muted/50   py-6">
                        <CardHeader className="flex flex-col md:flex-row gap-6 justify-center py-0 items-center ">

                            {/*<img*/}
                            {/*    src={`https://cdn.prod.website-files.com/637be75fec8ead33c23e5491/65243c1f0e974d0965f7c02c_5%20(2).png`}*/}
                            {/*    alt="Compass"*/}
                            {/*    className="  h-64 "*/}
                            {/*/>*/}
                            <img
                                src={"https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/hero.png"}
                                className="h-44"/>
                            <div>
                                <CardTitle className="text-center tracking-wide text-3xl font-bold ">
                                    Get detailed, actionable feedback from experts
                                </CardTitle>
                                <CardDescription className="text-center tracking-wide mt-2 text-md   ">
                                    Each session ends with an in-depth rundown of what you did well on and how you can improve.


                                </CardDescription>


                            </div>


                        </CardHeader>

                    </Card>

                </section>

            </div>
        </>
    );
}
