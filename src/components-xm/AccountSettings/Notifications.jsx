import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Bell, Smartphone, BookOpen, AlertCircle, Loader2, Archive, ChevronLeft, ChevronRight} from "lucide-react";
import {Pagination, PaginationContent, PaginationItem} from "@/components/ui/pagination";
import axiosConn from "@/axioscon.js";
import { useAuthStore } from "@/zustland/store.js";
import { useToast } from "@/hooks/use-toast";

// Map backend notification types to frontend templates
const mapNotificationType = (notificationType) => {
    const typeMap = {
        'COURSE_INVITE': 'courseInvite',
        'STUDY_GROUP_INVITE': 'courseInvite',
        'COURSE_UPDATE': 'courseUpdate',
        'SYSTEM': 'systemAlert',
        'CREDIT_UPDATE': 'systemAlert'
    };
    return typeMap[notificationType] || 'systemAlert';
};

// Notification Templates
const NOTIFICATION_TEMPLATES = {
    courseInvite: {
        icon: <BookOpen className="w-5 h-5 text-blue-500" />,
        getTitle: () => `Course Room Invitation`,
        getMessage: (data) => {
            if (data.courseName) {
                return data.inviter 
                    ? `${data.inviter} invited you to join "${data.courseName}"`
                    : `You've been invited to join "${data.courseName}"`;
            }
            const emailPart = data.email ? ` at ${data.email}` : '';
            return `You have received a course invitation${emailPart}`;
        },
        getActions: (notification, handlers) => (
            notification.isActionRequired && (
                <div className="flex gap-2">
                    <Button 
                        onClick={() => handlers.handleCourseInvite(notification, 'accept')}
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                    >
                        Accept
                    </Button>
                    <Button 
                        onClick={() => handlers.handleCourseInvite(notification, 'reject')}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        size="sm"
                    >
                        Reject
                    </Button>
                </div>
            )
        )
    },
    courseUpdate: {
        icon: <Bell className="w-5 h-5 text-yellow-500" />,
        getTitle: () => `Course Update`,
        getMessage: (data) => {
            if (data.courseName) {
                return `New content added to "${data.courseName}"`;
            }
            return data.message || 'A course you are enrolled in has been updated';
        },
        getActions: (notification, handlers) => (
            notification.isActionRequired && (
                <Button 
                    onClick={() => handlers.handleCourseUpdate(notification)}
                    variant="default"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    size="sm"
                >
                    View Updates
                </Button>
            )
        )
    },
    accountUpdate: {
        icon: <Smartphone className="w-5 h-5 text-blue-500" />,
        getTitle: (data) => data.field ? `Update Your ${data.field}` : 'Account Update',
        getMessage: (data) => data.message || 'Your account requires attention',
        getActions: (notification, handlers) => (
            notification.isActionRequired && (
                <Button 
                    onClick={() => handlers.handleAccountUpdate(notification)}
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                >
                    Update Now
                </Button>
            )
        )
    },
    systemAlert: {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        getTitle: (data) => data.title || 'System Notification',
        getMessage: (data) => data.message || 'You have a new notification',
        getActions: (notification, handlers) => (
            notification.isActionRequired && (
                <Button 
                    onClick={() => handlers.handleSystemAlert(notification)}
                    variant="default"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                >
                    View Details
                </Button>
            )
        )
    }
};

