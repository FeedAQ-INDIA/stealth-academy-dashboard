import { useAuthStore } from "@/zustland/store.js";
import axiosConn from "@/axioscon.js";

export const refreshToken = async () => {
  try {
    const response = await axiosConn.post(
            import.meta.env.VITE_API_URL+`/auth/refresh-token`,
        {},
        { withCredentials: true }
    );

    const newAccessToken = response.data.accessToken;
    console.log("New Access Token:", newAccessToken);

    // Correct way to update Zustand store from a non-React function
    useAuthStore.getState().setAccessToken(newAccessToken);

    return {isSuccess : true , isTemp : response?.data?.isTemp};
  } catch (error) {
    console.error("Failed to refresh token:", error?.response?.data || error.message);
    throw new Error("Token Refresh Failed");
  }
};



