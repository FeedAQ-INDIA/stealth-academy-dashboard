import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components-xm/error-page.jsx";
import SignInPage from "./components-xm/SignInPage.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import { refreshToken } from "./utils/refreshTokenUtils";

import { Dashboard } from "@/components-xm/Dashboard.jsx";
import { BringYourOwnCourse as BringYourOwnCourseExplore } from "@/components-xm/Explore/BringYourOwnCourse.jsx";
import { MyJourney } from "@/components-xm/MyJourney/MyJourney.jsx";
import { CourseDetail } from "@/components-xm/Course/CourseDetail.jsx";
import CourseOverview from "@/components-xm/Course/CourseOverview.jsx";
import CourseVideoTutorial from "@/components-xm/Course/CourseVideoTutorial.jsx";
import { AccountDetail } from "@/components-xm/AccountSettings/AccountDetail.jsx";
import MyAccount from "@/components-xm/AccountSettings/MyAccount.jsx";
import BillingOverview from "@/components-xm/AccountSettings/BillingOverview.jsx";

import {
  RegisterAsOrg,
  OrgProfile,
} from "@/components-xm/AccountSettings/Organization/index.js";
import CourseWritten from "@/components-xm/Course/CourseWritten.jsx";
import CourseDocThirdParty from "@/components-xm/Course/CourseDocThirdParty.jsx";
import CourseQuiz from "@/components-xm/Course/CourseQuiz/CourseQuiz.jsx";
import CourseFlashcard from "@/components-xm/Course/CourseFlashcard.jsx";
import { useProtectedURIStore } from "@/zustland/store";
import CourseSchedule from "@/components-xm/Course/CourseSchedule.jsx";
import { LoadingProvider } from "./contexts/LoadingContext";
 import CourseCertificate from "./components-xm/Course/CourseCertificate.jsx";
import CourseNotes from "./components-xm/Course/CourseNotes.jsx";
import CourseEmbedder from "./components-xm/Course/CourseEmbedder.jsx";
import Builder from "./components-xm/CourseBuilder/Builder.jsx";
import PreviewBuilder from "./components-xm/CourseBuilder/PreviewBuilder.jsx";
import CourseRoom from "./components-xm/Course/CourseRoom/CourseRoom.jsx";
 import CourseRoomDiscussions from "./components-xm/Course/CourseRoom/CourseRoomDiscussions.jsx";
import CourseRoomResources from "./components-xm/Course/CourseRoom/CourseRoomResources.jsx";
import CourseRoomActivities from "./components-xm/Course/CourseRoom/CourseRoomActivities.jsx";
import CourseRoomSettings from "./components-xm/Course/CourseRoom/CourseRoomSettings.jsx";
import CourseRoomMembers from "./components-xm/Course/CourseRoom/CourseRoomMembers.jsx";
import Notifications from "./components-xm/AccountSettings/Notifications.jsx";
import TransactionHistory from "./components-xm/AccountSettings/TransactionHistory.jsx";
// NOTE: PreviewBuilder & CourseEditorBuilder direct routes removed; they are accessed through Builder component flow.

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignInPage />,
  },

  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> }, // now "/" goes to HomePage

      {
        path: "/content-library",
        element: <BringYourOwnCourseExplore />,
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
            path: "/account-settings/billing",
            element: <BillingOverview />,
          },

          {
            path: "/account-settings/transaction-history",
            element: <TransactionHistory />,
          },

          {
            path: "/account-settings/register-organization",
            element: <RegisterAsOrg />,
          },

                    {
            path: "/account-settings/notification",
            element: <Notifications />,
          },

          {
            path: "/account-settings/organization/profile",
            element: <OrgProfile />,
            children: [
              {
                path: "profile",
                element: <OrgProfile />,
              },
            ],
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
            path: "/course/:CourseId/room",
            element: <CourseRoom />,
            children: [
              {
                index: true,
                element: <CourseRoom />,
              },
              {
                path: "/course/:CourseId/room/members",
                element: <CourseRoomMembers />,
              },
              {
                path: "/course/:CourseId/room/discussions",
                element: <CourseRoomDiscussions />,
              },
              {
                path: "/course/:CourseId/room/resources", 
                element: <CourseRoomResources />,
              },
              {
                path: "/course/:CourseId/room/activities",
                element: <CourseRoomActivities />,
              },
              {
                path: "/course/:CourseId/room/settings",
                element: <CourseRoomSettings />,
              },
            ],
          },
          {
            path: "/course/:CourseId/embed",
            element: <CourseEmbedder />,
          },
          {
            path: "/course/:CourseId/notes",
            element: <CourseNotes />,
          },
          {
            path: "/course/:CourseId/schedule",
            element: <CourseSchedule />,
          },
          {
            path: "/course/:CourseId/certificate/:CourseCertificateId",
            element: <CourseCertificate />,
          },
          {
            path: "/course/:CourseId/quiz/:CourseQuizId",
            element: <CourseQuiz />,
          },
          {
            path: "/course/:CourseId/flashcard/:CourseFlashcardId",
            element: <CourseFlashcard />,
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
        element: <MyJourney />,
       },

      {
        path: "/course-builder",
        element: <Builder />,
      },

      {
        path: "/course-builder/:CourseBuilderId",
        element: <PreviewBuilder />,
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
      <LoadingProvider>
        {/*<Provider store={store} >*/} {/* Wrap with Provider */}
        <RouterProvider router={router} />
        <Toaster />
        {/*</Provider>*/}
      </LoadingProvider>
    </StrictMode>
  );
})();
