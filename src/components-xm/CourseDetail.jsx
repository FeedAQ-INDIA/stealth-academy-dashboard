import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.jsx"
import CourseSidebar from "@/components-xm/CourseSidebar.jsx";

import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";


const HEADER_HEIGHT = "4rem";

export function CourseDetail() {

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState({});
    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "Course",  attributes: [],
            include: [{
                datasource: "CourseTopic", as: "courseTopic", required: false, order: [], attributes: [], where: {},
                include:[
                    {
                        datasource: "CourseVideo", as: "courseVideo", required: false, order: [], attributes: [], where: {},
                    }
                ]
            },
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
                setCourseList(res.data.data?.results?.[0]);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (<>
            <SidebarProvider className="p-0">
                <CourseSidebar/>
                <SidebarInset
                    className=" min-h-[calc(100svh-4em)]  " style={{borderRadius: '0px', margin: '0px'}}>

                    <div className="h-[calc(100svh-4em)] overflow-y-auto  ">
                        <Outlet/>
                    </div>


                </SidebarInset>
            </SidebarProvider>
        </>

    );
}
