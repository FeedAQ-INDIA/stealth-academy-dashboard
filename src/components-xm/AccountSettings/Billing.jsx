import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React, { useState, useEffect } from "react";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CreditCard, Download, Calendar, IndianRupee, Plus, MoreHorizontal, Coins, Zap, Star, Crown, TrendingUp, Clock, CheckCircle, UserCircle, Shield, Bell, ShoppingBag} from "lucide-react";
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
import { Progress } from "@/components/ui/progress.jsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { useCreditStore } from "@/zustland/store.js";
import CreditWidget from "@/components/CreditWidget.jsx";
import ServicePricingGrid from "@/components/ServicePricingGrid.jsx";
import { useToast } from "@/components/hooks/use-toast.js";

function Billing() {
    const { toast } = useToast();
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    // Content tabs for billing section
    const billingTabs = [
        { 
            id: "overview", 
            label: "Overview", 
            icon: TrendingUp, 
            description: "Credit overview and usage statistics"
        },
        { 
            id: "purchase", 
            label: "Buy Credits", 
            icon: Coins, 
            description: "Purchase credit packages"
        },
        { 
            id: "services", 
            label: "Service Costs", 
            icon: Star, 
            description: "View service pricing"
        },
        { 
            id: "history", 
            label: "Transaction History", 
            icon: Clock, 
            description: "View transaction history"
        },
    ];

    // Get credit data from Zustand store
    const { 
        currentCredits, 
        totalCreditsEverPurchased, 
        creditsUsedThisMonth, 
        creditsExpiringSoon,
        creditHistory,
        loading,
        fetchCreditBalance,
        fetchCreditHistory,
        purchaseCredits
    } = useCreditStore();

    // Fetch credit data on component mount
    useEffect(() => {
        fetchCreditBalance();
        fetchCreditHistory();
    }, [fetchCreditBalance, fetchCreditHistory]);

    // Credit packages/plans
    const creditPlans = [
        {
            id: 'starter',
            name: 'Starter Pack',
            credits: 500,
            price: 999,
            originalPrice: 1499,
            discount: 33,
            popular: false,
            features: [
                'Perfect for beginners',
                '1-2 courses access',
                'Basic support',
                'Valid for 6 months'
            ]
        },
        {
            id: 'professional',
            name: 'Professional Pack',
            credits: 1500,
            price: 2499,
            originalPrice: 3999,
            discount: 37,
            popular: true,
            features: [
                'Most popular choice',
                '3-5 courses access',
                'Priority support',
                'Mock interviews included',
                'Valid for 12 months'
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise Pack',
            credits: 3000,
            price: 4999,
            originalPrice: 7999,
            discount: 37,
            popular: false,
            features: [
                'Best value for money',
                'Unlimited course access',
                '24/7 premium support',
                'All premium features',
                'Valid for 18 months'
            ]
        }
    ];

    // Service costs in credits
    const serviceCosts = [
        { service: 'Course Access', cost: 100, description: 'Per course enrollment' },
        { service: 'Mock Interview', cost: 50, description: 'AI-powered practice session' },
        { service: 'Career Guidance', cost: 75, description: 'Personalized counseling' },
        { service: 'Resume Review', cost: 25, description: 'AI analysis and feedback' },
        { service: 'Skill Assessment', cost: 30, description: 'Comprehensive evaluation' }
    ];

    // Credit transaction history will come from store
    
    const handlePurchaseCredits = (plan) => {
        setSelectedPlan(plan);
        setIsPurchaseModalOpen(true);
    };

    const confirmPurchase = async () => {
        if (!selectedPlan) return;
        
        const result = await purchaseCredits(
            selectedPlan.id, 
            selectedPlan.price, 
            selectedPlan.credits
        );
        
        if (result.success) {
            toast({
                title: "Purchase Successful!",
                description: `${selectedPlan.credits} credits have been added to your account.`,
                duration: 5000,
            });
            setIsPurchaseModalOpen(false);
        } else {
            toast({
                title: "Purchase Failed",
                description: result.error || "Something went wrong. Please try again.",
                variant: "destructive",
                duration: 5000,
            });
        }
    };

    const handleServiceSelect = (service) => {
        toast({
            title: "Service Started!",
            description: `${service.name} has been initiated. ${service.credits} credits deducted.`,
            duration: 4000,
        });
    };

    return (
        <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">Credits & Billing</BreadcrumbPage>
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
                            <Coins className="w-8 h-8" />
                            Credits & Billing Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-white/90 text-lg mb-6">
                            Manage your credits, purchase new packages, and track your usage
                        </p>
                        <div className="flex items-center justify-center gap-8 text-center mb-6">
                            <div>
                                <p className="text-3xl font-bold">{currentCredits.toLocaleString()}</p>
                                <p className="text-white/80">Available Credits</p>
                            </div>
                            <Separator orientation="vertical" className="h-12 bg-white/30" />
                            <div>
                                <p className="text-3xl font-bold text-yellow-300">{creditsExpiringSoon}</p>
                                <p className="text-white/80">Expiring Soon</p>
                            </div>
                        </div>
                        
                        {/* Content Tabs */}
                        <div className="">
                            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border">
                                {billingTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
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
                    {/* Overview Tab Content */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Credit Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-green-100 rounded-full">
                                            <Coins className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Available Credits</p>
                                            <p className="text-2xl font-bold text-gray-800">{currentCredits.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 rounded-full">
                                            <TrendingUp className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Used This Month</p>
                                            <p className="text-2xl font-bold text-gray-800">{creditsUsedThisMonth}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-100 rounded-full">
                                            <Star className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Purchased</p>
                                            <p className="text-2xl font-bold text-gray-800">{totalCreditsEverPurchased.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-orange-100 rounded-full">
                                            <Clock className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Expiring Soon</p>
                                            <p className="text-2xl font-bold text-orange-600">{creditsExpiringSoon}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Credit Widget for Quick Overview */}
                        <CreditWidget 
                            className="mb-6"
                            showBalance={true}
                            showQuickPurchase={true}
                            compact={false}
                        />

                        {/* Credit Usage Progress */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Monthly Credit Usage
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Credits used this month</span>
                                        <span>{creditsUsedThisMonth} / 1000</span>
                                    </div>
                                    <Progress value={(creditsUsedThisMonth / 1000) * 100} className="h-3" />
                                    <p className="text-sm text-gray-600">
                                        You've used {creditsUsedThisMonth} credits this month. {1000 - creditsUsedThisMonth} credits remaining for optimal usage.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button className="h-16 flex flex-col gap-2" onClick={() => setIsPurchaseModalOpen(true)}>
                                        <Plus className="w-5 h-5" />
                                        Buy More Credits
                                    </Button>
                                    <Button variant="outline" className="h-16 flex flex-col gap-2">
                                        <Download className="w-5 h-5" />
                                        Download Report
                                    </Button>
                                    <Button variant="outline" className="h-16 flex flex-col gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Payment Methods
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        </div>
                    )}

                    {/* Purchase Credits Tab */}
                    {activeTab === "purchase" && (
                        <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Credit Package</h2>
                            <p className="text-gray-600">Select the perfect package for your learning journey</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {creditPlans.map((plan) => (
                                <Card key={plan.id} className={`relative border-2 shadow-lg bg-white transition-all duration-300 hover:scale-105 ${plan.popular ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}>
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <Badge className="bg-purple-500 text-white px-4 py-1">
                                                <Crown className="w-4 h-4 mr-1" />
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}
                                    
                                    <CardHeader className="text-center pb-4">
                                        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center gap-2">
                                                <Coins className="w-6 h-6 text-yellow-500" />
                                                <span className="text-3xl font-bold text-purple-600">{plan.credits.toLocaleString()}</span>
                                                <span className="text-gray-600">credits</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-2xl font-bold">₹{plan.price.toLocaleString()}</span>
                                                <span className="text-lg text-gray-400 line-through">₹{plan.originalPrice.toLocaleString()}</span>
                                            </div>
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                {plan.discount}% OFF
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            {plan.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-gray-600">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <Button 
                                            className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                                            onClick={() => handlePurchaseCredits(plan)}
                                        >
                                            Purchase Credits
                                        </Button>
                                        
                                        <p className="text-xs text-center text-gray-500">
                                            ₹{(plan.price / plan.credits).toFixed(2)} per credit
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Zap className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Why Choose Our Credit System?</h3>
                                        <p className="text-gray-600">
                                            Our flexible credit system allows you to pay once and use across all our services. 
                                            Credits never expire within the validity period, giving you complete control over your learning journey.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        </div>
                    )}

                    {/* Service Costs Tab */}
                    {activeTab === "services" && (
                        <div className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    Service Credit Costs
                                </CardTitle>
                                <p className="text-gray-600">Here's how many credits each service costs</p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {serviceCosts.map((service, index) => (
                                        <Card key={index} className="border border-gray-200 hover:border-purple-300 transition-colors">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold">{service.service}</h3>
                                                        <p className="text-sm text-gray-600">{service.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1">
                                                            <Coins className="w-4 h-4 text-yellow-500" />
                                                            <span className="font-bold text-lg">{service.cost}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500">credits</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Credit Calculation Made Simple</h3>
                                        <p className="text-gray-600">
                                            All services are priced in credits for transparent and predictable costs. 
                                            Use our credit calculator to plan your learning budget effectively.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interactive Service Pricing */}
                        <div className="mt-8">
                            <ServicePricingGrid 
                                title="Try Our Services"
                                subtitle="Use your credits to access premium learning services"
                                onServiceSelect={handleServiceSelect}
                                className="mt-6"
                            />
                        </div>
                        </div>
                    )}

                    {/* Transaction History Tab */}
                    {activeTab === "history" && (
                        <div className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Credit Transaction History
                                    </CardTitle>
                                    <Button variant="outline" className="border-gray-300">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export History
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Credits</TableHead>
                                            <TableHead>Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {creditHistory.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>{transaction.date}</TableCell>
                                                <TableCell>
                                                    <Badge variant={transaction.type === 'purchase' ? 'default' : 'secondary'}>
                                                        {transaction.type === 'purchase' ? 'Purchase' : 'Usage'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{transaction.description}</TableCell>
                                                <TableCell>
                                                    <span className={`font-medium ${transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {transaction.credits}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {transaction.type === 'purchase' ? `₹${transaction.amount.toLocaleString()}` : '-'}
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

                {/* Purchase Confirmation Modal */}
                <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Credit Purchase</DialogTitle>
                            <DialogDescription>
                                You're about to purchase the {selectedPlan?.name}
                            </DialogDescription>
                        </DialogHeader>
                        
                        {selectedPlan && (
                            <div className="space-y-4">
                                <Card className="border-purple-200 bg-purple-50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">{selectedPlan.name}</h3>
                                                <p className="text-sm text-gray-600">{selectedPlan.credits.toLocaleString()} credits</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold">₹{selectedPlan.price.toLocaleString()}</p>
                                                <p className="text-sm text-gray-500 line-through">₹{selectedPlan.originalPrice.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <div className="space-y-2">
                                    <h4 className="font-medium">What you'll get:</h4>
                                    <ul className="space-y-1">
                                        {selectedPlan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPurchaseModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmPurchase} className="bg-purple-600 hover:bg-purple-700">
                                Proceed to Payment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default Billing;
