import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {AlertCircle, Book, Check, Terminal, Video, Clock, Users, Star, PlayCircle, BookOpen, Award, Target, ChevronRight} from "lucide-react";
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
import {Progress} from "@/components/ui/progress.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";

function CourseSnapView() {
    const {CourseId} = useParams();
    const [courseDetail, setCourseDetail] = useState({});
    const {userDetail, fetchUserDetail} = useAuthStore();
    const navigate = useNavigate();
    const [isEnrolling, setIsEnrolling] = useState(false);

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

    const enrollUserToCourse = async () => {
        setIsEnrolling(true);
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
        setIsEnrolling(false);
    }

    function getRedirectUri() {
        return "?redirectUri=" + encodeURIComponent(window.location.href);
    }

    const completeEnrollmentPayment = async () => {
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

    // Calculate total course duration
    const getTotalDuration = () => {
        if (!courseDetail?.courseTopic) return "0h 0m";

        const totalMinutes = courseDetail.courseTopic.reduce((total, topic) => {
            const topicMinutes = topic.courseTopicContent?.reduce(
                (sum, item) => sum + (item.courseTopicContentDuration || 0),
                0
            ) || 0;
            return total + topicMinutes;
        }, 0);

        const hours = Math.floor(totalMinutes / 3600);
        const minutes = Math.floor((totalMinutes % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const getTotalLessons = () => {
        if (!courseDetail?.courseTopic) return 0;
        return courseDetail.courseTopic.reduce((total, topic) => {
            return total + (topic.courseTopicContent?.length || 0);
        }, 0);
    };

    return (
        <>
            {userDetail ? <Header/>:<PublicHeader/>}

            <div className="overflow-y-auto overflow-x-hidden h-[calc(100svh-4em)] w-full">
                {/* Hero Section with Vortex */}
                <div className="relative w-full">
                    <div className="w-full mx-auto rounded-md h-fit py-8 md:py-12 lg:py-16 overflow-hidden">
                        <Vortex
                            backgroundColor="black"
                            className="flex items-center flex-col justify-center px-4 md:px-10 py-8 w-full h-full"
                        >
                            <div className="max-w-4xl mx-auto text-center w-full">
                                <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                    Premium Course
                                </Badge>
                                <h1 className="text-white text-2xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight break-words">
                                    {courseDetail?.courseTitle}
                                </h1>
                                <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed px-4">
                                    Transform your career with industry-leading expertise and hands-on learning
                                </p>

                                {/* Course Stats */}
                                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 text-white text-sm md:text-base">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Users className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                        <span className="font-semibold">5,126</span>
                                        <span className="text-gray-300 hidden sm:inline">Students</span>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Clock className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                        <span className="font-semibold">{getTotalDuration()}</span>
                                        <span className="text-gray-300 hidden sm:inline">Duration</span>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <BookOpen className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                        <span className="font-semibold">{getTotalLessons()}</span>
                                        <span className="text-gray-300 hidden sm:inline">Lessons</span>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                        <span className="font-semibold">4.8</span>
                                        <span className="text-gray-300 hidden sm:inline">Rating</span>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-full text-sm md:text-base shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                                        onClick={() => enrollUserToCourse()}
                                        disabled={isEnrolling}
                                    >
                                        {isEnrolling ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                Enrolling...
                                            </div>
                                        ) : (
                                            <>
                                                <PlayCircle className="w-4 h-4 mr-2" />
                                                ENROLL NOW
                                            </>
                                        )}
                                    </Button>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="border-2 border-white text-black hover:bg-black hover:text-white px-6 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-200 w-full sm:w-auto"
                                            >
                                                LET'S CONNECT
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent className="w-full sm:max-w-[540px]">
                                            <SheetHeader>
                                                <SheetTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                    Let's Connect
                                                </SheetTitle>
                                                <SheetDescription className="text-gray-600">
                                                    This isn't just another course. It's the start of your professional journey.
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div className="my-6">
                                                <LetsConnectForm courseId={CourseId} courseName={courseDetail?.courseTitle}/>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </div>
                        </Vortex>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Left Column - Course Details */}
                        <div className="lg:col-span-2 space-y-6 lg:space-y-8 min-w-0">

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                                        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                        Course Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                            {courseDetail?.courseDescription || "Discover the comprehensive learning experience designed to transform your skills and advance your career. This course combines theoretical knowledge with practical application to ensure you're job-ready upon completion."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {courseDetail?.courseWhatYouWillLearn && (
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                                            <Target className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                            What You'll Learn
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-4">
                                            {courseDetail.courseWhatYouWillLearn.map((item, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed break-words">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                                        <Book className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                        Course Curriculum
                                    </CardTitle>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        {courseDetail?.courseTopic?.length || 0} modules • {getTotalLessons()} lessons • {getTotalDuration()} total length
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {courseDetail?.courseTopic?.map((topic, index) => (
                                            <Accordion type="single" key={topic?.courseTopicId} collapsible>
                                                <AccordionItem value={`item-${index}`} className="border border-gray-200 rounded-lg">
                                                    <AccordionTrigger className="px-4 md:px-6 py-4 hover:bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-3 md:gap-4 w-full min-w-0">
                                                            <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm md:text-base flex-shrink-0">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1 text-left min-w-0">
                                                                <h3 className="font-semibold text-sm md:text-lg break-words">{topic?.courseTopicTitle}</h3>
                                                                <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mt-1">
                                                                            <span className="flex items-center gap-1">
                                                                                <Video className="w-3 h-3 md:w-4 md:h-4" />
                                                                                {topic?.courseTopicContent?.length || 0}
                                                                            </span>
                                                                    <span className="flex items-center gap-1">
                                                                                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                                                        {(() => {
                                                                            const totalMinutes = topic?.courseTopicContent?.reduce(
                                                                                (sum, item) => sum + (item.courseTopicContentDuration || 0),
                                                                                0
                                                                            ) || 0;
                                                                            const hours = Math.floor(totalMinutes / 3600);
                                                                            const minutes = Math.floor((totalMinutes % 3600) / 60);
                                                                            return `${hours}h ${minutes}m`;
                                                                        })()}
                                                                            </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4 md:px-6 pb-4">
                                                        <div className="mb-4">
                                                            <p className="text-gray-700 mb-4 break-words">{topic?.courseTopicDescription}</p>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {topic?.courseTopicContent?.map((content, contentIndex) => (
                                                                <div key={content?.courseTopicContentId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <PlayCircle className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-medium text-sm md:text-base break-words">{content?.courseTopicContentTitle}</h4>
                                                                        <p className="text-xs md:text-sm text-gray-600">
                                                                            {Math.floor((content?.courseTopicContentDuration || 0) / 60)}:{String((content?.courseTopicContentDuration || 0) % 60).padStart(2, '0')} min
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            {courseDetail?.courseKeyFeature && (
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-2xl">
                                            <Award className="w-6 h-6 text-blue-600" />
                                            Key Features
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {courseDetail.courseKeyFeature.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                                                        {feature}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {courseDetail?.courseWhoCanJoin && (
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-2xl">
                                            <Users className="w-6 h-6 text-orange-600" />
                                            Who Can Join
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {courseDetail.courseWhoCanJoin.map((audience, index) => (
                                                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-orange-200">
                                                    <ChevronRight className="w-5 h-5 text-orange-600 mt-0.5" />
                                                    <p className="text-gray-700 leading-relaxed">{audience}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        </div>

                        {/* Right Column - Sticky Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Pricing Card */}
                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                    <CardHeader className="relative">
                                        <div className="text-center">
                                            {courseDetail?.courseMrpCost && courseDetail?.courseMrpCost > 0 && (
                                                <p className="text-pink-200 text-lg line-through mb-2">
                                                    ₹{courseDetail?.courseMrpCost}
                                                </p>
                                            )}
                                            <CardTitle className="text-4xl font-bold mb-2">
                                                {courseDetail?.courseCost > 0 ? `₹${courseDetail?.courseCost}` : 'FREE'}
                                            </CardTitle>
                                            <p className="text-pink-200">One-time payment</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <Button
                                            className="w-full bg-white text-rose-600 hover:bg-gray-100 font-bold py-3 rounded-lg mb-4 transition-all duration-200 transform hover:scale-105"
                                            onClick={() => enrollUserToCourse()}
                                            disabled={isEnrolling}
                                        >
                                            {isEnrolling ? 'Enrolling...' : 'ENROLL NOW'}
                                        </Button>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4" />
                                                <span>Lifetime access</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4" />
                                                <span>Certificate of completion</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4" />
                                                <span>24/7 support</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4" />
                                                <span>Mobile & desktop access</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Course Info Card */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Course Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Duration</span>
                                            <span className="font-semibold">{getTotalDuration()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Lessons</span>
                                            <span className="font-semibold">{getTotalLessons()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Students</span>
                                            <span className="font-semibold">5,126</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Level</span>
                                            <span className="font-semibold">Beginner</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Language</span>
                                            <span className="font-semibold">English</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Banner Image */}
                                <div className="relative rounded-lg overflow-hidden">
                                    <img
                                        src="https://cdn.vectorstock.com/i/1000v/40/01/vertical-banner-04-vector-29244001.jpg"
                                        alt="Course Banner"
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <h3 className="font-bold text-lg mb-2">Ready to Start?</h3>
                                        <p className="text-sm opacity-90">Join thousands of successful learners</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseSnapView;