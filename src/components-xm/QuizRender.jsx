import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {Check} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useCourse} from "@/components-xm/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import {toast} from "@/components/hooks/use-toast.js";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import QuizQuestionCard from "@/components-xm/QuizQuestionCard.jsx";
import QuizResultReview from "@/components-xm/QuizResultReview.jsx";
import {useAuthStore} from "@/zustland/store.js";

function QuizRender({saveUserEnrollmentData}) {

    const {CourseId, CourseQuizId} = useParams();
    const {
        userEnrollmentObj,
        userEnrollmentCourseLog,
        fetchUserEnrollmentData,
        isUserEnrolledAlready,
        courseList,
        enroll,
        disroll,
        enrollStatus
    } = useCourse();
    const { userDetail } = useAuthStore();

    const [courseQuizQuestion, setCourseQuizQuestion] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (courseList && CourseQuizId) {
            fetchCourseQuizQuestion();
            fetchAttemptedCourseVideo()
        }
    }, [ CourseQuizId]);

    const fetchCourseQuizQuestion = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "QuizQuestion", attributes: [], where: {courseQuizId: CourseQuizId},

                },
            })
            .then((res) => {
                console.log(res.data);
                const quizQues = res.data.data?.results
                setCourseQuizQuestion(quizQues);
             })
            .catch((err) => {
                console.log(err);
            });
    }

    const fetchAttemptedCourseVideo = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", {
                limit: 1, offset: 0, getThisData: {
                    datasource: "QuizResultLog", attributes: [], where: {courseQuizId: CourseQuizId, userId: userDetail.userId}
                },
            })
            .then((res) => {
                console.log(res.data);
                const attempt = res.data.data?.results
                if(attempt?.length > 0){
                    setServerResult(attempt?.[0]);
                    setSubmitted(true)

                }else{
                    setSubmitted(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }


    const [submitted, setSubmitted] = useState(false);
    const [serverResult, setServerResult] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        console.log(selectedOptions)
    }, [selectedOptions]);

    const [selectedAnswers, setSelectedAnswers] = useState({});

    const updateAnswer = (questionId, answers) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answers
        }));
    };

    const handleSubmit = async () => {
        const submissionList = Object.entries(selectedAnswers).map(([quizQuestionId, answerList]) => ({
            quizQuestionId,
            answerList,
        }));

        try {
            const res = await axiosConn.post(import.meta.env.VITE_API_URL + "/submitQuiz", {
                userId: userDetail.userId,
                courseId: CourseId,
                courseQuizId: CourseQuizId,
                submissionList
            });
            setServerResult(res.data?.data);
            setSubmitted(true);
            toast({title: "Quiz submitted successfully!"});
            saveUserEnrollmentData()

        } catch (err) {
            console.log(err);
            toast({title: "Error submitting quiz", variant: "destructive"});
        }
    };
    const handleRetake = () => {
        setSelectedAnswers({});
        setSubmitted(false);
        setServerResult(null);
        toast({ title: "You can retake the quiz now!" });
        navigate(`/course/${CourseId}/quiz/${CourseQuizId}`);
    };
    return (
        <>


            {!submitted ?<>
            <div className="  ">
                {courseQuizQuestion.map(q => (
                    <QuizQuestionCard key={q.quizQuestionId}
                                      question={q}
                                      onAnswerChange={updateAnswer}/>
                ))}


            </div>
            <div className="mt-3">


                    <Button onClick={handleSubmit} className="mt-4  ">
                        Submit
                    </Button>

            </div>
                </> :<>
                <QuizResultReview result={serverResult}  questionMap={Object.fromEntries(courseQuizQuestion.map(q => [q.quizQuestionId, q]))}/>
                <Button onClick={handleRetake} className="mt-6">
                    Retake Quiz
                </Button></> }

        </>)

}


export default QuizRender;