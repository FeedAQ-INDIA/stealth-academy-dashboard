import React, { useState, useEffect } from "react";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Clock, IndianRupee, Eye, MoreHorizontal, XCircle, Package} from "lucide-react";
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
import {Badge} from "@/components/ui/badge.jsx";
import { useOrderStore } from "@/zustland/store.js";
import { useToast } from "@/components/hooks/use-toast.js";

function PendingOrders() {
    const { toast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

    // Get orders data from Zustand store
    const { 
        orders,
        fetchOrders,
        cancelOrder
    } = useOrderStore();

    // Fetch orders data on component mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filter pending/processing orders
    const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing');

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

    const getStatusDisplay = (status) => {
        if (status === 'processing') {
            return {
                label: 'Processing',
                color: 'bg-blue-100 text-blue-800 border-blue-200'
            };
        }
        return {
            label: 'Pending',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
    };

    return (
        <>
            <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-600" />
                            Pending Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendingOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No pending orders found</p>
                                <p className="text-gray-400 text-sm">Your pending orders will appear here</p>
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
                                    {pendingOrders.map((order) => {
                                        const statusInfo = getStatusDisplay(order.status);
                                        return (
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
                                                    <Badge variant="outline" className={`${statusInfo.color} flex items-center gap-1`}>
                                                        <Clock className="w-4 h-4" />
                                                        {statusInfo.label}
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
                                        );
                                    })}
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
                                <Badge variant="outline" className={`${getStatusDisplay(selectedOrder.status).color} flex items-center gap-1`}>
                                    <Clock className="w-4 h-4" />
                                    {getStatusDisplay(selectedOrder.status).label}
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
                        <Button 
                            onClick={() => handleCancelOrder(selectedOrder?.id)} 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Order
                        </Button>
                        <Button onClick={() => setIsOrderDetailsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default PendingOrders;
