import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React, { useState, useEffect } from "react";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Package, Download, Calendar, IndianRupee, Eye, MoreHorizontal, ShoppingBag, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw, ArrowUpRight, UserCircle, Shield, CreditCard, Bell} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { useOrderStore } from "@/zustland/store.js";
import { useToast } from "@/components/hooks/use-toast.js";

function Orders() {
    const { toast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");

    // Content tabs for orders section
    const orderTabs = [
        { 
            id: "all", 
            label: "All Orders", 
            icon: ShoppingBag, 
            description: "View all your orders"
        },
        { 
            id: "completed", 
            label: "Completed", 
            icon: CheckCircle, 
            description: "Successfully completed orders"
        },
        { 
            id: "pending", 
            label: "Pending", 
            icon: Clock, 
            description: "Orders awaiting processing"
        },
        { 
            id: "cancelled", 
            label: "Cancelled", 
            icon: XCircle, 
            description: "Cancelled orders"
        },
    ];

    // Get orders data from Zustand store
    const { 
        orders,
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        loading,
        fetchOrders,
        cancelOrder,
        downloadInvoice
    } = useOrderStore();

    // Fetch orders data on component mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'processing':
                return <RefreshCw className="w-4 h-4 text-blue-600" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-600" />;
            case 'failed':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsOrderDetailsOpen(true);
    };

    const handleCancelOrder = async (orderId) => {
        const result = await cancelOrder(orderId);
        
        if (result.success) {
            toast({
                title: "Order Cancelled",
                description: "Your order has been successfully cancelled.",
                duration: 4000,
            });
        } else {
            toast({
                title: "Cancellation Failed",
                description: result.error || "Unable to cancel order. Please try again.",
                variant: "destructive",
                duration: 4000,
            });
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        const result = await downloadInvoice(orderId);
        
        if (result.success) {
            toast({
                title: "Invoice Downloaded",
                description: "Invoice has been downloaded successfully.",
                duration: 3000,
            });
        } else {
            toast({
                title: "Download Failed",
                description: result.error || "Unable to download invoice. Please try again.",
                variant: "destructive",
                duration: 4000,
            });
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
                            <BreadcrumbPage className="truncate max-w-[30ch]">My Orders</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <div className="p-4 mx-auto max-w-7xl">
                {/* Header Section */}
                <Card className="w-full rounded-xl border-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-700 text-white shadow-2xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
                            <ShoppingBag className="w-8 h-8" />
                            My Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-white/90 text-lg mb-6">
                            Track your orders, view purchase history, and manage your transactions
                        </p>
                        <div className="flex items-center justify-center gap-8 text-center mb-6">
                            <div>
                                <p className="text-3xl font-bold">{totalOrders}</p>
                                <p className="text-white/80">Total Orders</p>
                            </div>
                            <Separator orientation="vertical" className="h-12 bg-white/30" />
                            <div>
                                <p className="text-3xl font-bold text-green-300">{completedOrders}</p>
                                <p className="text-white/80">Completed</p>
                            </div>
                            <Separator orientation="vertical" className="h-12 bg-white/30" />
                            <div>
                                <p className="text-3xl font-bold text-yellow-300">{pendingOrders}</p>
                                <p className="text-white/80">Pending</p>
                            </div>
                        </div>
                        
                        {/* Content Tabs */}
                        <div className="">
                            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border">
                                {orderTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-2 py-1 rounded-lg font-medium transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                            }`}
                                        >
                                            <Icon size={18} />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="w-full">
                    {/* All Orders Tab Content */}
                    {activeTab === "all" && (
                        <div className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    All Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <RefreshCw className="w-6 h-6 animate-spin" />
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Order ID</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Items</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{order.items[0]?.name}</span>
                                                            {order.items.length > 1 && (
                                                                <span className="text-sm text-gray-500">
                                                                    +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <IndianRupee className="w-4 h-4" />
                                                            {order.total.toLocaleString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                {order.status === 'completed' && (
                                                                    <DropdownMenuItem onClick={() => handleDownloadInvoice(order.id)}>
                                                                        <Download className="w-4 h-4 mr-2" />
                                                                        Download Invoice
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {(order.status === 'pending' || order.status === 'processing') && (
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleCancelOrder(order.id)}
                                                                        className="text-red-600"
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-2" />
                                                                        Cancel Order
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                        </div>
                    )}

                    {/* Completed Orders Tab */}
                    {activeTab === "completed" && (
                        <div className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Completed Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.filter(order => order.status === 'completed').map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">#{order.id}</TableCell>
                                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{order.items[0]?.name}</span>
                                                        {order.items.length > 1 && (
                                                            <span className="text-sm text-gray-500">
                                                                +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee className="w-4 h-4" />
                                                        {order.total.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDownloadInvoice(order.id)}>
                                                                <Download className="w-4 h-4 mr-2" />
                                                                Download Invoice
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        </div>
                    )}

                    {/* Pending Orders Tab */}
                    {activeTab === "pending" && (
                        <div className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                    Pending Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.filter(order => order.status === 'pending' || order.status === 'processing').map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">#{order.id}</TableCell>
                                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{order.items[0]?.name}</span>
                                                        {order.items.length > 1 && (
                                                            <span className="text-sm text-gray-500">
                                                                +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee className="w-4 h-4" />
                                                        {order.total.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => handleCancelOrder(order.id)}
                                                                className="text-red-600"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Cancel Order
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        </div>
                    )}

                    {/* Cancelled Orders Tab */}
                    {activeTab === "cancelled" && (
                        <div className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    Cancelled Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.filter(order => order.status === 'cancelled' || order.status === 'failed').map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">#{order.id}</TableCell>
                                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{order.items[0]?.name}</span>
                                                        {order.items.length > 1 && (
                                                            <span className="text-sm text-gray-500">
                                                                +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee className="w-4 h-4" />
                                                        {order.total.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        </div>
                    )}
                </div>

                {/* Order Details Modal */}
                <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order Details #{selectedOrder?.id}
                            </DialogTitle>
                        </DialogHeader>
                        
                        {selectedOrder && (
                            <div className="space-y-6">
                                {/* Order Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Status:</span>
                                    <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1`}>
                                        {getStatusIcon(selectedOrder.status)}
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </Badge>
                                </div>

                                {/* Order Date */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Order Date:</span>
                                    <span className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                                </div>

                                {/* Items */}
                                <div>
                                    <h4 className="font-medium mb-3">Items Ordered:</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <span className="font-medium">{item.name}</span>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee className="w-4 h-4" />
                                                        <span className="font-medium">{item.price.toLocaleString()}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between text-lg font-semibold">
                                        <span>Total Amount:</span>
                                        <div className="flex items-center gap-1">
                                            <IndianRupee className="w-5 h-5" />
                                            <span>{selectedOrder.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                                        <span>Payment Method:</span>
                                        <span>{selectedOrder.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            {selectedOrder?.status === 'completed' && (
                                <Button onClick={() => handleDownloadInvoice(selectedOrder.id)} variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Invoice
                                </Button>
                            )}
                            <Button onClick={() => setIsOrderDetailsOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default Orders;
