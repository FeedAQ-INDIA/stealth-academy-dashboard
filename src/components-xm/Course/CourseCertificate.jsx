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
import React, { useEffect, useState, useRef } from "react";
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
  Download,
  Award,
  Shield,
  Star,
  Image as ImageIcon,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
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
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { CourseId, CourseCertificateId } = useParams();
  const {
    userCourseEnrollment,
    userCourseContentProgress,
    fetchUserCourseContentProgress,
    fetchUserCourseEnrollment,
    courseList,
  } = useCourse();

  // Generate unique certificate number
  const generateCertificateNumber = () => {
    const courseId = CourseId || '001';
    const userId = userDetail?.userId || '001';
    const year = new Date().getFullYear();
    return `CERT-${year}-${courseId.toString().padStart(3, '0')}-${userId.toString().padStart(4, '0')}`;
  };

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

  // Improved download functions
  const downloadCertificateAsImage = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const certificateElement = certificateRef.current;
      
      // Temporarily remove any blur effects and overlays
      const overlay = document.querySelector('.absolute.inset-0.z-10');
      const originalBlur = certificateElement.style.filter;
      
      if (overlay) overlay.style.display = 'none';
      certificateElement.style.filter = 'none';
      
      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Temporarily set fixed dimensions for download
      const originalStyle = certificateElement.style.cssText;
      certificateElement.style.width = '1056px';
      certificateElement.style.height = '792px';
      certificateElement.style.transform = 'scale(1)';
      
      // Get the exact dimensions
      const rect = { width: 1056, height: 792 };
      
      const canvas = await html2canvas(certificateElement, {
        backgroundColor: '#ffffff',
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: false,
        width: rect.width,
        height: rect.height,
        scrollX: 0,
        scrollY: 0,
        windowWidth: rect.width,
        windowHeight: rect.height,
        onclone: (clonedDoc) => {
          // Ensure all styles are applied in the cloned document
          const clonedElement = clonedDoc.querySelector('[data-certificate="true"]');
          if (clonedElement) {
            clonedElement.style.filter = 'none';
            clonedElement.style.transform = 'none';
            clonedElement.style.width = '1056px';
            clonedElement.style.height = '792px';
          }
        }
      });
      
      // Restore original styles
      certificateElement.style.cssText = originalStyle;
      
      // Restore original styles
      if (overlay) overlay.style.display = '';
      certificateElement.style.filter = originalBlur;
      
      // Download
      const imgData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const fileName = `Certificate_${(courseTitle || courseList?.courseTitle || 'Course').replace(/[^a-zA-Z0-9]/g, '_')}_${(userName || userDetail?.name || 'User').replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.download = fileName;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Certificate Downloaded!",
        description: "Your certificate has been saved as a high-quality PNG image.",
      });
      
    } catch (error) {
      console.error('Image download failed:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download certificate as image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadCertificateAsPDF = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Dynamically import required libraries
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      
      const certificateElement = certificateRef.current;
      
      // Temporarily remove any blur effects
      const overlay = document.querySelector('.absolute.inset-0.z-10');
      const originalBlur = certificateElement.style.filter;
      
      if (overlay) overlay.style.display = 'none';
      certificateElement.style.filter = 'none';
      
      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Temporarily set fixed dimensions for download
      const originalStyle = certificateElement.style.cssText;
      certificateElement.style.width = '1056px';
      certificateElement.style.height = '792px';
      certificateElement.style.transform = 'scale(1)';
      
      // Create canvas
      const canvas = await html2canvas(certificateElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        width: 1056,
        height: 792,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-certificate="true"]');
          if (clonedElement) {
            clonedElement.style.filter = 'none';
            clonedElement.style.width = '1056px';
            clonedElement.style.height = '792px';
          }
        }
      });
      
      // Restore original styles
      certificateElement.style.cssText = originalStyle;
      
      // Restore original styles
      if (overlay) overlay.style.display = '';
      certificateElement.style.filter = originalBlur;
      
      // Create PDF in landscape mode to match certificate aspect ratio
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2] // Adjust for scale
      });
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      
      // Download PDF
      const fileName = `Certificate_${(courseTitle || courseList?.courseTitle || 'Course').replace(/[^a-zA-Z0-9]/g, '_')}_${(userName || userDetail?.name || 'User').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Certificate Downloaded!",
        description: "Your certificate has been saved as a PDF document.",
      });
      
    } catch (error) {
      console.error('PDF download failed:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download certificate as PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
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

  const today = date || new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const certificateNumber = generateCertificateNumber();

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Dancing+Script:wght@400;500;600;700&display=swap');
        
        .certificate-title {
          font-family: 'Playfair Display', serif;
        }
        .certificate-name {
          font-family: 'Great+Vibes', cursive;
        }
        .certificate-course {
          font-family: 'Crimson Text', serif;
        }
        .certificate-body {
          font-family: 'Crimson Text', serif;
        }
        .signature-text {
          font-family: 'Dancing Script', cursive;
        }
        
        .watermark {
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(34, 197, 94, 0.05) 0%, transparent 50%);
        }
        
        .seal-stamp {
          background: conic-gradient(from 0deg, #1e40af, #3b82f6, #60a5fa, #93c5fd, #1e40af);
          animation: rotate 20s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .gold-border {
          background: linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #f59e0b, #fbbf24);
        }
        
        .ribbon {
          background: linear-gradient(135deg, #dc2626, #ef4444, #f87171, #ef4444, #dc2626);
        }

        /* Ensure certificate prints/downloads correctly */
        @media print {
          .certificate-container {
            width: 1056px !important;
            height: 792px !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }

        /* Responsive text sizing */
        @media (max-width: 768px) {
          .certificate-title {
            font-size: 2.5rem !important;
          }
          .certificate-name {
            font-size: 2.5rem !important;
          }
          .certificate-course {
            font-size: 1.5rem !important;
          }
          .certificate-body {
            font-size: 0.875rem !important;
          }
        }

        @media (max-width: 640px) {
          .certificate-title {
            font-size: 2rem !important;
          }
          .certificate-name {
            font-size: 2rem !important;
          }
          .certificate-course {
            font-size: 1.25rem !important;
          }
        }
      `}</style>

      <div className="p-3 space-y-4">
        {/* Enhanced Header Card */}
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm shadow-md overflow-hidden relative">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Award size={20} className="text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Course Certificate
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {/* Download Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isDownloading || !isCompleted}
                      className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 disabled:opacity-50"
                    >
                      <Download size={16} />
                      <span className="hidden sm:inline">
                        {isDownloading ? "Downloading..." : "Download"}
                      </span>
                      <span className="sm:hidden">
                        {isDownloading ? "..." : "Download"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={downloadCertificateAsImage} disabled={isDownloading}>
                      <ImageIcon size={16} className="mr-2" />
                      Download as PNG Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={downloadCertificateAsPDF} disabled={isDownloading}>
                      <FileDown size={16} className="mr-2" />
                      Download as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {isCompleted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteUserEnrollmentData}
                    className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <Undo2 size={16} />
                    <span className="hidden sm:inline">Mark as Incomplete</span>
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

        {/* Certificate with blur effect when not completed */}
        <div className="relative">
          {!isCompleted && (
            <div className="absolute inset-0 z-10 bg-gray-900/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <Award size={48} className="mx-auto mb-3 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Complete the Course
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Mark this content as complete to unlock your certificate
                </p>
                <Button
                  size="sm"
                  onClick={saveUserEnrollmentData}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 size={16} />
                  Complete Now
                </Button>
              </div>
            </div>
          )}

          <Card 
            ref={certificateRef}
            data-certificate="true"
            className={`certificate-container w-full max-w-4xl mx-auto my-12 bg-white shadow-2xl transition-all duration-300 overflow-hidden ${
              !isCompleted ? 'blur-sm' : ''
            }`}
            style={{ 
              aspectRatio: '4/3',
              minHeight: '300px'
            }}
          >
            <CardContent className="p-0 relative w-full h-full watermark">
              {/* Gold Border Frame */}
              <div className="absolute inset-4 gold-border rounded-lg p-1">
                <div className="w-full h-full bg-white rounded-lg relative overflow-hidden">
                  
                  {/* Corner Decorations */}
                  <div className="absolute top-2 sm:top-6 left-2 sm:left-6">
                    <div className="w-8 h-8 sm:w-16 sm:h-16 border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-6 sm:h-6 text-amber-500" />
                    </div>
                  </div>
                  <div className="absolute top-2 sm:top-6 right-2 sm:right-6">
                    <div className="w-8 h-8 sm:w-16 sm:h-16 border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-6 sm:h-6 text-amber-500" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-6 left-2 sm:left-6">
                    <div className="w-8 h-8 sm:w-16 sm:h-16 border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-6 sm:h-6 text-amber-500" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-6 right-2 sm:right-6">
                    <div className="w-8 h-8 sm:w-16 sm:h-16 border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-6 sm:h-6 text-amber-500" />
                    </div>
                  </div>

                  {/* Header Section */}
                  <div className="text-center pt-8 sm:pt-16 pb-4 sm:pb-8">
                    {/* Institution Logo/Name */}
                    <div className="mb-3 sm:mb-6">
                      <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                        <Shield className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h3 className="certificate-body text-sm sm:text-lg font-semibold text-gray-700 tracking-wider">
                        LEARNING ACADEMY
                      </h3>
                      <p className="certificate-body text-xs sm:text-sm text-gray-500 italic">
                        Excellence in Education
                      </p>
                    </div>

                    {/* Certificate Title */}
                    <div className="mb-4 sm:mb-8">
                      <h1 className="certificate-title text-3xl sm:text-5xl font-bold text-gray-800 mb-1 sm:mb-2 tracking-wide">
                        CERTIFICATE
                      </h1>
                      <div className="ribbon text-white py-1 sm:py-2 px-4 sm:px-8 inline-block transform -skew-x-12 shadow-lg">
                        <span className="certificate-body text-sm sm:text-lg font-semibold transform skew-x-12 inline-block">
                          OF COMPLETION
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="px-4 sm:px-16 pb-4 sm:pb-8">
                    <div className="text-center mb-4 sm:mb-8">
                      <p className="certificate-body text-sm sm:text-lg text-gray-600 mb-3 sm:mb-6">
                        This is to certify that
                      </p>
                      
                      {/* Student Name */}
                      <div className="mb-3 sm:mb-6">
                        <h2 className="certificate-name text-3xl sm:text-5xl font-bold text-blue-700 mb-1 sm:mb-2" 
                            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                          {userName || userDetail?.name || "Student Name"}
                        </h2>
                        <div className="w-32 sm:w-64 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
                      </div>
                      
                      <p className="certificate-body text-sm sm:text-lg text-gray-600 mb-3 sm:mb-6">
                        has successfully completed the course
                      </p>
                      
                      {/* Course Title */}
                      <div className="mb-4 sm:mb-8">
                        <h3 className="certificate-course text-xl sm:text-3xl font-bold text-green-700 leading-tight px-2">
                          {courseTitle || courseList?.courseTitle || "Course Title"}
                        </h3>
                        <div className="w-24 sm:w-48 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto mt-2 sm:mt-3"></div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 sm:gap-0">
                      {/* Date Section */}
                      <div className="text-center sm:text-left">
                        <p className="certificate-body text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Date of Completion</p>
                        <p className="certificate-body text-sm sm:text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-1 min-w-[100px] sm:min-w-[150px]">
                          {today}
                        </p>
                      </div>

                      {/* Official Seal */}
                      <div className="text-center">
                        <div className="seal-stamp w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg mb-1 sm:mb-2 mx-auto">
                          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center">
                            <div className="text-center">
                              <Shield className="w-4 h-4 sm:w-8 sm:h-8 text-blue-700 mx-auto mb-1" />
                              <p className="text-xs sm:text-xs font-bold text-blue-700">OFFICIAL</p>
                              <p className="text-xs sm:text-xs font-bold text-blue-700">SEAL</p>
                            </div>
                          </div>
                        </div>
                        <p className="certificate-body text-xs text-gray-500">Verified & Authenticated</p>
                      </div>

                      {/* Signature Section */}
                      <div className="text-center sm:text-right">
                        <p className="certificate-body text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Director</p>
                        <div className="min-w-[100px] sm:min-w-[150px] text-center sm:text-right">
                          <p className="signature-text text-lg sm:text-2xl text-gray-700 mb-1">John Doe</p>
                          <div className="w-full h-0.5 bg-gray-300"></div>
                          <p className="certificate-body text-xs text-gray-500 mt-1">Academic Director</p>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Number and Verification */}
                    <div className="mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-200 text-center">
                      <p className="certificate-body text-xs text-gray-500">
                        <span className="block sm:inline">Certificate Number: <span className="font-mono font-semibold text-gray-700">{certificateNumber}</span></span>
                        <span className="hidden sm:inline mx-4">|</span>
                        <span className="block sm:inline mt-1 sm:mt-0">Verify at: <span className="font-mono text-blue-600">verify.learningacademy.com/{certificateNumber}</span></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CourseCertificate;