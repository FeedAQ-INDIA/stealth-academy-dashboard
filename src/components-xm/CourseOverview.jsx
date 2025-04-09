import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {CircleDollarSign, Clock, Video} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import axiosConn from "@/axioscon.js";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {useParams} from "react-router-dom";
import {toast} from "@/components/hooks/use-toast.js";
function CourseOverview() {
    const {CourseId} = useParams();
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState({});
    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "Course",  attributes: [], where : {courseId: CourseId},
            include: [{
                datasource: "CourseTopic", as: "courseTopic", required: false, order: [], attributes: [], where: {},
                include:[
                    {
                        datasource: "CourseVideo", as: "courseVideo", required: false, order: [], attributes: [], where: {},
                    }
                ]
            },
            ],
        },
    });

    useEffect(() => {
        fetchCourses();
        enrollStatus();
    }, [apiQuery]);

    const fetchCourses = () => {
        axiosConn
            .post("http://localhost:3000/searchCourse", apiQuery)
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

    const [isUserEnrolledAlready, setIsUserEnrolledAlready] = useState(false);

    const enrollStatus = () => {
        axiosConn
            .post("http://localhost:3000/enrollStatus", {
                courseId: CourseId
            })
            .then((res) => {
                console.log(res?.data?.data);
                setIsUserEnrolledAlready(res?.data?.data?.isUserEnrolled)
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Enrollment'
                })
            });
    }

const enroll = () => {
    axiosConn
        .post("http://localhost:3000/enroll", {
            courseId: CourseId
        })
        .then((res) => {
            console.log(res.data);
            toast({
                title: 'Enrollment is successfull'
            });
            enrollStatus();
        })
        .catch((err) => {
            console.log(err);
            toast({
          title: 'Error occured while Enrollment'
        })
});
    }

    const disroll = () => {
        axiosConn
            .post("http://localhost:3000/disroll", {
                courseId: CourseId
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: 'Disrollment is successfull'
                });
                enrollStatus()
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Disrollment'
                })
            });
    }

    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>Course</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <div className="p-6">
                <section>
                    <div className="flex flex-wrap gap-2 w-full mb-3">
                        <Badge variant="outline">Course</Badge>


                    </div>

                    {/* Title with responsive spacing */}
                    <div  className="flex flex-wrap gap-2 w-full mb-3 items-center">
                        <div className=" ">
                            <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                                {courseList?.courseTitle}
                            </CardTitle>
                        </div>
                        <div className="ml-auto ">
                            {isUserEnrolledAlready?
                                <Button onClick={()=> disroll()}>LEAVE COURSE</Button>  :
                                <Button onClick={()=> enroll()}>START COURSE</Button>
                            }
                        </div>
                    </div>


                </section>
                <section className="my-8">
                    <div className="flex flex-wrap gap-4 w-full ">
                        <div className="flex gap-1 items-center">
                            <Clock size={18}/>  {`${Math.floor(+(courseList?.courseDuration) / 60)}hr ${+(courseList?.courseDuration) % 60}min`}
                        </div>
                        <div className="flex gap-2 items-center">
                            < CircleDollarSign size={18}/> {courseList?.courseCost == 0 ? 'Free' : 'Rs.'+courseList?.courseCost+'/-'}
                        </div>
                        <div className="flex gap-2 items-center">
                            <Badge variant="outline">{courseList?.courseLevel}</Badge>
                        </div>
                    </div>
                </section>
                <section className="my-8">
                    <div>
                        <p>{courseList?.courseDescription}</p>
                    </div>
                </section>
                <section className="my-8">
                    <h1 className="font-medium text-2xl">Course Structure</h1>
                    <div className="my-3">
                        {courseList?.courseTopic?.map(a => (
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>{a?.courseTopicTitle}</AccordionTrigger>
                                    <AccordionContent>
                                        {a?.courseTopicDescription}
                                        <div>
                                            <ul>
                                                {a?.courseVideo?.map(a => (
                                                    <li className="flex gap-2 items-center">
                                                        <Video />
                                                        <span>{a?.courseVideoTitle}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}

                    </div>
                </section>
            </div>

        </>)

}


export default CourseOverview;