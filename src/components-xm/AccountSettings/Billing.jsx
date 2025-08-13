import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React from "react";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CreditCard, Download, Calendar, IndianRupee, Plus, MoreHorizontal} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

function Billing() {
    const paymentMethods = [
        { id: 1, type: "Visa", last4: "1234", expiry: "12/25", isDefault: true },
        { id: 2, type: "UPI", details: "user@paytm", isDefault: false },
    ];

    const billingHistory = [
        { id: 1, date: "2024-01-15", amount: 2999, description: "Advanced React Course", status: "Paid" },
        { id: 2, date: "2024-01-10", amount: 1999, description: "JavaScript Fundamentals", status: "Paid" },
        { id: 3, date: "2024-01-05", amount: 4999, description: "Full Stack Development Bundle", status: "Paid" },
    ];

    return (
        <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">Billing & Payments</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <div className="p-4 mx-auto">
                {/* Billing Header */}
                <Card className="w-full rounded-xl border-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white shadow-2xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
                            <CreditCard className="w-8 h-8" />
                            Billing & Payments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-white/90 text-lg">
                            Manage your payment methods and billing history
                        </p>
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Payment Methods
                            </CardTitle>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Payment Method
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {method.type} {method.last4 ? `•••• ${method.last4}` : method.details}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {method.expiry ? `Expires ${method.expiry}` : 'UPI Payment'}
                                        </p>
                                    </div>
                                    {method.isDefault && (
                                        <Badge className="bg-green-100 text-green-800">Default</Badge>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Set as Default</DropdownMenuItem>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Billing Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <IndianRupee className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                    <p className="text-2xl font-bold text-gray-800">₹9,997</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">This Month</p>
                                    <p className="text-2xl font-bold text-gray-800">₹2,999</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <CreditCard className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Active Courses</p>
                                    <p className="text-2xl font-bold text-gray-800">3</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Billing History */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold text-gray-800">Billing History</CardTitle>
                            <Button variant="outline" className="border-gray-300">
                                <Download className="w-4 h-4 mr-2" />
                                Download All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {billingHistory.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>{transaction.description}</TableCell>
                                        <TableCell className="font-medium">₹{transaction.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-100 text-green-800">
                                                {transaction.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Billing;
