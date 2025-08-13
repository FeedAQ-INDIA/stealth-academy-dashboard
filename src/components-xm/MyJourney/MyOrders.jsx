import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React from "react";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import {Download, Package, ShoppingCart, Calendar, IndianRupee, Eye} from "lucide-react";

export function MyOrders() {
    const orders = [
        { 
            id: "ORD-001", 
            date: "2024-01-15", 
            course: "Advanced React Development", 
            amount: 2999, 
            status: "Completed",
            paymentMethod: "Credit Card"
        },
        { 
            id: "ORD-002", 
            date: "2024-01-10", 
            course: "JavaScript Fundamentals", 
            amount: 1999, 
            status: "Completed",
            paymentMethod: "UPI"
        },
        { 
            id: "ORD-003", 
            date: "2024-01-05", 
            course: "Full Stack Development Bundle", 
            amount: 4999, 
            status: "Completed",
            paymentMethod: "Net Banking"
        },
        { 
            id: "ORD-004", 
            date: "2024-01-01", 
            course: "Python for Data Science", 
            amount: 3499, 
            status: "Pending",
            paymentMethod: "Credit Card"
        },
    ];

    const getStatusBadge = (status) => {
        const variants = {
            Completed: "bg-green-100 text-green-800 border-green-200",
            Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            Failed: "bg-red-100 text-red-800 border-red-200",
            Refunded: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return variants[status] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    return (
        <div className="space-y-6">
            {/* Orders Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-xl font-bold text-gray-800">{orders.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                                <IndianRupee className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Spent</p>
                                <p className="text-xl font-bold text-gray-800">
                                    ₹{orders.reduce((total, order) => total + order.amount, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-full">
                                <Package className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {orders.filter(order => order.status === 'Completed').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-full">
                                <Calendar className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">This Month</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {orders.filter(order => 
                                        new Date(order.date).getMonth() === new Date().getMonth()
                                    ).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Order History
                        </CardTitle>
                        <Button variant="outline" className="border-gray-300">
                            <Download className="w-4 h-4 mr-2" />
                            Export All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-800">{order.course}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.paymentMethod}</TableCell>
                                    <TableCell className="font-medium">₹{order.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadge(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Empty State for no orders */}
            {orders.length === 0 && (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600 mb-4">
                            You haven't made any purchases yet. Start exploring our courses!
                        </p>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Browse Courses
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
