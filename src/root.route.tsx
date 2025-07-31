import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "./common/components/AuthGuard";
import { ClientSidebarData, PartnerPatientSidebarData, PartnerSidebarData, SuperAdminSidebarData } from "./common/constants/sidebarPages";
import AppLayout from "./common/layouts/AppLayout";
import NotificationContextProvider from "./context/NotificationContextProvider";
import TestForm from "./pages/TestForm";
import { AdminAppRoute } from "./pages/admin-app/admin-app.route";
import { AuthRoute } from "./pages/auth/auth.route";
import VerifyUser from "./pages/auth/login/verify-otp";

import { lazy } from "react";
import UserNotFoundPage from "./common/components/UserNotFound";
import ClientModuleRoute from "./pages/admin-app/client-module/client-module.route";
import ClientAppRoute from "./pages/client-app/client-app.route";
import { PartnerAppRoute } from "./pages/partner-app/partner-app.route";
import { PartnerPatientRoute } from "./pages/partner-patient-app/partner-patient.route";

const PanelNavigator = lazy(() => import("./common/components/NavigateToPanel"));
const MessageConversation = lazy(() => import("./pages/patient-doctor/messages"));
const ClientCompleteRegistration = lazy(() => import("./pages/client-registration/complete-registration.page"));
const PartnerCompleteRegistration = lazy(() => import("./pages/partner-registration/complete-registration.page"));
const PartnerPatientCompleteRegistration = lazy(() => import("./pages/partner-patient-intake/complete-registration.page"));
const PartnerPatientBooking = lazy(() => import("./pages/partner-patient-intake/partner-patient-booking"));
const PartnerPatientIntake = lazy(() => import("./pages/partner-patient-intake/partner-patient-intake"));
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
    path: "/client/*",
    element: <AuthGuard userType={["client"]} />,
    children: [
      {
        path: "",
        element: (
          <NotificationContextProvider>
            <AppLayout sidebarData={ClientSidebarData} />
          </NotificationContextProvider>
        ),
        children: ClientAppRoute,
      },
    ],
  },
  {
    path: "/partner/*",
    element: <AuthGuard userType={["customer", "customer_standard_user"]} />,
    children: [
      {
        path: "",
        element: (
          <NotificationContextProvider>
            <AppLayout sidebarData={PartnerSidebarData} />
          </NotificationContextProvider>
        ),
        children: PartnerAppRoute,
      },
    ],
  },
  {
    path: "/partner-patient/*",
    element: <AuthGuard userType={["patient"]} />,
    children: [
      {
        path: "",
        element: (
          <NotificationContextProvider>
            <AppLayout sidebarData={PartnerPatientSidebarData} />
          </NotificationContextProvider>
        ),
        children: PartnerPatientRoute,
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
    path: "partner-patient-password-setup",
    element: <PartnerPatientCompleteRegistration />,
  },
  {
    path: "partner-patient-booking",
    element: <PartnerPatientBooking />,
  },
  {
    path: "partner-patient-intake",
    element: <PartnerPatientIntake />,
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
