import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "./common/components/AuthGuard";
import UserNotFoundPage from "./common/components/UserNotFound";
import { SuperAdminSidebarData } from "./common/constants/sidebarPages";
import AppLayout from "./common/layouts/AppLayout";
import NotificationContextProvider from "./context/NotificationContextProvider";
import TestForm from "./pages/TestForm";
import { AdminAppRoute } from "./pages/admin-app/admin-app.route";
import ClientModuleRoute from "./pages/admin-app/client-module/client-module.route";
import { AuthRoute } from "./pages/auth/auth.route";
import VerifyUser from "./pages/auth/login/verify-otp";
const PanelNavigator = lazy(() => import("./common/components/NavigateToPanel"));
const MessageConversation = lazy(() => import("./pages/patient-doctor/messages"));
const ClientCompleteRegistration = lazy(() => import("./pages/client-registration/complete-registration.page"));
const PartnerCompleteRegistration = lazy(() => import("./pages/partner-registration/complete-registration.page"));
const NotFoundPage = lazy(() => import("./common/components/not-found.page"));

export const RootRoute = createBrowserRouter([
  {
    path: "",
    element: <PanelNavigator />,
  },
  {
    path: "",
    children: AuthRoute,
  },
  {
    path: "/admin/*",
    element: <AuthGuard userType={["admin"]} />,
    children: [
      {
        path: "",
        element: (
          <NotificationContextProvider>
            <AppLayout sidebarData={SuperAdminSidebarData} />
          </NotificationContextProvider>
        ),
        children: AdminAppRoute,
      },
    ],
  },
  {
    path: "/admin-client/*",
    element: <AuthGuard userType={["admin"]} />,
    children: [
      {
        path: "",
        element: (
          <NotificationContextProvider>
            <AppLayout sidebarData={SuperAdminSidebarData} />
          </NotificationContextProvider>
        ),
        children: ClientModuleRoute,
      },
    ],
  },

  {
    path: "auth-verification",
    element: <VerifyUser />,
  },
  {
    path: "patient-doctor/messages",
    element: <MessageConversation />,
  },
  {
    path: "client-password-setup",
    element: <ClientCompleteRegistration />,
  },
  {
    path: "partner-password-setup",
    element: <PartnerCompleteRegistration />,
  },
  {
    path: "test-form",
    element: <TestForm />,
  },
  {
    path: "user-not-found",
    element: <UserNotFoundPage />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
