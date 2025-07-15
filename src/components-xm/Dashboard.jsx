import {BookOpen, Clock, Search, User,} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import compass from '../assets/compass.png'
import mockinterview from '../assets/mock-interview.png'
import languagestudio from '../assets/language-studio.png'
import companiontalks from '../assets/companion-talks.png'

export function Dashboard() {
    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
    const navigate = useNavigate()

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState(null);
    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "User", attributes: [], where: {userId: userDetail?.userId},
            include: [{
                datasource: "Course", as: "courses", required: false, order: [], attributes: [], where: {},
            },
            ],
        },
    });

    useEffect(() => {
        fetchCourses();
    }, [apiQuery]);

    const fetchCourses = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
            .then((res) => {
                console.log(res.data);
                setCourseList(res.data.data?.results?.[0]);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [exploreCourseText, setExploreCourseText] = useState("");


    return (
        <div className="p-3 md:p-6">
            <Card className="rounded-sm  border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl mb-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <CardHeader className="relative z-10 pb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                            <div className="relative flex-shrink-0">
                                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/20 shadow-xl">
                                    <AvatarFallback className="text-xl sm:text-2xl bg-white/20 text-white font-bold">
                                        {userDetail?.nameInitial}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                                    Welcome , {userDetail?.derivedUserName}!
                                </h1>
                                <p className="text-blue-100 text-base sm:text-lg flex items-center gap-2 flex-wrap">
                                    <User className="w-4 h-4 flex-shrink-0" />
                                    <span className="break-words">Member since {userDetail?.created_date}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col xs:flex-row gap-3 w-full lg:w-auto">
                          <Link to={'/explore'}>  <Button
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm w-full xs:w-auto justify-center xs:justify-start"
                            >
                                <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="whitespace-nowrap">Explore Courses</span>
                            </Button></Link>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card className="rounded-sm  border-0 bg-gradient-to-r from-[#ffdd00] via-black-600 to-black text-white shadow-2xl mb-8 overflow-hidden relative">
                <CardHeader>
                    <CardTitle className="text-center tracking-wide">
                        What would you like to learn today ?
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="my-2">
                        <div className="flex gap-2 w-full md:w-3/4 lg:w-1/2 mx-auto items-center">
                            <Input type="text" value={exploreCourseText}
                                   onChange={(e) => setExploreCourseText(e.target.value)}
                                   placeholder="What do you want to learn today ?"/>
                            <Button type="submit"
                                    onClick={() => navigate('/explore?search=' + exploreCourseText)}><Search/></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <section className="my-6 grid grid-cols-1  lg:grid-cols-2  gap-6">
                {/*<Card className="border-0 bg-muted/50    ">*/}
                {/*    <CardHeader className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">*/}
                {/*        <img*/}
                {/*            src={mockinterview}*/}
                {/*            alt="Compass"*/}
                {/*            className="w-16 h-16 md:w-20 md:h-20 object-contain"*/}
                {/*        />*/}
                {/*        <div> <CardTitle className="text-lg sm:text-2xl font-semibold  tracking-widest text-cyan-700">*/}
                {/*            <strong>  MOCK INTERVIEW VAULT</strong>*/}
                {/*        </CardTitle>*/}
                {/*            <CardDescription>*/}
                {/*                <Link to={`/mock-interview`} className="text-blue-700">*/}
                {/*                    Click Here*/}
                {/*                </Link> to know More.*/}
                {/*            </CardDescription>*/}
                {/*        </div>*/}

                {/*        <div className="md:ml-auto">*/}

                {/*            <Link to={`/schedule-mock-interview`}>*/}
                {/*            <Button*/}
                {/*                className="h-8 gap-1 "*/}
                {/*            >SCHEDULE NOW</Button>*/}
                {/*            </Link>*/}
                {/*         </div>*/}
                {/*    </CardHeader>*/}


                {/*</Card>*/}

                <Card className="border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <CardHeader className="relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-xl font-bold tracking-wide">
                                    THE LANG STUDIO
                                </CardTitle>
                                <CardDescription className="text-green-100 mt-2">
                                    Master new languages with interactive lessons and real-world practice
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm" disabled>
                            <Clock className="w-4 h-4 mr-2" />
                            Coming Soon
                        </Button>
                    </CardContent>
                </Card>
            </section>


            {/*<section className="my-6 grid grid-cols-1  lg:grid-cols-2  gap-6">*/}
            {/*    <Card className="border-0 bg-muted/50 ">*/}
            {/*        <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">*/}
            {/*            <img*/}
            {/*                src={compass}*/}
            {/*                alt="Compass"*/}
            {/*                className="w-16 h-16 md:w-20 md:h-20 object-contain"*/}
            {/*            />*/}
            
            {/*            <div className="flex-1">*/}
            {/*                <CardTitle className="text-lg sm:text-2xl font-semibold tracking-widest text-yellow-600">*/}
            {/*                    <strong>COUNSELLING COMPASS</strong>*/}
            {/*                </CardTitle>*/}
            {/*                <CardDescription>*/}
            {/*                    <Link to={`/counselling-compass`} className="text-blue-700">*/}
            {/*                        Click Here*/}
            {/*                    </Link>{" "}*/}
            {/*                    to know More.*/}
            {/*                </CardDescription>*/}
            {/*            </div>*/}
            
            {/*            <div className="md:ml-auto">*/}
            {/*                <Link to={`/schedule-counselling-compass`}>*/}
            {/*                    <Button className="h-8 gap-1">SCHEDULE NOW</Button>*/}
            {/*                </Link>*/}
            {/*            </div>*/}
            {/*        </CardHeader>*/}
            {/*    </Card>*/}
            {/*    <Card className="border-0 bg-muted/50 ">*/}
            {/*        <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">*/}
            {/*            <img*/}
            {/*                src={companiontalks}*/}
            {/*                alt="Compass"*/}
            {/*                className="w-16 h-16 md:w-20 md:h-20 object-contain"*/}
            {/*            />*/}
            
            {/*            <div className="flex-1">*/}
            {/*                <CardTitle className="text-lg sm:text-2xl font-semibold tracking-widest text-red-600">*/}
            {/*                    <strong>COMPANION CONNECT</strong>*/}
            {/*                </CardTitle>*/}
            {/*                <CardDescription>*/}
            
            {/*                </CardDescription>*/}
            {/*            </div>*/}
            
            {/*            <div className="md:ml-auto">*/}
            {/*                /!*<Link to={`/schedule-counselling-compass`}>*!/*/}
            {/*                    <Button*/}
            {/*                        className="h-8 gap-1 bg-[#ffdd00] animate-blink" disabled*/}
            {/*                    >COMING SOON</Button>*/}
            {/*            /!*</Link>*!/*/}
            {/*            </div>*/}
            {/*        </CardHeader>*/}
            {/*    </Card>*/}
            
            {/*</section>*/}



        </div>
    );
}
