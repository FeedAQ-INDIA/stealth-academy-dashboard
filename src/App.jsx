import {Outlet, useLocation, useNavigate} from "react-router-dom";
import Header from "./components-xm/Header/Header.jsx";
import {useEffect} from "react";
import {useAuthStore, useProtectedURIStore} from "@/zustland/store.js";
import "./App.css"
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";


function App() {
    const navigate = useNavigate();
    const location = useLocation();


    const {fetchUserDetail, loading: loadingStore, userDetail, fetchUserEnrolledCourseIdList} = useAuthStore();
    const {publicUri} = useProtectedURIStore();

    useEffect(() => {
          fetchUserDetail(); // Fetch user details and let Zustand update the state
    }, []); // Runs only once on mount

    useEffect(() => {
        // console.log(userDetail)
        if ((userDetail === null || userDetail === undefined) && !loadingStore) {
            console.log('redirecting to signin')
            window.location = '/signin';
        }
        else{
            fetchUserEnrolledCourseIdList(userDetail?.userId);
            console.log('App.jsx  :: ', location.pathname)
            if(location.pathname == '/') {
                navigate('/dashboard')
            }
        }

    }, [userDetail]); // Redirect only after userDetail updates


    if (loadingStore) {
        return <div>Loading...</div>; // Display loading screen until both data are ready
    }

    return (
        <>
            {publicUri.includes(window.location.pathname) ? <></> :<Header/>}
            <div className={`overflow-y-auto ${publicUri.includes(window.location.pathname) ? '' : 'h-[calc(100svh-4em)]' }`}>
                <Outlet/>
            </div>



        </>
    );
}

export default App;
