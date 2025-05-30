import {Search,} from "lucide-react";
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
            <Card className="border-0 bg-[#ffdd00]">
                <CardHeader>
                    <div className="flex flex-sm justify-items-center gap-4 items-center">
                        <Avatar className="w-12 h-12">
                            <AvatarFallback className="text-xl">{userDetail?.nameInitial}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-xl font-medium">Welcome {userDetail?.derivedUserName}</h1>
                            <p>Member since {userDetail?.created_date}</p>
                        </div>
                    </div>


                </CardHeader>
            </Card>

            <Card className="border-0 bg-muted/50  my-6 py-6">
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

            <section className="my-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-muted/50    ">
                    <CardHeader className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <img
                            src={mockinterview}
                            alt="Compass"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />
                        <div> <CardTitle className="text-lg sm:text-2xl font-semibold  tracking-widest text-cyan-700">
                            <strong>  MOCK INTERVIEW VAULT</strong>
                        </CardTitle>
                            <CardDescription>
                                <Link to={`/mock-interview`} className="text-blue-700">
                                    Click Here
                                </Link> to know More.
                            </CardDescription>
                        </div>

                        <div className="md:ml-auto">

                            <Link to={`/schedule-mock-interview`}>
                            <Button
                                className="h-8 gap-1 "
                            >SCHEDULE NOW</Button>
                            </Link>
                         </div>
                    </CardHeader>


                </Card>

                <Card className="border-0 bg-muted/50    ">
                    <CardHeader className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">


                        <img
                            src={languagestudio}
                            alt="Compass"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />

                        <div>
                            <CardTitle className="text-lg sm:text-2xl font-semibold tracking-widest text-green-600">
                            <strong>THE LANGUAGE STUDIO</strong>

                        </CardTitle>

                        </div>

                        <div className="md:ml-auto">

                            {/*<Link to={`/schedule-mock-interview`}>*/}
                                <Button
                                    className="h-8 gap-1 bg-[#ffdd00] animate-blink" disabled
                                >COMING SOON</Button>
                            {/*</Link>*/}
                        </div>
                    </CardHeader>


                </Card>
            </section>


            <section className="my-6 grid grid-cols-1  lg:grid-cols-2  gap-6">
                <Card className="border-0 bg-muted/50 ">
                    <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">
                        <img
                            src={compass}
                            alt="Compass"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />

                        <div className="flex-1">
                            <CardTitle className="text-lg sm:text-2xl font-semibold tracking-widest text-yellow-600">
                                <strong>COUNSELLING COMPASS</strong>
                            </CardTitle>
                            <CardDescription>
                                <Link to={`/counselling-compass`} className="text-blue-700">
                                    Click Here
                                </Link>{" "}
                                to know More.
                            </CardDescription>
                        </div>

                        <div className="md:ml-auto">
                            <Link to={`/schedule-counselling-compass`}>
                                <Button className="h-8 gap-1">SCHEDULE NOW</Button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>
                <Card className="border-0 bg-muted/50 ">
                    <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">
                        <img
                            src={companiontalks}
                            alt="Compass"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />

                        <div className="flex-1">
                            <CardTitle className="text-lg sm:text-2xl font-semibold tracking-widest text-red-600">
                                <strong>COMPANION CONNECT</strong>
                            </CardTitle>
                            <CardDescription>
                                <Link to={`/counselling-compass`} className="text-blue-700">
                                    Click Here
                                </Link>{" "}
                                to know More.
                            </CardDescription>
                        </div>

                        <div className="md:ml-auto">
                            {/*<Link to={`/schedule-counselling-compass`}>*/}
                                <Button
                                    className="h-8 gap-1 bg-[#ffdd00] animate-blink" disabled
                                >COMING SOON</Button>
                        {/*</Link>*/}
                        </div>
                    </CardHeader>
                </Card>

            </section>



        </div>
    );
}
