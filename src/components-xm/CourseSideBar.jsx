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
import {Link, useLocation, useNavigate} from "react-router-dom";

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import {ChevronRight, Clock, Loader} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {useCourse} from "@/components-xm/CourseContext.jsx";


function CourseSidebar({...props}) {
    const location = useLocation();
    const navigate = useNavigate();



    const [selectedTab, setSelectedTab] = useState(location.pathname);


    // Update the state when the URL changes
    useEffect(() => {
        const currentTab =  location.pathname;
        console.log(currentTab)
        setSelectedTab(currentTab);
    }, [location.pathname]);



    const [urlEndpoint, setUrlEndpoint] = React.useState("");

    const [data, setData] = useState({});
    // let data;
    useEffect(() => {
        console.log("Updated urlEndpoint:", data);
    }, [data]);

    const {isUserEnrolledAlready, courseList, enroll, disroll, enrollStatus} = useCourse();


    useEffect(() => {
        if (courseList) {
           let vav =  courseList?.courseTopic?.map(a => (
                {
                    title: a?.courseTopicTitle,
                    url: `/course/${courseList?.courseId}`,
                    isClickable: false,
                    isActive: location.pathname === ``,
                    subItems: a?.courseVideo?.map(m => ({
                        title: m?.courseVideoTitle,
                        url: `/course/${courseList?.courseId}/video/${m?.courseVideoId}`,
                        isClickable: true,
                        isActive: location.pathname === `/course/${courseList?.courseId}/video/${m?.courseVideoId}`,
                    }))
                }
            ))

            setData({
                navMain: [
                    {
                        title: "COURSE", url: "#", items: [{
                            title: "Overview",
                            url: `/course/${courseList?.courseId}`,
                            isClickable: true,
                            isActive: location.pathname === `/course/${courseList?.courseId}`,
                        },
                         ].concat(vav),
                    },]
            })

        }else{
            return "Loading..."
        }
    }, [courseList, location.pathname])

    return (< >
        <Sidebar className="top-[4rem] h-[calc(100svh-4em)]  shadow-md " style={{borderRadius: '0px', overflowY: 'auto'}}
                 variant="inset">

            <SidebarHeader>
                <h2 className="text-lg font-medium">{courseList?.courseTitle} </h2>
                <div className=" ">
                    <div className="flex gap-2 items-center text-sm mt-2">
                        <Clock
                            size={18}/> {`${Math.floor(+(courseList?.courseDuration) / 60)}hr ${+(courseList?.courseDuration) % 60}min`}
                    </div>
                    <div className="flex gap-2 items-center text-sm mt-2">
                        <Loader size={18}/> 10 % Completed
                    </div>
                </div>
            </SidebarHeader>
            <Separator/>
            <SidebarContent>


                {data?.navMain?.map((item) => (<SidebarGroup key={item.title}>
                    <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {item?.items?.map((item) => (item?.subItems?.length > 0 ? (<Collapsible key={item.title}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}
                                                               className="py-5 rounded-1">

                                                <span>{item.title}</span>
                                                <ChevronRight
                                                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item?.subItems?.map((subItem) => (

                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuSubButton asChild
                                                                              isActive={subItem.isActive}
                                                                              className="py-5 rounded-1">
                                                            {subItem.isClickable?<Link to={subItem.url}>{subItem.title}</Link>:<span>{subItem.title}</span>}
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>))}

                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>) : (<SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.isActive}
                                                       className="py-5 rounded-1">
                                        {item.isClickable?  <Link to={item.url}>{item.title}</Link>: <span>{item.title}</span>}
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

export default CourseSidebar;
