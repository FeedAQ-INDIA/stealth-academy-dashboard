import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card.jsx";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb.jsx";
import {
  Download,
  Clock,
  Filter,
  Calendar,
  Search,
  Info,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { useAuthStore, useCreditStore } from "@/zustland/store.js";
import { useToast } from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon";
import { set } from "lodash";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ContentLoader } from "@/components/ui/loading-components";

function BillingHistory() {
  const { toast } = useToast();
  const { userDetail } = useAuthStore();

  const [creditHistory, setCreditHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // UI page number starts from 1, but backend offset starts from 0
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [apiQuery, setApiQuery] = useState({
    limit: limit,
    offset: offset,
    getThisData: {
      datasource: "UserCreditTransaction",
      attributes: [],
      where: {
        userId: userDetail?.userId,
      },
      //  include: [
      //    {
      //      datasource: "User",
      //      as: "user",
      //      required: false,
      //    },
      //    {
      //      datasource: "User",
      //      as: "processor",
      //      required: false,
      //    },
      //  ],
    },
  });

  // Dummy function to get order details for a transaction (replace with real API if needed)
  const getOrderForTransaction = (transaction) => {
    // For demo, just return the transaction object. Replace with real order fetch if needed.
    return transaction;
  };

  const handleOrderClick = (transaction) => {
    setSelectedOrder(getOrderForTransaction(transaction));
    setOrderDialogOpen(true);
  };

  // Fetch credit data on page or user change
  useEffect(() => {
    setLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
      .then((res) => {
        setCreditHistory(res.data?.data?.results || []);
        setTotalCount(res.data?.data?.totalCount || 0);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [apiQuery]);

  // Map transactionType to UI type (for legacy UI logic)
  const mapType = (transactionType) => {
    if (transactionType === "CREDIT") return "bonus";
    if (transactionType === "DEBIT") return "usage";
    return transactionType?.toLowerCase() || "other";
  };

  // Filter transactions based on search and filters
  // Map the new creditHistory JSON to the UI's expected fields
  const mappedHistory = creditHistory.map((transaction) => ({
    id: String(transaction.transactionId),
    type: mapType(transaction.transactionType),
    description: transaction.description,
    credits: Number(transaction.amount),
    amount: Number(transaction.amount),
    date: transaction.transactionDate || transaction.created_at,
    status: transaction.transactionStatus,
    ...transaction,
  }));

  const getTypeColor = (type) => {
    switch (type) {
      case "bonus":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "usage":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[30ch]">
                Credits & Billing
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto sm:flex-initial"></div>
      </header>

      <div className="space-y-6 p-4">
        <div className="relative overflow-hidden">
          <Card className="w-full rounded-lg border-0 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-900  rounded-2xl text-white shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>

            <CardHeader className=" ">
              <CardTitle className="text-center tracking-wide text-2xl md:text-3xl  font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Transaction History
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Transaction Table */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5" />
                Credit & Orders History
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {totalCount} transactions
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
          <ContentLoader message="Loading your courses..." size="lg" className="min-h-[400px]" />

            ) : mappedHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No transactions found matching your criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">
                          Description
                        </TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold text-center">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-right">
                          Order
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mappedHistory.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className="hover:bg-gray-50/80"
                        >
                          <TableCell className="font-medium">
                            {transaction.date}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-gray-600">
                            {transaction.id}
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(transaction.type)}>
                              {transaction.type?.charAt(0).toUpperCase() +
                                transaction.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {transaction.description}
                          </TableCell>
                          <TableCell className=" font-semibold">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell className=" text-center">
                            <Badge
                              variant="outline"
                              className={
                                transaction.status === "COMPLETED"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className=" text-right">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleOrderClick(transaction)}
                              title="View Order"
                            >
                              <Info className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter className="w-full bg-white">
                      <TableRow>
                        <TableCell colSpan={7} className="p-0 border-0">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full px-4 py-3">
                            <div className="text-sm text-gray-600">
                              Showing {offset + 1} to{" "}
                              {Math.min(offset + limit, totalCount)} of{" "}
                              {totalCount} course{totalCount !== 1 ? "s" : ""}
                            </div>
                            <Pagination className="mr-0 ml-auto w-auto">
                              <PaginationContent>
                                <PaginationItem>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={offset === 0}
                                    onClick={() => {
                                      setOffset(Math.max(offset - limit, 0));
                                      setApiQuery((prevQuery) => ({
                                        ...prevQuery,
                                        offset: Math.max(offset - limit, 0),
                                      }));
                                    }}
                                    className="hover:bg-blue-50"
                                  >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                  </Button>
                                </PaginationItem>
                                <PaginationItem>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={offset + limit >= totalCount}
                                    onClick={() => {
                                      setOffset(
                                        offset + limit < totalCount
                                          ? offset + limit
                                          : offset
                                      );
                                      setApiQuery((prevQuery) => ({
                                        ...prevQuery,
                                        offset:
                                          offset + limit < totalCount
                                            ? offset + limit
                                            : offset,
                                      }));
                                    }}
                                    className="hover:bg-blue-50"
                                  >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
                {/* Pagination Controls */}
              </>
            )}
          </CardContent>
        </Card>

        {/* Order Dialog */}
        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                {selectedOrder ? (
                  <div className="space-y-2">
                    <div>
                      <b>Transaction ID:</b> {selectedOrder.id}
                    </div>
                    <div>
                      <b>Date:</b> {selectedOrder.date}
                    </div>
                    <div>
                      <b>Type:</b> {selectedOrder.type}
                    </div>
                    <div>
                      <b>Description:</b> {selectedOrder.description}
                    </div>
                    <div>
                      <b>Amount:</b> {formatCurrency(selectedOrder.amount)}
                    </div>
                    <div>
                      <b>Status:</b> {selectedOrder.status}
                    </div>
                    {/* Add more order details here as needed */}
                  </div>
                ) : (
                  <span>No order details found.</span>
                )}
              </DialogDescription>
              <DialogFooter>
                <Button onClick={() => setOrderDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default BillingHistory;
