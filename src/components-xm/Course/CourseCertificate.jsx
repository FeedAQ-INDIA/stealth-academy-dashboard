import { useAuthStore } from "@/zustland/store";
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.jsx";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Check,
  CircleArrowLeft,
  CircleArrowRight,
  Clock,
  FileText,
  CheckCircle2,
  Undo2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import axiosConn from "@/axioscon.js";
import { toast } from "@/components/hooks/use-toast.js";
/**
 * CourseCertificate Component
 * Displays a certificate of completion for a course.
 * Props:
 *   - courseTitle: string
 *   - userName: string
 *   - date: string (optional)
 */
const CourseCertificate = ({ courseTitle, userName, date }) => {
  const { userDetail } = useAuthStore();

  const { CourseId, CourseCertificateId } = useParams();
  const {
    userCourseEnrollment,
    userCourseContentProgress,
    fetchUserCourseContentProgress,
    fetchUserCourseEnrollment,
    courseList,
  } = useCourse();

   const saveUserEnrollmentData = () => {
    if (!courseList?.courseId || !CourseCertificateId) return;

    axiosConn
      .post(import.meta.env.VITE_API_URL + "/saveUserCourseContentProgress", {
        courseId: courseList.courseId,
        courseContentId: CourseCertificateId,
        logStatus: "COMPLETED",
      })
      .then((res) => {
        console.log(res.data);
        toast({
          title: "Progress saved!",
          description: "Content marked as completed successfully.",
        });
        fetchUserCourseContentProgress(userDetail.userId);
        fetchUserCourseEnrollment(userDetail.userId);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to update progress. Please try again.",
          variant: "destructive",
        });
      });
  };

  const deleteUserEnrollmentData = () => {
    if (!courseList?.courseId || !CourseCertificateId) return;

    axiosConn
      .post(import.meta.env.VITE_API_URL + "/deleteUserCourseContentProgress", {
        courseId: courseList.courseId,
        courseContentId: CourseCertificateId,
      })
      .then((res) => {
        console.log(res.data);
        toast({
          title: "Progress updated",
          description: "Content completion status removed.",
        });
        fetchUserCourseContentProgress(userDetail.userId);
        fetchUserCourseEnrollment(userDetail.userId);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to update progress. Please try again.",
          variant: "destructive",
        });
      });
  };

const isCompleted = userCourseContentProgress?.some(
  (log) =>
    String(log.courseId) === String(CourseId) &&
    String(log.courseContentId) === String(CourseCertificateId) &&
    log.progressStatus === "COMPLETED"
);


    // Check enrollment access
  const isUserEnrolled =
    userCourseEnrollment && userCourseEnrollment.length > 0;
  const enrollmentStatus = userCourseEnrollment?.[0]?.enrollmentStatus;
  const hasContentAccess =
    isUserEnrolled &&
    ["ENROLLED", "IN_PROGRESS", "COMPLETED", "CERTIFIED"].includes(
      enrollmentStatus
    );

  const today = date || new Date().toLocaleDateString();
  return (
    <>
    <div className=" p-3 space-y-4">
     {/* Enhanced Header Card */}
          <Card className="border-0  bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm  shadow-md  overflow-hidden relative">
            <CardHeader className=" ">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                    {  "Course Certificate"}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deleteUserEnrollmentData}
                      className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      <Undo2 size={16} />
                      <span className="hidden sm:inline">
                        Mark as Incomplete
                      </span>
                      <span className="sm:hidden">Incomplete</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={saveUserEnrollmentData}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 size={16} />
                      <span className="hidden sm:inline">Mark as Complete</span>
                      <span className="sm:hidden">Complete</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

    <Card className="max-w-2xl mx-auto my-12 border-2 border-dashed border-primary bg-gradient-to-br from-white via-blue-50 to-slate-100 shadow-xl rounded-2xl">
      <CardContent className="p-10">
        <div className="flex flex-col items-center gap-2 mb-6">
          <Badge className="text-lg px-4 py-2 bg-primary/90 text-white rounded-full mb-2">Official Certificate</Badge>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide mb-1">Certificate of Completion</h2>
          <p className="text-gray-600 text-base">This is to certify that</p>
        </div>
        <div className="text-center mb-8">
          <span className="block text-4xl font-bold text-blue-700 mb-2 drop-shadow-sm">{userName}</span>
          <span className="text-gray-700 text-lg">has successfully completed the course</span>
          <span className="block text-2xl font-semibold text-green-700 mt-3">{courseTitle}</span>
        </div>
        <div className="flex justify-between items-end mt-10">
          <div className="text-left">
            <span className="block text-gray-500 text-xs">Date</span>
            <span className="block text-gray-800 font-medium text-base">{today}</span>
          </div>
          <div className="text-right">
            <span className="block text-gray-500 text-xs">Signature</span>
            <span className="block text-gray-800 font-medium text-base tracking-widest">__________________</span>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
</>  );
};

export default CourseCertificate;
