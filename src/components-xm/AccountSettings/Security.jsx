import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React from "react";
import {Button} from "@/components/ui/button.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Shield, Key, Smartphone, AlertTriangle} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";

function Security() {
    return (
        <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">Security Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <div className="p-4 mx-auto">
                {/* Security Header */}
                <Card className="w-full rounded-xl border-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-700  text-white shadow-2xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
                            <Shield className="w-8 h-8" />
                            Security & Privacy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-white/90 text-lg">
                            Keep your account secure with these security settings
                        </p>
                    </CardContent>
                </Card>

                {/* Security Status */}
                <Card className="mb-6 border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                                <Shield className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Account Security Status</h3>
                                <p className="text-sm text-gray-600">
                                    Your account security is <Badge className="bg-green-100 text-green-800">Good</Badge>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Password Section */}
                {/* <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Key className="w-5 h-5" />
                            Password & Authentication
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input type="password" id="current-password" placeholder="Enter current password" />
                                </div>
                                <div>
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input type="password" id="new-password" placeholder="Enter new password" />
                                </div>
                                <div>
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input type="password" id="confirm-password" placeholder="Confirm new password" />
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-2">Password Requirements</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• At least 8 characters long</li>
                                    <li>• Contains uppercase and lowercase letters</li>
                                    <li>• Contains at least one number</li>
                                    <li>• Contains at least one special character</li>
                                </ul>
                            </div>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Update Password
                        </Button>
                    </CardContent>
                </Card> */}

                {/* Two-Factor Authentication */}
                {/* <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Smartphone className="w-5 h-5" />
                            Two-Factor Authentication
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Two-Factor Authentication is disabled</p>
                                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                </div>
                            </div>
                            <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                                Enable 2FA
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Login Activity */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800">Recent Login Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-800">Windows • Chrome</p>
                                    <p className="text-sm text-gray-600">Current session • Mumbai, India</p>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-800">Mobile • Safari</p>
                                    <p className="text-sm text-gray-600">2 hours ago • Mumbai, India</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    Revoke
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Security;
