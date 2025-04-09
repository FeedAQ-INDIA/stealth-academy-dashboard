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
    SidebarMenuSubItem, useSidebar,
} from "@/components/ui/sidebar.jsx";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import {ArrowLeft, ChevronRight, Clock, Loader} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {Button} from "@/components/ui/button.jsx";
import axiosConn from "@/axioscon.js";


function CourseSidebar({...props}) {
    const location = useLocation();
    const navigate = useNavigate();

    // Helper function to get the current tab from the URL query params
    const getTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get("tab") || "overview"; // Default to 'overview' tab
    };

    const [selectedTab, setSelectedTab] = useState(getTabFromURL);


    // Update the state when the URL changes
    useEffect(() => {
        const currentTab = getTabFromURL();
        console.log(currentTab)
        setSelectedTab(currentTab);
    }, [location.search]);

    // Change the URL when the tab changes
    const handleTabChange = (value) => {
        setSelectedTab(value);
        navigate(`?tab=${value}`); // Update the URL without reloading the page
    };

    const [urlEndpoint, setUrlEndpoint] = React.useState("");

    const data = {
        navMain: [
            {
                title: "COURSE", url: "#", items: [{
                    title: "Overview",
                    url: ` `,
                    isActive: selectedTab === 'views',
                },
                    {
                        title: "Introduction",
                        url: ` `,
                        isActive: selectedTab === 'my-queue',
                        subItems:[
                            {
                                title: "What is Java ? ",
                                url: `/course/2/video/690`,
                                isActive: selectedTab === 'views',
                            },
                        ]
                    },

                ],
            },  ]
    };

    useEffect(() => {
        console.log("Updated urlEndpoint:", urlEndpoint);
    }, [urlEndpoint]);

    const {CourseId} = useParams();
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState([]);
    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "CourseTopic",  attributes: [], where : {courseId: CourseId},
            include: [
                    {
                        datasource: "CourseVideo", as: "courseVideo", required: false, order: [], attributes: [], where: {},
                    },
                {
                    datasource: "CourseWritten", as: "courseWritten", required: false, order: [], attributes: [], where: {},
                }
             ],
        },
    });

    useEffect(() => {
        fetchCourses();
    }, [apiQuery]);

    const fetchCourses = () => {
        axiosConn
            .post("http://localhost:3000/searchCourse", apiQuery)
            .then((res) => {
                console.log(res.data);
                setCourseList(res.data.data?.results);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (< >
        <Sidebar className="top-[4rem] h-[calc(100svh-4em)]   " style={{borderRadius: '0px', overflowY: 'auto'}}
                 variant="inset">

            <SidebarHeader>
                <h2 className="text-lg font-medium">Basic / Core Java </h2>
                <div className=" ">
                    <div className="flex gap-2 items-center text-sm mt-2">
                        <Clock size={18}/>  3 hr 30 min</div>
                    <div className="flex gap-2 items-center text-sm mt-2">
                       <Loader size={18}/>  10 % Completed</div>
                </div>
            </SidebarHeader>
<Separator/>
            <SidebarContent>


                {data.navMain.map((item) => (<SidebarGroup key={item.title}>
                    <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {item.items.map((item) => (item?.subItems?.length > 0 ? (<Collapsible key={item.title}>
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
                                                            <Link to={subItem.url}>{subItem.title}</Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>))}

                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>) : (<SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.isActive}
                                                       className="py-5 rounded-1">
                                        <Link to={item.url}>{item.title}</Link>
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
