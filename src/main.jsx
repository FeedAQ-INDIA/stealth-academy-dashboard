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
import {
  Marketplace,
  BringYourOwnCourse as BringYourOwnCourseExplore,
  PrivilegedAccess,
  LiveLearning,
} from "@/components-xm/Explore/index.js";
import { MyLearningLayout } from "@/components-xm/MyJourney/MyJourneyLayout.jsx";
import { CourseDetail } from "@/components-xm/Course/CourseDetail.jsx";
import CourseOverview from "@/components-xm/Course/CourseOverview.jsx";
import CourseVideoTutorial from "@/components-xm/Course/CourseVideoTutorial.jsx";
import { AccountDetail } from "@/components-xm/AccountSettings/AccountDetail.jsx";
import MyAccount from "@/components-xm/AccountSettings/MyAccount.jsx";
import Security from "@/components-xm/AccountSettings/Security.jsx";
import Billing from "@/components-xm/AccountSettings/Billing/Billing.jsx";
import BillingOverview from "@/components-xm/AccountSettings/Billing/BillingOverview.jsx";
import BillingHistory from "@/components-xm/AccountSettings/Billing/BillingHistory.jsx";
import {
  OrdersLayout,
  AllOrders,
  CompletedOrders,
  PendingOrders,
  CancelledOrders,
} from "@/components-xm/AccountSettings/Orders/index.js";
import {
  OrganizationLayout,
  RegisterAsOrg,
  OrgProfile,
  AddMembersToOrg,
} from "@/components-xm/AccountSettings/Organization/index.js";
import Notifications from "@/components-xm/AccountSettings/Notifications.jsx";
import CourseWritten from "@/components-xm/Course/CourseWritten.jsx";
import CourseDocThirdParty from "@/components-xm/Course/CourseDocThirdParty.jsx";
import CourseQuiz from "@/components-xm/Course/CourseQuiz/CourseQuiz.jsx";
import CourseFlashcard from "@/components-xm/Course/CourseFlashcard.jsx";
import { useAuthStore, useProtectedURIStore } from "@/zustland/store";
import HomePage from "@/components-xm/HomeFiles/HomePage.jsx";
import CourseSchedule from "@/components-xm/Course/CourseSchedule.jsx";
import CourseSnapView from "@/components-xm/HomeFiles/CourseSnapView.jsx";
import BringYourOwnCourse from "./components-xm/BringYourOwnCourse.jsx";
import { MyCourse } from "./components-xm/MyJourney/MyCourse.jsx";
import { MyWishlist } from "./components-xm/MyJourney/MyWishlist.jsx";
import MyJourneyOverview from "./components-xm/MyJourney/MyJourneyOverview.jsx";
import LearningArena from "./components-xm/LangStudio/LearningArena.jsx";
import LearningDashboard from "./components-xm/LangStudio/Dashboard.jsx";
import LearningArenaItem from "./components-xm/LangStudio/LearningArenaItem.jsx";
import ComprehensionSkillsSession from "./components-xm/LangStudio/SkillSession/ComprehensionSkillsSession.jsx";
import ReadingSkillsSession from "./components-xm/LangStudio/SkillSession/ReadingSkillsSession.jsx";
import ListeningSkillsSession from "./components-xm/LangStudio/SkillSession/ListeningSkillsSession.jsx";
import SpeakingSkillsSession from "./components-xm/LangStudio/SkillSession/SpeakingSkillsSession.jsx";
import EmailWritingSkillsSession from "./components-xm/LangStudio/SkillSession/EmailWritingSkillsSession.jsx";
import WritingSkillsSession from "./components-xm/LangStudio/SkillSession/WritingSkillsSession.jsx";
import { MyJourney as LangStudioMyJourney} from "./components-xm/LangStudio/MyJourney.jsx";
import CourseCertificate from "./components-xm/Course/CourseCertificate.jsx";
import CourseNotes from "./components-xm/Course/CourseNotes.jsx";
import MyAchievement from "./components-xm/MyJourney/MyAchievement.jsx";
import MyStudyGroup from "./components-xm/MyJourney/MyStudyGroup.jsx";
import MyLearningSchedule from "./components-xm/AccountSettings/MyLearningSchedule.jsx";
import MyGoals from "./components-xm/AccountSettings/MyGoals.jsx";
import CourseEmbedder from "./components-xm/Course/CourseEmbedder.jsx";

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
            path: "/account-settings/credit-and-order",
            element: <Billing />,
            children: [
              {
                index: true,
                element: <BillingOverview />,
              },
              {
                path: "history",
                element: <BillingHistory />,
              },
            ],
          },

          {
            path: "/account-settings/orders",
            element: <OrdersLayout />,
            children: [
              {
                index: true,
                element: <AllOrders />,
              },
              {
                path: "completed",
                element: <CompletedOrders />,
              },
              {
                path: "pending",
                element: <PendingOrders />,
              },
              {
                path: "cancelled",
                element: <CancelledOrders />,
              },

            ],
          },
          {
            path: "/account-settings/notifications",
            element: <Notifications />,
          },
            {
            path: "/account-settings/my-goals",
            element: <MyGoals />,
          },
          {
            path: "/account-settings/my-study-group",
            element: <MyStudyGroup />,
          },

          {
            path: "/account-settings/my-learning-schedule",
            element: <MyLearningSchedule />,
          },

                    {
            path: "/account-settings/register-organization",
            element: <RegisterAsOrg />,
          },
          
          {
            path: "/account-settings/organization",
            element: <OrganizationLayout />,
            children: [
              {
                index: true,
                element: <RegisterAsOrg />,
              },
              {
                path: "profile",
                element: <OrgProfile />,
              },
              {
                path: "add-members",
                element: <AddMembersToOrg />,
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
        element: <MyLearningLayout />,
        children: [
          {
            index: true,
            element: <MyJourneyOverview />,
          },
          {
            path: "/my-journey/courses",
            element: <MyCourse />,
          },
          {
            path: "/my-journey/my-achievement",
            element: <MyAchievement />,
          },
          {
            path: "/my-journey/my-goals",
            element: <MyGoals />,
          },

          {
            path: "/my-journey/my-study-group",
            element: <MyStudyGroup />,
          },


          {
            path: "/my-journey/my-learning-schedule",
            element: <MyLearningSchedule />,
          },

          
          {
            path: "/my-journey/wishlist",
            element: <MyWishlist />,
          },
        ],
      },

      {
        path: "/bring-your-own-course",
        element: <BringYourOwnCourse />,
      },

      {
        path: "/lang-studio/learning-arena",
        element: <LearningArena />,
      },
      {
        path: "/lang-studio/my-journey",
        element: <LangStudioMyJourney />,
      },
      {
        path: "/lang-studio/learning-arena/comprehension-skills/:sessionId",
        element: <ComprehensionSkillsSession />,
      },
      {
        path: "/lang-studio/learning-arena/reading-skills/:sessionId",
        element: <ReadingSkillsSession />,
      },
      {
        path: "/lang-studio/learning-arena/listening-skills/:sessionId",
        element: <ListeningSkillsSession />,
      },
         {
        path: "/lang-studio/learning-arena/speaking-skills/:sessionId",
        element: <SpeakingSkillsSession />,
      },
               {
        path: "/lang-studio/learning-arena/email-writing/:sessionId",
        element: <EmailWritingSkillsSession />,
      },
      {
        path: "/lang-studio/learning-arena/writing-skills/:sessionId",
        element: <WritingSkillsSession />,
      },
      {
        path: "/lang-studio/learning-arena/:arenaName",
        element: <LearningArenaItem />,
      },
      {
        path: "/lang-studio",
        element: <LearningDashboard />,
      }
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
