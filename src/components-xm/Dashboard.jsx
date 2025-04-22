import {Clock, Search, Terminal,} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Progress} from "@/components/ui/progress";
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {FeaturedCourse} from "@/components-xm/FeaturedCourse.jsx";



 import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function Dashboard() {
    const {userDetail,  userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
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
            .post(import.meta.env.VITE_API_URL+"/searchCourse", apiQuery)
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


    const disroll = (courseId) => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/disroll", {
                courseId: courseId
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: 'Disrollment is successfull'
                });
                fetchCourses()
             })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Disrollment'
                })
            });
    }


    const [exploreCourseText, setExploreCourseText] = useState("");


    return (
        <div className="p-6">
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
                    <CardTitle className="text-center">
                        What would you like to learn today ?
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="my-2">
                        <div className="flex gap-2 w-full md:w-3/4 lg:w-1/2 mx-auto items-center">
                            <Input type="text" value={exploreCourseText} onChange={(e)=> setExploreCourseText(e.target.value)} placeholder="What do you want to learn today ?"/>
                            <Button type="submit" onClick={()=> navigate('/explore?search='+exploreCourseText)}><Search/></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>



            <Card className="border-0 bg-muted/50  my-6 py-6">
<CardHeader>
    <CardTitle>
        Featured Content
    </CardTitle>
</CardHeader>
                <CardContent>
                    <FeaturedCourse/>
                </CardContent>
            </Card>

        </div>
    );
}
