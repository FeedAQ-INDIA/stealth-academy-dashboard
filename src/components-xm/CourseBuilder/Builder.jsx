import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/hooks/use-toast.js";
import byoc1 from "@/assets/byoc_1.png";
import { useOrganizationStore, useAuthStore } from "@/zustland/store";
import { useNavigate } from "react-router-dom";
import { LoaderOne } from "@/components/ui/loader.jsx";
import axiosConn from "@/axioscon.js";
import {
  Grid3X3,
  List,
  BookOpen,
  Plus,
  Calendar,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

export default function Builder() {
  const [listLoading, setListLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [curateOpen, setCurateOpen] = useState(false);
  const [curateTitle, setCurateTitle] = useState("");
  const [curateDesc, setCurateDesc] = useState("");
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();

  // selectedOrganization: null means general profile, object means organization selected
  const { selectedOrganization } = useOrganizationStore();
  const { userDetail } = useAuthStore();

  const [apiQuery, setApiQuery] = useState({
    limit: 12,
    offset: 0,
    getThisData: {
      datasource: "CourseBuilder",
      attributes: [], 
     where: {
            userId: userDetail?.userId,
           },
    },
  });

  const fetchCourses = useCallback(() => {
    setListLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
      .then((res) => {
        setCourses(res.data.data?.results || []);
        setTotalCount(res.data.data?.totalCount || 0);
        setOffset(res.data.data?.offset || 0);
        setLimit(res.data.data?.limit || 12);
        setListLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setCourses([]);
        setListLoading(false);
      });
  }, [apiQuery]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Load courses for current org (or general profile)
  useEffect(() => {
    if (userDetail?.userId) {
      setApiQuery(prev => ({
        ...prev,
        limit: limit,
        offset: offset,
        getThisData: {
          ...prev.getThisData,
          where: {
            userId: userDetail.userId,
          },
        },
      }));
    }
  }, [selectedOrganization, userDetail, limit, offset]);

  const handleDelete = async (courseBuilderId) => {
    try {
      await axiosConn.delete(`${import.meta.env.VITE_API_URL}/courseBuilder/${courseBuilderId}`);
      fetchCourses();
      toast({ title: "Course deleted", description: "Course removed successfully." });
    } catch (error) {
      console.error("Delete error:", error);
      toast({ title: "Delete failed", description: "Failed to delete course.", variant: "destructive" });
    }
  };

  const handlePublish = async (courseBuilderId) => {
    try {
      await axiosConn.patch(`${import.meta.env.VITE_API_URL}/courseBuilder/${courseBuilderId}/publish`);
      fetchCourses();
      toast({ title: "Course published", description: "Your course is now live." });
    } catch (error) {
      console.error("Publish error:", error);
      toast({ title: "Publish failed", description: "Failed to publish course.", variant: "destructive" });
    }
  };

  const handleUnpublish = async (courseBuilderId) => {
    try {
      await axiosConn.patch(`${import.meta.env.VITE_API_URL}/courseBuilder/${courseBuilderId}/unpublish`);
      fetchCourses();
      toast({ title: "Course moved to drafts", description: "Unpublished successfully." });
    } catch (error) {
      console.error("Unpublish error:", error);
      toast({ title: "Unpublish failed", description: "Failed to unpublish course.", variant: "destructive" });
    }
  };

  const handleCurateCreate = async () => {
    try {
      if (!curateTitle.trim()) {
        toast({ title: "Title required", description: "Please provide a title.", variant: "destructive" });
        return;
      }
      
      const courseBuilderData = {
        courseTitle: curateTitle.trim(),
        courseDescription: curateDesc.trim(),
      };
      
      await axiosConn.post(`${import.meta.env.VITE_API_URL}/courseBuilder`, {
        userId: userDetail?.userId,
        orgId: selectedOrganization?.orgId || null,
        status: "DRAFT",
        courseBuilderData: courseBuilderData,
      });
      
      fetchCourses();
      setCurateOpen(false);
      setCurateTitle("");
      setCurateDesc("");
      toast({ 
        title: "Course created", 
        description: "Your course draft has been created successfully."
      });
    } catch (error) {
      console.error("Create error:", error);
      toast({ title: "Failed to create course", description: "Please try again.", variant: "destructive" });
    }
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Course Studio</h1>
          <p className="text-muted-foreground">Create and manage your courses with ease</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* View Mode Toggle and Create Button */}
          <div className="flex gap-2">
            <div className="flex border rounded-lg p-1 bg-muted/50">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="px-3 py-1"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="px-3 py-1"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Create Course Button */}
            <Sheet open={curateOpen} onOpenChange={setCurateOpen}>
              <SheetTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Create a new course</SheetTitle>
                  <SheetDescription>Add a title and optional description for your new course.</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="create-title" className="block text-sm font-medium mb-1">Title *</label>
                    <Input
                      id="create-title"
                      placeholder="e.g., Mastering React in 7 Days"
                      value={curateTitle}
                      onChange={(e) => setCurateTitle(e.target.value)}
                      minLength={3}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="create-desc" className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      id="create-desc"
                      placeholder="What will learners achieve? Who is this for? Prerequisites?"
                      value={curateDesc}
                      onChange={(e) => setCurateDesc(e.target.value)}
                      rows={4}
                      maxLength={500}
                    />
                    <div className="text-xs text-muted-foreground mt-1">{curateDesc.length}/500 characters</div>
                  </div>
                </div>
                <SheetFooter className="mt-6">
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                  <Button onClick={handleCurateCreate} disabled={!curateTitle.trim()}>Create Course</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {listLoading ? (
          <div className="flex items-center justify-center min-h-[400px] w-full">
            <div className="text-center">
              <LoaderOne />
              <p className="mt-4 text-gray-600">Loading your courses...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Courses Grid/List */}
            {courses.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start Creating Courses
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    You haven&apos;t created any courses yet. Click &quot;Create Course&quot; to get started and share your knowledge with the world.
                  </p>
                  <Button 
                    onClick={() => setCurateOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`gap-6 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'flex flex-col space-y-4'
              }`}>
                {courses.map((course) => (
                  <Card key={course.courseBuilderId} className={`border-0 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                    viewMode === 'list' ? 'flex-row p-4' : 'p-4'
                  }`}>
                    <CardContent className={`p-0 ${viewMode === 'list' ? 'flex gap-4 items-center' : 'space-y-3'}`}>
                      {/* Course Image */}
                      <div className={`${viewMode === 'list' ? 'w-20 h-20' : 'w-full h-40'} relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50`}>
                        <img 
                          src={course.courseBuilderData?.courseImageUrl || byoc1} 
                          alt={course.courseBuilderData?.courseTitle || 'Course'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                            (course.status || "DRAFT") === "PUBLISHED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {(course.status || "DRAFT").charAt(0).toUpperCase() + (course.status || "DRAFT").slice(1).toLowerCase()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Course Details */}
                      <div className={`${viewMode === 'list' ? 'flex-1' : 'space-y-3'}`}>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg line-clamp-2" title={course.courseBuilderData?.courseTitle || 'Untitled Course'}>
                            {course.courseBuilderData?.courseTitle || 'Untitled Course'}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {course.courseBuilderData?.courseDescription || "No description available"}
                          </p>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Updated {formatDate(course.course_builder_updated_at)}</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {(course.status || "DRAFT") === "DRAFT" ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => navigate(`/course-builder/${course.courseBuilderId}`)}
                                className="flex-1"
                              >
                                <Edit className="mr-1 h-3 w-3" />
                                Continue
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handlePublish(course.courseBuilderId)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Publish
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => navigate(`/course/${course.publishedCourseId || course.courseBuilderId}`)}
                                className="flex-1"
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                onClick={() => handleUnpublish(course.courseBuilderId)}
                                className="flex-1"
                              >
                                Unpublish
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(course.courseBuilderId)}
                            className="px-3"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {courses.length > 0 && (
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
                              const newOffset = Math.max(offset - limit, 0);
                              setOffset(newOffset);
                              setApiQuery((prevQuery) => ({
                                ...prevQuery,
                                offset: newOffset,
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
                              const newOffset = offset + limit < totalCount ? offset + limit : offset;
                              setOffset(newOffset);
                              setApiQuery((prevQuery) => ({
                                ...prevQuery,
                                offset: newOffset,
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
}