import {CircleHelp, Construction, Frown, GraduationCap, HeartPulse, Search,} from "lucide-react";
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
import fresher from "@/assets/fresher.png";
import graduate from "@/assets/graduate.png";
import postgraduate from "@/assets/post-graduate.png";
import jobaspirant from "@/assets/job-aspirant.png";
import careertransition from "@/assets/career-transition.png";
import careerrestart from "@/assets/career-restart.png";
import careergrowth from "@/assets/career-growth.png";
import student8 from "@/assets/student-8.png";
import student9 from "@/assets/student-9.png";
import student10 from "@/assets/student-10.png";
import student11 from "@/assets/student-11.png";
import student12 from "@/assets/student-12.png";
import standingman from "@/assets/standingman.png"


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


                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">
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



                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-full  flex flex-col justify-center items-center text-center">
                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4">
                                Who Can Benefit from This ?
                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={student8}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">8th Std Students
                                        </p>
                                        <p className="mt-1  text-lg">
                                            You’re just beginning your journey.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={student9}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">9th Std Students
                                        </p>
                                        <p className="mt-1  text-lg">
                                            A critical phase of awareness.
                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={student10}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">10th Std Students
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Time to choose your stream.
                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={student11}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">11th Std Students
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Shaping career clarity.
                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={student12}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">12th Std Students
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Decision-making time.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={graduate}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">Graduates
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Entering the professional world.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={postgraduate}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">Postgraduates
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Specialization and upskilling.
                                        </p>
                                    </div>



                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={careertransition}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">Career Transition
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Shifting industries or domains.
                                        </p>
                                    </div>



                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={careerrestart}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">Career Restart
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Re-entering after a break.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={careergrowth}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg  ">Career Growth & Acceleration
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Scaling up your career.
                                        </p>
                                    </div>

                                </div>

                            </CardContent>
                        </CardContent>


                    </Card>

                </section>


                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-full  flex flex-col justify-center items-center text-center">
                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    GUIDING THROUGH THE CONFUSION</span> <br/>
                                Here’s How We Step In to Help for Class 8th Students

                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">

                                        <CircleHelp className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Confusion about interests and direction
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Many students are unsure about their strengths and interests. We help them understand themselves better and match their personality with future academic and career paths.

                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">

                                        <GraduationCap className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                                        <p className="mt-2 font-bold  text-lg">Limited awareness of career options

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Most students know only a few careers. We show them a wide range of options through relatable and engaging sessions.

                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">

                                        <HeartPulse className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Pressure from parents or peers

                                        </p>
                                        <p className="mt-1  text-lg">
                                            External pressure can confuse students. We involve parents to build mutual understanding and support choices that truly fit the child.

                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">

                                        <Frown  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Fear about future decisions

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Stream selection can be stressful. We guide students early so they feel clear, confident, and ready when it’s time to decide.

                                        </p>
                                    </div>



                                </div>

                            </CardContent>
                        </CardContent>

                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    LET THEM EXPLORE BEFORE THEY DECIDE</span> <br/>
                                Benefits of Career Guidance for Class 8th Students

                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">

                                        <p    className=" text-center text-3xl font-extrabold">1</p>
                                        <p className="mt-2 font-bold  text-lg">Start Smart, Not Late

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Early guidance helps students move in the right direction before confusion builds up in higher classes.


                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">2</p>

                                        <p className="mt-2 font-bold  text-lg">Know Yourself Better


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Students discover their strengths, interests, and how they learn best — things they usually don’t get to explore in school.


                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">3</p>

                                        <p className="mt-2 font-bold  text-lg">Stress Less Later


                                        </p>
                                        <p className="mt-1  text-lg">
                                            With a plan in place early on, stream selection in 9th or 10th feels easier and more confident.


                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">4</p>

                                        <p className="mt-2 font-bold  text-lg">Learn with a Purpose


                                        </p>
                                        <p className="mt-1  text-lg">
                                            When students understand how studies connect to future goals, they stay more focused and motivated.


                                        </p>
                                    </div>




                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">5</p>

                                        <p className="mt-2 font-bold  text-lg">Better Bond with Parents
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Counselling helps parents and kids get on the same page, making decisions smoother and more supportive.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">6</p>

                                        <p className="mt-2 font-bold  text-lg">Discover Career Paths Early



                                        </p>
                                        <p className="mt-1  text-lg">
                                            Students get introduced to a variety of career options, helping them understand the possibilities ahead and make informed choices when the time comes.
                                        </p>
                                    </div>
                                </div>

                            </CardContent>
                        </CardContent>
                    </Card>

                </section>


                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-full  flex flex-col justify-center items-center text-center">
                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    GUIDING THROUGH THE CONFUSION</span> <br/>
                                Here’s How We Step In to Help for Class 9th Students

                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">
                                        <HeartPulse className="w-16 h-16 md:w-20 md:h-20 object-contain"/>

                                        <p className="mt-2 font-bold  text-lg">Influence of Peer and Parental Pressure

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Many students feel caught between what their peers are choosing and what parents expect, leading to confusion and stress. Our experienced counsellors provide unbiased, research-backed advice that helps students make confident decisions—with parents involved in the process to ensure mutual understanding.


                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">

                                        <GraduationCap className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                                        <p className="mt-2 font-bold  text-lg">Limited Awareness of Career Options


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Students are often unaware of the wide range of career possibilities beyond the usual doctor-engineer-CA trio. We introduce students to a broad spectrum of career paths through real-life examples, industry insights, and emerging career trends—expanding their vision for the future.


                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">

                                        <Frown  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Fear of Making the Wrong Decision


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Students worry that one wrong choice now could close doors later, adding unnecessary pressure. We guide students step-by-step, helping them build a flexible yet focused plan that leaves room for growth and change—so no decision ever feels final or limiting.


                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <Construction  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Lack of Clarity About the Road Ahead


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Without a clear picture of what comes after Class 9, students may feel directionless or demotivated. Our sessions provide a roadmap of academic and career possibilities, helping students plan for the future while staying grounded in the present.


                                        </p>
                                    </div>



                                </div>

                            </CardContent>
                        </CardContent>

                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    LET THEM EXPLORE BEFORE THEY DECIDE</span> <br/>
                                Benefits of Career Guidance for Class 9th Students

                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">

                                        <p    className=" text-center text-3xl font-extrabold">1</p>
                                        <p className="mt-2 font-bold  text-lg">Clarity in Subject Choices

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Helps students understand which subjects align best with their interests, strengths, and long-term goals.



                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">2</p>

                                        <p className="mt-2 font-bold  text-lg">Early Career Direction


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Provides a head start in exploring potential career paths, reducing last-minute stress in higher classes.



                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">3</p>

                                        <p className="mt-2 font-bold  text-lg">Reduced Confusion & Anxiety


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Clears mental clutter and boosts confidence by addressing doubts with expert guidance.



                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">4</p>

                                        <p className="mt-2 font-bold  text-lg">Improved Academic Focus



                                        </p>
                                        <p className="mt-1  text-lg">
                                            Knowing their strengths allows students to concentrate on subjects that truly matter to their journey.



                                        </p>
                                    </div>




                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">5</p>

                                        <p className="mt-2 font-bold  text-lg">Better Bond with Parents

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Encourages meaningful conversations at home by aligning aspirations with expectations.

                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">6</p>

                                        <p className="mt-2 font-bold  text-lg">Exposure to Diverse Career Paths




                                        </p>
                                        <p className="mt-1  text-lg">
                                            Broadens students' understanding of various careers beyond traditional options, helping them explore interests they may not have considered before.

                                        </p>
                                    </div>
                                </div>

                            </CardContent>
                        </CardContent>
                    </Card>

                </section>

                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-full  flex flex-col justify-center items-center text-center">
                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    GUIDING THROUGH THE CONFUSION</span> <br/>
                                Here’s How We Step In to Help for Class 10th Students

                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">
                                        <HeartPulse className="w-16 h-16 md:w-20 md:h-20 object-contain"/>

                                        <p className="mt-2 font-bold  text-lg">Confusion About Choosing the Right Stream


                                        </p>
                                        <p className="mt-1  text-lg">
                                            We get it — deciding between Science, Commerce, Arts, or other fields can feel difficult. Our psychometric tests and one-on-one counselling sessions are designed to find your unique strengths, interests, and aptitude so you can confidently pick a stream that truly fits you.



                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">

                                        <GraduationCap className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                                        <p className="mt-2 font-bold  text-lg">Parental & Peer Pressure


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Many students face pressure to follow what others are doing or what parents believe is best. Here, we offer data-driven insights and involve parents in the counselling process, helping them understand your natural potential and supporting you in choosing a career that’s right for you.



                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">

                                        <Frown  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Lack of Awareness About Career Options


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Today’s world offers hundreds of career options beyond the typical doctor, engineer, or CA path. We expose you to emerging and offbeat career choices, industry insights, and future trends, helping you think beyond conventional streams.



                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <Construction  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Fear of Making the “Wrong” Decision


                                        </p>
                                        <p className="mt-1  text-lg">
                                            What if I choose the wrong stream? What if I regret it later? Our career experts ensure you don’t have to second-guess your decision. We guide you with a long-term vision, linking your stream choice to real-world career possibilities and goals.



                                        </p>
                                    </div>



                                </div>

                            </CardContent>
                        </CardContent>

                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    LET THEM EXPLORE BEFORE THEY DECIDE</span> <br/>
                                Benefits of Career Guidance for Class 10th Students

                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">

                                        <p    className=" text-center text-3xl font-extrabold">1</p>
                                        <p className="mt-2 font-bold  text-lg">Clarity in Stream Selection


                                        </p>
                                        <p className="mt-1  text-lg">
                                            No more confusion between Science, Commerce, Arts, or other options. Career counselling helps students choose the right stream based on their interests, strengths, and long-term goals.




                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">2</p>

                                        <p className="mt-2 font-bold  text-lg">Reduced Academic Pressure


                                        </p>
                                        <p className="mt-1  text-lg">
                                            When students understand what suits them best, they make choices more confidently, reducing stress, anxiety, and fear of failure.




                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">3</p>

                                        <p className="mt-2 font-bold  text-lg">Informed Decision-Making


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Instead of going with the crowd or family pressure, students make well-thought-out decisions backed by expert guidance.




                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">4</p>

                                        <p className="mt-2 font-bold  text-lg">Awareness of New-Age Careers


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Career counselling opens up lesser-known but promising career paths that match a student’s potential — beyond just the usual doctor or engineer route.




                                        </p>
                                    </div>




                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">5</p>

                                        <p className="mt-2 font-bold  text-lg">Parental Support Through Expert Advice

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Counselling bridges the gap between what parents hope for and what’s best for the student — creating alignment and peace of mind at home.


                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">6</p>

                                        <p className="mt-2 font-bold  text-lg">Ongoing Expert Support & Mentorship

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Our guidance doesn’t stop after one session. You get continued support from experienced mentors to help you throughout your academic journey.


                                        </p>
                                    </div>
                                </div>

                            </CardContent>
                        </CardContent>
                    </Card>

                </section>


                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-full  flex flex-col justify-center items-center text-center">
                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    GUIDING THROUGH THE CONFUSION</span> <br/>
                                Here’s How We Step In to Help for Class 11th Students

                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">
                                        <HeartPulse className="w-16 h-16 md:w-20 md:h-20 object-contain"/>

                                        <p className="mt-2 font-bold  text-lg">Confused About the Right Career

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Choosing a career feels confusing when you don’t know what suits you. We use scientific assessments and expert guidance to help you discover careers aligned with your strengths and interests.


                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">

                                        <GraduationCap className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                                        <p className="mt-2 font-bold  text-lg">Too Many Voices, No Clarity


                                        </p>
                                        <p className="mt-1  text-lg">
                                            With everyone giving advice, your own goals often take a backseat. We help you build a personalised career plan that reflects your aspirations while respecting your parents’ input.




                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">

                                        <Frown  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Limited Knowledge of Career Options

                                        </p>
                                        <p className="mt-1  text-lg">
                                            You can’t choose a path you don’t even know exists. We expose you to 300+ career options—including offbeat and emerging ones—so you make informed choices, not limited ones.




                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <Construction  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Caught in the Academic Chaos
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Managing studies, coaching, and career decisions can feel like too much. We simplify the process with a step-by-step roadmap that keeps you focused and reduces unnecessary stress.




                                        </p>
                                    </div>



                                </div>

                            </CardContent>
                        </CardContent>

                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    LET THEM EXPLORE BEFORE THEY DECIDE</span> <br/>
                                Benefits of Career Guidance for Class 11th Students

                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">

                                        <p    className=" text-center text-3xl font-extrabold">1</p>
                                        <p className="mt-2 font-bold  text-lg">Clear Career Direction



                                        </p>
                                        <p className="mt-1  text-lg">
                                            You’ll get clarity on which career path fits you best, so you’re not left confused in Class 12 or after.





                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">2</p>

                                        <p className="mt-2 font-bold  text-lg">Step-by-Step Plan


                                        </p>
                                        <p className="mt-1  text-lg">
                                            We help you understand what entrance exams to prepare for, which courses to choose, and what skills to build—one step at a time.





                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">3</p>

                                        <p className="mt-2 font-bold  text-lg">Less Confusion, More Confidence


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Instead of constantly second-guessing yourself, you’ll feel sure about your decisions with expert support by your side.





                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">4</p>

                                        <p className="mt-2 font-bold  text-lg">Save Time and Effort


                                        </p>
                                        <p className="mt-1  text-lg">
                                            By knowing exactly where to focus, you won’t waste time on things that don’t align with your career goals.





                                        </p>
                                    </div>




                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">5</p>

                                        <p className="mt-2 font-bold  text-lg">Parental Support Through Expert Advice


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Our sessions include parents too, so everyone is on the same page and career discussions become easier and stress-free.



                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">6</p>

                                        <p className="mt-2 font-bold  text-lg">Discover More Career Options


                                        </p>
                                        <p className="mt-1  text-lg">
                                            You’ll explore 300+ career paths—including trending, creative, and lesser-known options—so you don’t miss out on what could be perfect for you.



                                        </p>
                                    </div>
                                </div>

                            </CardContent>
                        </CardContent>
                    </Card>

                </section>



                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-full  flex flex-col justify-center items-center text-center">
                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    GUIDING THROUGH THE CONFUSION</span> <br/>
                                Here’s How We Step In to Help for Class 12th Students

                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">
                                        <HeartPulse className="w-16 h-16 md:w-20 md:h-20 object-contain"/>

                                        <p className="mt-2 font-bold  text-lg">Information Overload


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Too many opinions from parents, friends, relatives, and the internet? Our expert counsellors give you clear, unbiased guidance that cuts through the noise — so your decision is based on your future, not others' expectations.



                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">

                                        <GraduationCap className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                                        <p className="mt-2 font-bold  text-lg">Fear of Wrong Decisions



                                        </p>
                                        <p className="mt-1  text-lg">
                                            Worried about making a choice you’ll regret later? We help you make informed, confident decisions backed by data and expert insights so you move forward with clarity, not doubt.





                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">

                                        <Frown  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Parental Pressure

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Feeling torn between your passion and your parents’ expectations? We create a space where both you and your parents are heard. Through joint sessions, we help align your goals with their support.





                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <Construction  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Lack of Career Awareness

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Only know about a few “popular” career options? We introduce you to a wide range of future-ready and offbeat careers you might not have explored — all matched to your unique profile.





                                        </p>
                                    </div>



                                </div>

                            </CardContent>
                        </CardContent>

                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    LET THEM EXPLORE BEFORE THEY DECIDE</span> <br/>
                                Benefits of Career Guidance for Class 12th Students

                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">

                                        <p    className=" text-center text-3xl font-extrabold">1</p>
                                        <p className="mt-2 font-bold  text-lg">Clarity in Career Choices

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Say goodbye to confusion. Get a clear picture of which careers actually match your interests, strengths, and goals.


                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">2</p>

                                        <p className="mt-2 font-bold  text-lg">Discover New-Age & Emerging Careers

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Explore exciting, lesser-known career options beyond the usual doctor-engineer-CA route — and find something that truly excites you.



                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">3</p>

                                        <p className="mt-2 font-bold  text-lg">Informed Decision-Making

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Back every decision with expert advice and psychometric insights — no more guessing or following the crowd.


                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">4</p>

                                        <p className="mt-2 font-bold  text-lg">Customized Roadmap for Your Future


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Know exactly what to do next — which course, which college, and how to get there — all tailored just for you.






                                        </p>
                                    </div>




                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">5</p>

                                        <p className="mt-2 font-bold  text-lg">Parental Support Through Expert Advice



                                        </p>
                                        <p className="mt-1  text-lg">
                                            Bridge the gap between your choices and their expectations through joint sessions that bring clarity to everyone involved.




                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">6</p>

                                        <p className="mt-2 font-bold  text-lg">Boost in Confidence



                                        </p>
                                        <p className="mt-1  text-lg">
                                            When you know your direction, your confidence grows. Walk into your future with certainty, not stress.




                                        </p>
                                    </div>
                                </div>

                            </CardContent>
                        </CardContent>
                    </Card>

                </section>



                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-full  flex flex-col justify-center items-center text-center">
                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    GUIDING THROUGH THE CONFUSION</span> <br/>
                                Here’s How We Step In to Help for Undergraduates

                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">
                                        <HeartPulse className="w-16 h-16 md:w-20 md:h-20 object-contain"/>

                                        <p className="mt-2 font-bold  text-lg">Confusion About Career Choices

                                        </p>
                                        <p className="mt-1  text-lg">
                                            With so many options—MBA, Govt exams, Entrepreneurship, Study Abroad—it’s easy to feel lost. We help you evaluate what suits your interests, personality, and goals through scientific assessments and one-on-one expert guidance.




                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">

                                        <GraduationCap className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                                        <p className="mt-2 font-bold  text-lg">Pressure From Family or Peers




                                        </p>
                                        <p className="mt-1  text-lg">
                                            Not everyone around you understands your dreams. Our counsellors act as unbiased professionals, helping you gain clarity and confidence in your choices.






                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">

                                        <Frown  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Lack of Awareness About Career Options


                                        </p>
                                        <p className="mt-1  text-lg">
                                            You may not know about new-age roles or career paths that actually match your potential. We introduce you to trending and relevant career opportunities you might not have considered before.






                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <Construction  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Fear of Making the Wrong Decision


                                        </p>
                                        <p className="mt-1  text-lg">
                                            One wrong move could lead to years of dissatisfaction. We help you avoid trial and error with psychometric analysis, goal mapping, and personalised counselling.






                                        </p>
                                    </div>



                                </div>

                            </CardContent>
                        </CardContent>

                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    LET THEM EXPLORE BEFORE THEY DECIDE</span> <br/>
                                Benefits of Career Guidance for Undergraduates

                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">

                                        <p    className=" text-center text-3xl font-extrabold">1</p>
                                        <p className="mt-2 font-bold  text-lg">Clarity in Career Direction


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Get a clear understanding of which career paths align with your interests, strengths, and long-term goals—so you’re not left guessing what to do after graduation.



                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">2</p>

                                        <p className="mt-2 font-bold  text-lg">Strategic Post-Graduation Planning


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Receive a personalised step-by-step plan that outlines your next moves—be it further studies, skill-building, or starting your career—so you stay focused and confident.




                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">3</p>

                                        <p className="mt-2 font-bold  text-lg">Exposure to Diverse Career Opportunities


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Explore career options beyond the conventional choices—learn about emerging fields, interdisciplinary roles, and industries you may not have considered before.



                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">4</p>

                                        <p className="mt-2 font-bold  text-lg">Ongoing Expert Support & Mentorship



                                        </p>
                                        <p className="mt-1  text-lg">
                                            Our guidance doesn’t stop after one session. You get continued support from experienced mentors to help you throughout your academic and professional journey.



                                        </p>
                                    </div>




                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">5</p>

                                        <p className="mt-2 font-bold  text-lg">Parental Support Through Expert Advice

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Counselling bridges the gap between what parents hope for and what’s best for the student — creating alignment and peace of mind at home.





                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">6</p>

                                        <p className="mt-2 font-bold  text-lg">Reduced Stress & Self-Doubt

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Having expert support boosts your confidence, reduces stress, and helps you feel more in control of your future.





                                        </p>
                                    </div>
                                </div>

                            </CardContent>
                        </CardContent>
                    </Card>

                </section>



                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-full  flex flex-col justify-center items-center text-center">
                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    GUIDING THROUGH THE CONFUSION</span> <br/>
                                Here’s How We Step In to Help for Postgraduates

                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">
                                        <HeartPulse className="w-16 h-16 md:w-20 md:h-20 object-contain"/>

                                        <p className="mt-2 font-bold  text-lg">Feeling Unprepared for the Job Market


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Despite having a degree, many PG students lack industry exposure, soft skills, or confidence — making job hunting a challenge.





                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">

                                        <GraduationCap className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                                        <p className="mt-2 font-bold  text-lg">Mismatch Between Qualification and Passion





                                        </p>
                                        <p className="mt-1  text-lg">
                                            You may have completed your PG in one field but feel drawn to something else. This disconnect often leaves students feeling stuck.







                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">

                                        <Frown  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Uncertainty About the Next Step



                                        </p>
                                        <p className="mt-1  text-lg">
                                            Many PG students feel unsure about what to do after their degree — job, further studies, or something else? The lack of direction creates confusion.







                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <Construction  className="w-16 h-16 md:w-20 md:h-20 object-contain"/>
                                        <p className="mt-2 font-bold  text-lg">Lack of Career Clarity


                                        </p>
                                        <p className="mt-1  text-lg">
                                            With too many choices and no clear roadmap, students struggle to find a career path that truly fits their strengths and goals.



                                        </p>
                                    </div>



                                </div>

                            </CardContent>
                        </CardContent>

                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4 leading-10">
                                <span className="text-lg text-muted-foreground">
                                    LET THEM EXPLORE BEFORE THEY DECIDE</span> <br/>
                                Benefits of Career Guidance for Postgraduates

                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            <CardContent>
                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">

                                        <p    className=" text-center text-3xl font-extrabold">1</p>
                                        <p className="mt-2 font-bold  text-lg">Clarity in Career Direction


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Helps you identify the right path based on your strengths, interests, and goals — no more second-guessing.

                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">2</p>

                                        <p className="mt-2 font-bold  text-lg">Informed Decision-Making



                                        </p>
                                        <p className="mt-1  text-lg">
                                            Backed by scientific assessments and expert insights, so your next move is confident and well thought-out.

                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">3</p>

                                        <p className="mt-2 font-bold  text-lg">Smooth Career Transitions

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Whether you're switching fields or starting fresh, counselling offers guidance for a strategic and stress-free transition.

                                        </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">4</p>

                                        <p className="mt-2 font-bold  text-lg">Job Market Readiness

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Equips you with the right skills, resume tips, and interview prep to make a strong impression and land the right role.

                                        </p>
                                    </div>




                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">5</p>

                                        <p className="mt-2 font-bold  text-lg">Personalised Career Roadmap


                                        </p>
                                        <p className="mt-1  text-lg">
                                            Get a clear, step-by-step plan tailored to your background, passion, and future vision.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <p    className=" text-center text-3xl font-extrabold">6</p>

                                        <p className="mt-2 font-bold  text-lg">Reduced Stress & Self-Doubt

                                        </p>
                                        <p className="mt-1  text-lg">
                                            Having expert support boosts your confidence, reduces stress, and helps you feel more in control of your future.

                                        </p>
                                    </div>
                                </div>

                            </CardContent>
                        </CardContent>
                    </Card>

                </section>



            </div></>
    );
}
