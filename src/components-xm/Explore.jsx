import React, {useEffect, useState} from "react";
import {ChevronLeft, ChevronRight, Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Pagination, PaginationContent, PaginationItem} from "@/components/ui/pagination";
import {useNavigate} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {useAuthStore} from "@/zustland/store.js";
import {CourseCard} from "@/components-xm/Modules/CourseCard.jsx";
import Header from "@/components-xm/Header/Header.jsx";
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
import {LoaderOne} from "@/components/ui/loader.jsx";

export function Explore() {
    const navigate = useNavigate();
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(12);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSearchValueFromURL = (key) => {
        const params = new URLSearchParams(location.search);
        if (key == 'search') {
            return params.get(key) || '';
        } else {
            return params.get(key) || null;
        }
    };

    const {userDetail} = useAuthStore();

    const [exploreCourseText, setExploreCourseText] = useState(getSearchValueFromURL("search"));

    const [apiQuery, setApiQuery] = useState({
        limit: limit,
        offset: offset,
        getThisData: {
            datasource: "Course",
            order: [["courseIsLocked", "ASC"]],
             attributes: [],
        },
    });

    const updateApiQuery = (datasource, keyValueUpdates) => {
        setApiQuery((prevQuery) => {
            const newQuery = {...prevQuery};

            const updateWhereClause = (currentWhere, newWhere) => {
                const updatedWhere = {...currentWhere};
                for (const [key, value] of Object.entries(newWhere)) {
                    if (updatedWhere.hasOwnProperty(key)) {
                        updatedWhere[key] = value;
                    } else {
                        updatedWhere[key] = value;
                        console.log(`Key ${key} does not exist, skipping addition.`);
                    }
                }
                return updatedWhere;
            };

            const updateNestedIncludes = (includes) => {
                for (const include of includes) {
                    if (include.datasource === datasource) {
                        if (keyValueUpdates.where) {
                            include.where = updateWhereClause(include.where || {}, keyValueUpdates.where);
                        }
                        Object.keys(keyValueUpdates).forEach((key) => {
                            if (key !== "where" && include.hasOwnProperty(key)) {
                                include[key] = keyValueUpdates[key];
                            } else {
                                include[key] = keyValueUpdates[key];
                                console.log(`Key ${key} does not exist, skipping replacement.`);
                            }
                        });
                    }
                    if (include.include) {
                        updateNestedIncludes(include.include);
                    }
                }
            };

            if (newQuery.getThisData.datasource === datasource) {
                if (keyValueUpdates.where) {
                    newQuery.getThisData.where = updateWhereClause(newQuery.getThisData.where || {}, keyValueUpdates.where);
                } else {
                    newQuery.getThisData = {
                        ...newQuery.getThisData,
                        ...keyValueUpdates,
                    };
                }
            } else {
                updateNestedIncludes(newQuery.getThisData.include);
            }

            return newQuery;
        });
    };

    useEffect(() => {
        fetchCourses();
    }, [apiQuery]);

    const fetchCourses = () => {
        setLoading(true);
        axiosConn
            .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
            .then((res) => {
                setCourseList(res.data.data?.results);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    const handleSearchChange = (value) => {
        const searchValue = value;
        const trimmed = searchValue.trim();

        const params = new URLSearchParams(location.search);
        if (trimmed) {
            params.set("search", trimmed);
        } else {
            params.delete("search");
        }
        navigate({pathname: location.pathname, search: params.toString()});

        updateApiQuery("Course", {
            where: {
                courseTitle: {
                    $like: `%${trimmed.toUpperCase() || ""}%`,
                },
            },
        });
    };

    useEffect(() => {
        setApiQuery({
            limit: limit,
            offset: offset,
            getThisData: {
                datasource: "Course",
                order: [["courseIsLocked", "ASC"]],
                attributes: [],
            },
        });
        handleSearchChange(exploreCourseText);
    }, [exploreCourseText]);

    return (

        <>
            {userDetail ? <Header/> : <PublicHeader/>}
            <div className="p-3 md:p-6  overflow-y-auto h-[calc(100svh-4em)]">
                <div className=" items-center justify-items-center">
                    <Card className="w-full rounded-sm border-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-700 text-white shadow-2xl mb-8 py-6">
                        <CardHeader>
                            <CardTitle className="text-center tracking-wide">
                                What would you like to learn today ?
                            </CardTitle>


                        </CardHeader>
                        <CardContent>
                            <div className="my-2">
                                <div className="flex gap-2 w-full md:w-3/4 lg:w-1/2 mx-auto items-center text-black">
                                    <Input type="text" placeholder="What do you want to learn today ?"
                                           value={exploreCourseText} onChange={(e) => {
                                        const value = e.target.value;
                                        setExploreCourseText(value);
                                    }}
                                    />

                                    {/*<Button type="submit"><Search/></Button>*/}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="my-4">
                        {loading ? <div className="flex items-center justify-center min-h-[400px] w-full">
                            <LoaderOne/>
                        </div> : <>
                            <div className="flex items-center  ">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {exploreCourseText ? `Search Results for "${exploreCourseText}"` : ""}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        {totalCount > 0 ? `${totalCount} courses found` : ""}
                                    </p>
                                </div>


                            </div>
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-4 items-center">
                                {courseList?.map((a) =>
                                    (
                                        <CourseCard key={a.id} a={a}/>
                                    )
                                )}
                            </div>


                            {/* Empty State */}
                            {courseList.length === 0 && !loading && (
                                <div className="text-center py-16">
                                    <div
                                        className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-gray-400"/>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        No courses found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        Try adjusting your search terms or browse our popular categories to find the
                                        perfect course for you.
                                    </p>

                                </div>
                            )}

                            {courseList.length > 0 ?            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} courses
                                    </div>
                                    <Pagination className="mr-0 ml-auto w-auto">
                                        <PaginationContent>
                                            <PaginationItem>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={offset === 0}
                                                    onClick={() => {
                                                        setOffset(Math.max(offset - limit, 0));
                                                        setApiQuery((prevQuery) => ({
                                                            ...prevQuery,
                                                            offset: Math.max(offset - limit, 0),
                                                        }));
                                                    }}
                                                >
                                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                                    Previous
                                                </Button>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={offset + limit >= totalCount}
                                                    onClick={() => {
                                                        setOffset(offset + limit < totalCount ? offset + limit : offset);
                                                        setApiQuery((prevQuery) => ({
                                                            ...prevQuery,
                                                            offset: offset + limit < totalCount ? offset + limit : offset,
                                                        }));
                                                    }}
                                                >
                                                    Next
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </Button>
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                                : <></>}
                        </>}

                    </div>

                </div>
            </div>
        </>

    );
}