import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.jsx";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuthStore } from "@/zustland/store.js";
import { useCourseState } from "@/hooks/useCourseState";
import { CourseContext } from "./CourseContext.jsx";
import { Video, Book, HelpCircle, Zap, Award, Notebook, Info } from "lucide-react";
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
        if(type === 'CourseVideo') return <Video  size={20}/>;
        else if(type === 'CourseWritten') return <Book  size={20}/>;
        else if(type === 'CourseQuiz') return <HelpCircle  size={20}/>;
        else if(type === 'CourseFlashcard') return <Zap  size={20}/>;
        else if(type === 'CourseCertificate') return <Award  size={20}/>;
        else if(type === 'OVERVIEW') return <Info  size={20}/>;
        else if(type === 'COURSE NOTES') return <Notebook  size={20}/>;
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
                    className="min-h-[calc(100svh-4em)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
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
