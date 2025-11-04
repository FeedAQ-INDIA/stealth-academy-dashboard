import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/hooks/use-toast.js";
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
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  Clock,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContentLoader } from "@/components/ui/loading-components";

export default function Builder() {
  const [listLoading, setListLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [curateOpen, setCurateOpen] = useState(false);
  const [curateTitle, setCurateTitle] = useState("");
  const [curateDesc, setCurateDesc] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);
  const [unpublishConfirmation, setUnpublishConfirmation] = useState("");
  const [selectedCourseForUnpublish, setSelectedCourseForUnpublish] =
    useState(null);
  const [unpublishLoading, setUnpublishLoading] = useState(false);
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
      setApiQuery((prev) => ({
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
      await axiosConn.delete(
        `${import.meta.env.VITE_API_URL}/courseBuilder/${courseBuilderId}`
      );
      fetchCourses();
      toast({
        title: "Course deleted",
        description: "Course removed successfully.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete course.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmUnpublish = async () => {
    if (!selectedCourseForUnpublish) return;

    setUnpublishLoading(true);
    try {
      const response = await axiosConn.post(
        `${import.meta.env.VITE_API_URL}/deleteCourse`,
        {
          courseId: selectedCourseForUnpublish.publishedCourseId,
        }
      );

      if (response.data.status === 200) {
        fetchCourses();
        setUnpublishDialogOpen(false);
        setUnpublishConfirmation("");
        setSelectedCourseForUnpublish(null);
        toast({
          title: "Course deleted successfully",
          description: "The course has been permanently removed.",
        });
      } else {
        throw new Error(response.data.message || "Course deletion failed");
      }
    } catch (error) {
      console.error("Delete course error:", error);
      toast({
        title: "Delete failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete course.",
        variant: "destructive",
      });
    } finally {
      setUnpublishLoading(false);
    }
  };

  const handleOpenUnpublishDialog = (course) => {
    setSelectedCourseForUnpublish(course);
    setUnpublishDialogOpen(true);
    setUnpublishConfirmation("");
  };

  const handleCurateCreate = async () => {
    try {
      if (!curateTitle.trim()) {
        toast({
          title: "Title required",
          description: "Please provide a title.",
          variant: "destructive",
        });
        return;
      }

      await axiosConn.post(`${import.meta.env.VITE_API_URL}/registerBuilder`, {
        orgId: selectedOrganization?.orgId || null,
        title: curateTitle.trim(),
        description: curateDesc.trim(),
      });

      fetchCourses();
      setCurateOpen(false);
      setCurateTitle("");
      setCurateDesc("");
      toast({
        title: "Course created",
        description: "Your course draft has been created successfully.",
      });
    } catch (error) {
      console.error("Create error:", error);
      toast({
        title: "Failed to create course",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Hero Section with Enhanced Gradient */}
      <div className="relative overflow-hidden">
        <Card className="w-full rounded-lg border-0 bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800  rounded-2xl text-white shadow-2xl  ">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <CardHeader className="relative z-10  ">
            {/* <div className="flex items-center justify-center mb-2">
                          <Sparkles className="w-6 h-6 text-yellow-300 animate-float" />
                        </div> */}
            <CardTitle className="text-center tracking-wide text-2xl md:text-3xl  font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Curate Your Own Course
            </CardTitle>
            <p className="text-center text-white/90 mt-2 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Create and manage your courses with ease
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex  flex-row gap-3">
        {/* Create Course Button */}
        <Sheet open={curateOpen} onOpenChange={setCurateOpen}>
          <SheetTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="mr-1 h-4 w-4" />
              <span className="tracking-wide">CREATE COURSE</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Create a new course</SheetTitle>
              <SheetDescription>
                Add a title and optional description for your new course.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="create-title"
                  className="block text-sm font-medium mb-1"
                >
                  Title *
                </label>
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
                <label
                  htmlFor="create-desc"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="create-desc"
                  placeholder="What will learners achieve? Who is this for? Prerequisites?"
                  value={curateDesc}
                  onChange={(e) => setCurateDesc(e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {curateDesc.length}/500 characters
                </div>
              </div>
            </div>
            <SheetFooter className="mt-6">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button
                onClick={handleCurateCreate}
                disabled={!curateTitle.trim()}
              >
                Create Course
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {listLoading ? (
          <ContentLoader message="Loading your courses..." size="lg" className="min-h-[400px]" />

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
                    You haven&apos;t created any courses yet. Click &quot;Create
                    Course&quot; to get started and share your knowledge with
                    the world.
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
              <div
                className={`gap-6 ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "flex flex-col space-y-4"
                }`}
              >
                {courses.map((course) => {
                  const contentCount = course.courseBuilderData?.courseContent?.length || 0;
                  const totalDuration = course.courseBuilderData?.courseContent?.reduce(
                    (acc, content) => acc + (content.courseContentDuration || 0),
                    0
                  ) || 0;
                  
                  const formatDuration = (totalSeconds) => {
                    if (!totalSeconds || totalSeconds === 0) return null;
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    if (hours > 0) {
                      return `${hours}h ${minutes}m`;
                    }
                    return `${minutes}m`;
                  };

                  return (
                  <Card
                    key={course.courseBuilderId}
                    className="bg-gradient-to-br from-white to-orange-50/30 border-2 border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-xl rounded-lg group relative overflow-hidden transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Decorative gradient top bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
                    
                    <CardHeader className="pb-3 pt-5">
                      {/* Course Image */}
                      <div className="relative mb-4 -mx-6 -mt-5">
                        {course.courseBuilderData?.courseImageUrl ? (
                          <img
                            src={course.courseBuilderData.courseImageUrl}
                            className="w-full h-48 object-cover"
                            alt={course.courseBuilderData?.courseTitle || "Course"}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-48 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center"
                          style={{ display: course.courseBuilderData?.courseImageUrl ? 'none' : 'flex' }}
                        >
                          <BookOpen className="w-20 h-20 text-white/30" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Status badge overlay */}
                        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
                          <Badge
                            className={`font-medium px-3 py-1 shadow-md ${
                              (course.status || "DRAFT") === "PUBLISHED"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {(course.status || "DRAFT").charAt(0).toUpperCase() +
                              (course.status || "DRAFT").slice(1).toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-2 px-3">
                      {/* Course title */}
                      <div className="flex items-start gap-3 mb-3">
                        <CardTitle className="text-lg font-bold line-clamp-2 text-gray-900 flex-1 leading-tight">
                          {course.courseBuilderData?.courseTitle || "Untitled Course"}
                        </CardTitle>
                      </div>

                      {/* Course description */}
                      {course.courseBuilderData?.courseDescription && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                          {course.courseBuilderData.courseDescription}
                        </p>
                      )}

                      {/* Course metadata */}
                      <div className="space-y-2">
                        {totalDuration > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                            <span className="font-medium">{formatDuration(totalDuration)}</span>
                          </div>
                        )}
                        
                        {contentCount > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <BookOpen className="h-4 w-4 text-orange-500 flex-shrink-0" />
                            <span>{contentCount} {contentCount === 1 ? 'item' : 'items'}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                          <span>Updated {formatDate(course.course_builder_updated_at)}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="py-3 px-3">
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/course-builder/${course.courseBuilderId}`
                          )
                        }
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        EDIT COURSE
                      </Button>
                    </CardFooter>
                  </Card>
                );
                })}
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
                              const newOffset =
                                offset + limit < totalCount
                                  ? offset + limit
                                  : offset;
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

      {/* Unpublish Confirmation Dialog */}
      <Dialog open={unpublishDialogOpen} onOpenChange={setUnpublishDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Are You Sure You Want To Delete This Course?
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              This action cannot be undone. Type in{" "}
              <span className="font-semibold text-red-600 italic">
                &ldquo;
                {selectedCourseForUnpublish?.courseBuilderData?.courseTitle}
                &rdquo;
              </span>{" "}
              in the input field below and click confirm to permanently delete
              the course.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-y-2">
            <Input
              placeholder="Type course title to confirm deletion..."
              value={unpublishConfirmation}
              onChange={(e) => setUnpublishConfirmation(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <DialogFooter className="sm:justify-start gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleConfirmUnpublish}
              disabled={
                unpublishLoading ||
                selectedCourseForUnpublish?.courseBuilderData?.courseTitle?.trim() !==
                  unpublishConfirmation?.trim()
              }
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {unpublishLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting Course...
                </>
              ) : (
                "Delete Course"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
