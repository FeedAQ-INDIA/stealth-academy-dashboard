import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.jsx"
import CourseSidebar from "@/components-xm/Course/CourseSidebar.jsx";

import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";

import { CourseContext } from "./CourseContext.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {Book, Video} from "lucide-react";
import axios from "axios";
import {LoaderOne} from "@/components/ui/loader.jsx";

const HEADER_HEIGHT = "4rem";

export function CourseDetail() {
    const {CourseId} = useParams();

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState({});
    const { userDetail} = useAuthStore();


    const navigate = useNavigate();

    const [userEnrollmentCourseLog, setUserEnrollmentCourseLog] = useState(null);


    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "Course",  attributes: [], where : {courseId: CourseId, userId: userDetail.userId},
            include: [{
                datasource: "CourseContent", as: "courseContent", required: false, order: [], attributes: [], where: {},
            }],
        },
    });
    const [loading, setLoading] = useState(false); // local loader


    useEffect(() => {

        fetchCourses();
        fetchUserEnrollmentData();
    }, [apiQuery]);

    const identifyContentTypeIcons = (type) => {
        if(type == 'CourseVideo') return <Video/>
        else if(type == 'CourseWritten') return <Book />
    }

    const fetchCourses = () => {
        setLoading(true)
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/getCourseDetail", {courseId: CourseId})
            .then((res) => {
                console.log(res.data);
                setCourseList(res.data.data);
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            });
    };

    const fetchUserEnrollmentData = () => {
        setLoading(true)
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "UserActivityLog",  attributes: [],
                    where : {
                        userId: userDetail.userId,
                        courseId: CourseId,
                    },
                },
            })
            .then((res) => {
                console.log(res.data);
                setUserEnrollmentCourseLog(res.data.data?.results);
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            });
    }



    return (<>
        <CourseContext.Provider value={{ courseList, userEnrollmentCourseLog,fetchUserEnrollmentData, identifyContentTypeIcons}}>

        <SidebarProvider className="p-0">
                 <CourseSidebar/>
                <SidebarInset
                    className=" min-h-[calc(100svh-4em)]  " style={{borderRadius: '0px', margin: '0px'}}>

                    <div className="h-[calc(100svh-4em)] overflow-y-none   ">
                        <Outlet/>
                    </div>


                </SidebarInset>
            </SidebarProvider>
        </CourseContext.Provider>
        </>

    );
}