function Notifications() {
    const { userDetail } = useAuthStore();
    const { toast } = useToast();
    
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        if (!userDetail?.userId) return;
        
        setLoading(true);
        try {
            const response = await axiosConn.post('/notifications/getNotifications', {
                limit: limit,
                offset: offset
            });

            if (response.data?.status === 200) {
                const fetchedNotifications = response.data.data.notifications || [];
                setTotalCount(response.data.data.total || 0);
                setLimit(response.data.data.limit || 20);
                setOffset(response.data.data.offset || 0);
                
                // Transform API data to component format
                const transformedNotifications = fetchedNotifications.map(notif => ({
                    id: notif.notificationId,
                    type: mapNotificationType(notif.notificationType),
                    data: notif.notificationReq || {},
                    status: notif.status?.toLowerCase() || 'unread',
                    timestamp: notif.created_date && notif.v_created_time 
                        ? `${notif.created_date} at ${notif.v_created_time}` 
                        : 'Recently',
                    isActionRequired: notif.isActionRequired,
                    originalType: notif.notificationType
                }));
                
                setNotifications(transformedNotifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast({
                title: "Error",
                description: "Failed to fetch notifications. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Archive notification
    const archiveNotification = async (notificationId) => {
        try {
            const response = await axiosConn.post('/notifications/archiveNotifications', {
                notificationIds: [notificationId]
            });

            if (response.data?.status === 200) {
                toast({
                    title: "Success",
                    description: "Notification archived successfully",
                });
                // Refresh notifications
                fetchNotifications();
            }
        } catch (error) {
            console.error('Error archiving notification:', error);
            toast({
                title: "Error",
                description: "Failed to archive notification",
                variant: "destructive",
            });
        }
    };

 

    // Fetch notifications on component mount and when pagination changes
    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset]);

    // Type-specific handlers
    const handlers = {
        handleCourseInvite: async (notification, action) => {
            const notificationId = notification.id;
            const { inviteId, courseName } = notification.data;
            
            if (!inviteId) {
                toast({
                    title: "Error",
                    description: "Invalid invitation data",
                    variant: "destructive",
                });
                return;
            }
            
            try {
                if (action === 'accept') {
                    const response = await axiosConn.post('/course-access/acceptInvite', { 
                        inviteId: inviteId
                    });
                    
                    if (response.data?.status === 200) {
                        const courseTitle = response.data.data?.course?.courseTitle || 
                                          response.data.data?.course?.courseName || 
                                          courseName || 
                                          'the course';
                        
                        toast({
                            title: "Invitation Accepted",
                            description: `You have successfully joined "${courseTitle}"`,
                        });
                        
                        // Archive the notification after successful acceptance
                        await archiveNotification(notificationId);
                        
                        // Refresh notifications
                        fetchNotifications();
                        
                        // Optional: Navigate to course page
                        // if (response.data.data?.course?.courseId) {
                        //     navigate(`/course/${response.data.data.course.courseId}`);
                        // }
                    } else {
                        throw new Error(response.data?.message || 'Failed to accept invitation');
                    }
                } else if (action === 'reject') {
                    const response = await axiosConn.post('/course-access/declineInvite', { 
                        inviteId: inviteId
                    });
                    
                    if (response.data?.status === 200) {
                        const courseTitle = courseName || 'the course';
                        
                        toast({
                            title: "Invitation Declined",
                            description: `You have declined the invitation to "${courseTitle}"`,
                        });
                        
                        // Archive the notification after declining
                        await archiveNotification(notificationId);
                        
                        // Refresh notifications
                        fetchNotifications();
                    } else {
                        throw new Error(response.data?.message || 'Failed to decline invitation');
                    }
                }
            } catch (error) {
                console.error('Error handling course invite:', error);
                
                const errorMessage = error.response?.data?.message || 
                                   error.message || 
                                   `Failed to ${action} the invitation`;
                
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        },

        handleCourseUpdate: (notification) => {
            const { courseId } = notification.data;
            
             
            // Navigate to course page when courseId is available
            if (courseId) {
                toast({
                    title: "Opening Course",
                    description: `Navigating to course ${courseId}...`,
                });
                // Future: Add navigation: navigate(`/course/${courseId}`);
            } else {
                toast({
                    title: "Course Update",
                    description: "Course information not available",
                    variant: "destructive",
                });
            }
        },

        handleAccountUpdate: () => {
            // Navigate to account settings
            toast({
                title: "Account Update",
                description: "Opening account settings...",
            });
            // Future: Add navigation: navigate('/account-settings');
        },

        handleSystemAlert: (notification) => {
            toast({
                title: "Alert Acknowledged",
                description: notification.data.message || "System alert has been acknowledged",
            });
        },

        handleArchive: (notificationId) => {
            archiveNotification(notificationId);
        }
    }; 
    
    
    
    return (
        <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">Notification Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <div className="p-4 mx-auto">
                 <Card className="w-full rounded-xl border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-2xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
                            <Bell className="w-8 h-8" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-white/90 text-lg">
                            Stay updated with your latest notifications
                        </p>
                    </CardContent>
                </Card>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading notifications...</span>
                    </div>
                )}
                
                {!loading && notifications.length === 0 && (
                    <Card className="border shadow-sm">
                        <CardContent className="p-12 text-center">
                            <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications</h3>
                            <p className="text-gray-500">You&apos;re all caught up! No notifications at the moment.</p>
                        </CardContent>
                    </Card>
                )}
                
                {!loading && notifications.length > 0 && (
                    <>
                        <div className="space-y-4">
                            {notifications.map((notification) => {
                                const template = NOTIFICATION_TEMPLATES[notification.type];
                                if (!template) return null;

                                // Calculate if invite is expired (for COURSE_INVITE)
                                const isExpired = notification.data.expiresAt && 
                                    new Date(notification.data.expiresAt) < new Date();

                                return (
                                    <Card key={notification.id} className={`border shadow-sm hover:shadow-md transition-shadow ${
                                        isExpired ? 'opacity-60 bg-gray-50' : ''
                                    }`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="mt-1">{template.icon}</div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-lg text-gray-900">
                                                                {template.getTitle(notification.data)}
                                                            </h3>
                                                            {notification.originalType === 'COURSE_INVITE' && isExpired && (
                                                                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                                                    Expired
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-600 mt-1">
                                                            {template.getMessage(notification.data)}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                                                            <span>{notification.timestamp}</span>
                                                            {notification.originalType === 'COURSE_INVITE' && notification.data.expiresAt && !isExpired && (
                                                                <span className="text-orange-600">
                                                                    • Expires: {new Date(notification.data.expiresAt).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 items-end">
                                                    {notification.isActionRequired && !isExpired && (
                                                        <div className="flex gap-2 mb-2">
                                                            {template.getActions(notification, handlers)}
                                                        </div>
                                                    )}
                                                    {isExpired && notification.originalType === 'COURSE_INVITE' && (
                                                        <span className="text-sm text-red-600 font-medium">
                                                            Invitation Expired
                                                        </span>
                                                    )}
                                                    {!notification.isActionRequired  && isExpired && (<Button
                                                        onClick={() => handlers.handleArchive(notification.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        <Archive className="w-4 h-4 mr-1" />
                                                        Archive
                                                    </Button>)}
                                                    
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <Card className="border-0 shadow-sm mt-6">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing {offset + 1} to{" "}
                                        {Math.min(offset + limit, totalCount)} of {totalCount}{" "}
                                        notification{totalCount === 1 ? '' : 's'}
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
                    </>
                )}
            </div>
        </div>
    );
}

export default Notifications;