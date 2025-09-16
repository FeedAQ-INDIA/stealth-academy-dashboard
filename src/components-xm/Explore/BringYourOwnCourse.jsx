
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  SortAsc, 
  BookOpen,
  Star,
  TrendingUp,
  Grid3X3,
  List,
  Crown,
  Award,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import axiosConn from "@/axioscon.js";
import { useAuthStore } from "@/zustland/store.js";
import { CourseCard } from "@/components-xm/Modules/CourseCard.jsx";
import { LoaderOne } from "@/components/ui/loader.jsx";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



export function BringYourOwnCourse() {



    
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'title', 'progress'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'in-progress', 'completed', 'not-started'

  const getSearchValueFromURL = (key) => {
    const params = new URLSearchParams(location.search);
    if (key == "search") {
      return params.get(key) || "";
    } else {
      return params.get(key) || null;
    }
  };

  const { userDetail } = useAuthStore();

  const [exploreCourseText, setExploreCourseText] = useState(
    getSearchValueFromURL("search")
  );

  const [apiQuery, setApiQuery] = useState({
    limit: limit,
    offset: offset,
    getThisData: {
      datasource: "Course",
      attributes: [], 
      include: [
        {
          datasource: "CourseAccess",
          as: "accessControls",
          where: {
            userId: userDetail.userId,
            accessLevel: "OWN",
          },
          required: true,
        },
        {
          datasource: "UserCourseEnrollment",
          as: "enrollments",
          where: {
            userId: userDetail.userId,
          },
          required: false,
        },
      ],
    },
  });

  const updateApiQuery = (datasource, keyValueUpdates) => {
    setApiQuery((prevQuery) => {
      const newQuery = { ...prevQuery };

      const updateWhereClause = (currentWhere, newWhere) => {
        const updatedWhere = { ...currentWhere };
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
              include.where = updateWhereClause(
                include.where || {},
                keyValueUpdates.where
              );
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
          newQuery.getThisData.where = updateWhereClause(
            newQuery.getThisData.where || {},
            keyValueUpdates.where
          );
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
    navigate({ pathname: location.pathname, search: params.toString() });

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
    // Add sorting logic here based on the value
    let orderClause = [];
    switch (value) {
      case 'title':
        orderClause = [["courseTitle", "ASC"]];
        break;
      case 'recent':
        orderClause = [["createdAt", "DESC"]];
        break;
      case 'progress':
        // This would need to be implemented based on your progress tracking
        orderClause = [["updatedAt", "DESC"]];
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
    // Add filtering logic here based on the value
    // This would depend on how you track course status
  };

  useEffect(() => {
    setApiQuery({
      limit: limit,
      offset: offset,
      getThisData: {
        datasource: "Course",
        attributes: [],
        include: [
        {
          datasource: "CourseAccess",
          as: "accessControls",
          where: {
            userId: userDetail.userId,
            accessLevel: "OWN",
          },
          required: true,
        },
         {
          datasource: "UserCourseEnrollment",
          as: "enrollments",
          where: {
            userId: userDetail.userId,
          },
          required: false,
        },
      ],
      },
    });
    handleSearchChange(exploreCourseText);
  }, [exploreCourseText]);

  return (
    <div className=" space-y-4">
      {/* Header Section */}
      {/* <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"> */}
        {/* <div>
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          <p className="text-gray-600 mt-1">
            {totalCount > 0 ? `${totalCount} course${totalCount !== 1 ? 's' : ''} enrolled` : 'No courses enrolled yet'}
          </p>
        </div> */}
        
        {/* Quick Stats */}
        {/* {courseList.length > 0 && (
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{courseList.filter(c => c.status === 'IN_PROGRESS').length}</div>
              <div className="text-xs text-gray-500">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{courseList.filter(c => c.status === 'COMPLETED').length}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
        )} */}
      {/* </div> */}

      {/* Search and Filters */}
      {/* <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your courses..."
                value={exploreCourseText}
                onChange={(e) => {
                  setExploreCourseText(e.target.value);
                  handleSearchChange(e.target.value);
                }}
                className="pl-10 border-gray-200 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Select value={filterBy} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>

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
        </CardContent>
      </Card> */}

      {/* Content */}
      <div className="min-h-[400px] mt-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px] w-full">
            <div className="text-center">
              <LoaderOne />
              <p className="mt-4 text-gray-600">Loading your courses...</p>
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
              {courseList?.map((course) => (
                <CourseCard key={course.id} course={course} viewMode={viewMode} />
              ))}
            </div>

            {/* Empty State */}
            {courseList?.length === 0 && !loading && (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exploreCourseText ? 'No courses found' : 'Start Your Learning Journey'}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    {exploreCourseText 
                      ? 'Try adjusting your search terms or browse our course catalog.'
                      : 'You haven\'t enrolled in any courses yet. Explore our course catalog to get started.'
                    }
                  </p>
                  <Button 
                    onClick={() => navigate('/explore')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Explore Courses
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {courseList.length > 0 && (
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
  );

  
//   return (
//     <div className="min-h-[400px]">
//       <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
//         <CardContent className="text-center py-16">
//           <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <Upload className="w-10 h-10 text-blue-500" />
//           </div>
//           <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//             Share Your Knowledge
//           </h3>
//           <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
//             Have expertise to share? Upload your own courses and help others learn. 
//             Create engaging content, reach a global audience, and monetize your knowledge.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
//               <Upload className="mr-2 h-5 w-5" />
//               Upload Course
//             </Button>
//             <Button variant="outline" className="px-8 py-3">
//               Learn More
//             </Button>
//           </div>
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
//             <div className="text-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <BookOpen className="w-6 h-6 text-blue-600" />
//               </div>
//               <h4 className="font-semibold mb-2">Create Content</h4>
//               <p className="text-sm text-gray-600">Design and upload your course materials</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <Users className="w-6 h-6 text-blue-600" />
//               </div>
//               <h4 className="font-semibold mb-2">Reach Students</h4>
//               <p className="text-sm text-gray-600">Connect with learners worldwide</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <TrendingUp className="w-6 h-6 text-blue-600" />
//               </div>
//               <h4 className="font-semibold mb-2">Earn Revenue</h4>
//               <p className="text-sm text-gray-600">Monetize your expertise</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
}
