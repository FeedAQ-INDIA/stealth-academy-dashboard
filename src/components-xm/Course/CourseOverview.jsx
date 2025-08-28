import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge.jsx";
import {
  AlertCircle,
  Check,
  Terminal,
  Video,
  Clock,
  BookOpen,
  User,
  Award,
  ChevronRight,
  Star,
  Users,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import axiosConn from "@/axioscon.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.jsx";
import { Link, useParams } from "react-router-dom";
import { toast } from "@/components/hooks/use-toast.js";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import { useAuthStore } from "@/zustland/store.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Loader2 } from "lucide-react";

function CourseOverview() {
  const { CourseId } = useParams();
  const { courseList, userCourseContentProgress, userCourseEnrollment } =
    useCourse();
  const { userDetail } = useAuthStore();

  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  // Animation state
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  // Unenroll (disroll) state
  const [unenrollLoading, setUnenrollLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
    // Simulate loading completion
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const [notesList, setNotesList] = useState([]);

  const fetchNotes = () => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", {
        limit: 10,
        offset: 0,
        getThisData: {
          datasource: "Notes",
          attributes: [],
          where: { courseId: CourseId, userId: userDetail?.userId },
        },
      })
      .then((res) => {
        console.log(res.data);
        const notes = res.data.data?.results;
        setNotesList(notes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [triggerNotesRefresh, setTriggerNotesRefresh] = useState(false);

  const handleNotesSave = () => {
    setTriggerNotesRefresh((prev) => !prev);
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Enroll user in course
  const handleEnrollment = async () => {
    if (!userDetail?.userId || !CourseId) {
      toast({
        title: "Error",
        description: "User or course information is missing",
        variant: "destructive",
      });
      return;
    }

    setEnrollmentLoading(true);
    try {
      const response = await axiosConn.post(
        import.meta.env.VITE_API_URL + "/userCourseEnrollment",
        {
          courseId: CourseId,
        }
      );

      if (response.data.status === 200) {
        toast({
          title: "Success",
          description: "Successfully enrolled in the course!",
          variant: "default",
        });

        // Refresh enrollment data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(response.data.message || "Enrollment failed");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast({
        title: "Enrollment Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to enroll in the course",
        variant: "destructive",
      });
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Unenroll (disroll) user from course
  const handleUnenroll = async () => {
    if (!userDetail?.userId || !CourseId) {
      toast({
        title: "Error",
        description: "User or course information is missing",
        variant: "destructive",
      });
      setDeleteConfirmation("");
      return;
    }
    setUnenrollLoading(true);
    try {
      const response = await axiosConn.post(
        import.meta.env.VITE_API_URL + "/userCourseDisrollment",
        {
          courseId: CourseId,
        }
      );
      if (response.data.status === 200) {
        toast({
          title: "Success",
          description: "Successfully unenrolled from the course!",
          variant: "default",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(response.data.message || "Unenrollment failed");
      }
    } catch (error) {
      console.error("Unenrollment error:", error);
      toast({
        title: "Unenrollment Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to unenroll from the course",
        variant: "destructive",
      });
    } finally {
      setUnenrollLoading(false);
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!courseList?.courseTopic) return 0;

    const totalContent = courseList.courseTopic.reduce(
      (acc, topic) => acc + (topic.courseTopicContent?.length || 0),
      0
    );

    const completedContent =
      userCourseContentProgress?.filter(
        (log) => log.courseId == CourseId && log.progressStatus == "COMPLETED"
      ).length || 0;

    return totalContent > 0
      ? Math.round((completedContent / totalContent) * 100)
      : 0;
  };

  // Get enrollment status
  const getEnrollmentStatus = () => {
    if (!userCourseEnrollment || userCourseEnrollment.length === 0) {
      return {
        status: "NOT_ENROLLED",
        displayText: "NOT ENROLLED",
        color: "gray",
      };
    }

    // Find enrollment record for the current course
    const enrollment = userCourseEnrollment.find(
      (enrollment) => enrollment.courseId == CourseId
    );

    // If no enrollment found for this specific course, user is not enrolled
    if (!enrollment) {
      return {
        status: "NOT_ENROLLED",
        displayText: "NOT ENROLLED",
        color: "gray",
      };
    }
    const statusConfig = {
      NOT_STARTED: { displayText: "NOT STARTED", color: "orange" },
      ENROLLED: { displayText: "ENROLLED", color: "green" },
      IN_PROGRESS: { displayText: "IN PROGRESS", color: "blue" },
      PAUSED: { displayText: "PAUSED", color: "yellow" },
      COMPLETED: { displayText: "COMPLETED", color: "purple" },
      CERTIFIED: { displayText: "CERTIFIED", color: "gold" },
    };

    return {
      status: enrollment.enrollmentStatus,
      displayText:
        statusConfig[enrollment.enrollmentStatus]?.displayText ||
        enrollment.enrollmentStatus,
      color: statusConfig[enrollment.enrollmentStatus]?.color || "gray",
      enrollmentDate: enrollment.enrollmentDate,
      completionDate: enrollment.completionDate,
    };
  };

  const enrollmentInfo = getEnrollmentStatus();

  const progress = calculateProgress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-md px-4 transition-all duration-300">
        <div className="animate-fade-in flex items-center gap-2">
          <SidebarTrigger className="-ml-1 hover:bg-gray-100 rounded-md transition-colors" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[30ch] flex items-center gap-2">
                Overview
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto sm:flex-initial">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>{progress}% Complete</span>
            </div>
          </div>
        </div>
      </header>

      <div className=" p-3 animate-fade-in">
        <Card className="rounded-sm bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardHeader className=" ">
       

            <div className="flex flex-col lg:flex-row gap-4 w-full items-start lg:items-center">
              <div className="flex-1">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-tight">
                  {courseList?.courseTitle}
                </CardTitle>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 min-w-fit">
                    {progress}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                {/* Show status badge only when user is enrolled */}
                {enrollmentInfo.status !== "NOT_ENROLLED" && (
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg  font-semibold text-sm ${
                        enrollmentInfo.color === "green"
                          ? "bg-green-100 text-green-800 animate-bounce"
                          : enrollmentInfo.color === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : enrollmentInfo.color === "orange"
                          ? "bg-orange-100 text-orange-800"
                          : enrollmentInfo.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : enrollmentInfo.color === "purple"
                          ? "bg-purple-100 text-purple-800"
                          : enrollmentInfo.color === "gold"
                          ? "bg-yellow-100 text-yellow-900"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {enrollmentInfo.status === "ENROLLED" ||
                      enrollmentInfo.status === "COMPLETED" ||
                      enrollmentInfo.status === "CERTIFIED" ? (
                        <Check className="h-4 w-4" />
                      ) : null}
                      {enrollmentInfo.displayText}
                    </div>
                    <p className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 hover:underline transition-colors mt-1">
                      {enrollmentInfo.enrollmentDate &&
                        `Enrolled: ${new Date(
                          enrollmentInfo.enrollmentDate
                        ).toLocaleDateString()}`}
                      {enrollmentInfo.completionDate &&
                        ` | Completed: ${new Date(
                          enrollmentInfo.completionDate
                        ).toLocaleDateString()}`}
                    </p>
                  </div>
                )}

                {/* Enroll Button - only show when user is not enrolled */}
                {enrollmentInfo.status === "NOT_ENROLLED" && (
                  <Button
                    onClick={handleEnrollment}
                    disabled={enrollmentLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrollmentLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Enrolling...
                      </>
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Phone Number Alert */}
        {!userDetail?.number && (
          <section className="my-4 animate-slide-in">
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 rounded-sm"
            >
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="flex-1">
                  <AlertTitle className="text-red-800 font-semibold">
                    Phone number missing
                  </AlertTitle>
                  <AlertDescription className="text-red-700">
                    Please update your phone number to receive updates regarding
                    this {courseList?.courseType}
                  </AlertDescription>
                </div>
                <div>
                  <Link to="/account-settings/profile">
                    <Button
                      className="bg-red-600 hover:bg-red-700 transition-colors"
                      size="sm"
                    >
                      Update Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Alert>
          </section>
        )}

        {/* Description Section */}
        <section className="my-4 animate-slide-in">
          <Card className="border-0 bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-sm">
            <CardHeader className=" ">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap break-words text-gray-700 leading-relaxed">
                  {courseList?.courseDescription}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Course Structure */}
        <section className="my-4 animate-slide-in">
          <Card className="border-0 bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-sm">
            <CardHeader className=" ">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-purple-600" />
                Course Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseList?.courseContent?.map((topic, index) => (
                  <div
                    key={topic?.courseContentId}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Accordion type="single" collapsible>
                      <AccordionItem
                        value="item-1"
                        className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
                      >
                        <AccordionTrigger className="flex gap-3 items-center px-4 py-3 hover:bg-gray-50 transition-colors [&>svg]:h-5 [&>svg]:w-5">
                          <div className="flex items-center gap-3 flex-1">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                              {(() => {
                                const totalSeconds =
                                  +topic?.courseContentDuration || 0;
                                const hours = Math.floor(totalSeconds / 3600);
                                const minutes = Math.floor(
                                  (totalSeconds % 3600) / 60
                                );
                                const seconds = totalSeconds % 60;
                                const pad = (n) => String(n).padStart(2, "0");
                                return `${pad(hours)}:${pad(minutes)}:${pad(
                                  seconds
                                )}`;
                              })()}
                            </Badge>
                            <span className="font-semibold text-gray-800 text-left">
                              {topic?.courseContentTitle}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3 bg-gray-50">
                          <p className="text-gray-700 mb-4">
                            {topic?.courseContentDescription}
                          </p>
                          <div className="space-y-2">
                            {topic?.courseContent?.map(
                              (content, contentIndex) => (
                                <div
                                  key={content?.courseContentId}
                                  className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-blue-200 transition-all duration-200 hover:shadow-sm group"
                                >
                                  <div className="flex items-center gap-2">
                                    {userCourseContentProgress?.filter(
                                      (log) =>
                                        log.courseId == CourseId &&
                                        log?.courseContentId ==
                                          content?.courseContentId &&
                                        log.progressStatus == "COMPLETED"
                                    )?.length > 0 ? (
                                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                                        <Check className="h-4 w-4 text-green-600" />
                                      </div>
                                    ) : (
                                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <PlayCircle className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                                      </div>
                                    )}
                                  </div>

                                  <Badge variant="outline" className="text-xs">
                                    {(() => {
                                      const totalMinutes =
                                        +content?.courseContentDuration || 0;
                                      const hours = Math.floor(
                                        totalMinutes / 60
                                      );
                                      const minutes = totalMinutes % 60;
                                      return `${String(hours).padStart(
                                        2,
                                        "0"
                                      )}:${String(minutes).padStart(2, "0")}`;
                                    })()}
                                  </Badge>

                                  <Video className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                                    {content?.courseContentTitle}
                                  </span>

                                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-blue-600 transition-colors" />
                                </div>
                              )
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="flex justify-end my-4">
          {enrollmentInfo.status !== "NOT_ENROLLED" ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="hover:bg-red-600 transition-colors rounded-lg px-6"
                >
                  LEAVE COURSE
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-800">
                    Are You Sure You Want To Leave The Course?
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Type in{" "}
                    <span className="font-semibold text-red-600 italic">
                      "{courseList?.courseTitle}"
                    </span>{" "}
                    in the input field below and click confirm to leave the
                    course.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-y-2">
                  <Input
                    placeholder="Type course title to confirm..."
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
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
                    onClick={handleUnenroll}
                    disabled={
                      unenrollLoading ||
                      courseList?.courseTitle?.trim() !==
                        deleteConfirmation?.trim()
                    }
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed  "
                  >
                    {unenrollLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Leaving Course...
                      </>
                    ) : (
                      "Leave Course"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }
      `}</style>
    </>
  );
}

export default CourseOverview;
