import React, { useState, useEffect } from "react";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Package, Download, IndianRupee, Eye, MoreHorizontal, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw} from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { useToast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";

function AllOrders() {
    const { toast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
    
    // Local state for orders
    const [orders, setOrders] = useState([
        {
            id: 'ORD-2024-001',
            date: '2024-08-10',
            status: 'completed',
            total: 2499,
            paymentMethod: 'Credit Card',
            items: [
                {
                    name: 'Professional Credit Pack',
                    description: '1500 Credits for course access and services',
                    price: 2499,
                    quantity: 1,
                    type: 'credits'
                }
            ]
        },
        {
            id: 'ORD-2024-002',
            date: '2024-08-08',
            status: 'completed',
            total: 1299,
            paymentMethod: 'UPI',
            items: [
                {
                    name: 'React Development Course',
                    description: 'Complete React.js course with hands-on projects',
                    price: 1299,
                    quantity: 1,
                    type: 'course'
                }
            ]
        },
        {
            id: 'ORD-2024-003',
            date: '2024-08-05',
            status: 'pending',
            total: 999,
            paymentMethod: 'Credit Card',
            items: [
                {
                    name: 'Starter Credit Pack',
                    description: '500 Credits for beginners',
                    price: 999,
                    quantity: 1,
                    type: 'credits'
                }
            ]
        },
        {
            id: 'ORD-2024-004',
            date: '2024-08-03',
            status: 'processing',
            total: 1899,
            paymentMethod: 'Net Banking',
            items: [
                {
                    name: 'Python for Data Science',
                    description: 'Complete Python course with data science projects',
                    price: 1299,
                    quantity: 1,
                    type: 'course'
                },
                {
                    name: 'Mock Interview Pack',
                    description: '10 AI-powered mock interviews',
                    price: 600,
                    quantity: 1,
                    type: 'service'
                }
            ]
        },
        {
            id: 'ORD-2024-005',
            date: '2024-07-28',
            status: 'cancelled',
            total: 4999,
            paymentMethod: 'Credit Card',
            items: [
                {
                    name: 'Enterprise Credit Pack',
                    description: '3000 Credits with premium features',
                    price: 4999,
                    quantity: 1,
                    type: 'credits'
                }
            ]
        },
        {
            id: 'ORD-2024-006',
            date: '2024-07-25',
            status: 'completed',
            total: 2199,
            paymentMethod: 'UPI',
            items: [
                {
                    name: 'Full Stack Development Bundle',
                    description: 'Frontend + Backend development courses',
                    price: 2199,
                    quantity: 1,
                    type: 'course'
                }
            ]
        }
    ]);
    const [loading, setLoading] = useState(false);

    // Fetch orders from API
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/getUserOrders", {});
            if (res.data?.data?.orders) {
                setOrders(res.data.data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cancel order
    const cancelOrder = async (orderId) => {
        try {
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/cancelOrder", {
                orderId
            });
            
            if (res.data?.success) {
                // Update order status locally
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId 
                            ? { ...order, status: 'cancelled' }
                            : order
                    )
                );
                return { success: true };
            }
            return { success: false, error: res.data?.message };
        } catch (error) {
            console.error("Error cancelling order:", error);
            return { success: false, error: error.message };
        }
    };

    // Download invoice
    const downloadInvoice = async (orderId) => {
        try {
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/downloadInvoice", {
                orderId
            }, {
                responseType: 'blob'
            });
            
            // Create blob link to download the invoice
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            return { success: true };
        } catch (error) {
            console.error("Error downloading invoice:", error);
            return { success: false, error: error.message };
        }
    };

    // Fetch orders data on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

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
        <>
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
        </>
    );
}

export default AllOrders;
