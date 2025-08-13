import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React, {useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Bell, Mail, Smartphone, BookOpen, Trophy, MessageSquare, Settings} from "lucide-react";
import {Switch} from "@/components/ui/switch.jsx";
import {Label} from "@/components/ui/label.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";

function Notifications() {
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        courseUpdates: true,
        achievementAlerts: true,
        communityMessages: false,
        marketingEmails: true,
    });

    const handleNotificationChange = (key, value) => {
        setNotifications(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const notificationCategories = [
        {
            title: "Course Updates",
            description: "Get notified about new content, assignments, and deadlines",
            key: "courseUpdates",
            icon: BookOpen,
        },
        {
            title: "Achievement Alerts",
            description: "Notifications when you complete courses or earn badges",
            key: "achievementAlerts",
            icon: Trophy,
        },
        {
            title: "Community Messages",
            description: "Messages from instructors and fellow students",
            key: "communityMessages",
            icon: MessageSquare,
        },
        {
            title: "Marketing Emails",
            description: "Updates about new courses, discounts, and promotions",
            key: "marketingEmails",
            icon: Mail,
        },
    ];

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
                {/* Notifications Header */}
                <Card className="w-full rounded-xl border-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white shadow-2xl mb-8">
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

                {/* Notification Methods */}
                <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Notification Methods
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <Label htmlFor="email-notifications" className="font-medium">Email</Label>
                                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                                    </div>
                                </div>
                                <Switch
                                    id="email-notifications"
                                    checked={notifications.emailNotifications}
                                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-green-600" />
                                    <div>
                                        <Label htmlFor="push-notifications" className="font-medium">Push</Label>
                                        <p className="text-sm text-gray-600">Browser push notifications</p>
                                    </div>
                                </div>
                                <Switch
                                    id="push-notifications"
                                    checked={notifications.pushNotifications}
                                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-purple-600" />
                                    <div>
                                        <Label htmlFor="sms-notifications" className="font-medium">SMS</Label>
                                        <p className="text-sm text-gray-600">Text message notifications</p>
                                    </div>
                                </div>
                                <Switch
                                    id="sms-notifications"
                                    checked={notifications.smsNotifications}
                                    onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Categories */}
                <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800">Notification Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {notificationCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <div key={category.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <Icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <Label htmlFor={category.key} className="font-medium text-gray-800">
                                                {category.title}
                                            </Label>
                                            <p className="text-sm text-gray-600">{category.description}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        id={category.key}
                                        checked={notifications[category.key]}
                                        onCheckedChange={(checked) => handleNotificationChange(category.key, checked)}
                                    />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Notification Frequency */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800">Notification Frequency</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="email-frequency">Email Frequency</Label>
                                <Select defaultValue="daily">
                                    <SelectTrigger id="email-frequency">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="immediate">Immediate</SelectItem>
                                        <SelectItem value="daily">Daily Summary</SelectItem>
                                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                                        <SelectItem value="never">Never</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="digest-time">Daily Digest Time</Label>
                                <Select defaultValue="9am">
                                    <SelectTrigger id="digest-time">
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6am">6:00 AM</SelectItem>
                                        <SelectItem value="9am">9:00 AM</SelectItem>
                                        <SelectItem value="12pm">12:00 PM</SelectItem>
                                        <SelectItem value="6pm">6:00 PM</SelectItem>
                                        <SelectItem value="9pm">9:00 PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 pt-6">
                            <Button variant="outline" className="border-gray-300">
                                Reset to Default
                            </Button>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                Save Preferences
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Notifications;
