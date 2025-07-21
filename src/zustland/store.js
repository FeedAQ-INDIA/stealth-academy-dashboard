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
            set({ userDetail: res.data.data, loading: false });  // Set loading to false after fetch
        } catch (error) {
            console.error("Error fetching user details:", error);
            set({ loading: false });  // Set loading to false even on error
        }
    },
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