import { create } from 'zustand'

// Dynamic import function to avoid circular dependency
const getAxiosConn = async () => {
    const { default: axiosConn } = await import("@/axioscon.js");
    return axiosConn;
};

export const useAuthStore = create((set) => ({
    accessToken: null,
    userDetail: null,
    loading:true,
    setAccessToken: (accessToken) => {
        set(() => ({accessToken:  accessToken}));
        console.log("zustland useAuthStore.setAccessToken ",  accessToken);
    },
    setUserDetail: (userDetail) => {
        set(() => ({userDetail: userDetail}));
        console.log("zustland useAuthStore.setUserDetail ", userDetail);
    },
    fetchUserDetail: async () => {
        try {
            const axiosConn = await getAxiosConn();
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/getUser",
                { });
            set({ userDetail: res.data?.data?.data, loading: false });  // Set loading to false after fetch
        } catch (error) {
            console.error("Error fetching user details:", error);
            set({ loading: false });  // Set loading to false even on error
        }
    },
}))

export const useOrganizationStore = create((set, get) => ({
    // Organization status
    hasOrganization: false,
    loading: false,
    
    // Multiple organizations support
    organizations: [],
    selectedOrganization: null,
    organizationsLoading: false,
    
    // Actions
    setHasOrganization: (hasOrg) => set({ hasOrganization: hasOrg }),
    setOrganizations: (organizations) => set({ organizations }),
    setSelectedOrganization: (organization) => set({ selectedOrganization: organization }),
    

    
    // Fetch all organizations for the user
    fetchUserOrganizations: async () => {
        try {
            set({ organizationsLoading: true });
            console.log("Fetching user organizations...");
            
            const axiosConn = await getAxiosConn();
            const response = await axiosConn.get("/user/organizations");
            console.log("Organization API response:", response.data);
            
            // Check for successful response status (200) instead of success field
            if (response.data.status === 200 || response.status === 200) {
                const organizations = response.data.data || [];
                console.log("Organizations received:", organizations);
                
                set({ 
                    organizations,
                    organizationsLoading: false,
                    // Set first organization as selected if none selected
                    selectedOrganization: organizations.length > 0 && !get().selectedOrganization 
                        ? organizations[0] 
                        : get().selectedOrganization
                });
                
                console.log("Organization store updated successfully");
            } else {
                console.log("API response not successful:", response.data);
                set({ 
                    organizations: [],
                    organizationsLoading: false 
                });
            }
        } catch (error) {
            console.error("Error fetching user organizations:", error);
            set({ 
                organizations: [],
                organizationsLoading: false 
            });
        }
    },
    
    // Reset organization status (call after successful registration)
    resetOrganizationStatus: () => {
        set({
            hasOrganization: true,
        });
        // Refresh organizations list
        get().fetchUserOrganizations();
    }
}))

export const useCreditStore = create((set, get) => ({
    // Credit balance and info
    currentCredits: 0,
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
            const axiosConn = await getAxiosConn();
            const res = await axiosConn.post(import.meta.env.VITE_API_URL+"/getUser", {});
            set({ 
                currentCredits: res.data?.data?.data?.creditBalance || 0,
                totalCreditsEverPurchased: res.data?.data?.data?.totalPurchased || 0,
                creditsUsedThisMonth: res.data?.data?.data?.usedThisMonth || 0,
                creditsExpiringSoon: res.data?.data?.data?.expiringSoon || 0,
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
            const axiosConn = await getAxiosConn();
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
            const axiosConn = await getAxiosConn();
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

export const useProtectedURIStore = create(() => ({
    publicUri : ['/signin' ],
}));