import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
import "./HomePage.css"
import {Button} from "@/components/ui/button.jsx";
import {useState,useEffect, useRef} from "react";
import {Card, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Link} from "react-router-dom";
export default function HomePage() {


    return (
        <><PublicHeader/>
            <div className="p-0 md:p-3 overflow-y-auto h-[calc(100svh-4em)]">


                <section className="bg-black">
                    <div className="min-h-[30svh] p-8 h-full  ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full text-white h-full">

                            <div className="flex flex-col justify-center p-2 h-full">
                                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight  ">
                                    Unlock Your Full Potential <br/> Step Into the Top 1%
                                </h1>
                                <p className="mt-5 text-md md:text-lg">
                                    Learn with a Highly Structured, Personalized & Guided World-Class Program.
                                    We empower students and professionals with world-class education, mentorship, and
                                    real-world training. </p>
                                <div className="mt-5 flex gap-2">
                                    <Button
                                        className=" border-[#ffdd00] border-2 text-white hover:bg-[#ffdd00] hover:text-black"
                                        href="#letsconnect">Let's Connect</Button>
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

                <section className="bg-black p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <Link to='/browse'><Card className="rounded-sm hover:bg-[#ffdd00] cursor-pointer">
                            <CardHeader>
                                <h3 className="text-lg font-medium text-center">Browse Courses</h3>
                            </CardHeader>
                        </Card></Link>
                        <Link to='/mock-interview'><Card className="rounded-sm hover:bg-[#ffdd00] cursor-pointer">
                            <CardHeader>
                                <h3 className="text-lg font-medium text-center">Mock Interview Vault</h3>
                            </CardHeader>
                        </Card></Link>
                        <Link to='/counselling-compass'> <Card className="rounded-sm hover:bg-[#ffdd00] cursor-pointer">
                            <CardHeader>
                                <h3 className="text-lg font-medium text-center">Counselling Compass</h3>
                            </CardHeader>
                        </Card></Link>

                    </div>


                </section>

                <section>
                    <div className="container py-16">
                        <h1 className="font-bold text-xl md:text-3xl"> Why Choose FeedAQ Academy?
                        </h1>
                        <p className="my-6 text-md md:text-lg font-medium ">
                            We’re Not Just Selling Courses—We’re Building Your Future!</p>
                        <p>At FeedAQ Academy, we don’t believe in just teaching skills—we believe in transforming
                            careers. Our mission is
                            to take you from a graduate to a highly skilled professional, ready to thrive in today’s
                            competitive job market.
                        </p>
                        <div className="my-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center bg-gray-50 p-6 rounded-md shadow-md">
                                <p className="text-2xl font-medium text-black">13487 + </p>
                                <p className="text-muted-foreground">Careers Transformed</p>
                            </div>
                            <div className="text-center bg-gray-50 p-6 rounded-md shadow-md">
                                <p className="text-2xl font-medium text-black">8 </p>
                                <p className="text-muted-foreground">Corporates Partnered</p>
                            </div>
                            <div className="text-center bg-gray-50 p-6 rounded-md shadow-md">
                                <p className="text-2xl font-medium text-black">17896 + </p>
                                <p className="text-muted-foreground">Enrollments</p>
                            </div>
                            <div className="text-center bg-gray-50 p-6 rounded-md shadow-md">
                                <p className="text-2xl font-medium text-black">1.2 Cr </p>
                                <p className="text-muted-foreground">Highest Placement CTC</p>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="bg-black">
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
            <p className="font-medium text-black">
                This isn’t just another course. It’s the start of your professional journey.
            </p>
        </div>
    );
};

