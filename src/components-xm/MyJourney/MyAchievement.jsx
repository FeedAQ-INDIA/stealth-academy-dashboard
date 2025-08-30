import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/zustland/store";
import axiosConn from "@/axioscon";
import { CourseCard } from "../Modules";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

export default function MyAchievement() {
  // Simulate no achievements

  const { userDetail } = useAuthStore();

  const [completedCourseList, setCompletedCourseList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiQuery, setApiQuery] = useState({
    limit: limit,
    offset: offset,
    getThisData: {
      datasource: "Course",
      attributes: [],
      include: [
        {
          datasource: "UserCourseEnrollment",
          as: "enrollments",
          where: {
            enrollmentStatus: "COMPLETED",
            userId: userDetail.id,
          },
          required: true,
        },
      ],
    },
  });

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  const fetchCompletedCourses = () => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
      .then((res) => {
        console.log(res.data.data?.results);
        setTotalCount(res.data.data.totalCount);
        setOffset(res.data.data.offset);
        setLimit(res.data.data.limit);
        setCompletedCourseList(res.data.data?.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="space-y-4">
      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px] w-full">
            <div className="text-center">
              <LoaderOne />
              <p className="mt-4 text-gray-600">Loading your achievements...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Courses Grid/List */}
            <div
              className={`gap-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 `}
            >
              {completedCourseList?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Empty State */}
            {completedCourseList?.length === 0 && !loading && (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    'No Achievements Yet'
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    You haven’t completed any courses or earned any certificates
                    yet. Start learning to see your achievements here!
                  </p>
                  <Button
                    onClick={() => navigate("/explore")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Explore Courses
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {completedCourseList.length > 0 && (
              <Card className="border-0 shadow-sm mt-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {offset + 1} to{" "}
                      {Math.min(offset + limit, totalCount)} of {totalCount}{" "}
                      course{totalCount !== 1 ? "s" : ""}
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

  // ...existing code...
}
