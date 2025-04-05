import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
 import { useDispatch } from "react-redux";
import {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {WorkspaceDashboard} from "@/components-xm/Workspace/WorkspaceDashboard.jsx";
import {useAuthStore  } from "@/zustland/store.js";
import {ToastAction} from "@/components/ui/toast.jsx";

function Wrapper() {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchUserDetail, loading: loadingStore , userDetail, fetchOrgData  } = useAuthStore();


    useEffect(() => {
        fetchUserDetail(); // Fetch user details and let Zustand update the state
    }, []); // Runs only once on mount

    useEffect(() => {
        // console.log(userDetail)
        if ((userDetail === null || userDetail === undefined) && !loadingStore) {
            console.log('redirecting to signin')
            window.location = '/signin';
        }
    }, [userDetail]); // Redirect only after userDetail updates




    if (loadingStore) {
        return <div>Loading...</div>; // Display loading screen until both data are ready
    }



    return (
        <>
             <Outlet/>


        </>
    );
}

export default Wrapper;
