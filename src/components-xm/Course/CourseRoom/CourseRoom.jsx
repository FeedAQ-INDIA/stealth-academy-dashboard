import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
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
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Users,
  UserCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Settings,
  Activity,
  AlertCircle,
} from "lucide-react";
import { Link, useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import { ContentLoader } from "@/components/ui/loading-components";
import { useCourse } from "@/components-xm/Course/CourseContext.jsx";
import { useAuthStore } from "@/zustland/store.js";
import { useToast } from "@/hooks/use-toast.js";
import courseRoomService from "@/services/courseRoomService.js";

// Member status options
const MEMBER_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  INACTIVE: "INACTIVE",
};

function CourseRoom() {
  const { CourseId } = useParams();
  const { courseList, userCourseEnrollment } = useCourse();
  const { userDetail } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  
  // Tab state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsContainerRef = useRef(null);


  // Get current active tab based on location
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/discussions')) return 'discussions';
    if (path.includes('/resources')) return 'resources';
    if (path.includes('/activities')) return 'activities';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/progress')) return 'progress';
    if (path.includes('/leaderboard')) return 'leaderboard';
    if (path.includes('/member/')) return 'members';
    return 'members'; // default tab
  };

  const activeTab = getCurrentTab();

  // Fetch course room members
  const fetchCourseRoomMembers = useCallback(async () => {
    try {
      const response = await courseRoomService.getCourseRoomMembers(CourseId);
      const roomMembers = response.data?.results || [];
      
      // Enhance members with additional status information
      const enhancedMembers = roomMembers.map(member => ({
        ...member,
        displayName: `${member.user?.firstName || ''} ${member.user?.lastName || ''}`.trim(),
        status: member.status || MEMBER_STATUS.ACTIVE,
        lastActive: member.lastActive || member.joinedAt || new Date().toISOString(),
        isOnline: Math.random() > 0.3, // Simulate online status - replace with real data
        avatar: member.user?.profilePicture || null,
      }));
      
      setMembers(enhancedMembers);
    } catch (error) {
      console.error("Error fetching course room members:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load course room members",
        variant: "destructive",
      });
    }
  }, [CourseId, toast]);

  // Tab scroll functions
  const checkScrollButtons = useCallback(() => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? tabsContainerRef.current.scrollLeft - scrollAmount
        : tabsContainerRef.current.scrollLeft + scrollAmount;
      
      tabsContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Member statistics
  const memberStats = useMemo(() => {
    const total = members.length;
    const active = members.filter(m => m.status === MEMBER_STATUS.ACTIVE).length;
    const pending = members.filter(m => m.status === MEMBER_STATUS.PENDING).length;
    const online = members.filter(m => m.isOnline).length;
    const moderators = members.filter(m => m.role === "MODERATOR").length;
    const owners = members.filter(m => m.user?.userId === courseList?.userId).length;

    return { total, active, pending, online, moderators, owners };
  }, [members, courseList?.userId]);

  useEffect(() => {
    if (courseList && CourseId) {
      fetchCourseRoomMembers();
    }
    // Simulate loading completion
    setTimeout(() => setIsLoading(false), 500);
  }, [CourseId, courseList, fetchCourseRoomMembers]);

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScrollButtons]);

  // Redirect to members tab if on base room URL
  useEffect(() => {
    if (location.pathname === `/course/${CourseId}/room`) {
      navigate(`/course/${CourseId}/room/members`, { replace: true });
    }
  }, [location.pathname, CourseId, navigate]);

  // Check enrollment access
  const isUserEnrolled = userCourseEnrollment && userCourseEnrollment.length > 0;
  const enrollmentStatus = userCourseEnrollment?.[0]?.enrollmentStatus;
  const hasContentAccess = isUserEnrolled && 
    ["ENROLLED", "IN_PROGRESS", "COMPLETED", "CERTIFIED"].includes(enrollmentStatus);

  // Check if user is course owner
  const isCourseOwner = courseList?.userId === userDetail?.userId;

  // Tab configuration - using useMemo to recalculate when isCourseOwner changes
  const tabs = useMemo(() => [
    ...(isCourseOwner ? [{ id: "members", label: "Members", icon: Users, path: `/course/${CourseId}/room/members` }] : []),
    ...(isCourseOwner ? [{ id: "progress", label: "Progress", icon: Activity, path: `/course/${CourseId}/room/progress` }] : []),
    { id: "leaderboard", label: "Leaderboard", icon: Activity, path: `/course/${CourseId}/room/leaderboard` },
    ...(isCourseOwner ? [{ id: "settings", label: "Settings", icon: Settings, path: `/course/${CourseId}/room/settings` }] : []),
  ], [isCourseOwner, CourseId]);

  useEffect(() => {
    if(!isCourseOwner){
        navigate(`/course/${CourseId}/room/leaderboard`, { replace: true });
    }
  },[isCourseOwner])


  // Handle member removal
  const handleRemoveMember = async (userId, displayName) => {
    setRemoveLoading(true);
    try {
      await courseRoomService.removeMemberFromCourseRoom(CourseId, userId);
      toast({
        title: "Member Removed",
        description: `${displayName} has been removed from the course room.`,
      });
      fetchCourseRoomMembers(); // Refresh member list
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove member",
        variant: "destructive",
      });
    } finally {
      setRemoveLoading(false);
    }
  };

  // Handle member role update
  const handleUpdateMemberRole = async (userId, newRole, displayName) => {
    try {
      await courseRoomService.updateMemberRole(CourseId, userId, newRole);
      toast({
        title: "Role Updated",
        description: `${displayName}'s role has been updated to ${newRole.toLowerCase()}.`,
      });
      fetchCourseRoomMembers(); // Refresh member list
    } catch (error) {
      console.error("Error updating member role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  // If not enrolled, show access denied
  if (!hasContentAccess) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-600">
              You need to be enrolled in this course to access the course room.
            </p>
          </div>
          <Button
            onClick={() => globalThis.history.back()}
            variant="outline"
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <ContentLoader message="Loading course room..." size="lg" className="min-h-screen" />
    );
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[30ch] font-medium text-muted-foreground">
                Course Room
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          {/* Member Statistics */}
          <div className="hidden sm:flex items-center gap-2">
            
          </div>
          
          {/* Mobile stats summary */}
          <Badge variant="outline" className="flex sm:hidden items-center gap-1">
            <Users className="h-3 w-3" />
            {memberStats.total}
          </Badge>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Course Room Header Card */}
        <Card className="border-0 bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800 text-white rounded-sm shadow-md overflow-hidden">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-300 to-orange-500 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold  ">
                    Course Room
                  </CardTitle>
                  <p className="text-sm   mt-1">
                    Collaborate with other learners in {courseList?.courseTitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Actions can be added here if needed */}
              </div>
            </div>
          </CardHeader>
        </Card>

        
        {/* Tab Content */}
        {!userDetail?.number && (
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
                  Please update your phone number to receive updates regarding this course room
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
        )}

        {/* Horizontally Scrollable Tabs */}
        <Card className="border-0 bg-white shadow-sm rounded-sm">
          <CardContent className="p-0">
            <div className="flex items-center">
              {/* Left Arrow */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTabs('left')}
                disabled={!canScrollLeft}
                className={`flex-shrink-0 h-12 w-10 rounded-none border-r ${
                  canScrollLeft ? 'hover:bg-gray-50' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Tabs Container */}
              <div 
                ref={tabsContainerRef}
                className="flex-1 overflow-x-auto scrollbar-hide"
                onScroll={checkScrollButtons}
              >
                <div className="flex min-w-max">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <Link
                        key={tab.id}
                        to={tab.path}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                          isActive
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        {tab.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right Arrow */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTabs('right')}
                disabled={!canScrollRight}
                className={`flex-shrink-0 h-12 w-10 rounded-none border-l ${
                  canScrollRight ? 'hover:bg-gray-50' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Route Content */}
        <Outlet context={{ 
          members, 
          courseList, 
          userDetail, 
          fetchCourseRoomMembers,
          onRemoveMember: handleRemoveMember,
          onUpdateMemberRole: handleUpdateMemberRole,
          removeLoading,
          memberStats,
          isCourseOwner,
          isLoading 
        }} />
      </div>
    </>
  );
}

export default CourseRoom;