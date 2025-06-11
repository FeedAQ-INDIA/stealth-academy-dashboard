import { useAuthStore } from "@/zustland/store.js";
import axiosConn from "@/axioscon.js";
import axios from "axios";

export const refreshToken = async () => {
  try {
    const response = await axios.post(
            import.meta.env.VITE_API_URL+`/auth/refresh-token`,
        {},
        { withCredentials: true }
    );

    const newAccessToken = response.data.accessToken;
    console.log("New Access Token:", newAccessToken);


    return {isSuccess : true };
  } catch (error) {
    console.error("Failed to refresh token:", error?.response?.data || error.message);
    return {isSuccess : false };
  }
};



