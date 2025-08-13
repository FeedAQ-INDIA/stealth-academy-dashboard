import { create } from 'zustand'
import axiosConn from "@/axioscon.js";

export const useAuthStore = create((set) => ({
    accessToken: null,
    userDetail: null,
    loading:true,
    setAccessToken: (accessToken) => {
        set((state) => ({accessToken:  accessToken}));
        console.log("zustland useAuthStore.setAccessToken ",  accessToken);
    },
    setUserDetail: (userDetail) => {
        set((state) => ({userDetail: userDetail}));
        console.log("zustland useAuthStore.setUserDetail ", userDetail);
    },
    fetchUserDetail: async () => {
        try {
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/getUser",
                { });
            set({ userDetail: res.data?.data?.data, loading: false });  // Set loading to false after fetch
        } catch (error) {
            console.error("Error fetching user details:", error);
            set({ loading: false });  // Set loading to false even on error
        }
    },
}))

export const useCreditStore = create((set, get) => ({
    // Credit balance and info
    currentCredits: 1250,
    totalCreditsEverPurchased: 5000,
    creditsUsedThisMonth: 350,
    creditsExpiringSoon: 200,
    creditHistory: [],
    loading: false,
    
    // Actions
    setCurrentCredits: (credits) => set({ currentCredits: credits }),
    
    addCredits: (amount, description, transactionId) => {
        const currentCredits = get().currentCredits;
        set((state) => ({
            currentCredits: currentCredits + amount,
            totalCreditsEverPurchased: state.totalCreditsEverPurchased + amount,
            creditHistory: [
                {
                    id: transactionId || Date.now(),
                    date: new Date().toISOString().split('T')[0],
                    type: 'purchase',
                    amount: amount,
                    description: description || 'Credit Purchase',
                    credits: `+${amount}`
                },
                ...state.creditHistory
            ]
        }));
    },
    
    deductCredits: (amount, description, serviceType) => {
        const currentCredits = get().currentCredits;
        if (currentCredits >= amount) {
            set((state) => ({
                currentCredits: currentCredits - amount,
                creditsUsedThisMonth: state.creditsUsedThisMonth + amount,
                creditHistory: [
                    {
                        id: Date.now(),
                        date: new Date().toISOString().split('T')[0],
                        type: 'usage',
                        amount: amount,
                        description: description || 'Service Usage',
                        credits: `-${amount}`,
                        serviceType: serviceType
                    },
                    ...state.creditHistory
                ]
            }));
            return true; // Successfully deducted
        }
        return false; // Insufficient credits
    },
    
    fetchCreditBalance: async () => {
        set({ loading: true });
        try {
            // Replace with your actual API endpoint
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/getUserCredits", {});
            set({ 
                currentCredits: res.data?.data?.currentCredits || 0,
                totalCreditsEverPurchased: res.data?.data?.totalPurchased || 0,
                creditsUsedThisMonth: res.data?.data?.usedThisMonth || 0,
                creditsExpiringSoon: res.data?.data?.expiringSoon || 0,
                loading: false 
            });
        } catch (error) {
            console.error("Error fetching credit balance:", error);
            set({ loading: false });
        }
    },
    
    fetchCreditHistory: async () => {
        try {
            // Replace with your actual API endpoint
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/getCreditHistory", {});
            set({ creditHistory: res.data?.data?.history || [] });
        } catch (error) {
            console.error("Error fetching credit history:", error);
        }
    },
    
    purchaseCredits: async (planId, amount, credits) => {
        set({ loading: true });
        try {
            // Replace with your actual payment API endpoint
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/purchaseCredits", {
                planId,
                amount,
                credits
            });
            
            if (res.data?.success) {
                get().addCredits(credits, `Credit Purchase - ${planId}`, res.data?.transactionId);
                return { success: true, transactionId: res.data?.transactionId };
            }
            return { success: false, error: res.data?.message };
        } catch (error) {
            console.error("Error purchasing credits:", error);
            return { success: false, error: error.message };
        } finally {
            set({ loading: false });
        }
    }
}))

export const useLoadingBarStore = create((set) => ({
    loadingStates: {}, // Stores loading state for each component
    setLoading: (component, state) =>
        set((prev) => ({
            loadingStates: { ...prev.loadingStates, [component]: state },
        })),
}));

export const useProtectedURIStore = create((set) => ({
    publicUri : ['/signin', '/explore'],
}));

export const useOrderStore = create((set, get) => ({
    // Orders data
    orders: [
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
    ],
    loading: false,
    
    // Computed values
    get totalOrders() {
        return get().orders.length;
    },
    
    get completedOrders() {
        return get().orders.filter(order => order.status === 'completed').length;
    },
    
    get pendingOrders() {
        return get().orders.filter(order => order.status === 'pending' || order.status === 'processing').length;
    },
    
    get cancelledOrders() {
        return get().orders.filter(order => order.status === 'cancelled' || order.status === 'failed').length;
    },
    
    // Actions
    fetchOrders: async () => {
        set({ loading: true });
        try {
            // Replace with your actual API endpoint
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/getUserOrders", {});
            set({ 
                orders: res.data?.data?.orders || get().orders,
                loading: false 
            });
        } catch (error) {
            console.error("Error fetching orders:", error);
            set({ loading: false });
        }
    },
    
    cancelOrder: async (orderId) => {
        try {
            // Replace with your actual API endpoint
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/cancelOrder", {
                orderId
            });
            
            if (res.data?.success) {
                // Update order status locally
                set((state) => ({
                    orders: state.orders.map(order => 
                        order.id === orderId 
                            ? { ...order, status: 'cancelled' }
                            : order
                    )
                }));
                return { success: true };
            }
            return { success: false, error: res.data?.message };
        } catch (error) {
            console.error("Error cancelling order:", error);
            return { success: false, error: error.message };
        }
    },
    
    downloadInvoice: async (orderId) => {
        try {
            // Replace with your actual API endpoint
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
    },
    
    addOrder: (order) => {
        set((state) => ({
            orders: [order, ...state.orders]
        }));
    },
    
    updateOrderStatus: (orderId, status) => {
        set((state) => ({
            orders: state.orders.map(order => 
                order.id === orderId 
                    ? { ...order, status }
                    : order
            )
        }));
    }
}));