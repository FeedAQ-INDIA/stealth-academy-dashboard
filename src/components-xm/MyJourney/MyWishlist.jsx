import React, { useEffect, useState } from "react";
import { 
  Car, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Heart, 
  HeartOff,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Star,
  Clock,
  DollarSign,
  ShoppingCart,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import axiosConn from "@/axioscon.js";
import { CourseCard } from "@/components-xm/Modules/CourseCard.jsx";
import Header from "@/components-xm/Header/Header.jsx";
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
import { LoaderOne } from "@/components/ui/loader.jsx";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/hooks/use-toast";
import { useAuthStore } from "@/zustland/store.js";

export function MyWishlist() {
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCourses, setSelectedCourses] = useState(new Set());

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
    let orderClause = [];
    switch (value) {
      case 'title':
        orderClause = [["courseTitle", "ASC"]];
        break;
      case 'recent':
        orderClause = [["createdAt", "DESC"]];
        break;
      case 'price':
        orderClause = [["coursePrice", "ASC"]];
        break;
      default:
        orderClause = [["createdAt", "DESC"]];
    }
    
    updateApiQuery("Course", {
      order: orderClause,
    });
  };

  const removeFromWishlist = async (courseId) => {
    try {
      // API call to remove from wishlist
      // await axiosConn.delete(`/wishlist/${courseId}`);
      setCourseList(prev => prev.filter(course => course.id !== courseId));
      toast({
        title: "Removed from wishlist",
        description: "Course has been removed from your wishlist.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove course from wishlist.",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (courseId) => {
    try {
      // API call to add to cart
      // await axiosConn.post(`/cart`, { courseId });
      toast({
        title: "Added to cart",
        description: "Course has been added to your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add course to cart.",
        variant: "destructive",
      });
    }
  };

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const removeSelectedFromWishlist = async () => {
    try {
      // Remove all selected courses
      for (const courseId of selectedCourses) {
        await removeFromWishlist(courseId);
      }
      setSelectedCourses(new Set());
    } catch (error) {
      console.error(error);
    }
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      {/* <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            My Wishlist
          </h2>
          <p className="text-gray-600 mt-1">
            {totalCount > 0 ? `${totalCount} course${totalCount !== 1 ? 's' : ''} saved for later` : 'Your wishlist is empty'}
          </p>
        </div>
        
         {selectedCourses.size > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={removeSelectedFromWishlist}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Selected ({selectedCourses.size})
            </Button>
          </div>
        )}
      </div> */}

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search wishlist..."
                value={exploreCourseText}
                onChange={(e) => {
                  setExploreCourseText(e.target.value);
                  handleSearchChange(e.target.value);
                }}
                className="pl-10 border-gray-200 focus:border-red-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="price">Price Low to High</SelectItem>
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
        </CardContent>
      </Card>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px] w-full">
            <div className="text-center">
              <LoaderOne />
              <p className="mt-4 text-gray-600">Loading your wishlist...</p>
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
                <WishlistCourseCard 
                  key={course.id} 
                  course={course} 
                  viewMode={viewMode}
                  isSelected={selectedCourses.has(course.id)}
                  onToggleSelect={() => toggleCourseSelection(course.id)}
                  onRemoveFromWishlist={() => removeFromWishlist(course.id)}
                  onAddToCart={() => addToCart(course.id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {courseList?.length === 0 && !loading && (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exploreCourseText ? 'No courses found' : 'Your Wishlist is Empty'}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    {exploreCourseText 
                      ? 'Try adjusting your search terms.'
                      : 'Save interesting courses to your wishlist to view them later. Start exploring our course catalog!'
                    }
                  </p>
                  <Button 
                    onClick={() => navigate('/explore')}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
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
                            className="hover:bg-red-50"
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
                            className="hover:bg-red-50"
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
}

// Enhanced Wishlist Course Card Component
function WishlistCourseCard({ 
  course, 
  viewMode, 
  isSelected, 
  onToggleSelect, 
  onRemoveFromWishlist, 
  onAddToCart 
}) {
  const { userDetail } = useAuthStore();
  const navigate = useNavigate();

  if (viewMode === 'list') {
    return (
      <Card className="group relative overflow-hidden border shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Selection Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
            </div>

            {/* Course Image */}
            <div className="relative w-32 h-20 flex-shrink-0">
              <img
                src={course.courseImageUrl}
                className="w-full h-full object-cover rounded-lg"
                alt={course.courseTitle}
              />
            </div>

            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-1 mb-2">
                {course.courseTitle?.toUpperCase()}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {course.courseLevel && <Badge variant="outline">{course.courseLevel}</Badge>}
                {course.courseDuration && (
                  <Badge variant="outline">
                    <Clock size={12} className="mr-1" />
                    {`${Math.floor(+course.courseDuration / 60)}hr ${+course.courseDuration % 60}min`}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-green-600">
                  {course.coursePrice ? `$${course.coursePrice}` : 'Free'}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAddToCart}
                    className="hover:bg-blue-50"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onRemoveFromWishlist}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <HeartOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden border shadow-md hover:shadow-xl transition-all hover:-translate-y-1 p-4">
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
      </div>

      {/* Remove from Wishlist Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemoveFromWishlist}
        className="absolute top-2 right-2 z-10 p-2 h-8 w-8 text-red-500 hover:bg-red-50"
      >
        <HeartOff className="h-4 w-4" />
      </Button>

      <CardHeader className="p-0">
        <div className="overflow-x-auto mb-2">
          <div className="flex gap-2">
            {course.courseSource && <Badge variant="outline">{course.courseSource}</Badge>}
            {course.courseLevel && <Badge variant="outline">{course.courseLevel}</Badge>}
            {course.courseDuration && (
              <Badge variant="outline">
                <Clock size={14} className="mr-1 inline" />
                {`${Math.floor(+course.courseDuration / 60)}hr ${+course.courseDuration % 60}min`}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative mb-2">
          <img
            src={course.courseImageUrl}
            className="w-full h-40 object-cover rounded-lg"
            alt={course.courseTitle}
          />
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {course.coursePrice ? `$${course.coursePrice}` : 'Free'}
            </Badge>
          </div>
        </div>

        <CardTitle className="text-md font-semibold line-clamp-2">
          {course.courseTitle?.toUpperCase()}
        </CardTitle>
      </CardHeader>

      <div className="mt-4 space-y-2">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/explore/${course.courseId}`)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
