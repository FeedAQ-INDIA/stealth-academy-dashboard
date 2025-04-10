import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.jsx"
import CourseSidebar from "@/components-xm/CourseSidebar.jsx";

import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";

import { CourseContext } from "./CourseContext.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {Book, Video} from "lucide-react";

const HEADER_HEIGHT = "4rem";

export function CourseDetail() {
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
                        datasource: "CourseTopicContent", as: "courseTopicContent", required: false, order: [], attributes: [], where: {},
                    }
                ]
            },
            ],
        },
    });

    useEffect(() => {
        fetchCourses();
        enrollStatus()
    }, [apiQuery]);

    const identifyContentTypeIcons = (type) => {
        if(type == 'CourseVideo') return <Video/>
        else if(type == 'CourseWritten') return <Book />
    }

    const fetchCourses = () => {

        axiosConn
            .post(import.meta.env.VITE_API_URL+"/getCourseDetail", {courseId: CourseId})
            .then((res) => {
                console.log(res.data);
                setCourseList(res.data.data);
                // setTotalCount(res.data.data.totalCount);
                // setOffset(res.data.data.offset);
                // setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [isUserEnrolledAlready, setIsUserEnrolledAlready] = useState(false);

    const enrollStatus = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/enrollStatus", {
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
            .post(import.meta.env.VITE_API_URL+"/enroll", {
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
            .post(import.meta.env.VITE_API_URL+"/disroll", {
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




    return (<>
        <CourseContext.Provider value={{ courseList, isUserEnrolledAlready, enroll, disroll, enrollStatus , identifyContentTypeIcons}}>

        <SidebarProvider className="p-0">
                {isUserEnrolledAlready? <CourseSidebar/> : <></>}
                <SidebarInset
                    className=" min-h-[calc(100svh-4em)]  " style={{borderRadius: '0px', margin: '0px'}}>

                    <div className="h-[calc(100svh-4em)] overflow-y-auto  ">
                        <Outlet/>
                    </div>


                </SidebarInset>
            </SidebarProvider>
        </CourseContext.Provider>
        </>

    );
}
