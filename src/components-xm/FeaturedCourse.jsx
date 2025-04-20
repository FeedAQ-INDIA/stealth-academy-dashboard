import {ChevronLeft, ChevronRight, Clock, Search,} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination"
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import {toast} from "@/components/hooks/use-toast.js";

export function FeaturedCourse() {
    const navigate = useNavigate()
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState([]);
    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "Course", attributes: [],
            include: [{
                datasource: "CourseTopic", as: "courseTopic", required: false, order: [], attributes: [], where: {},
            },],
        },
    });

    const getSearchValueFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get("search") || ''; // Default to 'overview' tab
    };
    const { userDetail, userEnrolledCourseIdList, fetchUserEnrolledCourseIdList} = useAuthStore();

    const [exploreCourseText, setExploreCourseText] = useState(getSearchValueFromURL);


    const updateApiQuery = (datasource, keyValueUpdates) => {
        setApiQuery((prevQuery) => {
            const newQuery = {...prevQuery};

            // Function to handle the merging of where clauses
            const updateWhereClause = (currentWhere, newWhere) => {
                // Start with a copy of the current where clause
                const updatedWhere = {...currentWhere};

                // Loop through each key in the new where object
                for (const [key, value] of Object.entries(newWhere)) {
                    // Replace the value only if the key exists
                    if (updatedWhere.hasOwnProperty(key)) {
                        updatedWhere[key] = value; // Replace value if key exists
                    } else {
                        // Optionally log or handle the case where the key does not exist
                        updatedWhere[key] = value;
                        console.log(`Key ${key} does not exist, skipping addition.`);
                    }
                }
                console.log(updatedWhere);
                return updatedWhere; // Return the updated where clause
            };

            const updateNestedIncludes = (includes) => {
                for (const include of includes) {
                    if (include.datasource === datasource) {
                        // Update where clause if keyValueUpdates contains `where`
                        if (keyValueUpdates.where) {
                            include.where = updateWhereClause(include.where || {}, keyValueUpdates.where);
                        }

                        // Update other keys directly
                        Object.keys(keyValueUpdates).forEach((key) => {
                            if (key !== "where" && include.hasOwnProperty(key)) {
                                include[key] = keyValueUpdates[key]; // Replace existing keys
                            } else {
                                include[key] = keyValueUpdates[key];
                                console.log(`Key ${key} does not exist, skipping replacememnt.`);
                            }
                        });
                    }

                    if (include.include) {
                        updateNestedIncludes(include.include);
                    }
                }
            };

            // Update the main datasource if it matches
            if (newQuery.getThisData.datasource === datasource) {
                if (keyValueUpdates.where) {
                    newQuery.getThisData.where = updateWhereClause(newQuery.getThisData.where || {}, keyValueUpdates.where);
                } else {
                    newQuery.getThisData = {
                        ...newQuery.getThisData, ...keyValueUpdates,
                    };
                }

                // Update the main query with other key-value pairs
            } else {
                updateNestedIncludes(newQuery.getThisData.include);
            }

            return newQuery; // Return the updated query
        });
    };

    const fetchValueByDatasourceAndKey = (datasource, key) => {
        const {getThisData} = apiQuery;

        // Helper function to search recursively through includes
        const findInNestedIncludes = (includes) => {
            for (const include of includes) {
                // Check if the datasource matches
                if (include.datasource === datasource) {
                    return include[key]; // Return the value for the specified key
                }

                // If there are nested includes, search deeper
                if (include.include) {
                    const result = findInNestedIncludes(include.include);
                    if (result !== undefined) {
                        return result; // Return if found in nested includes
                    }
                }
            }
            return undefined; // Return undefined if not found
        };

        // Check main datasource
        if (getThisData.datasource === datasource) {
            return getThisData[key]; // Return the value for the specified key
        }

        // Search in nested includes
        return findInNestedIncludes(getThisData.include);
    };

    useEffect(() => {
        fetchCourses();
        console.log("userEnrolledCourseIdList :: ", userEnrolledCourseIdList)

    }, [apiQuery]);

    const fetchCourses = () => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/searchCourse", apiQuery)
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


    const handleSearchChange = (value) => {
        const searchValue =  value;
        const trimmed = searchValue.trim();

        // Update the query param in the URL
        const params = new URLSearchParams(location.search);
        if (trimmed) {
            params.set("search", trimmed);
        } else {
            params.delete("search");
        }
        navigate({ pathname: location.pathname, search: params.toString() });

        // Call API with appropriate query
        updateApiQuery("Course", {
            where: {
                courseTitle: {
                    $like: `%${trimmed.toUpperCase() || ""}%`,
                },
            },
        });
    };

    useEffect(() => {
        handleSearchChange(exploreCourseText)
    }, [exploreCourseText]);

    const disroll = (courseId) => {
        axiosConn
            .post(import.meta.env.VITE_API_URL+"/disroll", {
                courseId: courseId
            })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: 'Disrollment is successfull'
                });
                fetchCourses();
                fetchUserEnrolledCourseIdList(userDetail.userId)
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: 'Error occured while Disrollment'
                })
            });
    }



    return (
        <div className=" ">

            <div className=" items-center justify-items-center">

                <div className=" ">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-4 items-center">
                        {courseList?.map(a => (<Card className=" border shadow-sm hover:shadow-md cursor-pointer ">
                                <CardHeader>
                                    {/* Badge row - wraps on smaller screens */}
                                    <div className="flex flex-wrap gap-2 w-full mb-3">
                                        <Badge className="animate-blink bg-green-600 text-white">FREE</Badge>
                                        {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId) ?   <Badge  className="animate-blink bg-blue-600 text-white"  variant="outline">{userEnrolledCourseIdList?.find(m => m.courseId == a.courseId)?.enrollmentStatus }</Badge>
                                            : <></>}
                                        <Badge variant="outline">Course</Badge>
                                        <Badge variant="outline">Beginner</Badge>
                                    </div>

                                    {/* Title with responsive spacing */}
                                    <div className=" ">
                                        <CardTitle className="text-lg sm:text-xl  font-semibold">
                                            {a?.courseTitle}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className=" line-clamp-3">
                                        {a?.courseDescription}
                                    </p>
                                    {/*<p className="my-2 animate-blink text-blue-800 font-medium"> Registration Started</p>*/}
                                    <div className="font-medium  mt-6">
                                        <div className="flex gap-2 items-center">
                                            <Clock size={18}/>
                                            {`${Math.floor(+(a?.courseDuration) / 60)}hr ${+(a?.courseDuration) % 60}min`}
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex w-full flex-wrap gap-2">
                                    {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId && (m.enrollmentStatus != 'COMPLETED' && m.enrollmentStatus != 'CERTIFIED')) ?
                                        <Button className=" flex-1 " variant="destructive"
                                                onClick={() => disroll(a?.courseId)}>Leave Course</Button> :<></>}
                                    {userEnrolledCourseIdList?.find(m => m.courseId == a.courseId && ( m.enrollmentStatus == 'CERTIFIED')) ?
                                        <Button className=" flex-1 " variant="outline"
                                        >Download Certificate</Button> :<></>}

                                    <Link to={`/course/${a?.courseId}`} className="  flex-1 "><Button
                                        className="  w-full ">Learn More</Button>
                                    </Link>
                                </CardFooter>
                            </Card>)
                        )}

                    </div>
                </div>

            </div>
            {courseList.length > 0 ? <div className="flex flex-row items-center ">
                <div className="text-xs text-muted-foreground">
                    {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} row(s) selected.
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => {
                                    setOffset(Math.max(offset - limit, 0));
                                    setApiQuery((prevQuery) => ({
                                        ...prevQuery,
                                        offset: Math.max(offset - limit, 0),
                                    }));
                                }}
                            >
                                <ChevronLeft className="h-3.5 w-3.5"/>
                                <span className="sr-only">Previous Order</span>
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => {
                                    setOffset(offset + limit < totalCount ? offset + limit : offset);
                                    setApiQuery((prevQuery) => ({
                                        ...prevQuery,
                                        offset: offset + limit < totalCount ? offset + limit : offset,
                                    }));
                                }}
                            >
                                <ChevronRight className="h-3.5 w-3.5"/>
                                <span className="sr-only">Next Order</span>
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>: <></>}
        </div>
    );
}
