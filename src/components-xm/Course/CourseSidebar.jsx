import * as React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.jsx";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Check,
  MonitorPlay,
  SquareArrowLeft,
  Lock,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Target,
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { Separator } from "@/components/ui/separator.jsx";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "@/components/hooks/use-toast.js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function CourseSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { CourseId, CourseVideoId, CourseDocId, CourseQuizId, CourseFlashcardId } = useParams();

  const [data, setData] = useState(null);
  const activeItemRef = useRef(null);
  const sidebarContentRef = useRef(null);
  const [activeContentId, setActiveContentId] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const {
    userCourseContentProgress,
    userCourseEnrollment,
    courseList,
    identifyContentTypeIcons,
  } = useCourse();

  const contentUrlMap = {
    CourseVideo: "video",
    CourseWritten: "doc",
    CourseQuiz: "quiz",
    CourseFlashcard: "flashcard",
  };

  // Check if user is enrolled and has access to content
  const isUserEnrolled =
    userCourseEnrollment && userCourseEnrollment.length > 0;
  const enrollmentStatus = userCourseEnrollment?.[0]?.enrollmentStatus;

  // Calculate course progress
  const completedContent =
    userCourseContentProgress?.filter(
      (p) => p.courseId == CourseId && p.progressStatus === "COMPLETED"
    )?.length || 0;
  const totalContent = courseList?.courseContent?.length || 0;
  const progressPercentage =
    totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;

  // Define which enrollment statuses allow content access
  const hasContentAccess =
    isUserEnrolled &&
    ["ENROLLED", "IN_PROGRESS", "COMPLETED", "CERTIFIED"].includes(
      enrollmentStatus
    );

  // Function to determine if a course content item is currently active
  const isContentActive = (content) => {
    const contentUrl = `/course/${courseList?.courseId}/${
      contentUrlMap[content?.courseContentType]
    }/${content?.courseContentId}`;

    // Direct URL match
    if (location.pathname === contentUrl) {
      return true;
    }

    // Check based on URL parameters - this handles the case where the content ID in URL maps to a courseContentId
    if (
      CourseVideoId &&
      content.courseContentType === "CourseVideo" &&
      content.courseContentId === CourseVideoId
    ) {
      return true;
    }
    if (
      CourseDocId &&
      content.courseContentType === "CourseWritten" &&
      content.courseContentId === CourseDocId
    ) {
      return true;
    }
    if (
      CourseQuizId &&
      content.courseContentType === "CourseQuiz" &&
      content.courseContentId === CourseQuizId
    ) {
      return true;
    }
    if (
      CourseFlashcardId &&
      content.courseContentType === "CourseFlashcard" &&
      content.courseContentId === CourseFlashcardId
    ) {
      return true;
    }

    return false;
  };

  // Improved scroll to active item function
  const scrollToActiveItem = useCallback(() => {
    if (activeItemRef.current && sidebarContentRef.current && !isScrolling) {
      const activeContent = courseList?.courseContent?.find(
        (content) => content.courseContentId === activeContentId
      );
      console.log(
        "CourseSidebar: Scrolling to active item:",
        activeContent?.courseContentTitle
      );

      setIsScrolling(true);

      // Show toast notification
      toast({
        title: "📍 Scrolling to active content",
        description: activeContent?.courseContentTitle || "Current lesson",
        duration: 2000,
      });

      // Get the sidebar content container
      const container = sidebarContentRef.current;
      const activeElement = activeItemRef.current;

      // Calculate the position of the active element relative to the container
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();

      // Calculate the scroll position to center the active element
      const scrollTop =
        container.scrollTop +
        (elementRect.top - containerRect.top) -
        containerRect.height / 2 +
        elementRect.height / 2;

      // Smooth scroll to the calculated position
      container.scrollTo({
        top: Math.max(0, scrollTop), // Ensure we don't scroll to negative values
        behavior: "smooth",
      });

      // Reset scrolling flag after animation completes
      setTimeout(() => setIsScrolling(false), 800);
    }
  }, [isScrolling, activeContentId, courseList]);

  // Track active content changes and trigger scroll
  useEffect(() => {
    const currentActive = courseList?.courseContent?.find((content) =>
      isContentActive(content)
    );

    if (currentActive && currentActive.courseContentId !== activeContentId) {
      console.log(
        "CourseSidebar: Active content changed to:",
        currentActive.courseContentTitle
      );
      setActiveContentId(currentActive.courseContentId);

      // Delay scroll to ensure DOM is updated
      const scrollTimer = setTimeout(() => {
        scrollToActiveItem();
      }, 300);

      return () => clearTimeout(scrollTimer);
    }
  }, [
    CourseVideoId,
    CourseDocId,
    CourseQuizId,
    CourseFlashcardId,
    location.pathname,
    courseList,
    activeContentId,
    scrollToActiveItem,
  ]);

  // Add keyboard shortcut to scroll to active item (Ctrl/Cmd + G)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "g") {
        event.preventDefault();
        console.log("CourseSidebar: Manual scroll to active item triggered");
        scrollToActiveItem();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [scrollToActiveItem]);

  useEffect(() => {
    if (courseList && location.pathname) {
        console.log("CourseSidebar: Updating sidebar data", {
          pathname: location.pathname,
          CourseVideoId,
          CourseDocId,
          CourseQuizId,
          CourseFlashcardId,
          courseContent: courseList?.courseContent,
        });      setData({
        navMain: [
          {
            title: "",
            url: "#",
            items: [
              {
                title: "OVERVIEW",
                url: `/course/${courseList?.courseId}`,
                isClickable: true,
                isActive:
                  location.pathname === `/course/${courseList?.courseId}`,
              },
              ...(courseList?.courseContent?.map((m) => {
                const contentUrl = `/course/${courseList?.courseId}/${
                  contentUrlMap[m?.courseContentType]
                }/${m?.courseContentId}`;
                const isActive = isContentActive(m);

                console.log("CourseSidebar: Content item", {
                  title: m?.courseContentTitle,
                  contentId: m?.courseContentId,
                  contentType: m?.courseContentType,
                  isActive,
                  url: contentUrl,
                });

                return {
                  isCourseContent: true,
                  title: m?.courseContentTitle,
                  courseContentId: m?.courseContentId,
                  contentType: m?.courseContentType,
                  url: contentUrl,
                  isClickable: hasContentAccess,
                  isActive: isActive,
                  isLocked: !hasContentAccess,
                };
              }) || []),
            ],
          },
        ],
      });
    }
  }, [
    courseList,
    userCourseEnrollment,
    location.pathname,
    CourseVideoId,
    CourseDocId,
    CourseQuizId,
    CourseFlashcardId,
    hasContentAccess,
  ]);

  if (!courseList || !data) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading course data...
      </div>
    );
  }

  return (
    <Sidebar
      className="top-[4rem] h-[calc(100svh-4em)] shadow-lg px-0 border-r"
      style={{ borderRadius: "0px", overflowY: "auto" }}
    >
      {isScrolling && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse z-10" />
      )}

      <SidebarHeader className="pb-2 space-y-3">
        <div className="space-y-2">
          <h2 className="text-base font-medium text-black text-center line-clamp-1">
            {courseList?.courseTitle}
          </h2>

          <Collapsible open={isInfoExpanded} onOpenChange={setIsInfoExpanded}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-9 text-xs text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 flex items-center justify-center gap-2 transition-all duration-200 border border-transparent hover:border-blue-200 rounded-lg"
              >
                <Info
                  size={14}
                  className={isInfoExpanded ? "text-blue-600" : ""}
                />
                <span className="font-medium">Course Details</span>
                {isInfoExpanded ? (
                  <ChevronUp size={14} className="text-blue-600" />
                ) : (
                  <ChevronDown size={14} />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-300">
              {/* Enrollment Status Badge */}
              <div className="flex justify-between">
                <Link to="/explore">
                  <Button
                    className="w-full flex gap-2 text-muted-foreground text-xs py-2 h-8 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                    size="sm"
                    variant="ghost"
                  >
                    <SquareArrowLeft size={14} />
                    Explore More Courses
                  </Button>
                </Link>{" "}
                <div className="mx-auto w-fit flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-xs font-semibold text-gray-700 capitalize">
                    {enrollmentStatus?.toLowerCase()?.replace("_", " ")}
                  </p>
                  {enrollmentStatus === "COMPLETED" && (
                    <Trophy size={12} className="text-yellow-500" />
                  )}
                  {enrollmentStatus === "CERTIFIED" && (
                    <Target size={12} className="text-green-500" />
                  )}
                </div>
              </div>

              {/* Course Statistics */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 space-y-2 border border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <BookOpen size={12} />
                    <span>Progress</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-medium">
                    <TrendingUp size={12} />
                    {progressPercentage}%
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Check size={10} className="text-green-500" />
                    <span>{completedContent} Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock size={10} className="text-orange-500" />
                    <span>{totalContent - completedContent} Remaining</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                {activeContentId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 space-y-1">
                    <Button
                      onClick={scrollToActiveItem}
                      size="sm"
                      variant="ghost"
                      className="w-full text-xs py-1.5 h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-all duration-200 flex items-center gap-2"
                    >
                      <Target size={12} />
                      Find Active Content{" "}
                      <span className="font-normal">or press</span>{" "}
                      <kbd className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">
                        Ctrl+G
                      </kbd>
                    </Button>
                  </div>
                )}
              </div>

              {/* Course Info Footer */}
              {/* <div className="pt-2 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Users size={10} />
                                        <span>Interactive</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={10} />
                                        <span>Self-paced</span>
                                    </div>
                                </div>
                            </div> */}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent ref={sidebarContentRef}>
        {data?.navMain?.map((group) => (
          <SidebarGroup key={group?.title} className="font-medium text-xs">
            {group?.title && group?.title?.length > 0 && (
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu>
                {group?.items?.map((item) => {
                  const isActive = item?.isActive;

                  return item.isCourseContent ? (
                    <SidebarMenuItem
                      key={item?.url}
                      ref={isActive ? activeItemRef : null}
                    >
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild={item?.isClickable}
                          isActive={isActive}
                          className={`flex items-center gap-1 py-2 rounded-1 h-fit transition-all duration-200 ${
                            item?.isLocked
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          } ${
                            isActive
                              ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500 shadow-md transform scale-[1.02]"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {item?.isClickable ? (
                            <Link to={item?.url} className="w-full">
                              <div className="flex items-center gap-2 w-full">
                                {userCourseContentProgress?.some(
                                  (log) =>
                                    log.courseId == CourseId &&
                                    log.courseContentId ==
                                      item?.courseContentId &&
                                    log.progressStatus === "COMPLETED"
                                ) ? (
                                  <Avatar className="border shadow-md bg-green-500">
                                    <AvatarFallback className="bg-green-500">
                                      <Check strokeWidth={3} color="#ffffff" />
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <Avatar className="border shadow-md">
                                    <AvatarFallback>
                                      {identifyContentTypeIcons(
                                        item?.contentType
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={`flex-1 text-left ${
                                    isActive
                                      ? "font-semibold text-blue-700"
                                      : "font-medium text-gray-700 hover:text-gray-900"
                                  }`}
                                >
                                  {item?.title}
                                </div>
                                {isActive && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-2 w-full">
                              <Avatar className="border shadow-md bg-gray-400">
                                <AvatarFallback className="bg-gray-400">
                                  <Lock size={18} color="#ffffff" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 text-gray-500">
                                {item?.title}
                              </div>
                              <div className="text-xs text-gray-400">
                                Locked
                              </div>
                            </div>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuItem>
                  ) : (
                    <SidebarMenuItem
                      key={item?.url}
                      ref={isActive ? activeItemRef : null}
                    >
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive}
                          className={`flex items-center gap-1 py-2 rounded-1 h-fit transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500 shadow-md"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <Link to={item?.url} className="w-full">
                            <div className="flex items-center gap-2 w-full">
                              <div
                                className={`flex-1 text-left ${
                                  isActive
                                    ? "font-semibold text-blue-700"
                                    : "font-medium text-gray-700 hover:text-gray-900"
                                }`}
                              >
                                {item?.title}
                              </div>
                              {isActive && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default CourseSidebar;

/* Custom styles for enhanced scrollbar and sidebar interactions */
const customStyles = `
  .sidebar-scroll-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .sidebar-scroll-container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
  
  .sidebar-scroll-container::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
    border-radius: 3px;
    transition: background 0.2s ease;
  }
  
  .sidebar-scroll-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #2563eb, #1e40af);
  }
  
  .scroll-indicator {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 30px;
    background: linear-gradient(to bottom, #3b82f6, transparent);
    border-radius: 2px;
    opacity: 0;
    animation: fadeInOut 3s ease-in-out infinite;
  }
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.6; }
  }
  
  .active-content-highlight {
    position: relative;
    overflow: hidden;
  }
  
  .active-content-highlight::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
`;

// Inject styles into document head
if (typeof document !== "undefined") {
  const styleId = "course-sidebar-custom-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = customStyles;
    document.head.appendChild(style);
  }
}
