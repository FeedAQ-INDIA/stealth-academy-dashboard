
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ContentLoader } from "@/components/ui/loading-components";




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
    <div className="p-4">

            {/* Hero Section with Enhanced Gradient */}
            <div className="relative overflow-hidden">
              <Card className="w-full rounded-lg border-0 bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800  rounded-sm text-white shadow-2xl  ">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>
                
                <CardHeader className="relative z-10">
                  {/* <div className="flex items-center justify-center mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-300 animate-float" />
                  </div> */}
                  <CardTitle className="text-center tracking-wide text-2xl md:text-3xl  font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                    What would you like to learn today?
                  </CardTitle>
 
                </CardHeader>

              </Card>
            </div>

    <div className=" space-y-4">
       {/* Content */}
      <div className="min-h-[400px] mt-6">
        {loading ? (
          <ContentLoader message="Loading your courses..." size="lg" className="min-h-[400px]" />
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
    </div></div>
  );

   
}
