import * as React from "react";
import { useEffect, useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar.jsx";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {Check, MonitorPlay, SquareArrowLeft} from "lucide-react";
import { Separator } from "@/components/ui/separator.jsx";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";

function CourseSidebar() {
    const location = useLocation();
    const { CourseId } = useParams();

    const [data, setData] = useState(null);

    const { userCourseContentProgress, courseList, identifyContentTypeIcons } = useCourse();

    const contentUrlMap = {
        CourseVideo: "video",
        CourseWritten: "doc",
        CourseQuiz: "quiz",
    };

    useEffect(() => {
        if (courseList && location.pathname) {
            setData({
                navMain: [
                    {
                        title: "",
                        url: "#",
                        items: [
                            {
                                title: "OVERVIEW",
                                url: `/course/${courseList?.courseId}`,
                                isClickable: true,
                                isActive: location.pathname === `/course/${courseList?.courseId}`,
                            },
                            ...(courseList?.courseContent?.map((m) => ({
                                isCourseContent: true,
                                title: m?.courseContentTitle,
                                courseContentId: m?.courseContentId,
                                contentType: m?.courseContentType,
                                url: `/course/${courseList?.courseId}/${contentUrlMap[m?.courseContentType]}/${m?.courseContentId}`,
                                isClickable: true,
                                isActive: location.pathname === `/course/${courseList?.courseId}/${contentUrlMap[m?.courseContentType]}/${m?.courseContentId}`,
                            })) || []),
                        ],
                    },
                ],
            });
        }
    }, [courseList, location.pathname]);

    if (!courseList || !data) {
        return <div className="p-4 text-center text-muted-foreground">Loading course data...</div>;
    }

    return (
        <Sidebar
            className="top-[4rem] h-[calc(100svh-4em)] shadow-lg px-0 border-r"
            style={{ borderRadius: "0px", overflowY: "auto" }}
        >
            <SidebarHeader>
                <h2 className="text-lg font-medium text-black text-center line-clamp-1">
                    {courseList?.courseTitle}
                </h2>

                <div className="items-center w-full">
                    <div className="mx-auto w-fit flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-semibold text-gray-700">
                            {courseList?.courseCompletionStatus}
                        </p>
                    </div>

                    <Link to="/explore">
                        <Button className="w-full flex gap-2 text-muted-foreground" size="sm" variant="ghost">
                            <SquareArrowLeft />
                            Explore more courses
                        </Button>
                    </Link>
                </div>
            </SidebarHeader>

            <Separator />

            <SidebarContent>
                {data?.navMain?.map((group) => (
                    <SidebarGroup key={group?.title} className="font-medium text-xs">
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group?.items?.map((item) => item.isCourseContent? (
                                    <SidebarMenuItem key={item?.url}>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={item?.isActive}
                                                className="flex items-center gap-1 py-2 rounded-1 h-fit"
                                            >
                                                <Link to={item?.url}>
                                                    <div className="flex items-center gap-2">
                                                        {userCourseContentProgress?.some(
                                                            (log) =>
                                                                log.courseId == CourseId &&
                                                                log.courseContentId == item?.courseContentId &&
                                                                log.progressStatus === "COMPLETED"
                                                        ) ? (
                                                            <Avatar className="border shadow-md bg-green-500">
                                                                <AvatarFallback className="bg-green-500">
                                                                    <Check strokeWidth={3} color="#ffffff" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ) : (
                                                            <Avatar className="border shadow-md">
                                                                <AvatarFallback>
                                                                    <MonitorPlay size={18} />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                        <div>{item?.title}</div>
                                                    </div>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuItem>
                                ):(
                                    <SidebarMenuItem key={item?.url}>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={item?.isActive}
                                                className="flex items-center gap-1 py-2 rounded-1 h-fit"
                                            >
                                                <Link to={item?.url}>
                                                    <div className="flex items-center gap-2">
                                                        <div>{item?.title}</div>
                                                    </div>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuItem>
                                    )
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}

export default CourseSidebar;
