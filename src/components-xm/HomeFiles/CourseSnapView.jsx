import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {AlertCircle, Book, Check, Terminal, Video} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import axiosConn from "@/axioscon.js";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion.jsx"
import {Link, useNavigate, useParams} from "react-router-dom";
import {toast} from "@/components/hooks/use-toast.js";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import {useAuthStore} from "@/zustland/store.js";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.jsx"
import {Input} from "@/components/ui/input.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import axios from "axios";
import Header from "@/components-xm/Header/Header.jsx";
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
import {Vortex} from "@/components/ui/vortex.jsx";


function CourseSnapView() {
    const {CourseId} = useParams();
    const [courseDetail, setCourseDetail] = useState({});
    const {userDetail} = useAuthStore();
    const navigate = useNavigate()



    const [apiQuery, setApiQuery] = useState({
        limit: 2, offset: 0, getThisData: {
            datasource: "Course",  attributes: [], where : {courseId: CourseId},
            include: [{
                datasource: "CourseTopic", as: "courseTopic", required: false, order: [], attributes: [], where: {},
                include:[
                    {
                        datasource: "CourseTopicContent", as: "courseTopicContent", required: false, order: [], attributes: [], where: {},
                    }
                ]
            },
            ],
        },
    });


    useEffect(() => {
        fetchCourses();

     }, [apiQuery]);

    useEffect(() => {
        console.log(userDetail)
        if(userDetail){enrollStatus();}
    }, []);

  const fetchCourses = () => {

        axios
            .post(import.meta.env.VITE_API_URL+"/searchCourse", apiQuery)
            .then((res) => {
                console.log(res.data);
                setCourseDetail(res?.data?.data?.results?.[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const enrollStatus = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/enrollStatus", {
                courseId: CourseId
            })
            .then((res) => {
                console.log(res?.data?.data);
                if(res?.data?.data?.isUserEnrolled){
                    navigate('/course/'+CourseId);
                }
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Enrollment'
                })
            });
    }



    return (
        <>
            {userDetail ? <Header/>:<PublicHeader/>}


            <div className="p-2 md:p-4 overflow-y-auto h-[calc(100svh-4em)]  ">

                <div className="w-full mx-auto rounded-md  h-fit py-4 md:py-6 lg:py-10 overflow-hidden">
                    <Vortex
                        backgroundColor="black"
                        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                    >
                        <h2 className="text-white text-2xl md:text-4xl lg:text-6xl font-bold text-center">
                            {courseDetail?.courseTitle}
                        </h2>
                        {/*<p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">*/}
                        {/*    This is chemical burn. It&apos;ll hurt more than you&apos;ve ever been*/}
                        {/*    burned and you&apos;ll have a scar.*/}
                        {/*</p>*/}
                        <div className="mt-6 grid ">
                            <Button className="text-center" size="sm" variant="secondary">ENROLL NOW </Button>
                            <p className="text-center text-white"><strong>5126</strong> Learners Enrolled Already</p>
                        </div>
                    </Vortex>
                </div>
                {courseDetail?.courseKeyFeature && <section className="my-4">
                    <Card className="rounded-sm  bg-muted/50 border-0">
                        <CardHeader>
                            <CardTitle>Key Feature</CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            {courseDetail?.courseKeyFeature?.map(a => (<Badge variant="outline" className="mr-1">{a}</Badge>))}
                        </CardContent>
                    </Card>

                </section>}

                {/*{courseDetail?.courseImageUrl && <section className="my-4">*/}
                {/*    <img src={courseDetail?.courseImageUrl?.[0]} className="w-full p-4"/>*/}
                {/*</section>}*/}

                <section className="my-4">
                    <Card className="rounded-sm  bg-muted/50 border-0">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="whitespace-pre-wrap">
                            {courseDetail?.courseDescription}
                        </CardContent>
                    </Card>

                </section>


                {courseDetail?.courseWhatYouWillLearn &&  <section className="my-4">
                    <Card className="rounded-sm  bg-muted/50 border-0">
                        <CardHeader>
                            <CardTitle>What will you learn</CardTitle>
                        </CardHeader>
                        <CardContent className="whitespace-pre-wrap">
                            {courseDetail?.courseWhatYouWillLearn?.map(a => (<p>{a}</p>))}
                        </CardContent>
                    </Card>

                </section>}


                {courseDetail?.courseWhoCanJoin && <section className="my-4">
                    <Card className="rounded-sm  bg-muted/50 border-0">
                        <CardHeader>
                            <CardTitle>Who can join</CardTitle>
                        </CardHeader>
                        <CardContent className="whitespace-pre-wrap">
                            {courseDetail?.courseWhoCanJoin?.map(a => (<p>{a}</p>))}
                        </CardContent>
                    </Card>

                </section>}

                <section className="my-4">
                    <Card className="border-0 bg-muted/50">
                        <CardHeader>
                            <CardTitle className="">
                                Course Structure
                            </CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div className="my-3">
                                {courseDetail?.courseTopic?.map(a => (
                                    <Accordion type="single" key={a?.courseTopicId} collapsible>
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="flex items-center gap-2  justify-start">
                                                <Badge>
                                                    {(() => {
                                                        const totalMinutes = +a?.courseTopicContent?.reduce(
                                                            (sum, item) => sum + (item.courseTopicContentDuration || 0),
                                                            0
                                                        ) || 0;
                                                        const hours = Math.floor(totalMinutes / 3600);
                                                        const minutes = totalMinutes % 60;

                                                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                                    })()}
                                                </Badge>
                                                <span>{a?.courseTopicTitle}</span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {a?.courseTopicDescription}
                                                <div>
                                                    <ul>
                                                        {a?.courseTopicContent?.map(a => (
                                                            <li className="flex gap-2 items-center my-2"
                                                                key={a?.courseTopicContentId}>

                                                                <Badge>
                                                                    {(() => {
                                                                        const totalMinutes = +a?.courseTopicContentDuration || 0;
                                                                        const hours = Math.floor(totalMinutes / 3600);
                                                                        const minutes = totalMinutes % 60;

                                                                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                                                    })()}
                                                                </Badge>
                                                                <Video/>
                                                                <span>{a?.courseTopicContentTitle}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}

                            </div>
                        </CardContent>
                    </Card>

                </section>



            </div>

        </>)

}



export default CourseSnapView;