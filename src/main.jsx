import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components-xm/error-page.jsx";
import SignInPage from "./components-xm/SignInPage.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import { refreshToken } from "./utils/refreshTokenUtils";

import { Dashboard } from "@/components-xm/Dashboard.jsx";
import { Explore } from "@/components-xm/Explore.jsx";
import { MyLearningPath } from "@/components-xm/MyJourney/MyLearningPath.jsx";
import { CourseDetail } from "@/components-xm/Course/CourseDetail.jsx";
import CourseOverview from "@/components-xm/Course/CourseOverview.jsx";
import CourseVideoTutorial from "@/components-xm/Course/CourseVideoTutorial.jsx";
import { AccountDetail } from "@/components-xm/AccountSettings/AccountDetail.jsx";
import MyAccount from "@/components-xm/AccountSettings/MyAccount.jsx";
import CourseWritten from "@/components-xm/Course/CourseWritten.jsx";
import CourseDocThirdParty from "@/components-xm/Course/CourseDocThirdParty.jsx";
import CourseQuiz from "@/components-xm/Course/CourseQuiz.jsx";
import { useAuthStore, useProtectedURIStore } from "@/zustland/store";
import HomePage from "@/components-xm/HomeFiles/HomePage.jsx";
import CourseSchedule from "@/components-xm/Course/CourseSchedule.jsx";
import CourseSnapView from "@/components-xm/HomeFiles/CourseSnapView.jsx";
import BringYourOwnCourse from "./components-xm/BringYourOwnCourse.jsx";
import { MyCourse } from "./components-xm/MyJourney/MyCourse.jsx";
import { MyWishlist } from "./components-xm/MyJourney/MyWishlist.jsx";

const router = createBrowserRouter([
  // {
  //     path: "/browse",
  //     element: <HomeExplore/>,
  // },

  {
    path: "/explore/:CourseId",
    element: <CourseSnapView />,
  },

  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> }, // now "/" goes to HomePage

      {
        path: "/signin",
        element: <SignInPage />,
      },

      {
        path: "/dashboard",
        element: <Dashboard />,
      },

      {
        path: "/account-settings",
        element: <AccountDetail />,
        children: [
          {
            path: "/account-settings/profile",
            element: <MyAccount />,
          },
        ],
      },

      {
        path: "/course",
        element: <CourseDetail />,
        children: [
          {
            path: "/course/:CourseId",
            element: <CourseOverview />,
          },
          {
            path: "/course/:CourseId/schedule",
            element: <CourseSchedule />,
          },
          {
            path: "/course/:CourseId/quiz/:CourseQuizId",
            element: <CourseQuiz />,
          },
          {
            path: "/course/:CourseId/video/:CourseVideoId",
            element: <CourseVideoTutorial />,
          },
          {
            path: "/course/:CourseId/doc/:CourseDocId",
            element: <CourseWritten />,
          },
          {
            path: "/course/:CourseId/pdf/:CourseDocId",
            element: <CourseDocThirdParty />,
          },
        ],
      },

      {
        path: "/my-learning-path",
        element: <MyLearningPath />,
        children: [
          {
            path: "/my-learning-path/my-course",
            element: <MyCourse />,
          },
                    {
            path: "/my-learning-path/my-wishlist",
            element: <MyWishlist />,
          },
        ],
      },

      {
        path: "/bring-your-own-course",
        element: <BringYourOwnCourse />,
      },
    ],
  },
]);

const { publicUri } = useProtectedURIStore.getState();

async function runTokenRefresh() {
  if (
    !publicUri.includes(window.location.pathname) ||
    window.location.pathname == "/signin"
  ) {
    await refreshToken().catch((err) => {
      console.error("Refresh token logic failed:", err.message);
      // Optionally redirect or show login page
    });
  }
}

(async function initApp() {
  if (
    !publicUri.includes(window.location.pathname) ||
    window.location.pathname == "/signin"
  ) {
    console.log("invoking token refresh");
    try {
      await runTokenRefresh();
    } catch (err) {
      console.error("Refresh token logic failed:", err.message);
    }
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      {/*<Provider store={store} >*/} {/* Wrap with Provider */}
      <RouterProvider router={router} />
      <Toaster />
      {/*</Provider>*/}
    </StrictMode>
  );
})();
