import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import Header from "./components-xm/Header/Header.jsx";
import { useDispatch } from "react-redux";
import {useEffect, useState} from "react";
 import axiosConn from "@/axioscon.js";
import {WorkspaceDashboard} from "@/components-xm/Workspace/WorkspaceDashboard.jsx";
import {useAuthStore  } from "@/zustland/store.js";
import {ToastAction} from "@/components/ui/toast.jsx";

function App() {
    const {WorkspaceId} = useParams();
    const navigate = useNavigate();

    const {
        workspaceData,
        setWorkspaceData,
        fetchWorkspaceData,
        orgData,
        loading: loadingStore,
    } = useAuthStore();

    useEffect(() => {

        fetchWorkspaceData(WorkspaceId)
    }, [WorkspaceId])






    useEffect(() => {
        if (!localStorage.getItem('currentOrg')) {
            navigate("/organization");
            console.log('redirecting to org')
        }
    }, []);


    return (
    <>
      <Header />
       <Outlet/>


    </>
  );
}

export default App;
