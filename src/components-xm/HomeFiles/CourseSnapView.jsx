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
import {Link, useParams} from "react-router-dom";
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


    return (
        <>
            {userDetail ? <Header/>:<PublicHeader/>}


            <div className="p-2">

                <div className="w-full mx-auto rounded-md  h-fit py-4 md:py-8 lg:py-12 overflow-hidden">
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

                    </Vortex>
                </div>

                <div className="">

                </div>

            </div>

        </>)

}


export default CourseSnapView;