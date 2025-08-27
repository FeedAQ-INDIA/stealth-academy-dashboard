import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card.jsx";
import React, { useState, useEffect } from "react";
import {Button} from "@/components/ui/button.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CreditCard, Download, Calendar, IndianRupee, Plus, MoreHorizontal, Coins, Zap, Star, Crown, TrendingUp, Clock, CheckCircle, UserCircle, Shield, Bell, ShoppingBag} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Badge} from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { useCreditStore } from "@/zustland/store.js";
import CreditWidget from "@/components/CreditWidget.jsx";
import { useToast } from "@/components/hooks/use-toast.js";
import BillingHistory from "./BillingHistory";

function BillingOverview() {
    const { toast } = useToast();
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Get credit data from Zustand store
    const { 
        currentCredits, 
        totalCreditsEverPurchased, 
        creditsUsedThisMonth, 
        creditsExpiringSoon,
        loading,
        fetchCreditBalance,
        purchaseCredits
    } = useCreditStore();

    // Fetch credit data on component mount
    useEffect(() => {
        fetchCreditBalance();
    }, [fetchCreditBalance]);

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

    useEffect(() => {
        const fetchData = async () => {
            await fetchCreditBalance();
            console.log(currentCredits);
        };
        fetchData();
    }, [fetchCreditBalance]);

    return (
        <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="space-y-4">
                    {/* Credit Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Available Credits Card */}
                        <Card className="group relative border-0 shadow-xl bg-gradient-to-br from-emerald-50 via-white to-green-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <Coins className="w-7 h-7 text-emerald-600" />
                                    </div>
                                    <div className="text-right">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-emerald-700 tracking-wide uppercase">Available Credits</p>
                                    <p className="text-3xl font-black text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                                        {currentCredits.toLocaleString()}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="h-1 bg-emerald-200 rounded-full flex-1">
                                            <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full w-4/5"></div>
                                        </div>
                                        <span className="text-xs text-emerald-600 font-medium">Active</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Used This Month Card */}
                        <Card className="group relative border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <TrendingUp className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                                        This Month
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-blue-700 tracking-wide uppercase">Used This Month</p>
                                    <p className="text-3xl font-black text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                                        {creditsUsedThisMonth}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <TrendingUp className="w-4 h-4 text-blue-500" />
                                        <span className="text-xs text-blue-600 font-medium">
                                            {creditsUsedThisMonth > 0 ? '+' : ''}{((creditsUsedThisMonth / 1000) * 100).toFixed(1)}% usage rate
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Purchased Card */}
                        <Card className="group relative border-0 shadow-xl bg-gradient-to-br from-purple-50 via-white to-violet-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <Star className="w-7 h-7 text-purple-600" />
                                    </div>
                                    <Crown className="w-5 h-5 text-purple-400 opacity-60" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-purple-700 tracking-wide uppercase">Total Purchased</p>
                                    <p className="text-3xl font-black text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                                        {totalCreditsEverPurchased.toLocaleString()}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-purple-400 fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-purple-600 font-medium">Lifetime Value</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Expiring Soon Card */}
                        <Card className="group relative border-0 shadow-xl bg-gradient-to-br from-amber-50 via-white to-orange-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <Clock className="w-7 h-7 text-amber-600" />
                                    </div>
                                    {creditsExpiringSoon > 0 && (
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-amber-600 font-medium">Alert</span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-amber-700 tracking-wide uppercase">Expiring Soon</p>
                                    <p className={`text-3xl font-black transition-colors duration-300 ${
                                        creditsExpiringSoon > 0 
                                            ? 'text-amber-600 group-hover:text-amber-700' 
                                            : 'text-gray-800 group-hover:text-amber-700'
                                    }`}>
                                        {creditsExpiringSoon}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        {creditsExpiringSoon > 0 ? (
                                            <>
                                                <Bell className="w-4 h-4 text-amber-500 animate-pulse" />
                                                <span className="text-xs text-amber-600 font-medium">Action Required</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-xs text-green-600 font-medium">All Credits Safe</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Credit Widget for Quick Overview */}
                    <CreditWidget 
                        className=""
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



                        </div>

<BillingHistory/>
        
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
    );
}

export default BillingOverview;
