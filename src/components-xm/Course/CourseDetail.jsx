import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.jsx";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuthStore } from "@/zustland/store.js";
import { useCourseState } from "@/hooks/useCourseState";
import { CourseContext } from "./CourseContext.jsx";
import { Book, Video } from "lucide-react";
import { CourseLoadingSkeleton } from "@/components/CourseLoadingSkeleton";
import CourseSidebar from "@/components-xm/Course/CourseSidebar.jsx";

export function CourseDetail() {
    const { CourseId } = useParams();
    const { userDetail } = useAuthStore();
    const navigate = useNavigate();
    
    const {
        course: courseList,
        userCourseContentProgress,
        loading,
        error,
        progress,
        actions: {
            fetchCourseDetail,
            fetchUserCourseContentProgress
        }
    } = useCourseState(CourseId);

    useEffect(() => {
        fetchCourseDetail();
        if (userDetail?.userId) {
            fetchUserCourseContentProgress(userDetail.userId);
        }
    }, [CourseId, userDetail?.userId, fetchCourseDetail, fetchUserCourseContentProgress]);

    const identifyContentTypeIcons = (type) => {
        if(type === 'CourseVideo') return <Video/>;
        else if(type === 'CourseWritten') return <Book />;
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
            fetchUserEnrollmentData: fetchUserCourseContentProgress,
            identifyContentTypeIcons,
            progress 
        }}>
            <SidebarProvider className="p-0">
                <CourseSidebar/>
                <SidebarInset
                    className="min-h-[calc(100svh-4em)]"
                    style={{borderRadius: '0px', margin: '0px'}}
                >
                    <div className="h-[calc(100svh-4em)] overflow-y-auto">
                        <Outlet/>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </CourseContext.Provider>
    );
}
