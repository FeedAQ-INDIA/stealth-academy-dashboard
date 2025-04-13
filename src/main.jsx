import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./components-xm/error-page.jsx";
 import SignInPage from "./components-xm/SignInPage.jsx";
 import {Toaster} from "./components/ui/toaster.jsx";
 import {refreshToken} from "./utils/refreshTokenUtils";

import {Dashboard} from "@/components-xm/Dashboard.jsx";
import {Explore} from "@/components-xm/Explore.jsx";
import {MyLearningPath} from "@/components-xm/MyLearningPath.jsx";
import {CourseDetail} from "@/components-xm/CourseDetail.jsx";
import CourseOverview from "@/components-xm/CourseOverview.jsx";
import CourseVideoTutorial from "@/components-xm/CourseVideoTutorial.jsx";
import {AccountDetail} from "@/components-xm/AccountDetail.jsx";
import CourseComprehensionReading from "@/components-xm/CourseComprehensionReading.jsx";
import CourseListenAndRead from "@/components-xm/CourseListenAndRead.jsx";
import MyAccount from "@/components-xm/MyAccountSettings/MyAccount.jsx";
import CourseWritten from "@/components-xm/CourseWritten.jsx";


// Normalize double slashes in URL
const normalizedPath = window.location.pathname.replace(/\/{2,}/g, '/');
if (window.location.pathname !== normalizedPath) {
  window.history.replaceState({}, '', normalizedPath + window.location.search);
}

const router = createBrowserRouter([
    {
        path: "/signin",
        element: <SignInPage/>,
    },


    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard/>,
            },
            {
                path: "/explore",
                element: <Explore/>,
            },
            {
                path: "/account-settings",
                element: <AccountDetail/>,
                children:[
                    {
                        path: "/account-settings/profile",
                        element: <MyAccount/>,
                    },
                ]
            },
            {
                path: "/course",
                element: <CourseDetail/>,
                children:[
                    {
                        path: "/course/:CourseId",
                        element: <CourseOverview/>,
                    },
                    {
                        path: "/course/:CourseId/video/:CourseVideoId",
                        element: <CourseVideoTutorial/>,
                    },
                    {
                        path: "/course/:CourseId/doc/:CourseDocId",
                        element: <CourseWritten/>,
                    },
                    {
                        path: "/course/:CourseId/comprehension-reading/:ComprehensionReadingId",
                        element: <CourseComprehensionReading/>,
                    },
                    {
                        path: "/course/:CourseId/listen-and-read/:ListenAndReadId",
                        element: <CourseListenAndRead/>,
                    },
                ]
             },

            {
                path: "/my-learning-path",
                element: <MyLearningPath/>,
            },
        ]
    },


]);


// try {
//     if (window.location.pathname != "/signin") {
//         await refreshToken();
//     }
// } catch (err) {
//     console.log(err);
// }

async function runTokenRefresh() {
    if (window.location.pathname !== "/signin") {
        await refreshToken().catch((err) => {
            console.error("Refresh token logic failed:", err.message);
            // Optionally redirect or show login page
        });
    }
}


(async function initApp() {
    if (window.location.pathname !== "/signin") {
        try {
            await runTokenRefresh();
        } catch (err) {
            console.error("Refresh token logic failed:", err.message);
        }
    }

    createRoot(document.getElementById("root")).render(
        <StrictMode>
            {/*<Provider store={store} >*/}
            {" "}
            {/* Wrap with Provider */}
            <RouterProvider router={router}/>
            <Toaster/>
            {/*</Provider>*/}
        </StrictMode>
     );
})();

//
// createRoot(document.getElementById("root")).render(
//     <StrictMode>
//         {/*<Provider store={store} >*/}
//         {" "}
//         {/* Wrap with Provider */}
//         <RouterProvider router={router}/>
//         <Toaster/>
//         {/*</Provider>*/}
//     </StrictMode>
// );
