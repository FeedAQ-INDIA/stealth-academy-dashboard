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
    const [loading, setLoading] = useState(false); // local loader

    const { userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore();

    useEffect(() => {

        fetchCourses();
        enrollStatus();
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

    const [isUserEnrolledAlready, setIsUserEnrolledAlready] = useState(null);
    const [userEnrollmentObj, setUserEnrollmentObj] = useState({});

    const enrollStatus = () => {
        setLoading(true)
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/enrollStatus", {
                courseId: CourseId
            })
            .then((res) => {
                console.log(res?.data?.data);
                setIsUserEnrolledAlready(res?.data?.data?.isUserEnrolled);
                setUserEnrollmentObj(res?.data?.data?.enrollmentData?.[0]);
                setLoading(false)

            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Enrollment'
                })
                setLoading(false)
            });
    }



    const enroll = async () => {
        setLoading(true)

    await enrollUser();

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
                fetchUserEnrolledCourseIdList(userDetail.userId)
                setLoading(false)

            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Enrollment'
                })
                setLoading(false)
            });
    }

    const disroll = () => {
        setLoading(true)
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/disroll", {
                courseId: CourseId
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: 'Disrollment is successfull'
                });
                enrollStatus();
                fetchUserEnrolledCourseIdList(userDetail.userId)
                setLoading(false)

            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Disrollment'
                })
                setLoading(false)
            });
    }

    const enrollUser = async () => {
        // Step 3: Launch Razorpay Checkout
        setLoading(true)

        const options = {
            key: 'rzp_test_1F67LLEd7Qzk1u',
            amount: 1,
            currency: 'INR',
            name: 'FeedAQ Academy',
            description: 'Test Transaction',
            order_id: null,
            handler: async function (response) {
                const verifyRes = await axios.post('http://localhost:5000/api/verify', {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });

                if (verifyRes.data.success) {
                    alert('Payment successful!');
                } else {
                    alert('Payment verification failed');
                }
            },
            prefill: {
                name: 'bksb',
                email: 'test@example.com',
                contact: '9631045873',
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false)

    }


    const navigate = useNavigate();
    useEffect(()=>{
        if(!isUserEnrolledAlready) {
            navigate('/course/'+CourseId)
        }else if(isUserEnrolledAlready){
            fetchUserEnrollmentData()
        }
    },[isUserEnrolledAlready])


    const [userEnrollmentCourseLog, setUserEnrollmentCourseLog] = useState(null);

    const fetchUserEnrollmentData = () => {
        setLoading(true)
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "UserEnrollmentLog",  attributes: [],
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

    if(loading){
        return (
            <div className="flex items-center justify-center h-[100svh] w-full">
                <LoaderOne />
            </div>
        )
    }

    return (<>
        <CourseContext.Provider value={{ courseList, userEnrollmentObj, userEnrollmentCourseLog,fetchUserEnrollmentData, isUserEnrolledAlready, enroll, disroll, enrollStatus , identifyContentTypeIcons}}>

        <SidebarProvider className="p-0">
                {isUserEnrolledAlready? <CourseSidebar/> : <></>}
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
