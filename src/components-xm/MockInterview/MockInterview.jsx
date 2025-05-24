import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {useAuthStore} from "@/zustland/store.js";
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
import mockinterview from "@/assets/mock-interview.png";
import professions from "@/assets/professions.png";
import increaseconfidence from "@/assets/increase-confidence.png"
import enhancedprofessionalism from "@/assets/enhanced-professionalism.png"
import insightfulfeedback from "@/assets/insightful-feedback.png"
import markettrends from "@/assets/market-trends.png"
import reducenervousness from "@/assets/reduce-nervousness.png"
import clearcommunication from "@/assets/clear-communication.png"
import fresher from "@/assets/fresher.png"
import graduate from "@/assets/graduate.png"
import postgraduate from "@/assets/post-graduate.png"
import jobaspirant from "@/assets/job-aspirant.png"
import careertransition from "@/assets/career-transition.png"
import careerrestart from "@/assets/career-restart.png"


export function MockInterview() {
    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
    const navigate = useNavigate()


    return (
        <>   <PublicHeader/>
            <div className="p-3 md:p-3 overflow-y-auto h-[calc(100svh-4em)]">

                <Card className="border-0 bg-muted/50 bg-[#ffdd00]   py-6">
                    <CardHeader className="flex flex-col md:flex-row gap-4 justify-between py-0 items-center ">
                        <img
                            src={mockinterview}
                            alt="Compass"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain hidden md:block"
                        />
                        <div>
                            <CardTitle className="text-center tracking-widest text-2xl md:text-3xl font-bold ">
                                VAULT THE PRACTICE ! ACE THE PERFORMANCE WITH MOCK INTERVIEW
                            </CardTitle>
                            {/*<CardDescription className="text-center text-black">*/}
                            {/*    Your personal space to rehearse real-world interviews securely and sharpen your*/}
                            {/*    responses.*/}
                            {/*</CardDescription>*/}
                        </div>
                        <img
                            src={mockinterview}
                            alt="Compass"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />


                    </CardHeader>

                </Card>

                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">
                    <img
                        src="https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/hero.png"
                        alt="Professions"
                        className="w-84 h-72 object-contain rounded-xl border-0 bg-muted/50 p-4"
                    />
                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit w-84 flex flex-col justify-center items-start text-left ">
                        <CardHeader className="flex flex-col gap-4">
                            <CardTitle className="tracking-widest text-3xl font-extrabold text-left">
                                Interview Skills
                            </CardTitle>
                            <CardDescription className="text-black text-md">
                                Interviews can be nerve-wracking, but our mock interview skills program is designed to
                                transform your approach and boost your confidence. This comprehensive program provides
                                you with essential techniques, from tackling common interview questions to perfecting
                                your body language and communication skills. Our personalized strategies will empower
                                you to make a memorable impression and increase your chances of landing your dream job.
                            </CardDescription>
                            <div className="mt-">
                                <Link to={`/schedule-mock-interview`}>
                                    <Button className="gap-1">TALK TO OUR EXPERT NOW</Button>
                                </Link>
                            </div>
                        </CardHeader>
                    </Card>
                </section>

                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit w-84 flex flex-col justify-center items-start text-left ">
                        <CardHeader className="flex flex-col gap-4">
                            <CardTitle className="tracking-widest   text-3xl font-bold  ">
                                What are Interview Skills?
                            </CardTitle>
                            <CardDescription className="text-black text-md mt-4">
                                Interview skills are the basic techniques and strategies that help candidates succeed in
                                interviews. These skills include preparing strong answers to both common and unexpected
                                questions and improving communication to make a good impression. Our program equips
                                candidates with essential skills to handle various interview formats, from one-on-one
                                meetings to panel discussions. It also focuses on improving communication to create a
                                positive impression and effectively address questions about strengths and weaknesses in
                                an interview.

                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <img
                        src="https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/target.svg"
                        alt="Professions"
                        className="w-84 h-72 object-contain rounded-xl border-0 bg-muted/50 p-4"
                    />
                </section>

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
                                            Benefits of Mock Interview

                                        </CardTitle>

                                        <div>
                                            {/* Optional content */}
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-3   gap-6 justify-items-center">
                                            {/*<div className="flex flex-col items-center text-center">*/}
                                            {/*    <img*/}
                                            {/*        src="https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/target.svg"*/}
                                            {/*        className="w-16 h-16 md:w-20 md:h-20 object-contain"*/}
                                            {/*        alt="Mock Interview Target"*/}
                                            {/*    />*/}
                                            {/*    <p className="mt-2 font-bold text-lg">Hands-on experience</p>*/}
                                            {/*    <p className="mt-1  text-lg">*/}
                                            {/*        Learn how to answer interview questions professionally to the hiring*/}
                                            {/*        panel.*/}
                                            {/*    </p>*/}
                                            {/*</div>*/}

                                            {/*<div className="flex flex-col items-center text-center">*/}
                                            {/*    <img*/}
                                            {/*        src="https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/chat.svg"*/}
                                            {/*        className="w-16 h-16 md:w-20 md:h-20 object-contain"*/}
                                            {/*        alt="Mock Interview Target"*/}
                                            {/*    />*/}
                                            {/*    <p className="mt-2 font-bold  text-lg">Detailed feedback*/}
                                            {/*    </p>*/}
                                            {/*    <p className="mt-1  text-lg">*/}
                                            {/*        Get actionable feedback on what you need to work on to land your*/}
                                            {/*        next job.*/}

                                            {/*    </p>*/}
                                            {/*</div>*/}

                                            {/*<div className="flex flex-col items-center text-center">*/}
                                            {/*    <img*/}
                                            {/*        src="https://next-cdn.codementor.io/images/landing-pages/mock-interview-practices/star.svg"*/}
                                            {/*        className="w-16 h-16 md:w-20 md:h-20 object-contain"*/}
                                            {/*        alt="Mock Interview Target"*/}
                                            {/*    />*/}
                                            {/*    <p className="mt-2 font-bold  text-lg">Confidence boost*/}
                                            {/*    </p>*/}
                                            {/*    <p className="mt-1  text-lg">*/}
                                            {/*        Gain confidence practicing with coaches who match your learning*/}
                                            {/*        style.*/}

                                            {/*    </p>*/}
                                            {/*</div>*/}


                                            <div className="flex flex-col items-center text-center">
                                                <img
                                                    src={increaseconfidence}
                                                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                                    alt="Mock Interview Target"
                                                />
                                                <p className="mt-2 font-bold  text-lg">Increased Confidence
                                                </p>
                                                <p className="mt-1  text-lg">
                                                    Approach interviews with ease, knowing you're well-prepared.

                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center text-center">
                                                <img
                                                    src={enhancedprofessionalism}
                                                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                                    alt="Mock Interview Target"
                                                />
                                                <p className="mt-2 font-bold  text-lg"> Enhanced Professionalism
                                                </p>
                                                <p className="mt-1  text-lg">
                                                    Understand the finer details of presenting yourself professionally.

                                                </p>
                                            </div>


                                            <div className="flex flex-col items-center text-center">
                                                <img
                                                    src={insightfulfeedback}
                                                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                                    alt="Mock Interview Target"
                                                />
                                                <p className="mt-2 font-bold  text-lg">Insightful Feedback
                                                </p>
                                                <p className="mt-1  text-lg">
                                                    Receive constructive insights on areas of improvement.
                                                </p>
                                            </div>


                                            <div className="flex flex-col items-center text-center">
                                                <img
                                                    src={clearcommunication}
                                                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                                    alt="Mock Interview Target"
                                                />
                                                <p className="mt-2 font-bold  text-lg">Clear Communication
                                                </p>
                                                <p className="mt-1  text-lg">
                                                    Learn how to articulate your skills and experiences effectively.
                                                </p>
                                            </div>


                                            <div className="flex flex-col items-center text-center">
                                                <img
                                                    src={markettrends}
                                                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                                    alt="Mock Interview Target"
                                                />
                                                <p className="mt-2 font-bold  text-lg">Market Trends Insight
                                                </p>
                                                <p className="mt-1  text-lg">
                                                    Stay informed about industry trends to customize your answers and
                                                    showcase your skills in interviews.

                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                <img
                                                    src={reducenervousness}
                                                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                                    alt="Mock Interview Target"
                                                />
                                                <p className="mt-2 font-bold  text-lg">Reduced Nervousness
                                                </p>
                                                <p className="mt-1  text-lg">
                                                    Gain comfort with mock interviews that simulate real scenarios.

                                                </p>
                                            </div>

                                        </div>

                                    </CardContent>
                                </div>


                            </div>
                        </CardContent>
                    </Card>
                </section>


                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">
                    <img
                        src={professions}
                        alt="Professions"
                        className="w-84 h-72  object-cover rounded-xl border-0 bg-muted/50"
                    />
                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit p-4 w-full md:w-3/4 flex flex-col justify-center items-center text-center">
                        <CardHeader>
                            <CardTitle className="tracking-wider text-yellow-600 text-3xl font-bold mb-4">
                                Who Can Benefit from This?
                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3   gap-6 justify-items-center">


                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={fresher}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">Freshers
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Just starting out, usually in the first or second year of study.
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
                                            Recently completed or in the final phase of undergraduate studies.
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
                                            Pursuing or completed postgraduate degrees and looking to specialize
                                            further. </p>
                                    </div>


                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={jobaspirant}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                            alt="Mock Interview Target"
                                        />
                                        <p className="mt-2 font-bold  text-lg">Job Aspirants
                                        </p>
                                        <p className="mt-1  text-lg">
                                            Looking to enter the workforce or secure their first job opportunity. </p>
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
                                            Seeking a shift into a new industry or domain.
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
                                            Returning to the workforce after a break or hiatus.
                                        </p>
                                    </div>

                                </div>

                            </CardContent>
                        </CardContent>


                    </Card>
                </section>


                <section className="my-6 w-full flex flex-col md:flex-row gap-6 justify-between py-0 items-center">

                    <Card
                        className="bg-muted/50 rounded-xl border-0 min-h-72 h-fit w-84 flex flex-col justify-center items-start text-left ">
                        <CardHeader  className="flex flex-col gap-4"> <CardTitle className="tracking-widest text-3xl font-extrabold text-left">
                            Practice Interviews in Safe Virtual Sessions
                        </CardTitle>
                            <CardDescription className="text-black text-md mt-4">
                                We’re a team of seasoned professionals passionate about helping candidates shine in
                                their interviews. Whether you’re applying for your first job, transitioning careers, or
                                aiming for a leadership role, our mock interview services provide the confidence and
                                preparation you need to succeed.

                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <img
                        src="https://mockinterview.co/wp-content/uploads/2024/11/DALL%C2%B7E-2024-11-16-12.57.19-A-futuristic-tech-themed-hero-image-for-a-landing-page.-A-confident-candidate-sits-at-a-virtual-interview-table-facing-an-AI-enabled-human-interview-1.webp"
                        alt="Professions"
                        className="w-84 h-72 object-contain rounded-xl border-0 bg-muted/50  "
                    />
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


            </div>
        </>
    );
}
