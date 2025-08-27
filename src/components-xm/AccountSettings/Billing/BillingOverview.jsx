import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.jsx";
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
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
  CreditCard,
  Download,
  Calendar,
  IndianRupee,
  Plus,
  MoreHorizontal,
  Coins,
  Zap,
  Star,
  Crown,
  TrendingUp,
  Clock,
  CheckCircle,
  UserCircle,
  Shield,
  Bell,
  ShoppingBag,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";

import CreditWidget from "@/components/CreditWidget.jsx";
import { useToast } from "@/components/hooks/use-toast.js";
import BillingHistory from "./BillingHistory";


function BillingOverview() {
  const { toast } = useToast();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Local state for credit stats
  const [currentCredits, setCurrentCredits] = useState(0);
  const [creditsUsedThisMonth, setCreditsUsedThisMonth] = useState(0);
  const [creditsExpiringSoon, setCreditsExpiringSoon] = useState(0);
  const [totalCreditsEverPurchased, setTotalCreditsEverPurchased] = useState(0); // Not in API, keep as 0 or fetch elsewhere if needed
  const [loading, setLoading] = useState(false);
  const [dailyExpense, setDailyExpense] = useState([]);
  // Set a max credits value for progress bar (can be changed as needed)
  const maxCredits = 2000;
  const creditsProgress = Math.min((currentCredits / maxCredits) * 100, 100);

  // Fetch credit stats from API
  const fetchCreditStats = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/credit/getUserCreditStats",
        {},
        { withCredentials: true }
      );
      const json = res.data;
      if (json.status === 200 && json.data) {
        setCurrentCredits(json.data.available || 0);
        setCreditsUsedThisMonth(json.data.usedThisMonth || 0);
        setCreditsExpiringSoon(json.data.expiring || 0);
        // Optionally: setTotalCreditsEverPurchased(json.data.totalPurchased || 0);
        setDailyExpense(json.data.dailyExpense || []);
      }
    } catch (err) {
      toast({
        title: "Failed to fetch credit stats",
        description:
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          "Could not fetch credit stats.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Credit packages/plans
  const creditPlans = [
    {
      id: "starter",
      name: "Starter Pack",
      credits: 500,
      price: 999,
      originalPrice: 1499,
      discount: 33,
      popular: false,
      features: [
        "Perfect for beginners",
        "1-2 courses access",
        "Basic support",
        "Valid for 6 months",
      ],
    },
    {
      id: "professional",
      name: "Professional Pack",
      credits: 1500,
      price: 2499,
      originalPrice: 3999,
      discount: 37,
      popular: true,
      features: [
        "Most popular choice",
        "3-5 courses access",
        "Priority support",
        "Mock interviews included",
        "Valid for 12 months",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise Pack",
      credits: 3000,
      price: 4999,
      originalPrice: 7999,
      discount: 37,
      popular: false,
      features: [
        "Best value for money",
        "Unlimited course access",
        "24/7 premium support",
        "All premium features",
        "Valid for 18 months",
      ],
    },
  ];


  // Purchase logic placeholder (replace with your actual purchase API logic)
  const handlePurchaseCredits = (plan) => {
    setSelectedPlan(plan);
    setIsPurchaseModalOpen(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPlan) return;
    // Simulate purchase success
    toast({
      title: "Purchase Successful!",
      description: `${selectedPlan.credits} credits have been added to your account.`,
      duration: 5000,
    });
    setIsPurchaseModalOpen(false);
    // Optionally, re-fetch credit stats
    fetchCreditStats();
  };


  useEffect(() => {
    fetchCreditStats();
    // eslint-disable-next-line
  }, []);

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
                <p className="text-sm font-medium text-emerald-700 tracking-wide uppercase">
                  Available Credits
                </p>
                <p className="text-3xl font-black text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                  {currentCredits.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-1 bg-emerald-200 rounded-full flex-1 relative">
                    <div
                      className="h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full absolute top-0 left-0"
                      style={{ width: `${creditsProgress}%`, minWidth: creditsProgress > 0 ? '8px' : 0 }}
                    ></div>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">
                    {creditsProgress === 100 ? 'Maxed' : 'Active'}
                  </span>
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
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 border-0"
                >
                  This Month
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-700 tracking-wide uppercase">
                  Used This Month
                </p>
                <p className="text-3xl font-black text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  {creditsUsedThisMonth}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">
                    {creditsUsedThisMonth > 0 ? "+" : ""}
                    {((creditsUsedThisMonth / 1000) * 100).toFixed(1)}% usage
                    rate
                  </span>
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
                    <span className="text-xs text-amber-600 font-medium">
                      Alert
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-700 tracking-wide uppercase">
                  Expiring Soon
                </p>
                <p
                  className={`text-3xl font-black transition-colors duration-300 ${
                    creditsExpiringSoon > 0
                      ? "text-amber-600 group-hover:text-amber-700"
                      : "text-gray-800 group-hover:text-amber-700"
                  }`}
                >
                  {creditsExpiringSoon}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {creditsExpiringSoon > 0 ? (
                    <>
                      <Bell className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span className="text-xs text-amber-600 font-medium">
                        Action Required
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        All Credits Safe
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>


                    {/* Total Purchased Card */}
          <Card className="group relative border-0 shadow-xl bg-gradient-to-br from-purple-50 via-white to-violet-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-7 h-7 text-purple-600" />
                </div>
              </div>
              <p className="text-lg font-semibold text-purple-700 mb-2">Add Credits</p>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 mt-2"
                onClick={() => handlePurchaseCredits(creditPlans[1])}
                aria-label="Add Credit"
              >
                <Plus className="w-4 h-4 mr-2 inline" /> Add Credit
              </Button>
              <p className="text-xs text-gray-500 mt-3">Top up your credits instantly</p>
            </CardContent>
          </Card>



        </div>

   

        {/* Daily Expense Graph */}
        <Card className="mt-4 border-0 shadow-lg bg-white/80  ">
          <CardHeader>
          <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
               Credit Usage - Expense
              </CardTitle>   
              <CardDescription className=" ">
                  You've used {creditsUsedThisMonth} credits this month.{" "}
                  {1000 - creditsUsedThisMonth} credits remaining for optimal
                  usage.
                </CardDescription>
          </CardHeader>
          <CardContent>
            {dailyExpense && dailyExpense.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dailyExpense} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickFormatter={d => `Day ${d}`} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, name === 'totalExpense' ? 'Expense' : name]} />
                  <Line type="monotone" dataKey="totalExpense" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 text-center py-8">No expense data for this month.</div>
            )}
          </CardContent>
        </Card>

        <BillingHistory />
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
                      <p className="text-sm text-gray-600">
                        {selectedPlan.credits.toLocaleString()} credits
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        ₹{selectedPlan.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        ₹{selectedPlan.originalPrice.toLocaleString()}
                      </p>
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
            <Button
              variant="outline"
              onClick={() => setIsPurchaseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPurchase}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BillingOverview;
