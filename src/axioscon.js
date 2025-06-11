import axios from "axios";
import { refreshToken } from "./utils/refreshTokenUtils";
import { useAuthStore, useProtectedURIStore } from "@/zustland/store";

const axiosConn = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

const { publicUri } = useProtectedURIStore.getState();

// Refresh lock + retry queue
let isRefreshInProgress = false;
let refreshSubscribers = [];

// Notify all subscribers with new token
function onRefreshed() {
    refreshSubscribers.forEach(callback => callback());
    refreshSubscribers = [];
}

// Push failed requests to retry after refresh
function addSubscriber(callback) {
    refreshSubscribers.push(callback);
}

// Request interceptor
axiosConn.interceptors.request.use(
    function (config) {
        const { accessToken } = useAuthStore.getState();
        config.withCredentials = true;
        config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : "";
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
        const originalRequest = error.config;

        if (publicUri.includes(window.location.pathname) && window.location.pathname === "/signin") {
            return Promise.reject(error);
        }

        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshInProgress) {
                isRefreshInProgress = true;

                try {
                    const { isSuccess } = await refreshToken();
                    if (isSuccess) {
                        isRefreshInProgress = false;
                        onRefreshed(); // Notify queued requests
                        return axiosConn(originalRequest);
                    } else {
                        isRefreshInProgress = false;
                        window.location.href = "/signin" + getRedirectUri();
                        return Promise.reject(error);
                    }
                } catch (err) {
                    isRefreshInProgress = false;
                    window.location.href = "/signin" + getRedirectUri();
                    return Promise.reject(err);
                }
            }

            // Queue the request until refresh is complete
            return new Promise((resolve) => {
                addSubscriber(() => {
                    resolve(axiosConn(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);

function getRedirectUri() {
    return publicUri.includes(window.location.pathname)
        ? ""
        : "?redirectUri=" + encodeURIComponent(window.location.href);
}

export default axiosConn;
