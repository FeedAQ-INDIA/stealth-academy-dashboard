import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.jsx"
import WebinarSidebar from "@/components-xm/Webinar/WebinarSidebar.jsx";

import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";

import { WebinarContext } from "./WebinarContext.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {Book, Video} from "lucide-react";

const HEADER_HEIGHT = "4rem";

export function WebinarDetail() {
    const {WebinarId} = useParams();

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [webinarList, setWebinarList] = useState({});
    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "Webinar",  attributes: [], where : {webinarId: WebinarId},
            // include: [{
            //     datasource: "CourseTopic", as: "courseTopic", required: false, order: [], attributes: [], where: {},
            //     include:[
            //         {
            //             datasource: "CourseTopicContent", as: "courseTopicContent", required: false, order: [], attributes: [], where: {},
            //         }
            //     ]
            // },
            // ],
        },
    });

    const { userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore();

    useEffect(() => {
        fetchWebinars();
        enrollStatus();
    }, [apiQuery]);



    const fetchWebinars = () => {

        axiosConn
            .post(import.meta.env.VITE_API_URL+"/searchCourse", apiQuery)
            .then((res) => {
                console.log(res.data);
                setWebinarList(res.data.data.results?.[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [isUserEnrolledAlready, setIsUserEnrolledAlready] = useState(null);
    const [userEnrollmentObj, setUserEnrollmentObj] = useState({});

    const enrollStatus = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/enrollStatus", {
                webinarId: WebinarId
            })
            .then((res) => {
                console.log(res?.data?.data);
                setIsUserEnrolledAlready(res?.data?.data?.isUserEnrolled);
                setUserEnrollmentObj(res?.data?.data?.enrollmentData?.[0]);

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
                webinarId: WebinarId
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: 'Enrollment is successfull'
                });
                enrollStatus();
                fetchUserEnrolledCourseIdList(userDetail.userId)

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
                webinarId: WebinarId
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: 'Disrollment is successfull'
                });
                enrollStatus();
                fetchUserEnrolledCourseIdList(userDetail.userId)

            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Disrollment'
                })
            });
    }

    const navigate = useNavigate();
    useEffect(()=>{
        if(!isUserEnrolledAlready) {
            navigate('/webinar/'+WebinarId)
        }else if(isUserEnrolledAlready){
            fetchUserEnrollmentData()
        }
    },[isUserEnrolledAlready])


    const [userEnrollmentWebinarLog, setUserEnrollmentWebinarLog] = useState(null);

    const fetchUserEnrollmentData = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "UserEnrollmentLog",  attributes: [],
                    where : {
                        userId: userDetail.userId,
                        webinarId: WebinarId,
                    },
                },
            })
            .then((res) => {
                console.log(res.data);
                setUserEnrollmentWebinarLog(res.data.data?.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }




    return (<>
            <WebinarContext.Provider value={{ webinarList, userEnrollmentObj, userEnrollmentWebinarLog,fetchUserEnrollmentData, isUserEnrolledAlready, enroll, disroll, enrollStatus }}>

                <SidebarProvider className="p-0">
                    {/*{isUserEnrolledAlready? <WebinarSidebar/> : <></>}*/}
                    <SidebarInset
                        className=" min-h-[calc(100svh-4em)]  " style={{borderRadius: '0px', margin: '0px'}}>

                        <div className="h-[calc(100svh-4em)] overflow-y-none   ">
                            <Outlet/>
                        </div>


                    </SidebarInset>
                </SidebarProvider>
            </WebinarContext.Provider>
        </>

    );
}
