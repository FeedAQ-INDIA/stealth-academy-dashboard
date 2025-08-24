import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.jsx";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuthStore } from "@/zustland/store.js";
import { useCourseState } from "@/hooks/useCourseState";
import { CourseContext } from "./CourseContext.jsx";
import { Video, Book, HelpCircle, Zap, Award } from "lucide-react";
import { CourseLoadingSkeleton } from "@/components/CourseLoadingSkeleton";
import CourseSidebar from "@/components-xm/Course/CourseSidebar.jsx";

export function CourseDetail() {
    const { CourseId } = useParams();
    const { userDetail } = useAuthStore();
    const navigate = useNavigate();
    
    const {
        course: courseList,
        userCourseContentProgress,
        userCourseEnrollment,
        loading,
        error,
        progress,
        actions: {
            fetchCourseDetail,
            fetchUserCourseContentProgress,
            fetchUserCourseEnrollment
        }
    } = useCourseState(CourseId);

    useEffect(() => {
        fetchCourseDetail();
        if (userDetail?.userId) {
            fetchUserCourseContentProgress(userDetail.userId);
            fetchUserCourseEnrollment(userDetail.userId);
        }
    }, [CourseId, userDetail?.userId, fetchCourseDetail, fetchUserCourseContentProgress, fetchUserCourseEnrollment]);

    const identifyContentTypeIcons = (type) => {
        if(type === 'CourseVideo') return <Video/>;
        else if(type === 'CourseWritten') return <Book />;
        else if(type === 'CourseQuiz') return <HelpCircle />;
        else if(type === 'CourseFlashcard') return <Zap />;
        else if(type === 'CourseCertificate') return <Award />;
        return null;
    }

    if (loading && !courseList) {
        return <CourseLoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="p-4 text-red-600">
                Error: {error}
            </div>
        );
    }



    return (
        <CourseContext.Provider value={{ 
            courseList, 
            userCourseContentProgress,
            userCourseEnrollment,
            fetchUserCourseContentProgress,
            fetchUserCourseEnrollment,
            identifyContentTypeIcons,
            progress 
        }}>
            <SidebarProvider className="p-0">
                <CourseSidebar/>
                <SidebarInset
                    className="min-h-[calc(100svh-4em)]"
                    style={{borderRadius: '0px', margin: '0px'}}
                >
                    <div className="w-full">
                        <Outlet/>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </CourseContext.Provider>
    );
}
