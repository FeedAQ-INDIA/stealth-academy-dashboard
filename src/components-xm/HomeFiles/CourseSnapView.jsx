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
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import {LetsConnectForm} from "@/components-xm/HomeFiles/LetsConnectForm.jsx";


function CourseSnapView() {
    const {CourseId} = useParams();
    const [courseDetail, setCourseDetail] = useState({});
    const {userDetail, fetchUserDetail} = useAuthStore();
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
        if(userDetail){
            enrollStatus();
        }
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

    const enrollUserToCourse= async () => {
        await fetchUserDetail();
        const updatedUserDetail = useAuthStore.getState().userDetail;
        if(!updatedUserDetail){
            navigate("/signin" + getRedirectUri());
            console.log("/signin" + getRedirectUri())
        }else{
            if(courseDetail?.courseCost != 0){
                await completeEnrollmentPayment();
            }else{
                axiosConn
                    .post(import.meta.env.VITE_API_URL+"/enroll", {
                        courseId: CourseId
                    })
                    .then((res) => {
                        console.log(res.data);
                        toast({
                            title: 'Enrollment is successfull'
                        });
                        // enrollStatus();
                        // fetchUserEnrolledCourseIdList(userDetail.userId)
                        navigate(`/course/${CourseId}`);

                    })
                    .catch((err) => {
                        console.log(err);
                        toast({
                            title: 'Error occured while Enrollment'
                        })
                    });
            }
        }




    }
    function getRedirectUri() {
        return  "?redirectUri=" + encodeURIComponent(window.location.href);
    }

    const completeEnrollmentPayment = async () => {
        // Step 3: Launch Razorpay Checkout

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
                    toast({title: 'Payment successful!'});
                    axiosConn
                        .post(import.meta.env.VITE_API_URL+"/enroll", {
                            courseId: CourseId
                        })
                        .then((res) => {
                            console.log(res.data);
                            toast({
                                title: 'Enrollment is successfull'
                            });
                            // enrollStatus();
                            // fetchUserEnrolledCourseIdList(userDetail.userId)
                            navigate(`/course/${CourseId}`);

                        })
                        .catch((err) => {
                            console.log(err);
                            toast({
                                title: 'Error occured while Enrollment'
                            })
                        });
                } else {
                    toast({title: 'Payment Failed!'});
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
                            <div className="flex gap-2 ">
                                {/*<Link to={`/course/${CourseId}`}>*/}
                                    <Button className=" border-[#ffdd00] border-2 text-white hover:bg-[#ffdd00] hover:text-black" size="sm" onClick={()=>enrollUserToCourse()}>ENROLL NOW </Button>
                                {/*</Link>*/}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            className=" border-[#ffdd00] border-2 text-white hover:bg-[#ffdd00] hover:text-black" size="sm"
                                            href="#letsconnect">LET'S CONNECT</Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle className="tracking-wide font-bold text-2xl">Let's Connect</SheetTitle>
                                            <SheetDescription>
                                                This isn’t just another course. It’s the start of your professional journey.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="my-4">
                                            <LetsConnectForm courseId={CourseId} courseName={courseDetail?.courseTitle}/>
                                        </div>

                                    </SheetContent>
                                </Sheet>

                            </div>
                            <p className="text-center text-white"><strong>5126</strong> Learners Enrolled Already</p>
                        </div>
                    </Vortex>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 ">
                    <div className=" lg:col-span-3">

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

                    <div className="hidden lg:block">
                        <Card className=" my-4 rounded-sm border-0 bg-rose-500">
                            <CardHeader className="grid grid-cols-2 gap-2">
                                <div>
                                    {/*<p className="text-white my-0 py-0">Price</p>*/}
                                    {courseDetail?.courseMrpCost && courseDetail?.courseMrpCost > 0 &&   <CardTitle className="my-0 py-0 text-white font-bold text-2xl   text-black line-through ">{`Rs.${courseDetail?.courseMrpCost}/-` }</CardTitle>}
                                    <CardTitle className="my-0 py-0 text-white font-bold text-3xl">{courseDetail?.courseCost > 0 ? `Rs.${courseDetail?.courseCost}/-` : 'FREE' }</CardTitle>
                                </div>

                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" variant="outline" onClick={()=>enrollUserToCourse()}>ENROLL NOW</Button>
                            </CardContent>
                        </Card>
                        <img
                            src={'https://cdn.vectorstock.com/i/1000v/40/01/vertical-banner-04-vector-29244001.jpg'}
                            alt="Picture of the author"
                            width={200}
                            height={800}
                            className="w-full h-full rounded-md my-4"
                        />
                    </div>
                </div>
            </div>

        </>)

}



export default CourseSnapView;