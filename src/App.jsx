import {Outlet, useLocation, useNavigate} from "react-router-dom";
import Header from "./components-xm/Header/Header.jsx";
import {useEffect} from "react";
import {useAuthStore} from "@/zustland/store.js";
import "./App.css"


function App() {
    const navigate = useNavigate();
    const location = useLocation();


    const {fetchUserDetail, loading: loadingStore, userDetail, fetchUserEnrolledCourseIdList} = useAuthStore();


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
            <Header/>
            <div className="overflow-y-auto h-[calc(100svh-4em)]">
                <Outlet/>
            </div>



        </>
    );
}

export default App;
