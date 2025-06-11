import axios from "axios";
import { refreshToken } from "./utils/refreshTokenUtils";
import { useAuthStore, useProtectedURIStore } from "@/zustland/store"; // ✅ Ensure the correct import path

const axiosConn = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

let refreshTokenCount = 0;
const {publicUri}= useProtectedURIStore.getState();

// Request interceptor
axiosConn.interceptors.request.use(
    function (config) {
        const { accessToken } = useAuthStore.getState(); // ✅ Correct way to get Zustand state
        console.log("Access Token:", accessToken);

        config.withCredentials = true;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosConn.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        if (publicUri.includes(window.location.pathname)  && window.location.pathname == "/signin") {

            return Promise.reject(error);
        }

        if (error.response && (error.response.status === 403 || error.response.status === 401)) {


                     console.log("Token expired, refreshing token...");
                    let {isSuccess  } = await refreshToken();

                    if(isSuccess)  {
                        // recall the endpoint
                    }else{
                             window.location.href = "/signin" + getRedirectUri();
                     }

                    return axiosConn(error.config);


        }


        return Promise.reject(error);
    }
);


const getRedirectUri = () => {
    if(publicUri.includes(window.location.pathname)) {
        return "";
    }else{
        return "?redirectUri="+window.location.href;
    }
}

export default axiosConn;
