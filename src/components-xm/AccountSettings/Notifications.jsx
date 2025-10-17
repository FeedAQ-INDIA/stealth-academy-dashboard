import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React, {useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Bell, Mail, Smartphone, BookOpen, Trophy, MessageSquare, Settings, AlertCircle} from "lucide-react";
import {Switch} from "@/components/ui/switch.jsx";
import {Label} from "@/components/ui/label.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";

// Notification Templates
const NOTIFICATION_TEMPLATES = {
    courseInvite: {
        icon: <BookOpen className="w-5 h-5 text-blue-500" />,
        getTitle: (data) => `Course Room Invitation`,
        getMessage: (data) => `${data.inviter} invited you to join "${data.courseName}"`,
        getActions: (notification, handlers) => (
            notification.status === 'pending' && (
                <div className="flex gap-2">
                    <Button 
                        onClick={() => handlers.handleCourseInvite(notification.id, 'accept')}
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Accept
                    </Button>
                    <Button 
                        onClick={() => handlers.handleCourseInvite(notification.id, 'reject')}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                        Reject
                    </Button>
                </div>
            )
        )
    },
    courseUpdate: {
        icon: <Bell className="w-5 h-5 text-yellow-500" />,
        getTitle: (data) => `Course Update`,
        getMessage: (data) => `New content added to "${data.courseName}"`,
        getActions: (notification, handlers) => (
            <Button 
                onClick={() => handlers.handleCourseUpdate(notification.id)}
                variant="default"
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
                View Updates
            </Button>
        )
    },
    accountUpdate: {
        icon: <Smartphone className="w-5 h-5 text-blue-500" />,
        getTitle: (data) => `Update Your ${data.field}`,
        getMessage: (data) => data.message,
        getActions: (notification, handlers) => (
            <Button 
                onClick={() => handlers.handleAccountUpdate(notification.id)}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
                {notification.icon}
                Update Now
            </Button>
        )
    },
    systemAlert: {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        getTitle: (data) => data.title,
        getMessage: (data) => data.message,
        getActions: (notification, handlers) => (
            <Button 
                onClick={() => handlers.handleSystemAlert(notification.id)}
                variant="default"
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                View Details
            </Button>
        )
    }
};

function Notifications() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'courseInvite',
            data: {
                inviter: 'John Doe',
                courseName: 'Advanced React Development'
            },
            timestamp: '2 hours ago',
            status: 'pending'
        },
        {
            id: 2,
            type: 'courseUpdate',
            data: {
                courseName: 'JavaScript Fundamentals',
                updates: ['New module added', 'Quiz updated']
            },
            timestamp: '1 day ago',
            status: 'unread'
        },
        {
            id: 3,
            type: 'courseInvite',
            data: {
                inviter: 'Sarah Smith',
                courseName: 'UI/UX Design Principles'
            },
            timestamp: '2 days ago',
            status: 'pending'
        },
        {
            id: 4,
            type: 'accountUpdate',
            data: {
                field: 'Phone Number',
                message: 'Please update your phone number for security purposes and better account recovery options'
            },
            timestamp: 'Just now',
            status: 'required'
        },
        {
            id: 5,
            type: 'systemAlert',
            data: {
                title: 'System Maintenance',
                message: 'Scheduled maintenance in 2 hours. Please save your work.'
            },
            timestamp: '30 minutes ago',
            status: 'unread'
        }
    ]);

    // Type-specific handlers
    const handlers = {
        handleCourseInvite: (notificationId, action) => {
            setNotifications(notifications.map(notif => 
                notif.id === notificationId 
                    ? { ...notif, status: action === 'accept' ? 'accepted' : 'rejected' }
                    : notif
            ));
            // API call to handle course invitation
        },

        handleCourseUpdate: (notificationId) => {
            setNotifications(notifications.map(notif => 
                notif.id === notificationId 
                    ? { ...notif, status: 'read' }
                    : notif
            ));
            // Navigate to course updates
        },

        handleAccountUpdate: (notificationId) => {
            setNotifications(notifications.map(notif => 
                notif.id === notificationId 
                    ? { ...notif, status: 'in-progress' }
                    : notif
            ));
            // Open account update modal/form
        },

        handleSystemAlert: (notificationId) => {
            setNotifications(notifications.map(notif => 
                notif.id === notificationId 
                    ? { ...notif, status: 'acknowledged' }
                    : notif
            ));
            // Show system alert details
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
                            Notification Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-white/90 text-lg">
                            Choose how you want to receive updates and notifications
                        </p>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {notifications.map((notification) => {
                        const template = NOTIFICATION_TEMPLATES[notification.type];
                        if (!template) return null;

                        return (
                            <Card key={notification.id} className="border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">{template.icon}</div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {template.getTitle(notification.data)}
                                                </h3>
                                                <p className="text-gray-600 mt-1">
                                                    {template.getMessage(notification.data)}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">{notification.timestamp}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {template.getActions(notification, handlers)}
                                            {notification.status === 'accepted' && (
                                                <span className="text-green-600 font-medium">Accepted</span>
                                            )}
                                            {notification.status === 'rejected' && (
                                                <span className="text-red-600 font-medium">Rejected</span>
                                            )}
                                            {notification.status === 'read' && (
                                                <span className="text-gray-600 font-medium">Viewed</span>
                                            )}
                                            {notification.status === 'acknowledged' && (
                                                <span className="text-blue-600 font-medium">Acknowledged</span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Notifications;