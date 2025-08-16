import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React, { useState, useEffect } from "react";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Download, Clock, Filter, Calendar, Search} from "lucide-react";
import {Link} from "react-router-dom";
import {Badge} from "@/components/ui/badge.jsx";
import {Input} from "@/components/ui/input.jsx";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";
import { useCreditStore } from "@/zustland/store.js";
import { useToast } from "@/components/hooks/use-toast.js";

function BillingHistory() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [dateRange, setDateRange] = useState("all");

    // Get credit data from Zustand store
    const { 
        creditHistory,
        loading,
        fetchCreditHistory
    } = useCreditStore();

    // Fetch credit data on component mount
    useEffect(() => {
        fetchCreditHistory();
    }, [fetchCreditHistory]);

    // Filter transactions based on search and filters
    const filteredTransactions = creditHistory.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || transaction.type === filterType;
        
        // Date filtering logic can be added here
        let matchesDate = true;
        if (dateRange !== "all") {
            const transactionDate = new Date(transaction.date);
            const now = new Date();
            
            switch (dateRange) {
                case "7days":
                    matchesDate = (now - transactionDate) <= (7 * 24 * 60 * 60 * 1000);
                    break;
                case "30days":
                    matchesDate = (now - transactionDate) <= (30 * 24 * 60 * 60 * 1000);
                    break;
                case "90days":
                    matchesDate = (now - transactionDate) <= (90 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    matchesDate = true;
            }
        }
        
        return matchesSearch && matchesType && matchesDate;
    });

    const handleExportHistory = () => {
        // Create CSV content
        const csvContent = [
            ["Date", "Type", "Description", "Credits", "Amount"],
            ...filteredTransactions.map(transaction => [
                transaction.date,
                transaction.type,
                transaction.description,
                transaction.credits,
                transaction.type === 'purchase' ? transaction.amount : ''
            ])
        ].map(row => row.join(",")).join("\n");

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `credit_history_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
            title: "Export Successful!",
            description: "Your transaction history has been downloaded as a CSV file.",
            duration: 3000,
        });
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'purchase':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'usage':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'refund':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'bonus':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

                {/* Transaction History Content */}
                <div className="space-y-6">
                    {/* Filters and Search */}
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filter & Search Transactions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search transactions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Type Filter */}
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="purchase">Purchases</SelectItem>
                                        <SelectItem value="usage">Usage</SelectItem>
                                        <SelectItem value="refund">Refunds</SelectItem>
                                        <SelectItem value="bonus">Bonus</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Date Range Filter */}
                                <Select value={dateRange} onValueChange={setDateRange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Time</SelectItem>
                                        <SelectItem value="7days">Last 7 Days</SelectItem>
                                        <SelectItem value="30days">Last 30 Days</SelectItem>
                                        <SelectItem value="90days">Last 90 Days</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Export Button */}
                                <Button onClick={handleExportHistory} className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {filteredTransactions.filter(t => t.type === 'purchase').length}
                                    </p>
                                    <p className="text-sm text-gray-600">Total Purchases</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {filteredTransactions.filter(t => t.type === 'usage').length}
                                    </p>
                                    <p className="text-sm text-gray-600">Credit Usage</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">
                                        {filteredTransactions.reduce((sum, t) => sum + (t.type === 'purchase' ? t.credits : 0), 0).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600">Credits Purchased</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Transaction Table */}
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Credit Transaction History
                                </CardTitle>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {filteredTransactions.length} transactions
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Loading transactions...</span>
                                </div>
                            ) : filteredTransactions.length === 0 ? (
                                <div className="text-center py-8">
                                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No transactions found matching your criteria.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="font-semibold">Date</TableHead>
                                                <TableHead className="font-semibold">Transaction ID</TableHead>
                                                <TableHead className="font-semibold">Type</TableHead>
                                                <TableHead className="font-semibold">Description</TableHead>
                                                <TableHead className="font-semibold text-right">Credits</TableHead>
                                                <TableHead className="font-semibold text-right">Amount</TableHead>
                                                <TableHead className="font-semibold">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTransactions.map((transaction) => (
                                                <TableRow key={transaction.id} className="hover:bg-gray-50/80">
                                                    <TableCell className="font-medium">
                                                        {new Date(transaction.date).toLocaleDateString('en-IN', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm text-gray-600">
                                                        {transaction.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getTypeColor(transaction.type)}>
                                                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {transaction.description}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className={`font-semibold ${
                                                            transaction.type === 'purchase' || transaction.type === 'bonus'
                                                                ? 'text-green-600' 
                                                                : 'text-red-600'
                                                        }`}>
                                                            {transaction.type === 'purchase' || transaction.type === 'bonus' ? '+' : '-'}
                                                            {Math.abs(transaction.credits).toLocaleString()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        {transaction.type === 'purchase' && transaction.amount ? 
                                                            formatCurrency(transaction.amount) : 
                                                            '-'
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                            Completed
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
         </div>
    );
}

export default BillingHistory;
