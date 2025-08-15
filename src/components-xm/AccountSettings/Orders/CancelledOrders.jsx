import React, { useState, useEffect } from "react";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {XCircle, IndianRupee, Eye, Package} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import { useOrderStore } from "@/zustland/store.js";

function CancelledOrders() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

    // Get orders data from Zustand store
    const { 
        orders,
        fetchOrders
    } = useOrderStore();

    // Fetch orders data on component mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filter cancelled/failed orders
    const cancelledOrders = orders.filter(order => order.status === 'cancelled' || order.status === 'failed');

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsOrderDetailsOpen(true);
    };

    const getStatusDisplay = (status) => {
        if (status === 'failed') {
            return {
                label: 'Failed',
                color: 'bg-red-100 text-red-800 border-red-200'
            };
        }
        return {
            label: 'Cancelled',
            color: 'bg-red-100 text-red-800 border-red-200'
        };
    };

    return (
        <>
            <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            Cancelled Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {cancelledOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No cancelled orders found</p>
                                <p className="text-gray-400 text-sm">Your cancelled orders will appear here</p>
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
                                    {cancelledOrders.map((order) => {
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
                                                        <XCircle className="w-4 h-4" />
                                                        {statusInfo.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
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
                                    <XCircle className="w-4 h-4" />
                                    {getStatusDisplay(selectedOrder.status).label}
                                </Badge>
                            </div>

                            {/* Order Date */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Order Date:</span>
                                <span className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                            </div>

                            {/* Cancellation/Failure Info */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-red-800 mb-2">
                                    <XCircle className="w-4 h-4" />
                                    <span className="font-medium">
                                        {selectedOrder.status === 'failed' ? 'Order Failed' : 'Order Cancelled'}
                                    </span>
                                </div>
                                <p className="text-red-700 text-sm">
                                    {selectedOrder.status === 'failed' 
                                        ? 'This order failed during processing. If you were charged, the amount will be refunded within 3-5 business days.'
                                        : 'This order was cancelled. If you were charged, the amount will be refunded within 3-5 business days.'
                                    }
                                </p>
                            </div>

                            {/* Items */}
                            <div>
                                <h4 className="font-medium mb-3">Items:</h4>
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
                                <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                                    <span>Refund Status:</span>
                                    <span className="text-orange-600 font-medium">
                                        {selectedOrder.refundStatus || 'Processing'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setIsOrderDetailsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CancelledOrders;
