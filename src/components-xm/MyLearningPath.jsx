import {Clock, Terminal,} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {useAuthStore} from "@/zustland/store.js";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Link} from "react-router-dom";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";


export function MyLearningPath() {

    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState({});


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


    const disroll = (courseId) => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/disroll", {
                courseId: courseId
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: 'Disrollment is successfull'
                });
                fetchCourses()
                fetchUserEnrolledCourseIdList(userDetail.userId)

            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Disrollment'
                })
            });
    }
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

            <Card className="border-0 bg-muted/50  my-6">
                <CardHeader>
                    <CardTitle>
                        My Enrolled Courses
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="my-2">
                        {courseList?.courses?.length > 0 ?

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10 items-center">
                                {courseList?.courses?.map(a => (
                                    <Card className=" border shadow-sm hover:shadow-md cursor-pointer ">
                                        <CardHeader>
                                            {/* Badge row - wraps on smaller screens */}
                                            <div className="flex flex-wrap gap-2 w-full mb-3">
                                                <Badge className="animate-blink bg-green-600 text-white">FREE</Badge>
                                                <Badge variant="outline">Course</Badge>
                                                <Badge variant="outline">Beginner</Badge>
                                            </div>

                                            {/* Title with responsive spacing */}
                                            <div className=" ">
                                                <CardTitle className="text-lg sm:text-xl  font-semibold">
                                                    {a?.courseTitle}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="mb-2 line-clamp-3">{a?.courseDescription}</p>
                                            {/*<p className="my-2 animate-blink text-blue-800 font-medium"> Registration Started</p>*/}
                                            <div className="font-medium  ">
                                                <div className="flex gap-2 items-center">
                                                    <Clock
                                                        size={18}/> {`${Math.floor(+(a?.courseDuration) / 60)}hr ${+(a?.courseDuration) % 60}min`}
                                                </div>
                                                {/*<div className="flex flex-row gap-2 items-center mt-2">*/}
                                                {/*  <span>16% complete</span>*/}
                                                {/*  <Progress value={66} /></div>*/}


                                            </div>
                                        </CardContent>


                                        <CardFooter className="flex w-full flex-wrap gap-2">
                                            <Button className=" flex-1 " variant="destructive"
                                                    onClick={() => disroll(a?.courseId)}>Leave Course</Button>
                                            <Link to={`/course/${a?.courseId}`} className="  flex-1 "><Button
                                                className="  w-full ">Learn More</Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                            :
                            <Alert> <Terminal className="h-4 w-4"/>
                                <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
                                    <div>
                                        <AlertTitle>No Enrollment found</AlertTitle>
                                        <AlertDescription>
                                            <p>You are not enrolled in any course</p>

                                        </AlertDescription>
                                    </div>

                                    <div className="md:ml-auto">
                                        <Link to='/explore'>
                                            <Button className="mt-2 flex-1" size={'sm'}>Start your journey
                                                today</Button>
                                        </Link>

                                    </div>
                                </div>

                            </Alert>}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 bg-muted/50  my-6">
                <CardHeader>
                    <CardTitle>
                        My Completions
                    </CardTitle>


                </CardHeader>
                <CardContent>
                    <div className="my-2">
                        {courseList?.courses?.filter(a => a.user_enrollment?.enrollment_status == 'COMPLETED')?.length > 0 ?

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10 items-center">
                                {courseList?.courses?.filter(a => a.user_enrollment?.enrollment_status == 'COMPLETED')?.map(a => (
                                    <Card className=" border shadow-sm hover:shadow-md cursor-pointer ">
                                    <CardHeader>
                                    <div className="flex flex-wrap gap-2 w-full mb-3">
                                    <Badge className="animate-blink bg-green-600 text-white">CERTIFIED</Badge>

                                    </div>

                                    <div className=" ">
                                    <CardTitle className="text-lg sm:text-xl  font-semibold">
                                {a?.courseTitle}
                            </CardTitle>
                            </div>
                            </CardHeader>
                            <CardContent>
                            <p className="mb-2 line-clamp-3">{a?.courseDescription}</p>
                    <div className="font-medium  ">
                        <div className="flex gap-2 items-center">
                            <Clock
                                size={18}/>{`${Math.floor(+(a?.courseDuration) / 60)} hr ${+(a?.courseDuration) % 60} min`}
                        </div>
                    </div>
                </CardContent>


                <CardFooter className="flex w-full flex-wrap gap-2">
                    <Button className=" flex-1 " variant="outline"
                    >Download Certificate</Button>
                    <Link to={`/course/${a?.courseId}`} className="  flex-1 "><Button
                        className="  w-full ">Learn More</Button>
                    </Link>
                </CardFooter>
            </Card>
            )
            )}
        </div>
        :
    <Alert> <Terminal className="h-4 w-4"/>
        <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
            <div>
                <AlertTitle>No Completions found</AlertTitle>
                <AlertDescription>
                    <p>You have not completed in any course</p>

                </AlertDescription>
            </div>

            <div className="md:ml-auto">
                {/*<Link to='/explore'>*/}
                {/*    <Button className="mt-2 flex-1" size={'sm'}>Start your journey today</Button>*/}
                {/*</Link>*/}

            </div>
        </div>

    </Alert>
}
</div>
</CardContent>
</Card>

</div>
)

}
