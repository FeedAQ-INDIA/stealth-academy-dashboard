import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Coins, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useCreditStore } from '@/zustland/store.js';
import { useToast } from '@/components/hooks/use-toast.js';

const CreditWidget = ({ 
    className = "",
    showBalance = true,
    showQuickPurchase = true,
    compact = false 
}) => {
    const { toast } = useToast();
    const [isInsufficientCreditsModalOpen, setIsInsufficientCreditsModalOpen] = useState(false);
    const [isQuickPurchaseModalOpen, setIsQuickPurchaseModalOpen] = useState(false);
    
    const { 
        currentCredits, 
        creditsExpiringSoon,
        loading,
        addCredits 
    } = useCreditStore();

    const quickPurchaseOptions = [
        { credits: 100, price: 199, popular: false },
        { credits: 500, price: 899, popular: true },
        { credits: 1000, price: 1699, popular: false }
    ];

    const handleQuickPurchase = (option) => {
        // Simulate payment process
        addCredits(option.credits, `Quick Purchase - ${option.credits} credits`);
        setIsQuickPurchaseModalOpen(false);
        
        toast({
            title: "Credits Added Successfully!",
            description: `${option.credits} credits have been added to your account.`,
            duration: 3000,
        });
    };

    if (compact) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{currentCredits.toLocaleString()}</span>
                </div>
                {creditsExpiringSoon > 0 && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                        {creditsExpiringSoon} expiring
                    </Badge>
                )}
                {showQuickPurchase && (
                    <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setIsQuickPurchaseModalOpen(true)}
                    >
                        Add Credits
                    </Button>
                )}
            </div>
        );
    }

    return (
        <>
            <Card className={`bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 ${className}`}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-full">
                                <Coins className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                {showBalance && (
                                    <>
                                        <p className="text-sm text-gray-600">Available Credits</p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {currentCredits.toLocaleString()}
                                        </p>
                                    </>
                                )}
                                {creditsExpiringSoon > 0 && (
                                    <Badge variant="outline" className="text-orange-600 border-orange-300 mt-1">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        {creditsExpiringSoon} expiring soon
                                    </Badge>
                                )}
                            </div>
                        </div>
                        
                        {showQuickPurchase && (
                            <Button 
                                onClick={() => setIsQuickPurchaseModalOpen(true)}
                                disabled={loading}
                                className="bg-yellow-600 hover:bg-yellow-700"
                            >
                                Add Credits
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Purchase Modal */}
            <Dialog open={isQuickPurchaseModalOpen} onOpenChange={setIsQuickPurchaseModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Coins className="w-5 h-5" />
                            Quick Credit Purchase
                        </DialogTitle>
                        <DialogDescription>
                            Choose a credit package to add to your account instantly
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {quickPurchaseOptions.map((option, index) => (
                            <Card 
                                key={index} 
                                className={`cursor-pointer transition-all hover:scale-105 ${
                                    option.popular ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                                }`}
                                onClick={() => handleQuickPurchase(option)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Coins className="w-5 h-5 text-yellow-500" />
                                                <span className="font-bold text-lg">{option.credits}</span>
                                                <span className="text-sm text-gray-600">credits</span>
                                            </div>
                                            {option.popular && (
                                                <Badge className="bg-purple-100 text-purple-800">
                                                    Popular
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">₹{option.price}</p>
                                            <p className="text-xs text-gray-500">
                                                ₹{(option.price / option.credits).toFixed(2)} per credit
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsQuickPurchaseModalOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Insufficient Credits Modal */}
            <Dialog open={isInsufficientCreditsModalOpen} onOpenChange={setIsInsufficientCreditsModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Insufficient Credits
                        </DialogTitle>
                        <DialogDescription>
                            You don't have enough credits for this action. Purchase more credits to continue.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="text-center py-4">
                        <p className="text-lg mb-2">Current Balance: <span className="font-bold">{currentCredits}</span> credits</p>
                        <p className="text-sm text-gray-600">Add more credits to access our services</p>
                    </div>
                    
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsInsufficientCreditsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => {
                                setIsInsufficientCreditsModalOpen(false);
                                setIsQuickPurchaseModalOpen(true);
                            }}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Buy Credits
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreditWidget;

// Hook for checking and deducting credits before service usage
export const useCreditTransaction = () => {
    const { currentCredits, deductCredits } = useCreditStore();
    const [isInsufficientModalOpen, setIsInsufficientModalOpen] = useState(false);
    
    const checkAndDeductCredits = (amount, description, serviceType) => {
        if (currentCredits >= amount) {
            return deductCredits(amount, description, serviceType);
        } else {
            setIsInsufficientModalOpen(true);
            return false;
        }
    };

    const InsufficientCreditsModal = () => (
        <Dialog open={isInsufficientModalOpen} onOpenChange={setIsInsufficientModalOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Insufficient Credits
                    </DialogTitle>
                    <DialogDescription>
                        You need more credits to access this service.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="text-center py-4">
                    <p className="text-lg mb-2">Current Balance: <span className="font-bold">{currentCredits}</span> credits</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/account/billing'}>
                        Buy More Credits
                    </Button>
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInsufficientModalOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return {
        checkAndDeductCredits,
        InsufficientCreditsModal,
        currentCredits
    };
};
