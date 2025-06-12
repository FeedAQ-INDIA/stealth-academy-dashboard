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
import {Explore as HomeExplore} from "@/components-xm/HomeFiles/Explore.jsx";
import {MyLearningPath} from "@/components-xm/MyLearningPath.jsx";
import {CourseDetail} from "@/components-xm/Course/CourseDetail.jsx";
import CourseOverview from "@/components-xm/Course/CourseOverview.jsx";
import CourseVideoTutorial from "@/components-xm/Course/CourseVideoTutorial.jsx";
import {AccountDetail} from "@/components-xm/AccountSettings/AccountDetail.jsx";
import CourseComprehensionReading from "@/components-xm/Course/CourseComprehensionReading.jsx";
import CourseListenAndRead from "@/components-xm/Course/CourseListenAndRead.jsx";
import MyAccount from "@/components-xm/AccountSettings/MyAccount.jsx";
import CourseWritten from "@/components-xm/Course/CourseWritten.jsx";
import CourseDocThirdParty from "@/components-xm/Course/CourseDocThirdParty.jsx";
import CourseQuiz from "@/components-xm/Course/CourseQuiz.jsx";
import {WebinarDetail} from "@/components-xm/Webinar/WebinarDetail.jsx";
import WebinarOverview from "@/components-xm/Webinar/WebinarOverview.jsx";
import {MockInterview} from "@/components-xm/MockInterview/MockInterview.jsx";
import { useAuthStore, useProtectedURIStore } from "@/zustland/store";
import {CreateMockInterview} from "@/components-xm/MockInterview/CreateMockInterview.jsx";
import MockInterviewHistoryDetail from "@/components-xm/MockInterview/MockInterviewHistoryDetail.jsx";
import LanguageStudio from "@/components-xm/Lang/LanguageStudio.jsx";
import HomePage from "@/components-xm/HomeFiles/HomePage.jsx";
import {CreateCounsellingCompass} from "@/components-xm/CounsellingCompass/CreateCounsellingCompass.jsx";
import {CounsellingCompass} from "@/components-xm/CounsellingCompass/CounsellingCompass.jsx";
import CounsellingHistoryDetail from "@/components-xm/CounsellingCompass/CounsellingHistoryDetail.jsx";
import CourseSchedule from "@/components-xm/Course/CourseSchedule.jsx";
import CourseSnapView from "@/components-xm/Course/CourseSnapView.jsx";


 

const router = createBrowserRouter([



    {
        path: "/mock-interview",
        element: <MockInterview/>,
    },
    {
        path: "/the-language-studio",
        element: <LanguageStudio/>,
    },
    {
        path: "/counselling-compass",
        element: <CounsellingCompass/>,
    },

    {
        path: "/browse",
        element: <HomeExplore/>,
    },

    {
        path: "/browse/:CourseId",
        element: <CourseSnapView/>,
    },


    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            { index: true, element: <HomePage /> }, // now "/" goes to HomePage

            {
                path: "/signin",
                element: <SignInPage/>,
            },
            {
                path: "/schedule-counselling-compass",
                element: <CreateCounsellingCompass/>,
            },
            {
                path: "/counselling-compass/:CounsellingId",
                element: <CounsellingHistoryDetail/>,
            },
            {
                path: "/schedule-mock-interview",
                element: <CreateMockInterview/>,
            },
            {
                path: "/mock-interview/:MockInterviewId",
                element: <MockInterviewHistoryDetail/>,
            },
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
                        path: "/course/:CourseId/schedule",
                        element: <CourseSchedule/>,
                    },
                    {
                        path: "/course/:CourseId/quiz/:CourseQuizId",
                        element: <CourseQuiz/>,
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
                        path: "/course/:CourseId/pdf/:CourseDocId",
                        element: <CourseDocThirdParty/>,
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
                path: "/webinar",
                element: <WebinarDetail/>,
                children:[
                    {
                        path: "/webinar/:WebinarId",
                        element: <WebinarOverview/>,
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

const {publicUri}= useProtectedURIStore.getState();

async function runTokenRefresh() {
    if (!publicUri.includes(window.location.pathname) || window.location.pathname == '/signin') {
        await refreshToken().catch((err) => {
            console.error("Refresh token logic failed:", err.message);
            // Optionally redirect or show login page
        });
    }
}


(async function initApp() {
    if (!publicUri.includes(window.location.pathname) || window.location.pathname == '/signin') {
        console.log("invoking token refresh")
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
