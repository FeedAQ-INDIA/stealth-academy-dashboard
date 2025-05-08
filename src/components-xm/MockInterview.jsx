import {Search,} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import {CreateMockInterview} from "@/components-xm/CreateMockInterview.jsx";


export function MockInterview() {
    const {userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore()
    const navigate = useNavigate()

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState(null);


    const [exploreCourseText, setExploreCourseText] = useState("");


    return (
        <div className="p-6">


            <Card className="border-0 bg-muted/50 bg-[#ffdd00]   py-6">
                <CardHeader>
                    <CardTitle className="text-center">
                        Ace Your Next Interview with Real-World Mock Interview Sessions
                    </CardTitle>
                    <CardDescription className="text-center text-black">
                        Get personalized, live mock interviews by industry experts. Receive feedback, improve your confidence, and land your dream job.
                    </CardDescription>


                </CardHeader>
                {/*<CardContent>*/}
                    {/*<Sheet>*/}
                    {/*    <SheetTrigger asChild>*/}
                    {/*        /!*<Link to={`/workspace/${WorkspaceId}/products?tab=products`}>*!/*/}
                    {/*        <Button*/}
                    {/*            className="h-8 gap-1 "*/}
                    {/*        >Schedule Interview</Button>*/}
                    {/*        /!*</Link>*!/*/}
                    {/*    </SheetTrigger>*/}
                    {/*    <SheetContent>*/}
                    {/*        <SheetHeader>*/}
                    {/*            <SheetTitle>Schedule Interview</SheetTitle>*/}
                    {/*        </SheetHeader>*/}
                    {/*    </SheetContent>*/}
                    {/*</Sheet>*/}
                {/*</CardContent>*/}
            </Card>


            <section className="my-6 grid grid-cols-1 ">
                <Card className="border-0 bg-muted/50  py-3  ">

                    <CardContent>
                        <div className="flex gap-2 flex-col md:flex-row">
                            <img src={"https://myinterviewpractice.com/images/home_enterprise.png"} className="h-44"/>
                            <div>
                                <CardHeader className="flex flex-col sm:flex-row   gap-2 sm:gap-4">
                                    <CardTitle className="text-lg sm:text-2xl font-semibold">
                                        What we offer ?
                                    </CardTitle>

                                    <div className="sm:ml-auto">
                                        {/*<Sheet>*/}
                                        {/*    <SheetTrigger asChild>*/}
                                        {/*        /!*<Link to={`/workspace/${WorkspaceId}/products?tab=products`}>*!/*/}
                                        {/*        <Button*/}
                                        {/*            className="h-8 gap-1 "*/}
                                        {/*        >Schedule Interview</Button>*/}
                                        {/*        /!*</Link>*!/*/}
                                        {/*    </SheetTrigger>*/}
                                        {/*    <SheetContent>*/}
                                        {/*        <SheetHeader>*/}
                                        {/*            <SheetTitle>Schedule Interview</SheetTitle>*/}
                                        {/*        </SheetHeader>*/}
                                        {/*    </SheetContent>*/}
                                        {/*</Sheet>*/}
                                    </div>
                                </CardHeader>

                                <CardContent>
                                  <p>
                                      At Feedaq Academy, our Mock Interview Service is designed to simulate real-world interview scenarios. Whether you're preparing for a technical role in software engineering, a business analyst position, or a fresher interview, we’ve got you covered.

                                  </p>
                                <div className="mt-4">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            {/*<Link to={`/workspace/${WorkspaceId}/products?tab=products`}>*/}
                                            <Button
                                                className="h-8 gap-1 "
                                            >Schedule Interview</Button>
                                            {/*</Link>*/}
                                        </SheetTrigger>
                                        <SheetContent className="">
                                            <SheetHeader>
                                                <SheetTitle>Schedule Interview</SheetTitle>
                                            </SheetHeader>
                                            <div className=" ">
                                                <CreateMockInterview/>
                                            </div>
                                        </SheetContent>

                                    </Sheet>
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
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                {/*<Link to={`/workspace/${WorkspaceId}/products?tab=products`}>*/}
                                                <Button
                                                    className=" gap-1 "
                                                >Schedule Interview</Button>
                                                {/*</Link>*/}
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>Schedule Interview</SheetTitle>
                                                </SheetHeader>
                                                <div className=" ">
                                                    <CreateMockInterview/>
                                                </div>

                                            </SheetContent>
                                        </Sheet>
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


        </div>
    );
}
