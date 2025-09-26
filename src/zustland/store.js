import { create } from 'zustand'

// Key for persisting selected organization (only orgId) in localStorage
const ORG_STORAGE_KEY = 'fa_selected_org_v1';

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
    selectedOrganization: null, // null means general, org object means selected organization (rehydrated after fetch)
    organizationsLoading: false,
    organizationsError: null, // Add error state
    
    // Actions
    setHasOrganization: (hasOrg) => set({ hasOrganization: hasOrg }),
    setOrganizations: (organizations) => set({ organizations }),
    setSelectedOrganization: (organization) => {
        // organization can be null (for general) or an organization object
        set({ selectedOrganization: organization });
        try {
            if (typeof window !== 'undefined') {
                if (organization && organization.orgId) {
                    localStorage.setItem(ORG_STORAGE_KEY, organization.orgId.toString());
                } else {
                    localStorage.removeItem(ORG_STORAGE_KEY);
                }
            }
        } catch (e) {
            console.warn('Failed to persist selected organization', e);
        }
    },
    

    
    // Fetch all organizations for the user
    fetchUserOrganizations: async () => {
        try {
            set({ organizationsLoading: true, organizationsError: null });
            console.log("Fetching user organizations...");
            
            const axiosConn = await getAxiosConn();
            const response = await axiosConn.get("/user/organizations");
            console.log("Organization API response:", response.data);
            
            // Check for successful response status (200) instead of success field
            if (response.data.status === 200 || response.status === 200) {
                const organizations = response.data.data || [];
                console.log("Organizations received:", organizations);
                
                // Validate organization data structure
                const validOrganizations = organizations.filter(org => 
                    org && typeof org === 'object' && org.orgId && org.orgName
                );
                
                if (validOrganizations.length !== organizations.length) {
                    console.warn("Some organizations had invalid data structure:", organizations);
                }
                
                const currentState = get();
                const storedOrgId = (typeof window !== 'undefined') ? localStorage.getItem(ORG_STORAGE_KEY) : null;

                set({
                    organizations: validOrganizations,
                    organizationsLoading: false,
                    hasOrganization: validOrganizations.length > 0,
                });
                
                // Rehydrate previously selected organization if it still exists
                if (storedOrgId) {
                    const match = validOrganizations.find(o => o.orgId?.toString() === storedOrgId);
                    if (match) {
                        set({ selectedOrganization: match });
                    } else {
                        // Stored org no longer available
                        try { 
                            localStorage.removeItem(ORG_STORAGE_KEY); 
                        } catch {
                            // ignore cleanup error
                        }
                        if (currentState.selectedOrganization === null && validOrganizations.length > 0) {
                            set({ selectedOrganization: validOrganizations[0] });
                        }
                    }
                } else if (currentState.selectedOrganization === null && validOrganizations.length > 0) {
                    // No stored org, fallback to first (previous behaviour)
                    set({ selectedOrganization: validOrganizations[0] });
                }
                
                console.log("Organization store updated successfully");
            } else {
                const errorMessage = response.data?.message || "Failed to fetch organizations";
                console.log("API response not successful:", response.data);
                set({ 
                    organizations: [],
                    organizationsLoading: false,
                    organizationsError: errorMessage,
                    hasOrganization: false,
                });
            }
        } catch (error) {
            console.error("Error fetching user organizations:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch organizations";
            set({ 
                organizations: [],
                organizationsLoading: false,
                organizationsError: errorMessage,
                hasOrganization: false,
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