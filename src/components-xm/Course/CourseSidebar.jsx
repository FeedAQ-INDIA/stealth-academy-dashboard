import * as React from "react";
import {useEffect, useState} from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar.jsx";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import {Check, ChevronRight, CircleChevronLeft, Clock, Loader, SquareArrowLeft} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {useCourse} from "@/components-xm/Course/CourseContext.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Button} from "@/components/ui/button.jsx";


function CourseSidebar({...props}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {CourseId} = useParams();

    const [data, setData] = useState(null);

    const {userEnrollmentObj, userEnrollmentCourseLog, isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus,identifyContentTypeIcons} = useCourse();


    const contentUrlMap = {
        'CourseVideo' :  'video',
        'CourseWritten' :  'doc',
        'CourseQuiz' :  'quiz',
        'ComprehensionReading' :  'comprehension-reading',
     }

    useEffect(() => {
        if (courseList && location.pathname) {
           let vav =  courseList?.courseTopic?.map(a => (
                {
                    title: a?.courseTopicTitle,
                    url: `/course/${courseList?.courseId}`,
                    isClickable: false,
                    isActive: location.pathname === ``,
                    subItems: a?.courseTopicContent?.map(m => ({
                        title: m?.courseTopicContentTitle,
                        courseTopicContentId : m?.courseTopicContentId,
                        contentType:m?.courseTopicContentType,
                        url: `/course/${courseList?.courseId}/${contentUrlMap[m?.courseTopicContentType]}/${m?.contentId}`,
                        isClickable: true,
                        isActive: location.pathname === `/course/${courseList?.courseId}/${contentUrlMap[m?.courseTopicContentType]}/${m?.contentId}`,
                    }))
                }
            ))

            setData({
                navMain: [
                    {
                        title: `` , url: "#", items: [{
                            title: "OVERVIEW",
                            url: `/course/${courseList?.courseId}`,
                            isClickable: true,
                            isActive: location.pathname === `/course/${courseList?.courseId}`,
                        },
                            ...(courseList?.courseMode === "LIVE"
                                ? [{
                                    title: "SCHEDULE",
                                    url: `/course/${courseList?.courseId}/schedule`,
                                    isClickable: true,
                                    isActive: location.pathname === `/course/${courseList?.courseId}/schedule`,
                                }]
                                : []) ,
                         ].concat(vav),
                    },]
            })

        }else{
            return  <div>Loading...</div>
        }
    }, [courseList, location.pathname])

    return (<>
        <Sidebar className="top-[4rem] h-[calc(100svh-4em)]    shadow-lg px-0 border-r " style={{borderRadius: '0px', overflowY: 'auto'}}
                >

            <SidebarHeader>
                <h2 className="text-lg font-medium   text-black text-center line-clamp-1">{courseList?.courseTitle} </h2>
                <div className=" ">
                    {/*{userEnrollmentObj?.enrollmentStatus  ?*/}
                    {/*    <Badge  className="animate-blink bg-blue-600 text-white"  variant="outline">*/}
                    {/*        {userEnrollmentObj?.enrollmentStatus}</Badge>*/}
                    {/*    : <></>}*/}

                    {/*<p className=" text-xs font-medium text-muted-foreground text-center mb-2" >*/}
                    {/*         COURSE STATUS - {userEnrollmentObj?.enrollmentStatus  || ''}*/}

                    {/*</p>*/}
                    {/*<p  className="completed-stamp text-base tracking-wide"   >*/}
                    {/*    <span className="text-black font-light">Course Status :</span>  {userEnrollmentObj?.enrollmentStatus}</p>*/}
                              <div className="items-center w-full">
                                <div className="mx-auto w-fit flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200">
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {userEnrollmentObj?.enrollmentStatus}
                                    </p>
                                </div>
                            </div>
                     <Link to={'/explore'}>
                        <Button className="w-full flex gap-2 text-muted-foreground" size="sm" variant="ghost"><SquareArrowLeft />Explore more courses</Button>

                    </Link>
                </div>
            </SidebarHeader>
            <Separator/>
            <SidebarContent >


                {data?.navMain?.map((item) => (<SidebarGroup key={item?.title}  className="font-medium text-xs">
                 <SidebarGroupLabel>{item.title}</SidebarGroupLabel>


                    <SidebarGroupContent>
                        <SidebarMenu>
                            {item?.items?.map((item) => (item?.subItems?.length > 0 ? (<Collapsible key={item?.title}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item?.title}
                                                               className="py-5 rounded-1">

                                                <span>{item?.title}</span>
                                                <ChevronRight
                                                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item?.subItems?.map((subItem) => (

                                                    <SidebarMenuSubItem>
                                                        {subItem?.isClickable? <SidebarMenuSubButton asChild
                                                                              isActive={subItem?.isActive}
                                                                              className="flex items-center gap-1 py-2 rounded-1 h-fit">
                                                            <Link to={subItem?.url}><div className="flex items-center gap-2">

                                                                {userEnrollmentCourseLog?.filter(b => b.courseId == CourseId && b?.courseTopicContentId == subItem?.courseTopicContentId && b.enrollmentStatus == 'COMPLETED')?.length > 0?
                                                                    <Avatar className="border shadow-sm bg-green-500">
                                                                        <AvatarFallback  className=" bg-green-500"><Check  strokeWidth={3}  color="#ffffff" className="flex-shrink-0"/></AvatarFallback>
                                                                    </Avatar> :  <Avatar  className="border shadow-sm">
                                                                        <AvatarFallback> </AvatarFallback>
                                                                    </Avatar> }

                                                                {/*<div>{identifyContentTypeIcons(subItem.contentType)}</div>*/}
                                                            <div className="">{subItem?.title} </div>


                                                            </div></Link>
                                                        </SidebarMenuSubButton> :
                                                            <SidebarMenuSubButton asChild
                                                                                  isActive={subItem?.isActive}
                                                                                  className="flex items-center gap-1 py-5 rounded-1 h-fit">
                                                                <div className="flex items-center gap-1">
                                                                    <div>{identifyContentTypeIcons(subItem.contentType)}</div>
                                                                    <div>{<span>{subItem.title}</span>}</div>
                                                                </div>
                                                            </SidebarMenuSubButton> }
                                                    </SidebarMenuSubItem>))}

                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>) : (<SidebarMenuItem key={item?.title}>
                                    <SidebarMenuButton asChild isActive={item?.isActive}
                                                       className="py-5 rounded-1">
                                        {item?.isClickable?  <Link to={item?.url}>{item?.title}</Link>: <span>{item?.title}</span>}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>)

                            ))}

                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>))}


            </SidebarContent>


        </Sidebar>
    </ >);
}

export default CourseSidebar