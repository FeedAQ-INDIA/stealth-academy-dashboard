import React, {useEffect, useState} from "react";
import {
    ChevronLeft, 
    ChevronRight, 
    Search, 
    Filter, 
    SortAsc, 
    Grid3X3,
    List,
    BookOpen,
    Star,
    TrendingUp
} from "lucide-react";
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
import {Badge} from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function Explore() {
    const navigate = useNavigate();
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(12);
    const [offset, setOffset] = useState(0);
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('recent'); // 'recent', 'title', 'popular'
    const [filterBy, setFilterBy] = useState('all'); // 'all', 'free', 'premium', 'beginner', 'intermediate', 'advanced'

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
                const responseData = res.data.data;
                setCourseList(responseData?.results || []);
                setTotalCount(responseData?.totalCount || 0);
                setOffset(responseData?.offset || 0);
                setLimit(responseData?.limit || limit);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setCourseList([]); // Ensure courseList is always an array on error
                setTotalCount(0);
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

    const handleSortChange = (value) => {
        setSortBy(value);
        let orderClause = [];
        switch (value) {
            case 'title':
                orderClause = [["courseTitle", "ASC"]];
                break;
            case 'recent':
                orderClause = [["createdAt", "DESC"]];
                break;
            case 'popular':
                orderClause = [["updatedAt", "DESC"]]; // You can implement actual popularity logic
                break;
            default:
                orderClause = [["createdAt", "DESC"]];
        }
        
        updateApiQuery("Course", {
            order: orderClause,
        });
    };

    const handleFilterChange = (value) => {
        setFilterBy(value);
        let whereClause = {};
        
        // Implement filtering logic based on your course entity structure
        switch (value) {
            case 'free':
                whereClause = { courseIsFree: true };
                break;
            case 'premium':
                whereClause = { courseIsFree: false };
                break;
            case 'beginner':
                whereClause = { courseLevel: 'beginner' };
                break;
            case 'intermediate':
                whereClause = { courseLevel: 'intermediate' };
                break;
            case 'advanced':
                whereClause = { courseLevel: 'advanced' };
                break;
            case 'all':
            default:
                whereClause = {};
        }
        
        // Merge with existing search filters
        if (exploreCourseText.trim()) {
            whereClause.courseTitle = {
                $like: `%${exploreCourseText.trim().toUpperCase()}%`,
            };
        }
        
        updateApiQuery("Course", {
            where: whereClause,
        });
    };

    useEffect(() => {
        setApiQuery({
            limit: limit,
            offset: offset,
            getThisData: {
                datasource: "Course",
                // order: [["courseIsLocked", "ASC"]],
                attributes: [],
            },
        });
        handleSearchChange(exploreCourseText);
    }, [exploreCourseText]);

    // Apply initial sort when component mounts
    useEffect(() => {
        handleSortChange(sortBy);
    }, []);

    // Apply filter when filterBy changes
    useEffect(() => {
        handleFilterChange(filterBy);
    }, [filterBy]);

    return (

        <>
            {userDetail ? <Header/> : <PublicHeader/>}
            <div className="p-4 overflow-y-auto h-[calc(100svh-4em)]">
                <div className="space-y-6">
                    {/* Hero Section */}
                    <Card className="w-full rounded-sm border-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-700 text-white shadow-2xl ">
                        <CardHeader>
                            <CardTitle className="text-center tracking-wide text-2xl md:text-3xl">
                                What would you like to learn today?
                            </CardTitle>
                            <p className="text-center text-white/90 mt-2">
                                Discover thousands of courses from beginner to advanced levels
                            </p>
                        </CardHeader>
                        <CardContent>
                             {/* Search Bar */}
                                {/* <div className="w-full">
                                    <div className="relative max-w-2xl mx-auto">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input 
                                            type="text" 
                                            placeholder="Search for courses, topics, or skills..."
                                            value={exploreCourseText} 
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setExploreCourseText(value);
                                                handleSearchChange(value);
                                            }}
                                            className="pl-12 h-12 text-lg border-gray-200 focus:border-blue-500 shadow-sm"
                                        />
                                    </div>
                                </div> */}


      {/* Search and Filters */}
                    <Card className="border-0 shadow-sm mt-4">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                               
                                {/* Results Info and Controls */}
                                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                                    {/* Course Count and Search Results */}
                                    {/* <div className="flex-1">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {exploreCourseText ? `Search Results for "${exploreCourseText}"` : "Explore Courses"}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            {totalCount > 0 ? `${totalCount} course${totalCount !== 1 ? 's' : ''} available` : ""}
                                        </p>
                                    </div> */}

                                    <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                                                                               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
  <Input 
                                            type="text" 
                                            placeholder="Search for courses, topics, or skills..."
                                            value={exploreCourseText} 
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setExploreCourseText(value);
                                                handleSearchChange(value);
                                            }}
                                            className="pl-12  w-full h-10 sm:h-11 md:h-12 text-base sm:text-lg border-gray-200 focus:border-blue-500 shadow-sm"
                                        />
                                    </div>

                                    {/* Filters and Controls */}
                                    <div className="flex gap-2 items-center flex-wrap">
                                        {/* Filter */}
                                        <Select value={filterBy} onValueChange={handleFilterChange}>
                                            <SelectTrigger className="w-36">
                                                <Filter className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Filter" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Courses</SelectItem>
                                                <SelectItem value="free">Free Courses</SelectItem>
                                                <SelectItem value="premium">Premium Courses</SelectItem>
                                                <SelectItem value="beginner">Beginner Level</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {/* Sort */}
                                        <Select value={sortBy} onValueChange={handleSortChange}>
                                            <SelectTrigger className="w-36">
                                                <SortAsc className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Sort" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="recent">Recently Added</SelectItem>
                                                <SelectItem value="title">Title A-Z</SelectItem>
                                                <SelectItem value="popular">Most Popular</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {/* View Mode Toggle */}
                                        <div className="flex border rounded-lg p-1">
                                            <Button
                                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setViewMode('grid')}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Grid3X3 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setViewMode('list')}
                                                className="h-8 w-8 p-0"
                                            >
                                                <List className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                        </CardContent>
                    </Card>

              

                    {/* Content */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center min-h-[400px] w-full">
                                <div className="text-center">
                                    <LoaderOne/>
                                    <p className="mt-4 text-gray-600">Discovering amazing courses for you...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Courses Grid/List */}
                                <div className={`gap-6 ${
                                    viewMode === 'grid' 
                                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                        : 'flex flex-col space-y-4'
                                }`}>
                                    {courseList && courseList.length > 0 && courseList.map((course) => (
                                        <CourseCard key={course.id} course={course} viewMode={viewMode} />
                                    ))}
                                </div>

                                {/* Enhanced Empty State */}
                                {(!courseList || courseList.length === 0) && !loading && (
                                    <Card className="border-2 border-dashed border-gray-200">
                                        <CardContent className="text-center py-16">
                                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <BookOpen className="w-10 h-10 text-orange-500" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                {exploreCourseText ? 'No courses found' : 'Start Your Learning Journey'}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                                                {exploreCourseText 
                                                    ? 'Try adjusting your search terms or browse different categories to find the perfect course for you.'
                                                    : 'Discover thousands of courses from beginner to advanced levels. Start learning something new today!'
                                                }
                                            </p>
                                            {exploreCourseText && (
                                                <div className="flex gap-2 justify-center">
                                                    <Button 
                                                        variant="outline"
                                                        onClick={() => {
                                                            setExploreCourseText('');
                                                            handleSearchChange('');
                                                        }}
                                                    >
                                                        Clear Search
                                                    </Button>
                                                    <Button 
                                                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                                                    >
                                                        <TrendingUp className="mr-2 h-4 w-4" />
                                                        Browse Popular
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Enhanced Pagination */}
                                {courseList && courseList.length > 0 && (
                                    <Card className="border-0 shadow-sm mt-6">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-sm text-gray-600">
                                                    Showing {offset + 1} to{" "}
                                                    {Math.min(offset + limit, totalCount)} of {totalCount}{" "}
                                                    course{totalCount !== 1 ? 's' : ''}
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
                                                                className="hover:bg-blue-50"
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
                                                                    setOffset(
                                                                        offset + limit < totalCount
                                                                            ? offset + limit
                                                                            : offset
                                                                    );
                                                                    setApiQuery((prevQuery) => ({
                                                                        ...prevQuery,
                                                                        offset:
                                                                            offset + limit < totalCount
                                                                                ? offset + limit
                                                                                : offset,
                                                                    }));
                                                                }}
                                                                className="hover:bg-blue-50"
                                                            >
                                                                Next
                                                                <ChevronRight className="h-4 w-4 ml-1" />
                                                            </Button>
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>

    );
}