import { create } from 'zustand'
import axiosConn from "@/axioscon.js";

export const useAuthStore = create((set) => ({
    accessToken: null,
    userDetail: null,
    userStatus: null,
    orgData: null,
    workspaceData:null,
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
            const res = await axiosConn.post("http://localhost:3000/getUser",
                {orgId: localStorage.getItem("currentOrg")});
            set({ userDetail: res.data.data, loading: false });  // Set loading to false after fetch
        } catch (error) {
            console.error("Error fetching user details:", error);
            set({ loading: false });  // Set loading to false even on error
        }
    },
    setWorkspaceData: (data) => {
        set(() => ({ workspaceData: data })); // Update the orgData with the passed value
        console.log("zustand useAuthStore.setWorkspaceData: ", data);
    },
    fetchWorkspaceData: async (workspaceId) => {
        try {
            const res = await axiosConn.post("http://localhost:3000/searchRecord", {
                limit: 1, offset: 0, getThisData: {
                    datasource: "Workspace", order: [], attributes: [], where: {
                        workspaceId: workspaceId, orgId: localStorage.getItem("currentOrg"),
                    },
                },
            });
            set({ workspaceData: res.data?.data?.results?.[0] || null ,loading: false});
        } catch (error) {
            console.error("Error fetching organizations:", error);
            set({ loading: false });  // Set loading to false even on error
        }
    },
    setOrgData: (newOrgData) => {
        set(() => ({ orgData: newOrgData })); // Update the orgData with the passed value
        console.log("zustand useAuthStore.setOrgData: ", newOrgData);
    },
    fetchOrgData: async () => {
        try {
            const res = await axiosConn.post("http://localhost:3000/searchRecord", {
                limit: 20,
                offset: 0,
                getThisData: {
                    datasource: "Org",
                    order: [],
                    attributes: [],
                    where: {orgId: localStorage.getItem("currentOrg")},

                },
            });
            set({ orgData: res.data?.data?.results?.[0] || [] ,loading: false});
        } catch (error) {
            console.error("Error fetching organizations:", error);
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