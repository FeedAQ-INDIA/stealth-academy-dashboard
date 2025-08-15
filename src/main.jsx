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
import { Marketplace, BringYourOwnCourse as BringYourOwnCourseExplore, PrivilegedAccess , LiveLearning} from "@/components-xm/Explore/index.js";
import { MyLearningPath } from "@/components-xm/MyJourney/MyLearningPath.jsx";
import { CourseDetail } from "@/components-xm/Course/CourseDetail.jsx";
import CourseOverview from "@/components-xm/Course/CourseOverview.jsx";
import CourseVideoTutorial from "@/components-xm/Course/CourseVideoTutorial.jsx";
import { AccountDetail } from "@/components-xm/AccountSettings/AccountDetail.jsx";
import MyAccount from "@/components-xm/AccountSettings/MyAccount.jsx";
import Security from "@/components-xm/AccountSettings/Security.jsx";
import Billing from "@/components-xm/AccountSettings/Billing.jsx";
import Orders from "@/components-xm/AccountSettings/Orders.jsx";
import Notifications from "@/components-xm/AccountSettings/Notifications.jsx";
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
import { MyOrders } from "./components-xm/MyJourney/MyOrders.jsx";
 
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
        children: [
          {
            path: "marketplace",
            element: <Marketplace />,
          },
          {
            path: "live-learning",
            element: <LiveLearning />,
          },
          {
            path: "bring-your-own-course",
            element: <BringYourOwnCourseExplore />,
          },
          {
            path: "privileged-access",
            element: <PrivilegedAccess />,
          },
        ],
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
            index: true,
            element: <MyAccount />,
          },
          {
            path: "/account-settings/profile",
            element: <MyAccount />,
          },
          {
            path: "/account-settings/security",
            element: <Security />,
          },
          {
            path: "/account-settings/billing",
            element: <Billing />,
          },
          {
            path: "/account-settings/orders",
            element: <Orders />,
          },
          {
            path: "/account-settings/notifications",
            element: <Notifications />,
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
        path: "/my-journey",
        element: <MyLearningPath />,
        children: [
          {
            path: "/my-journey/courses",
            element: <MyCourse />,
          },
          {
            path: "/my-journey/wishlist",
            element: <MyWishlist />,
          },
          {
            path: "/my-journey/orders",
            element: <MyOrders />,
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
