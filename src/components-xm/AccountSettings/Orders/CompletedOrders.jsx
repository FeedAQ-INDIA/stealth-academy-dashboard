import React, { useState, useEffect } from "react";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {CheckCircle, Download, IndianRupee, Eye, MoreHorizontal, Package} from "lucide-react";
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

function CompletedOrders() {
    const { toast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

    // Get orders data from Zustand store
    const { 
        orders,
        fetchOrders,
        downloadInvoice
    } = useOrderStore();

    // Fetch orders data on component mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filter completed orders
    const completedOrders = orders.filter(order => order.status === 'completed');

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsOrderDetailsOpen(true);
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
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Completed Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {completedOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No completed orders found</p>
                                <p className="text-gray-400 text-sm">Your completed orders will appear here</p>
                            </div>
                        ) : (
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
                                    {completedOrders.map((order) => (
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
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Completed
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
                        <Button onClick={() => handleDownloadInvoice(selectedOrder.id)} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                        </Button>
                        <Button onClick={() => setIsOrderDetailsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CompletedOrders;
