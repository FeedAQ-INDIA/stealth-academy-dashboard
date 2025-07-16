import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
import "./HomePage.css"
import {Button} from "@/components/ui/button.jsx";
import React, {useState,useEffect, useRef} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Link} from "react-router-dom";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {LetsConnectForm} from "@/components-xm/HomeFiles/LetsConnectForm.jsx";
import {Vortex} from "@/components/ui/vortex.jsx";
 import { useScroll, useTransform } from "motion/react";
import {GoogleGeminiEffect} from "@/components/ui/google-gemini-effect.jsx";
import {BookOpen, Briefcase, Star, TrendingUp, Users} from "lucide-react";


export default function HomePage() {

    const learningPath = [
        {
            step: "01",
            title: "Foundation Building",
            description: "Start with basics and build a strong foundation with our structured curriculum."
        },
        {
            step: "02",
            title: "Hands-on Projects",
            description: "Work on real-world projects to apply your learning and build a portfolio."
        },
        {
            step: "03",
            title: "Industry Mentorship",
            description: "Get guided by industry experts who share their real-world experience."
        },
        {
            step: "04",
            title: "Job Placement",
            description: "Receive career support and job placement assistance to land your dream role."
        }
    ];

    const projects = [

        {
            title: "IT Experts as Trainers",
            description:
                "Learning a technology from a professional with industry expertise solves 60% of your challenges.",
        },
        {
            title: "Fully Hands-on Training",
            description:
                "We back every course with practical classes, offering immersive hands-on training.",
        },
        {
            title: "Flexible Timings",
            description:
                "With over 100+ trainers, we offer flexible class schedules to suit your needs.",
        },
        {
            title: "Affordable Fees",
            description:
                "We offer top-quality training at budget-friendly prices, making tech education accessible.",
        },
        {
            title: "Lab Support",
            description:
                "Bring your laptop and we’ll help you set up everything you need to start learning.",
        },
        {
            title: "Interview Preparation",
            description:
                "Each course includes interview questions and real-world scenarios to help you succeed.",
        },

    ];
    const successStats = [
        { icon: Users, value: "13,487+", label: "Careers Transformed" },
        { icon: Briefcase, value: "8", label: "Corporate Partners" },
        { icon: BookOpen, value: "17,896+", label: "Active Learners" },
        { icon: TrendingUp, value: "67.3 LPA", label: "Highest Placement CTC" }
    ];

    return (
        <><PublicHeader/>
            <div className="p-0 md:p-3 overflow-y-auto h-[calc(100svh-4em)]">


                <section className="bg-gradient-to-r from-orange-800 via-black to-black rounded-sm">
                    <div className="min-h-[30svh] p-8 h-full  ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full text-white h-full">

                            <div className="flex flex-col justify-center p-2 h-full">
                                <div className="inline-flex items-center space-x-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 text-sm w-fit">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>Rated #8 EdTech Platform</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mt-5 ">
                                    Unlock Your Full Potential <br/> Step Into the Top 1%
                                </h1>
                                <p className="mt-5 text-md md:text-lg">
                                    Learn with a Highly Structured, Personalized & Guided World-Class Program.
                                    We empower students and professionals with world-class education, mentorship, and
                                    real-world training. </p>
                                <div className="mt-5 flex gap-2">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button
                                                className=" border-[#ffdd00] border-2 text-white hover:bg-[#ffdd00] hover:text-black"
                                                href="#letsconnect">Let's Connect</Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle className="tracking-wide font-bold text-2xl">Let's Connect</SheetTitle>
                                                <SheetDescription>
                                                    This isn’t just another course. It’s the start of your professional journey.
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div className="my-4">
                                                <LetsConnectForm/>
                                            </div>

                                        </SheetContent>
                                    </Sheet>

                                </div>
                            </div>

                            <div className="flex items-center justify-center h-full p-2">
                                <div className="relative w-full h-full overflow-hidden rounded-xl">
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        poster="https://cdn.prod.website-files.com/66fdb7625e27fbd31a1cfc73%2F66fec092111f8ae557675c47_-42d2-40d5-ba3d-0008a659a8b9-poster-00001.jpg"
                                    >
                                        <source
                                            src="https://cdn.prod.website-files.com/66fdb7625e27fbd31a1cfc73%2F66fec092111f8ae557675c47_-42d2-40d5-ba3d-0008a659a8b9-transcode.mp4"
                                            type="video/mp4"/>
                                        <source
                                            src="https://cdn.prod.website-files.com/66fdb7625e27fbd31a1cfc73%2F66fec092111f8ae557675c47_-42d2-40d5-ba3d-0008a659a8b9-transcode.webm"
                                            type="video/webm"/>
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>


                        </div>


                    </div>
                    <TransformationHero/>
                </section>


                <section>

                    <div className="bg-white py-16 ">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <h2 className="text-center text-lg/8 font-semibold text-gray-900">We have alumni's working
                                in
                                top
                                organizations across the world.</h2>
                            <div className="mx-auto mt-10 flex w-full flex-wrap items-center gap-2 justify-center">
                                <img className="max-h-12 w-auto object-contain"
                                     src="https://www.tutort.net/assets/company-logos/original/intuit.svg"
                                     alt="Transistor"
                                     width="158"
                                     height="48"/>
                                <img className="max-h-12 w-auto object-contain"
                                     src="https://www.tutort.net/assets/company-logos/original/jpmorgan.svg"
                                     alt="Reform"
                                     width="158"
                                     height="48"/>
                                <img className="max-h-12 w-auto object-contain"
                                     src="https://www.tutort.net/assets/company-logos/original/microsoft.svg"
                                     alt="Tuple"
                                     width="158"
                                     height="48"/>
                                <img className="max-h-12 w-auto object-contain"
                                     src="https://www.tutort.net/assets/company-logos/original/walmart.svg" alt="Tuple"
                                     width="158" height="48"/>
                                <img className="max-h-12 w-auto object-contain"
                                     src="https://www.tutort.net/assets/company-logos/original/amazon.svg" alt="Tuple"
                                     width="158" height="48"/>

                            </div>
                        </div>
                    </div>

                </section>



                <section className=" ">
                    <div className="w-full mx-auto rounded-sm  h-fit py-4 md:py-6 lg:py-10 overflow-hidden">
                        <Vortex
                            backgroundColor="black"
                            className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                        >
                            <h2 className="text-white text-2xl md:text-3xl lg:text-5xl font-bold text-center">
                                Learning Today For A Better Tomorrow
                            </h2>

                            {/*</p>*/}
                            <div className="mt-6 flex gap-4 ">
                                <Link to={'/explore'}> <Button  className=" border-[#ffdd00] border-2 text-white hover:bg-[#ffdd00] hover:text-black" >EXPLORE</Button></Link>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            className=" border-[#ffdd00] border-2 text-white hover:bg-[#ffdd00] hover:text-black"
                                            href="#letsconnect">LET'S CONNECT</Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle className="tracking-wide font-bold text-2xl">Let's Connect</SheetTitle>
                                            <SheetDescription>
                                                This isn’t just another course. It’s the start of your professional journey.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="my-4">
                                            <LetsConnectForm/>
                                        </div>

                                    </SheetContent>
                                </Sheet>

                             </div>
                        </Vortex>
                    </div>

                </section>


                <section  className="  my-12">
                    <div className=" mx-auto  ">
                         {/* Learning Path */}
                        <section className="  ">
                            <div className="  mx-auto px-4">
                                <div className="text-center mb-8">
                                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Learning Journey</h2>
                                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                        Follow our proven 4-step methodology to transform from beginner to industry-ready professional
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {learningPath.map((step, index) => (
                                        <div key={index} className=" ">
                                            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow   h-full">
                                                <div className="flex items-center mb-4">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                        {index+1}
                                                    </div>
                                                    {/*{index < projects.length - 1 && (*/}
                                                    {/*    <div className="hidden lg:block absolute top-12 left-16 w-full h-0.5 bg-gradient-to-r from-yellow-600 to-orange-600"></div>*/}
                                                    {/*)}*/}
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                                                <p className="text-gray-600 text-sm">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </section>

                <section className="py-12 bg-black rounded-sm ">
                    <div className=" mx-auto px-4">
                        <h2 className="text-4xl font-bold text-white mb-6 text-center">Our Offerings</h2>
                         <HoverEffect items={projects} />
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Why Choose FeedAQ Academy?
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                                We're Not Just Selling Courses—We're Building Your Future!
                            </p>
                            <p className="text-gray-700 max-w-3xl mx-auto">
                                At FeedAQ Academy, we don't believe in just teaching skills—we believe in transforming careers.
                                Our mission is to take you from a graduate to a highly skilled professional, ready to thrive in today's competitive job market.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            {successStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="text-center group">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                        <div className="text-gray-600 text-sm">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="bg-black rounded-sm ">
                    <div className="py-8 container text-white text-center">

                        <h1>@2025 Copyright - FeedAQ Academy</h1>
                        <p>Part of FeedAQ Technologies Pvt Ltd</p>

                    </div>
                </section>
            </div>
        </>
    );
}


const transformations = [
    "ZERO TO HERO",
    "BASIC TO ADVANCED",
    "SKILLED TO UPSKILLED",
    "BEGINNER TO EXPERT",
    "NOVICE TO MASTER",
    "TRAINEE TO PROFESSIONAL",
    "UNSKILLED TO SKILLED",
    "FAILURE TO SUCCESS",
    "STUDENT TO PROFESSIONAL",
    "ROOKIE TO CHAMPION",
    "HTML TO FULL-STACK",
    "NO CODE TO PRO CODE"
];

const TransformationHero = () => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const [isErasing, setIsErasing] = useState(false);
    const [charIndex, setCharIndex] = useState(0);

    const typingSpeed = 50;
    const erasingSpeed = 30;
    const pauseTime = 1000;

    useEffect(() => {
        const current = transformations[index];
        let timeout;

        if (!isErasing && charIndex < current.length) {
            timeout = setTimeout(() => {
                setDisplayText(current.slice(0, charIndex + 1));
                setCharIndex((prev) => prev + 1);
            }, typingSpeed);
        } else if (isErasing && charIndex > 0) {
            timeout = setTimeout(() => {
                setDisplayText(current.slice(0, charIndex - 1));
                setCharIndex((prev) => prev - 1);
            }, erasingSpeed);
        } else {
            timeout = setTimeout(() => {
                if (!isErasing) {
                    setIsErasing(true);
                } else {
                    setIsErasing(false);
                    setIndex((prev) => (prev + 1) % transformations.length);
                }
            }, pauseTime);
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isErasing, index]);

    return (
        <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                TRANSFORM FROM{" "}
                <span className=" font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                    {displayText}
                    <span className="animate-ping text-white">|</span>
                </span>
            </p>

        </div>
    );
};


const HoverEffect = ({ items }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {items?.map((item, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg w-fit">
                        <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                    </p>
                </CardContent>
            </Card>
        ))}
    </div>
);

